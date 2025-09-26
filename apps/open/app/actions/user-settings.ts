"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseClient } from "@/lib/supabase-server";
import { userSettingsSchema, type UserSettingsFormData } from "@/lib/validations/user-settings";

export async function updateUserSettings(data: UserSettingsFormData) {
  try {
    console.log('👤 User Settings - Starting update:', data);
    
    const supabase = await createSupabaseClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('❌ User Settings - No authenticated user:', userError);
      return { success: false, error: "User not authenticated" };
    }

    // Validate the form data
    const validatedData = userSettingsSchema.parse(data);
    console.log('👤 User Settings - Validated data:', validatedData);

    // Check if email has changed
    const emailChanged = validatedData.email !== user.email;
    
    // Update email in Supabase Auth if it has changed
    if (emailChanged) {
      console.log('👤 User Settings - Updating email in auth:', {
        oldEmail: user.email,
        newEmail: validatedData.email
      });
      
      const { error: emailUpdateError } = await supabase.auth.updateUser({
        email: validatedData.email
      });

      if (emailUpdateError) {
        console.error('❌ User Settings - Email update error:', emailUpdateError);
        return { success: false, error: `Failed to update email: ${emailUpdateError.message}` };
      }
      
      // Return pending state for email change - don't update profile yet
      console.log('✅ User Settings - Email change initiated, confirmation emails sent');
      
      // Revalidate the account page
      revalidatePath('/(user-settings)/account');
      
      return { 
        success: true, 
        data: {
          emailChanged: true,
          pendingEmail: validatedData.email,
          currentEmail: user.email,
          message: "Email change initiated! Please check both your current and new email inboxes to confirm the email change."
        }
      };
    }

    // Check if display name has changed
    const displayNameChanged = validatedData.fullName !== user.user_metadata?.full_name;
    
    // Update display name in Supabase Auth if it has changed
    if (displayNameChanged) {
      console.log('👤 User Settings - Updating display name in auth:', {
        oldName: user.user_metadata?.full_name,
        newName: validatedData.fullName
      });
      
      const { error: nameUpdateError } = await supabase.auth.updateUser({
        data: {
          full_name: validatedData.fullName
        }
      });

      if (nameUpdateError) {
        console.error('❌ User Settings - Display name update error:', nameUpdateError);
        return { success: false, error: `Failed to update display name: ${nameUpdateError.message}` };
      }
    }

    // Update user profile in database
    // Only update fields that aren't synced by the trigger (email and full_name are synced automatically)
    const { data: updatedProfile, error: profileUpdateError } = await supabase
      .schema('core')
      .from('user_profiles')
      .update({
        phone_number: validatedData.phoneNumber || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (profileUpdateError) {
      console.error('❌ User Settings - Profile update error:', profileUpdateError);
      return { success: false, error: `Failed to update profile: ${profileUpdateError.message}` };
    }

    console.log('✅ User Settings - Successfully updated:', updatedProfile);

    // Revalidate the account page
    revalidatePath('/(user-settings)/account');
    
    return { 
      success: true, 
      data: {
        ...updatedProfile,
        message: "Profile updated successfully!"
      }
    };
  } catch (error) {
    console.error('❌ User Settings - Unexpected error:', error);
    
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function deleteAccount() {
  try {
    console.log('🗑️ Delete Account - Starting account deletion');
    
    const supabase = await createSupabaseClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('❌ Delete Account - No authenticated user:', userError);
      return { success: false, error: "User not authenticated" };
    }

    // Get user profile to verify it exists and is not already deleted
    const { data: userProfile, error: profileError } = await supabase
      .schema('core')
      .from('user_profiles')
      .select('id, email, full_name, organization_id')
      .eq('id', user.id)
      .is('deleted_at', null)
      .single();

    if (profileError || !userProfile) {
      console.error('❌ Delete Account - Profile not found or already deleted:', profileError);
      return { success: false, error: "User profile not found or already deleted" };
    }

    // Soft delete the user profile (set deleted_at timestamp)
    const { data: deletedProfile, error: deleteError } = await supabase
      .schema('core')
      .from('user_profiles')
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by: user.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .is('deleted_at', null)
      .select()
      .single();

    if (deleteError) {
      console.error('❌ Delete Account - Failed to delete profile:', deleteError);
      return { success: false, error: `Failed to delete account: ${deleteError.message}` };
    }

    console.log('✅ Delete Account - Successfully deleted user profile:', deletedProfile);

    // Revalidate relevant paths
    revalidatePath('/(user-settings)/account');
    revalidatePath('/dashboard');
    
    return { success: true, data: deletedProfile };
  } catch (error) {
    console.error('❌ Delete Account - Unexpected error:', error);
    
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getUserSettings() {
  try {
    console.log('👤 User Settings - Fetching user data');
    
    const supabase = await createSupabaseClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('❌ User Settings - No authenticated user:', userError);
      return { success: false, error: "User not authenticated" };
    }

    // First, get the basic user profile
    const { data: userProfile, error: profileError } = await supabase
      .schema('core')
      .from('user_profiles')
      .select(`
        id,
        email,
        full_name,
        phone_number,
        organization_id,
        branch_id,
        role_id
      `)
      .eq('id', user.id)
      .is('deleted_at', null)
      .single();

    if (profileError) {
      console.error('❌ User Settings - Profile fetch error:', profileError);
      return { success: false, error: "Failed to fetch user profile" };
    }

    // If user has organization, branch, or role, fetch them separately
    let organization = null;
    let branch = null;
    let role = null;

    if (userProfile.organization_id) {
      const { data: orgData } = await supabase
        .schema('core')
        .from('organizations')
        .select('name')
        .eq('id', userProfile.organization_id)
        .single();
      organization = orgData;
    }

    if (userProfile.branch_id) {
      const { data: branchData } = await supabase
        .schema('core')
        .from('branches')
        .select('name')
        .eq('id', userProfile.branch_id)
        .single();
      branch = branchData;
    }

    if (userProfile.role_id) {
      const { data: roleData } = await supabase
        .schema('core')
        .from('roles')
        .select('name')
        .eq('id', userProfile.role_id)
        .single();
      role = roleData;
    }

    const result = {
      ...userProfile,
      organizations: organization,
      branches: branch,
      roles: role
    };

    console.log('✅ User Settings - Successfully fetched user data:', result);
    
    return { success: true, data: result };
  } catch (error) {
    console.error('❌ User Settings - Unexpected error:', error);
    
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    
    return { success: false, error: "An unexpected error occurred" };
  }
}
