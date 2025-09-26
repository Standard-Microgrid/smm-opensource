"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseClient } from "@/lib/supabase-server";
import { userSettingsSchema, type UserSettingsFormData } from "@/lib/validations/user-settings";

export async function updateUserSettingsImproved(data: UserSettingsFormData) {
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

    const emailChanged = validatedData.email !== user.email;

    // Check email uniqueness before attempting update
    if (emailChanged) {
      console.log('👤 User Settings - Checking email uniqueness:', validatedData.email);
      
      // Check if email already exists in auth.users
      const { data: existingUsers, error: checkError } = await supabase.auth.admin.listUsers();
      
      if (checkError) {
        console.error('❌ User Settings - Error checking email uniqueness:', checkError);
        // Continue with update attempt - let Supabase handle the error
      } else {
        const emailExists = existingUsers.users.some(existingUser => 
          existingUser.email === validatedData.email && existingUser.id !== user.id
        );
        
        if (emailExists) {
          console.log('❌ User Settings - Email already exists:', validatedData.email);
          return { 
            success: false, 
            error: "This email address is already associated with another account. Please use a different email address.",
            errorCode: "EMAIL_EXISTS"
          };
        }
      }

      console.log('👤 User Settings - Email is unique, proceeding with update:', {
        oldEmail: user.email,
        newEmail: validatedData.email
      });
      
      const { error: emailUpdateError } = await supabase.auth.updateUser({
        email: validatedData.email
      });

      if (emailUpdateError) {
        console.error('❌ User Settings - Email update error:', emailUpdateError);
        
        // Handle specific error cases
        if (emailUpdateError.message?.includes('already') || 
            emailUpdateError.message?.includes('exists') ||
            emailUpdateError.message?.includes('taken')) {
          return { 
            success: false, 
            error: "This email address is already associated with another account. Please use a different email address.",
            errorCode: "EMAIL_EXISTS"
          };
        }
        
        return { 
          success: false, 
          error: `Failed to update email: ${emailUpdateError.message}`,
          errorCode: "EMAIL_UPDATE_FAILED"
        };
      }

      // Email update completed
    }

    // Update user profile in database
    const { data: updatedProfile, error: profileUpdateError } = await supabase
      .schema('core')
      .from('user_profiles')
      .update({
        email: validatedData.email,
        full_name: validatedData.fullName,
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
    
    // Return different success messages based on whether email changed
    if (emailChanged) {
      return { 
        success: true, 
        data: updatedProfile,
        emailChanged: true,
        message: "Profile updated! Please check both your current and new email inboxes to confirm the email change.",
        pendingEmail: validatedData.email
      };
    } else {
      return { 
        success: true, 
        data: updatedProfile,
        emailChanged: false,
        message: "Profile updated successfully!"
      };
    }
  } catch (error) {
    console.error('❌ User Settings - Unexpected error:', error);
    
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    
    return { success: false, error: "An unexpected error occurred" };
  }
}
