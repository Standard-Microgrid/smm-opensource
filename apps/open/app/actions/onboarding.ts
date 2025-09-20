"use server";

import { createSupabaseClient } from "@/lib/supabase-server";
import { requireAuth } from "@/utils/auth/server-permissions";
import { onboardingSchema, type OnboardingFormData } from "@/lib/validations/onboarding";
import { getCountryMapping } from "@smm/shared/src/country-mappings";
import { revalidatePath } from "next/cache";

export async function completeOnboarding(data: OnboardingFormData) {
  try {
    console.log('🚀 Onboarding - Starting with data:', data);
    
    // Validate the form data
    const validatedData = await onboardingSchema.parseAsync(data);
    console.log('✅ Onboarding - Validation passed:', validatedData);
    
    const userContext = await requireAuth();
    console.log('👤 Onboarding - User context:', { userId: userContext.user_id });
    
    const supabase = await createSupabaseClient();

    // Test database connection by checking if we can query the user_profiles table
    console.log('🔌 Onboarding - Testing database connection...');
    const { data: connectionTest, error: connectionError } = await supabase
      .schema('core')
      .from('user_profiles')
      .select('id')
      .eq('id', userContext.user_id)
      .limit(1);
    
    console.log('🔌 Onboarding - Connection test result:', {
      connectionTest,
      connectionError: connectionError?.message
    });

    if (connectionError) {
      console.error('❌ Onboarding - Database connection failed:', connectionError);
      return { success: false, error: `Database connection failed: ${connectionError.message}` };
    }

    // Check if user already has an organization (prevent multiple organizations)
    console.log('🔍 Onboarding - Checking existing profile...');
    const { data: existingProfile, error: profileCheckError } = await supabase
      .schema('core')
      .from('user_profiles')
      .select('organization_id')
      .eq('id', userContext.user_id)
      .single();

    console.log('🔍 Onboarding - Profile check result:', {
      existingProfile,
      profileCheckError: profileCheckError?.message,
      hasOrganization: !!existingProfile?.organization_id
    });

    // If profile doesn't exist, create it first
    let userProfile = existingProfile;
    if (profileCheckError?.code === 'PGRST116' || !existingProfile) {
      console.log('🔍 Onboarding - Profile doesn\'t exist, creating it...');
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
        console.error('❌ Onboarding - Failed to create profile:', createError);
        return { success: false, error: "Failed to create user profile" };
      }
      
      console.log('✅ Onboarding - Profile created successfully');
      userProfile = newProfile;
    }

    if (userProfile?.organization_id) {
      console.log('❌ Onboarding - User already has organization:', userProfile.organization_id);
      return { success: false, error: "User already has an organization" };
    }

    // Note: Geocoding will be added back when Google Maps API key is configured

    // Start a transaction-like operation
    // 1. First, get the Executive role and assign it to the user temporarily
    console.log('👔 Onboarding - Getting Executive role...');
    const { data: executiveRole, error: roleError } = await supabase
      .schema('core')
      .from('roles')
      .select('id')
      .eq('name', 'executive')
      .single();

    console.log('👔 Onboarding - Role query result:', {
      executiveRole,
      roleError: roleError ? {
        message: roleError.message,
        details: roleError.details,
        hint: roleError.hint,
        code: roleError.code
      } : null
    });

    if (roleError || !executiveRole) {
      console.error('❌ Onboarding - Failed to find Executive role:', roleError);
      return { success: false, error: "Failed to find Executive role" };
    }

    // 2. Temporarily assign executive role to user (without organization) so they can create one
    console.log('👤 Onboarding - Temporarily assigning executive role to user...');
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
      console.error('❌ Onboarding - Failed to assign temporary executive role:', tempRoleError);
      return { success: false, error: "Failed to assign executive role" };
    }

    // 3. Now create organization (user has executive permissions)
    console.log('🏢 Onboarding - Creating organization:', validatedData.organizationName);
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
      console.error('❌ Onboarding - Failed to create organization:', orgError);
      const errorMessage = orgError ? 
        `Failed to create organization: ${orgError.message} (Code: ${orgError.code})` : 
        "Failed to create organization: No organization returned";
      return { success: false, error: errorMessage };
    }

    // 3. Get country-specific currency and timezone
    console.log('🌍 Onboarding - Getting country mapping for:', validatedData.headquartersCountry);
    const countryMapping = getCountryMapping(validatedData.headquartersCountry);
    console.log('🌍 Onboarding - Country mapping:', countryMapping);

    // 4. Create the headquarters branch (first branch)
    console.log('🏢 Onboarding - Creating branch for organization:', organization.id);
    const branchData = {
      organization_id: organization.id,
      name: validatedData.organizationName, // Use organization name directly
      city: validatedData.headquartersCity,
      country: validatedData.headquartersCountry,
      phone_number: validatedData.organizationWhatsApp,
      currency: countryMapping.currency,
      timezone: countryMapping.timezone
    };
    console.log('🏢 Onboarding - Branch data:', branchData);
    
    const { data: branch, error: branchError } = await supabase
      .schema('core')
      .from('branches')
      .insert(branchData)
      .select()
      .single();

    console.log('🏢 Onboarding - Branch creation result:', {
      branch,
      branchError: branchError ? {
        message: branchError.message,
        details: branchError.details,
        hint: branchError.hint,
        code: branchError.code
      } : null
    });

    if (branchError || !branch) {
      console.error('❌ Onboarding - Failed to create branch:', branchError);
      return { success: false, error: "Failed to create branch" };
    }

    // 5. Update user profile with organization and branch IDs (role already assigned)
    console.log('👤 Onboarding - Updating user profile with organization and branch...');
    const profileUpdateData = {
      organization_id: organization.id,
      branch_id: branch.id,
      updated_at: new Date().toISOString()
    };
    console.log('👤 Onboarding - Profile update data:', profileUpdateData);
    
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
      console.error('❌ Onboarding - Failed to update user profile:', profileError);
      return { success: false, error: "Failed to update user profile" };
    }

    // Note: organization_members table will be created when entitlement system is fully deployed

    console.log('✅ Onboarding - Successfully completed!');
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("❌ Onboarding - Unexpected error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An unexpected error occurred" };
  }
}
