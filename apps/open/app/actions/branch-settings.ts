"use server";

import { createSupabaseClient } from "@/lib/supabase-server";
import { requireAuth } from "@/utils/auth/server-permissions";
import { branchSettingsSchema, type BranchSettingsFormData } from "@/lib/validations/branch-settings";
import { revalidatePath } from "next/cache";

export async function addBranch(data: BranchSettingsFormData) {
  try {
    // Validate the form data
    const validatedData = await branchSettingsSchema.parseAsync(data);
    
    // Get user context and validate authentication
    const userContext = await requireAuth();

    // Create Supabase client
    const supabase = await createSupabaseClient();

    // Get user profile to get organization_id
    const { data: userProfile, error: profileError } = await supabase
      .schema('core')
      .from('user_profiles')
      .select('organization_id')
      .eq('id', userContext.user_id)
      .is('deleted_at', null)
      .single();

    if (profileError || !userProfile?.organization_id) {
      return { success: false, error: "User profile not found or no organization assigned" };
    }

    // Check if a branch with the same name already exists in the organization
    const { data: existingBranch, error: checkError } = await supabase
      .schema('core')
      .from('branches')
      .select('id')
      .eq('organization_id', userProfile.organization_id)
      .eq('name', validatedData.name)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      return { success: false, error: `Failed to check existing branch: ${checkError.message}` };
    }

    if (existingBranch) {
      return { success: false, error: "A branch with this name already exists in your organization" };
    }

    // Create new branch
    const { data: newBranch, error: createError } = await supabase
      .schema('core')
      .from('branches')
      .insert({
        organization_id: userProfile.organization_id,
        name: validatedData.name,
        city: validatedData.city,
        country: validatedData.country,
        phone_number: validatedData.phoneNumber,
        currency: validatedData.currency,
        timezone: validatedData.timezone,
      })
      .select()
      .single();

    if (createError) {
      return { success: false, error: `Failed to create branch: ${createError.message}` };
    }

    // Revalidate relevant paths
    revalidatePath('/dashboard');
    revalidatePath('/(org-settings)/add-branch');

    return { success: true, data: newBranch };

  } catch (error) {
    console.error('❌ Add Branch - Unexpected error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unexpected error occurred" 
    };
  }
}

export async function deleteBranch(branchId: string) {
  try {
    // Get user context and validate authentication
    const userContext = await requireAuth();
    const supabase = await createSupabaseClient();

    // Get user profile to get organization_id
    const { data: userProfile, error: profileError } = await supabase
      .schema('core')
      .from('user_profiles')
      .select('organization_id')
      .eq('id', userContext.user_id)
      .is('deleted_at', null)
      .single();

    if (profileError || !userProfile?.organization_id) {
      return { success: false, error: "User profile not found or no organization assigned" };
    }

    // Check if the branch belongs to the user's organization
    const { data: branch, error: branchError } = await supabase
      .schema('core')
      .from('branches')
      .select('id, name, organization_id, is_active')
      .eq('id', branchId)
      .eq('organization_id', userProfile.organization_id)
      .single();

    if (branchError || !branch) {
      return { success: false, error: "Branch not found or access denied" };
    }

    // Check if there are other active branches in the organization
    const { data: activeBranches, error: countError } = await supabase
      .schema('core')
      .from('branches')
      .select('id')
      .eq('organization_id', userProfile.organization_id)
      .neq('id', branchId);

    if (countError) {
      return { success: false, error: `Failed to check active branches: ${countError.message}` };
    }

    const activeBranchCount = activeBranches?.length || 0;

    if (activeBranchCount === 0) {
      return { 
        success: false, 
        error: "Each organization must have at least one active branch. Please create another branch before deleting this one." 
      };
    }

    // Deactivate the branch (soft delete by setting is_active to false)
    const { data: updatedBranch, error: updateError } = await supabase
      .schema('core')
      .from('branches')
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', branchId)
      .eq('organization_id', userProfile.organization_id)
      .select()
      .single();

    if (updateError) {
      return { success: false, error: `Failed to delete branch: ${updateError.message}` };
    }

    // Revalidate relevant paths
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/branch-settings');

    return { success: true, data: updatedBranch };

  } catch (error) {
    console.error('❌ Delete Branch - Unexpected error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unexpected error occurred" 
    };
  }
}

