"use client"

import { useState, useEffect } from 'react';
import { createSupabaseClient } from '@/lib/supabase';
import { getCountryName } from '@smm/shared/src/countries';

export interface BranchData {
  id: string;
  name: string;
  location: string;
  logo: string; // Changed to string identifier
  locationIcon: string; // Changed to string identifier
}


/**
 * Hook to get current user's branches on the client side
 */
export function useBranchData(): BranchData[] {
  const [branches, setBranches] = useState<BranchData[]>([]);

  useEffect(() => {
    async function fetchBranchData() {
      try {
        const supabase = createSupabaseClient();
        
        // Get current user from auth
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.log('🏢 Client Branch Data - No authenticated user found');
          setBranches([]);
          return;
        }

        // Get user profile to get organization_id
        const { data: userProfile, error: profileError } = await supabase
          .schema('core')
          .from('user_profiles')
          .select('organization_id')
          .eq('id', user.id)
          .is('deleted_at', null)
          .single();

        if (profileError || !userProfile?.organization_id) {
          console.error('🏢 Client Branch Data - Profile error or no organization:', profileError);
          setBranches([]);
          return;
        }

        // Get all active branches for the user's organization
        const { data: branchesData, error: branchesError } = await supabase
          .schema('core')
          .from('branches')
          .select(`
            id,
            name,
            city,
            country,
            timezone
          `)
          .eq('organization_id', userProfile.organization_id)
          .eq('is_active', true)
          .order('name');

        if (branchesError) {
          console.error('🏢 Client Branch Data - Branches error:', branchesError);
          setBranches([]);
          return;
        }

        if (!branchesData || branchesData.length === 0) {
          console.log('🏢 Client Branch Data - No branches found for organization');
          setBranches([]);
          return;
        }

        // Transform branches to the expected format
        const branchData: BranchData[] = branchesData.map(branch => {
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

        console.log('🏢 Client Branch Data - Retrieved branches:', {
          count: branchData.length,
          branches: branchData.map(b => ({ id: b.id, name: b.name, location: b.location }))
        });

        setBranches(branchData);
      } catch (error) {
        console.error('🏢 Client Branch Data - Error getting branches:', error);
        setBranches([]);
      }
    }

    fetchBranchData();
  }, []);

  return branches;
}
