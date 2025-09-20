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
      console.log('🏢 Branch Data - No authenticated user found');
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

    console.log('🏢 Branch Data - Profile query result:', {
      userProfile,
      profileError: profileError ? {
        message: profileError.message,
        details: profileError.details,
        hint: profileError.hint,
        code: profileError.code
      } : null,
      hasOrganizationId: !!userProfile?.organization_id,
      organizationId: userProfile?.organization_id
    });

    let currentUserProfile = userProfile;
    if (profileError) {
      console.error('🏢 Branch Data - Profile error:', {
        message: profileError.message,
        details: profileError.details,
        hint: profileError.hint,
        code: profileError.code
      });
      
      // If profile doesn't exist, create a basic one
      if (profileError.code === 'PGRST116') {
        console.log('🏢 Branch Data - Creating missing profile...');
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
          console.error('🏢 Branch Data - Failed to create profile:', createError);
          return [];
        } else {
          console.log('🏢 Branch Data - Profile created successfully');
          // Use the newly created profile
          currentUserProfile = newProfile;
        }
      } else {
        return [];
      }
    }

    if (!currentUserProfile?.organization_id) {
      console.log('🏢 Branch Data - User has no organization_id, returning empty branches');
      return [];
    }

    // Get all branches for the user's organization
    console.log('🏢 Branch Data - Querying branches for organization:', currentUserProfile.organization_id);
    
    let branches, branchesError;
    try {
      console.log('🏢 Branch Data - About to query branches table...');
      
      // First, let's try a simple query to see if we can access the table
      const testResult = await supabase
        .schema('core')
        .from('branches')
        .select('count')
        .limit(1);
      
      console.log('🏢 Branch Data - Test query result:', testResult);
      
      const result = await supabase
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
      
      console.log('🏢 Branch Data - Raw query result:', result);
      
      branches = result.data;
      branchesError = result.error;
      
      console.log('🏢 Branch Data - Extracted data:', { branches, branchesError });
    } catch (queryError) {
      console.error('🏢 Branch Data - Query exception:', queryError);
      branchesError = queryError;
      branches = null;
    }

    console.log('🏢 Branch Data - Branches query result:', {
      branches,
      branchesError: branchesError ? {
        message: (branchesError as Error).message,
        details: (branchesError as { details?: string }).details,
        hint: (branchesError as { hint?: string }).hint,
        code: (branchesError as { code?: string }).code
      } : null,
      branchesCount: branches?.length || 0
    });

    if (branchesError) {
      console.error('🏢 Branch Data - Branches error details:', {
        error: branchesError,
        errorType: typeof branchesError,
        errorKeys: Object.keys(branchesError),
        errorString: JSON.stringify(branchesError),
        errorMessage: (branchesError as Error).message,
        errorCode: (branchesError as { code?: string }).code
      });
      return [];
    }

    if (!branches || branches.length === 0) {
      console.log('🏢 Branch Data - No branches found for organization');
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

    console.log('🏢 Branch Data - Retrieved branches:', {
      count: branchData.length,
      branches: branchData.map(b => ({ id: b.id, name: b.name, location: b.location }))
    });

    return branchData;
  } catch (error) {
    console.error('🏢 Branch Data - Error getting branches:', error);
    return [];
  }
}

