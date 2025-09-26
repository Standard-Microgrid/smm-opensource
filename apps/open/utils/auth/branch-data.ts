// Utility functions for getting user branch data

import { createSupabaseClient } from '@/lib/supabase-server';
import { getCountryName } from '@smm/shared/src/countries';

export interface BranchData {
  id: string;
  name: string;
  location: string;
  logo: string; // Changed to string identifier
  locationIcon: string; // Changed to string identifier
}

/**
 * Get current user's branches from the database
 */
export async function getCurrentUserBranches(): Promise<BranchData[]> {
  try {
    const supabase = await createSupabaseClient();
    
    // Get current user from auth
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return [];
    }

    // Get user profile to get organization_id
    const { data: userProfile, error: profileError } = await supabase
      .schema('core')
      .from('user_profiles')
      .select('organization_id')
      .eq('id', user.id)
      .is('deleted_at', null)
      .single();


    let currentUserProfile = userProfile;
    if (profileError) {
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
          .select('organization_id')
          .single();

        if (createError) {
          return [];
        } else {
          // Use the newly created profile
          currentUserProfile = newProfile;
        }
      } else {
        return [];
      }
    }

    if (!currentUserProfile?.organization_id) {
      return [];
    }

    // Get all branches for the user's organization
    const { data: branches, error: branchesError } = await supabase
      .schema('core')
      .from('branches')
      .select(`
        id,
        name,
        city,
        country,
        timezone
      `)
      .eq('organization_id', currentUserProfile.organization_id)
      .order('name');

    if (branchesError) {
      return [];
    }

    if (!branches || branches.length === 0) {
      return [];
    }

    // Transform branches to the expected format
    const branchData: BranchData[] = branches.map(branch => {
      // Format location as "[city], [country]" or just "[country]" if no city
      let location = 'Unknown Location';
      if (branch.city && branch.country) {
        const countryName = getCountryName(branch.country) || branch.country;
        location = `${branch.city}, ${countryName}`;
      } else if (branch.country) {
        location = getCountryName(branch.country) || branch.country;
      } else if (branch.city) {
        location = branch.city;
      }

      return {
        id: branch.id,
        name: branch.name,
        location,
        logo: 'PowerTimeIcon', // String identifier for logo
        locationIcon: 'MapPin' // String identifier for location icon
      };
    });

    return branchData;
  } catch (error) {
    console.error('🏢 Branch Data - Error getting branches:', error);
    return [];
  }
}

