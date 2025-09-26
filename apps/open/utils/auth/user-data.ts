// Utility functions for getting user data with profile information

import { createSupabaseClient } from '@/lib/supabase-server';

export interface UserData {
  name: string;
  email: string;
  avatar: string;
  initials: string;
}

/**
 * Get current user data including profile picture and full name
 */
export async function getCurrentUserData(): Promise<UserData | null> {
  try {
    const supabase = await createSupabaseClient();
    
    // Get current user from auth
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return null;
    }

    // Get user profile data
    const { data: userProfile, error: profileError } = await supabase
      .schema('core')
      .from('user_profiles')
      .select('full_name, email')
      .eq('id', user.id)
      .is('deleted_at', null)
      .single();

    let currentUserProfile = userProfile;
    if (profileError) {
      console.error('👤 User Data - Profile error:', {
        message: profileError.message,
        details: profileError.details,
        hint: profileError.hint,
        code: profileError.code
      });
      
      // If profile doesn't exist, create a basic one
      if (profileError.code === 'PGRST116') {
        const { data: newProfile, error: createError } = await supabase
          .schema('core')
          .from('user_profiles')
          .insert({
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || '',
            phone_number: '',
            organization_id: null,
            branch_id: null,
            role_id: null,
            access_scope: {},
            is_active: true
          })
          .select('full_name, email')
          .single();

        if (createError) {
          console.error('👤 User Data - Failed to create profile:', createError);
        } else {
          console.log('👤 User Data - Profile created successfully');
          // Use the newly created profile
          currentUserProfile = newProfile;
        }
      }
    }

    // Determine the full name - prefer profile, fallback to OAuth metadata
    const fullName = currentUserProfile?.full_name || user.user_metadata?.full_name || '';
    
    // Determine the email - prefer profile, fallback to auth user
    const email = currentUserProfile?.email || user.email || '';
    
    // Get avatar from Google OAuth metadata if available
    const avatar = user.user_metadata?.avatar_url || user.user_metadata?.picture || '';
    
    // Generate initials from full name
    const initials = generateInitials(fullName);

    console.log('👤 User Data - Retrieved:', {
      fullName,
      email,
      hasAvatar: !!avatar,
      initials
    });

    return {
      name: fullName,
      email,
      avatar,
      initials
    };
  } catch (error) {
    console.error('👤 User Data - Error getting user data:', error);
    return null;
  }
}

/**
 * Generate initials from a full name
 */
export function generateInitials(fullName: string): string {
  if (!fullName || fullName.trim() === '') {
    return 'U'; // Default fallback
  }

  const names = fullName.trim().split(/\s+/);
  
  if (names.length === 1) {
    // Single name - take first two characters
    return names[0].substring(0, 2).toUpperCase();
  } else {
    // Multiple names - take first character of first and last name
    const firstInitial = names[0].charAt(0).toUpperCase();
    const lastInitial = names[names.length - 1].charAt(0).toUpperCase();
    return firstInitial + lastInitial;
  }
}
