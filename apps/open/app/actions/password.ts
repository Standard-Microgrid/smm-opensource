"use server";

import { createSupabaseClient } from "@/lib/supabase-server";
import { passwordChangeSchema, passwordResetSchema, type PasswordChangeFormData, type PasswordResetFormData } from "@/lib/validations/password";

export async function changePassword(data: PasswordChangeFormData) {
  try {
    console.log('🔐 Password Change - Starting password change process');
    
    const supabase = await createSupabaseClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('❌ Password Change - No authenticated user:', userError);
      return { success: false, error: "User not authenticated" };
    }

    // Validate the form data
    const validatedData = passwordChangeSchema.parse(data);
    console.log('🔐 Password Change - Validated data received');

    // Update password in Supabase Auth
    const { error: passwordUpdateError } = await supabase.auth.updateUser({
      password: validatedData.newPassword
    });

    if (passwordUpdateError) {
      console.error('❌ Password Change - Password update error:', passwordUpdateError);
      return { success: false, error: `Failed to update password: ${passwordUpdateError.message}` };
    }

    console.log('✅ Password Change - Password updated successfully');
    
    return { success: true, message: "Password updated successfully!" };
  } catch (error) {
    console.error('❌ Password Change - Unexpected error:', error);
    
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function sendPasswordResetEmail(data: PasswordResetFormData) {
  try {
    const supabase = await createSupabaseClient();
    
    // Validate the form data
    const validatedData = passwordResetSchema.parse(data);

    // Send password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(validatedData.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/auth/callback?next=/reset-password`,
    });

    if (error) {
      console.error('❌ Password Reset - Email send error:', error);
      return { success: false, error: `Failed to send reset email: ${error.message}` };
    }
    
    return { success: true, message: "Password reset email sent! Check your inbox." };
  } catch (error) {
    console.error('❌ Password Reset - Unexpected error:', error);
    
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    
    return { success: false, error: "An unexpected error occurred" };
  }
}
