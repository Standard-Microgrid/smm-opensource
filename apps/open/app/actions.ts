"use server";

import { createSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { encodedRedirect } from "@/utils/redirect";

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const client = await createSupabaseClient();

  const { error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/login", error.message);
  }

  return redirect("/dashboard");
};

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const client = await createSupabaseClient();

  // Validate passwords match
  if (password !== confirmPassword) {
    return encodedRedirect("error", "/sign-up", "Passwords do not match.");
  }

  // Validate strong password requirements
  if (password.length < 8) {
    return encodedRedirect("error", "/sign-up", "Password must be at least 8 characters long.");
  }
  
  if (!/[A-Z]/.test(password)) {
    return encodedRedirect("error", "/sign-up", "Password must contain at least one uppercase letter.");
  }
  
  if (!/[a-z]/.test(password)) {
    return encodedRedirect("error", "/sign-up", "Password must contain at least one lowercase letter.");
  }
  
  if (!/[0-9]/.test(password)) {
    return encodedRedirect("error", "/sign-up", "Password must contain at least one number.");
  }
  
  if (!/[^A-Za-z0-9]/.test(password)) {
    return encodedRedirect("error", "/sign-up", "Password must contain at least one special character.");
  }

  const url = process.env.VERCEL_URL
    ? `${process.env.VERCEL_URL}/dashboard`
    : "http://localhost:3000/dashboard";

  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: url,
    },
  });

  if (error) {
    return encodedRedirect("error", "/sign-up", error.message);
  }

  // Create user profile record
  if (data.user) {
    console.log('📝 Signup Debug - User created:', {
      userId: data.user.id,
      email: data.user.email
    });

    // Check if user profile already exists
        const { data: existingProfile } = await client
          .schema('core')
          .from('user_profiles')
          .select('id')
          .eq('id', data.user.id)
          .single();

    console.log('📝 Signup Debug - Profile check:', {
      existingProfile: !!existingProfile
    });

    if (!existingProfile) {
          const { error: profileError } = await client
            .schema('core')
            .from('user_profiles')
            .insert({
          id: data.user.id,
          email: email,
          full_name: '', // Will be filled during onboarding
          phone_number: '', // Will be filled during onboarding
          organization_id: null, // Will be set during onboarding
          branch_id: null, // Will be set during onboarding
          role_id: null, // Will be set during onboarding
          access_scope: {}, // Default empty scope as object
          is_active: true
        });

      console.log('📝 Signup Debug - Profile creation:', {
        profileError: profileError?.message,
        profileCreated: !profileError
      });

      if (profileError) {
        console.error('Error creating user profile:', profileError);
        // Don't fail the signup for this, but log the error
      }
    }
  }

  return redirect("/dashboard");
};

export const signOutAction = async () => {
  const client = await createSupabaseClient();
  await client.auth.signOut();
  return redirect("/login");
};

export const signInWithGoogleAction = async () => {
  const client = await createSupabaseClient();
  
  const { data, error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/auth/callback`,
    },
  });

  if (error) {
    return encodedRedirect("error", "/login", error.message);
  }

  if (data.url) {
    return redirect(data.url);
  }
};

export const signUpWithGoogleAction = async () => {
  const client = await createSupabaseClient();
  
  const { data, error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/auth/callback`,
    },
  });

  if (error) {
    return encodedRedirect("error", "/sign-up", error.message);
  }

  if (data.url) {
    return redirect(data.url);
  }
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const client = await createSupabaseClient();

  const { error } = await client.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return encodedRedirect("error", "/forgot-password", error.message);
  }

  return encodedRedirect("success", "/forgot-password", "Password reset email sent! Check your inbox.");
};

export const resetPasswordAction = async (formData: FormData) => {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const client = await createSupabaseClient();

  // Validate passwords match
  if (password !== confirmPassword) {
    return encodedRedirect("error", "/reset-password", "Passwords do not match.");
  }

  // Validate strong password requirements
  if (password.length < 8) {
    return encodedRedirect("error", "/reset-password", "Password must be at least 8 characters long.");
  }
  
  if (!/[A-Z]/.test(password)) {
    return encodedRedirect("error", "/reset-password", "Password must contain at least one uppercase letter.");
  }
  
  if (!/[a-z]/.test(password)) {
    return encodedRedirect("error", "/reset-password", "Password must contain at least one lowercase letter.");
  }
  
  if (!/[0-9]/.test(password)) {
    return encodedRedirect("error", "/reset-password", "Password must contain at least one number.");
  }
  
  if (!/[^A-Za-z0-9]/.test(password)) {
    return encodedRedirect("error", "/reset-password", "Password must contain at least one special character.");
  }

  // Check if user has a valid session (from password reset flow)
  const { data: { session }, error: sessionError } = await client.auth.getSession();
  
  if (sessionError || !session) {
    return encodedRedirect("error", "/reset-password", "No valid session found. Please request a new password reset link.");
  }

  // Update the password using the authenticated session
  const { error } = await client.auth.updateUser({
    password: password,
  });

  if (error) {
    return encodedRedirect("error", "/reset-password", error.message);
  }

  // Sign out the user after password reset
  await client.auth.signOut();

  return redirect("/login?message=Password updated successfully! Please sign in with your new password.");
};
