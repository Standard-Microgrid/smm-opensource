"use client"

import { useState, useEffect } from 'react';
import { createSupabaseClient } from '@/lib/supabase';
import { useActiveBranch } from './use-active-branch';

export interface BranchCurrency {
  currency: string;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to get the current active branch's currency
 */
export function useBranchCurrency(): BranchCurrency {
  const [currency, setCurrency] = useState<string>('USD'); // Default fallback
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { activeBranchId } = useActiveBranch();

  useEffect(() => {
    async function fetchBranchCurrency() {
      try {
        setIsLoading(true);
        setError(null);

        if (!activeBranchId) {
          // If no active branch, try to get the first available branch
          
          const supabase = createSupabaseClient();
          
          // Get current user from auth
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          
          if (userError || !user) {
            setCurrency('USD');
            setIsLoading(false);
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
            setCurrency('USD');
            setIsLoading(false);
            return;
          }

          // Get the first available branch for the organization
          const { data: firstBranch, error: firstBranchError } = await supabase
            .schema('core')
            .from('branches')
            .select('currency')
            .eq('organization_id', userProfile.organization_id)
            .order('name')
            .limit(1)
            .single();

          if (firstBranchError) {
            console.warn('First branch fetch failed, using default:', firstBranchError);
            setCurrency('USD');
          } else if (firstBranch?.currency) {
            setCurrency(firstBranch.currency);
          } else {
            setCurrency('USD'); // Default fallback
          }
          
          setIsLoading(false);
          return;
        }

        const supabase = createSupabaseClient();
        
        // Get current user from auth
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          setError('User not authenticated');
          setCurrency('USD');
          setIsLoading(false);
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
          setError('User profile not found');
          setCurrency('USD');
          setIsLoading(false);
          return;
        }

        // Get the specific branch's currency
        const { data: branchData, error: branchError } = await supabase
          .schema('core')
          .from('branches')
          .select('currency')
          .eq('id', activeBranchId)
          .eq('organization_id', userProfile.organization_id)
          .single();

        if (branchError) {
          console.warn('Branch currency fetch failed, using default:', branchError);
          // Don't set error for missing branch data - this is common after onboarding
          setCurrency('USD');
        } else if (branchData?.currency) {
          setCurrency(branchData.currency);
        } else {
          setCurrency('USD'); // Default fallback
        }
      } catch (err) {
        console.error('Unexpected error fetching branch currency:', err);
        setError('Unexpected error occurred');
        setCurrency('USD');
      } finally {
        setIsLoading(false);
      }
    }

    fetchBranchCurrency();
  }, [activeBranchId]);

  return {
    currency,
    isLoading,
    error
  };
}