export async function updateBranchSettings(data: BranchSettingsFormData, branchId?: string) {
  try {
    // Validate the form data
    const validatedData = await branchSettingsSchema.parseAsync(data);
    
    const userContext = await requireAuth();
    const supabase = await createSupabaseClient();

    // Get user profile to get organization_id
    const { data: userProfile, error: profileError } = await supabase
      .schema('core')
      .from('user_profiles')
      .select('organization_id')
      .eq('id', userContext.user_id)
      .is('deleted_at', null)
      .single();

    if (profileError || !userProfile?.organization_id) {
      console.error('❌ Branch Settings - Profile error or no organization:', profileError);
      return { success: false, error: "User profile not found or no organization assigned" };
    }

    if (branchId) {
      // Update specific branch
      // First verify the branch belongs to the user's organization
      const { error: branchCheckError } = await supabase
        .schema('core')
        .from('branches')
        .select('id')
        .eq('id', branchId)
        .eq('organization_id', userProfile.organization_id)
        .single();

      if (branchCheckError) {
        console.error('❌ Branch Settings - Branch not found or access denied:', branchCheckError);
        return { success: false, error: "Branch not found or access denied" };
      }
      
      const { data: updatedBranch, error: updateError } = await supabase
        .schema('core')
        .from('branches')
        .update({
          name: validatedData.name,
          city: validatedData.city,
          country: validatedData.country,
          phone_number: validatedData.phoneNumber,
          currency: validatedData.currency,
          timezone: validatedData.timezone,
        })
        .eq('id', branchId)
        .eq('organization_id', userProfile.organization_id)
        .select()
        .single();

      if (updateError) {
        console.error('❌ Branch Settings - Update error:', updateError);
        return { success: false, error: `Failed to update branch: ${updateError.message}` };
      }
      
      // Revalidate the dashboard and branch settings pages
      revalidatePath('/dashboard');
      revalidatePath('/dashboard/branch-settings');
      
      return { success: true, data: updatedBranch };
    } else {
      // Fallback: Check if there's an existing branch for this organization
      
      const { data: existingBranch, error: branchCheckError } = await supabase
        .schema('core')
        .from('branches')
        .select('id')
        .eq('organization_id', userProfile.organization_id)
        .limit(1)
        .single();

      if (branchCheckError && branchCheckError.code !== 'PGRST116') {
        console.error('❌ Branch Settings - Error checking existing branch:', branchCheckError);
        return { success: false, error: `Failed to check existing branch: ${branchCheckError.message}` };
      }

      if (existingBranch) {
        // Update existing branch
        const { data: updatedBranch, error: updateError } = await supabase
          .schema('core')
          .from('branches')
          .update({
            name: validatedData.name,
            city: validatedData.city,
            country: validatedData.country,
            phone_number: validatedData.phoneNumber,
            currency: validatedData.currency,
            timezone: validatedData.timezone,
          })
          .eq('id', existingBranch.id)
          .eq('organization_id', userProfile.organization_id)
          .select()
          .single();

        if (updateError) {
          console.error('❌ Branch Settings - Update error:', updateError);
          return { success: false, error: `Failed to update branch: ${updateError.message}` };
        }
        
        // Revalidate the dashboard and branch settings pages
        revalidatePath('/dashboard');
        revalidatePath('/dashboard/branch-settings');
        
        return { success: true, data: updatedBranch };
      } else {
        // Create new branch (only if none exists)
        
        const { data: newBranch, error: createError } = await supabase
          .schema('core')
          .from('branches')
          .insert({
            organization_id: userProfile.organization_id,
            name: validatedData.name,
            city: validatedData.city,
            country: validatedData.country,
            phone_number: validatedData.phoneNumber,
            currency: validatedData.currency,
            timezone: validatedData.timezone,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (createError) {
          console.error('❌ Branch Settings - Create error:', createError);
          return { success: false, error: `Failed to create branch: ${createError.message}` };
        }
        
        // Revalidate the dashboard and branch settings pages
        revalidatePath('/dashboard');
        revalidatePath('/dashboard/branch-settings');
        
        return { success: true, data: newBranch };
      }
    }
  } catch (error) {
    console.error('❌ Branch Settings - Unexpected error:', error);
    
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getBranchSettings(branchId?: string) {
  try {
    const userContext = await requireAuth();
    const supabase = await createSupabaseClient();

    // Get user profile to get organization_id
    const { data: userProfile, error: profileError } = await supabase
      .schema('core')
      .from('user_profiles')
      .select('organization_id')
      .eq('id', userContext.user_id)
      .is('deleted_at', null)
      .single();

    if (profileError || !userProfile?.organization_id) {
      console.error('❌ Branch Settings - Profile error:', {
        message: profileError?.message,
        details: profileError?.details,
        hint: profileError?.hint,
        code: profileError?.code
      });
      return { success: false, error: "User profile not found" };
    }

    if (branchId) {
      // Get specific branch
      const { data: branch, error: branchError } = await supabase
        .schema('core')
        .from('branches')
        .select('*')
        .eq('id', branchId)
        .eq('organization_id', userProfile.organization_id)
        .single();

      if (branchError) {
        console.error('❌ Branch Settings - Branch error:', {
          message: branchError.message,
          details: branchError.details,
          hint: branchError.hint,
          code: branchError.code
        });
        return { success: false, error: "Branch not found" };
      }

      return { 
        success: true, 
        data: {
          id: branch.id,
          name: branch.name,
          city: branch.city,
          country: branch.country,
          phoneNumber: branch.phone_number,
          currency: branch.currency,
          timezone: branch.timezone,
        }
      };
    } else {
      // Get first branch for the organization (for now, we'll assume one branch per org)
      const { data: branches, error: branchesError } = await supabase
        .schema('core')
        .from('branches')
        .select('*')
        .eq('organization_id', userProfile.organization_id)
        .limit(1);

      if (branchesError) {
        console.error('❌ Branch Settings - Branches error:', branchesError);
        return { success: false, error: "Failed to fetch branches" };
      }

      if (!branches || branches.length === 0) {
        return { success: true, data: null };
      }

      const branch = branches[0];
      return { 
        success: true, 
        data: {
          id: branch.id,
          name: branch.name,
          city: branch.city,
          country: branch.country,
          phoneNumber: branch.phone_number,
          currency: branch.currency,
          timezone: branch.timezone,
        }
      };
    }
  } catch (error) {
    console.error('❌ Branch Settings - Unexpected error:', error);
    
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    
    return { success: false, error: "An unexpected error occurred" };
  }
}
