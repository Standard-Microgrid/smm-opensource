"use server";

import { createSupabaseClient } from "@/lib/supabase-server";
import { requireAuth } from "@/utils/auth/server-permissions";
import { onboardingSchema, type OnboardingFormData } from "@/lib/validations/onboarding";
import { getCountryMapping } from "@smm/shared/src/country-mappings";
import { revalidatePath } from "next/cache";

export async function completeOnboarding(data: OnboardingFormData) {
  try {
    
    // Validate the form data
    const validatedData = await onboardingSchema.parseAsync(data);
    
    const userContext = await requireAuth();
    const supabase = await createSupabaseClient();

    // Test database connection by checking if we can query the user_profiles table
    const { error: connectionError } = await supabase
      .schema('core')
      .from('user_profiles')
      .select('id')
      .eq('id', userContext.user_id)
      .limit(1);
    
    if (connectionError) {
      return { success: false, error: `Database connection failed: ${connectionError.message}` };
    }

    // Check if user already has an organization (prevent multiple organizations)
    const { data: existingProfile, error: profileCheckError } = await supabase
      .schema('core')
      .from('user_profiles')
      .select('organization_id')
      .eq('id', userContext.user_id)
      .single();


    // If profile doesn't exist, create it first
    let userProfile = existingProfile;
    if (profileCheckError?.code === 'PGRST116' || !existingProfile) {
      const { data: newProfile, error: createError } = await supabase
        .schema('core')
        .from('user_profiles')
        .insert({
          id: userContext.user_id,
          email: userContext.user_id, // We'll get the actual email from auth
          full_name: validatedData.fullName,
          phone_number: '',
          organization_id: null,
          branch_id: null,
          role_id: null,
          access_scope: {},
          is_active: true
        })
        .select('organization_id')
        .single();

      if (createError) {
        return { success: false, error: "Failed to create user profile" };
      }
      
      userProfile = newProfile;
    }

    if (userProfile?.organization_id) {
      return { success: false, error: "User already has an organization" };
    }

    // Note: Geocoding will be added back when Google Maps API key is configured

    // Start a transaction-like operation
    // 1. First, get the Executive role and assign it to the user temporarily
    const { data: executiveRole, error: roleError } = await supabase
      .schema('core')
      .from('roles')
      .select('id')
      .eq('name', 'executive')
      .single();


    if (roleError || !executiveRole) {
      return { success: false, error: "Failed to find Executive role" };
    }

    // 2. Temporarily assign executive role to user (without organization) so they can create one
    const { error: tempRoleError } = await supabase
      .schema('core')
      .from('user_profiles')
      .update({
        role_id: executiveRole.id,
        full_name: validatedData.fullName,
        updated_at: new Date().toISOString()
      })
      .eq('id', userContext.user_id);

    console.log('👤 Onboarding - Temporary role assignment result:', {
      tempRoleError: tempRoleError ? {
        message: tempRoleError.message,
        details: tempRoleError.details,
        hint: tempRoleError.hint,
        code: tempRoleError.code
      } : null
    });

    if (tempRoleError) {
      return { success: false, error: "Failed to assign executive role" };
    }

    // 3. Now create organization (user has executive permissions)
    const { data: organization, error: orgError } = await supabase
      .schema('core')
      .from('organizations')
      .insert({
        name: validatedData.organizationName
      })
      .select()
      .single();

    console.log('🏢 Onboarding - Organization creation result:', {
      organization,
      orgError: orgError ? {
        message: orgError.message,
        details: orgError.details,
        hint: orgError.hint,
        code: orgError.code
      } : null
    });

    if (orgError || !organization) {
      const errorMessage = orgError ? 
        `Failed to create organization: ${orgError.message} (Code: ${orgError.code})` : 
        "Failed to create organization: No organization returned";
      return { success: false, error: errorMessage };
    }

    // 3. Get country-specific currency and timezone
    const countryMapping = getCountryMapping(validatedData.headquartersCountry);

    // 4. Create the headquarters branch (first branch)
    const branchData = {
      organization_id: organization.id,
      name: validatedData.organizationName, // Use organization name directly
      city: validatedData.headquartersCity,
      country: validatedData.headquartersCountry,
      phone_number: validatedData.organizationWhatsApp,
      currency: countryMapping.currency,
      timezone: countryMapping.timezone
    };
    
    const { data: branch, error: branchError } = await supabase
      .schema('core')
      .from('branches')
      .insert(branchData)
      .select()
      .single();

    console.log('🏢 Onboarding - Branch creation result:', {
      branch,
      branchData,
      branchError: branchError ? {
        message: branchError.message,
        details: branchError.details,
        hint: branchError.hint,
        code: branchError.code
      } : null
    });

    if (branchError || !branch) {
      return { success: false, error: "Failed to create branch" };
    }

    // 5. Update user profile with organization and branch IDs (role already assigned)
    const profileUpdateData = {
      organization_id: organization.id,
      branch_id: branch.id,
      updated_at: new Date().toISOString()
    };
    
    const { error: profileError } = await supabase
      .schema('core')
      .from('user_profiles')
      .update(profileUpdateData)
      .eq('id', userContext.user_id);

    console.log('👤 Onboarding - Profile update result:', {
      profileError: profileError ? {
        message: profileError.message,
        details: profileError.details,
        hint: profileError.hint,
        code: profileError.code
      } : null
    });

    if (profileError) {
      return { success: false, error: "Failed to update user profile" };
    }

    // 6. Create organization_members record
    const { error: memberError } = await supabase
      .schema('core')
      .from('organization_members')
      .insert({
        organization_id: organization.id,
        user_id: userContext.user_id,
        role_id: executiveRole.id,
        status: 'active'
      });

    console.log('👥 Onboarding - Organization members creation result:', {
      memberError: memberError ? {
        message: memberError.message,
        details: memberError.details,
        hint: memberError.hint,
        code: memberError.code
      } : null
    });

    if (memberError) {
      return { success: false, error: "Failed to create organization membership" };
    }

    revalidatePath("/dashboard");
    return { success: true, branchId: branch.id };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An unexpected error occurred" };
  }
}
