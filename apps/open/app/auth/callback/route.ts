import { createSupabaseClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/dashboard";
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    console.log('🔐 Auth Callback Debug:', {
      code: !!code,
      next,
      origin,
      error,
      errorDescription,
      fullUrl: request.url,
      allParams: Object.fromEntries(searchParams.entries())
    });

  // Handle OAuth errors
  if (error) {
    console.error('🔐 OAuth Error:', { error, errorDescription });
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errorDescription || error)}`);
  }

  if (code) {
    const client = await createSupabaseClient();
    const { data, error } = await client.auth.exchangeCodeForSession(code);
    
    console.log('🔐 Auth Exchange Debug:', {
      hasUser: !!data.user,
      userEmail: data.user?.email,
      userMetadata: data.user?.user_metadata,
      error: error?.message
    });
    
    if (error) {
      console.error('🔐 Auth Exchange Error:', error);
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`);
    }
    
    if (data.user) {
      console.log('🔐 OAuth Success - User authenticated:', {
        userId: data.user.id,
        email: data.user.email,
        isNewUser: data.user.created_at === data.user.updated_at
      });

      // Always check if user profile exists, regardless of sign-in vs sign-up
      try {
        const { data: existingProfile, error: profileCheckError } = await client
          .schema('core')
          .from('user_profiles')
          .select('id, organization_id, branch_id, full_name, phone_number, role_id, access_scope')
          .eq('id', data.user.id)
          .single();

        console.log('🔐 Profile Check Debug:', {
          userId: data.user.id,
          existingProfile: !!existingProfile,
          profileCheckError: profileCheckError?.message,
          hasOrganization: !!existingProfile?.organization_id,
          hasBranch: !!existingProfile?.branch_id
        });

        // If profile doesn't exist OR if it exists but is incomplete (missing org/branch), create/update it
        if (!existingProfile || !existingProfile.organization_id || !existingProfile.branch_id) {
          console.log('🔐 Creating/updating profile for user:', data.user.id);
          
          const profileData = {
            id: data.user.id,
            email: data.user.email || '',
            full_name: data.user.user_metadata?.full_name || existingProfile?.full_name || '',
            phone_number: existingProfile?.phone_number || '', // Preserve existing if updating
            organization_id: existingProfile?.organization_id || null, // Preserve existing if updating
            branch_id: existingProfile?.branch_id || null, // Preserve existing if updating
            role_id: existingProfile?.role_id || null, // Use role_id instead of role
            access_scope: existingProfile?.access_scope || {}, // Use object instead of string
            is_active: true
          };

          // Use upsert to handle both create and update cases
          const { error: profileError } = await client
            .schema('core')
            .from('user_profiles')
            .upsert(profileData, { 
              onConflict: 'id',
              ignoreDuplicates: false 
            });

          console.log('🔐 Profile Upsert Debug:', {
            profileError: profileError?.message,
            profileUpserted: !profileError,
            profileData
          });

          if (profileError) {
            console.error('🔐 Profile Upsert Error Details:', {
              message: profileError.message,
              details: profileError.details,
              hint: profileError.hint,
              code: profileError.code
            });
            
            // If profile creation fails, still redirect to dashboard but log the error
            console.log('🔐 Profile creation failed, but continuing with redirect');
          }
        } else {
          console.log('🔐 Profile exists and is complete, no action needed');
        }
      } catch (profileError) {
        console.error('🔐 Unexpected error during profile handling:', profileError);
        console.log('🔐 Continuing with redirect despite profile error');
      }

      console.log('🔐 Redirecting to:', `${origin}${next}`);
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

    // Return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  } catch (error) {
    console.error('🔐 Unexpected error in auth callback:', error);
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('Authentication failed')}`);
  }
}
