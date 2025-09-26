"use client"

import { useState, useEffect } from 'react';
import { createSupabaseClient } from '@/lib/supabase';

export interface UserData {
  name: string;
  email: string;
  avatar: string;
  initials: string;
}

/**
 * Generate initials from a full name
 */
function generateInitials(fullName: string): string {
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

/**
 * Hook to get current user data on the client side
 */
export function useUserData(): UserData | null {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const supabase = createSupabaseClient();
        
        // Get current user from auth
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.log('👤 Client User Data - No authenticated user found');
          setUserData(null);
          return;
        }

        // Get user profile data
        const { data: userProfile, error: profileError } = await supabase
          .schema('core')
          .from('user_profiles')
          .select('full_name, email')
          .eq('id', user.id)
          .is('deleted_at', null)
          .single();

        if (profileError) {
          console.error('👤 Client User Data - Profile error:', profileError);
        }

        // Determine the full name - prefer profile, fallback to OAuth metadata
        const fullName = userProfile?.full_name || user.user_metadata?.full_name || '';
        
        // Determine the email - prefer profile, fallback to auth user
        const email = userProfile?.email || user.email || '';
        
        // Get avatar from Google OAuth metadata if available
        const avatar = user.user_metadata?.avatar_url || user.user_metadata?.picture || '';
        
        // Generate initials from full name
        const initials = generateInitials(fullName);

        console.log('👤 Client User Data - Retrieved:', {
          fullName,
          email,
          hasAvatar: !!avatar,
          initials
        });

        setUserData({
          name: fullName,
          email,
          avatar,
          initials
        });
      } catch (error) {
        console.error('👤 Client User Data - Error getting user data:', error);
        setUserData(null);
      }
    }

    fetchUserData();
  }, []);

  return userData;
}
