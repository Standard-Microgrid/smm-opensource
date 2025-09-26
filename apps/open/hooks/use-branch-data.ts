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
          setBranches([]);
          return;
        }

        if (!branchesData || branchesData.length === 0) {
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
