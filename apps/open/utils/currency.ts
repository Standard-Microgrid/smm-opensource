import { createSupabaseClient } from '@/lib/supabase-server';
import { getActiveBranchFromCookie } from './cookies';

/**
 * Get the currency for a specific branch ID (server-side)
 */
export async function getBranchCurrency(branchId: string): Promise<string | null> {
  try {
    const supabase = await createSupabaseClient();
    
    // Get the branch's currency
    const { data: branchData, error: branchError } = await supabase
      .schema('core')
      .from('branches')
      .select('currency')
      .eq('id', branchId)
      .single();

    if (branchError) {
      // Suppress all errors during onboarding - they're expected when no branches exist yet
      // Only log if there's a meaningful error with actual content
      if (branchError && Object.keys(branchError).length > 0 && branchError.code !== 'PGRST116') {
        console.error('Database error fetching branch currency:', branchError);
      }
      return null;
    }

    if (!branchData) {
      console.error('No branch data found for ID:', branchId);
      return null;
    }

    if (!branchData.currency) {
      console.error('Branch found but no currency set for ID:', branchId);
      return null;
    }

    return branchData.currency;
  } catch (err) {
    console.error('Unexpected error fetching branch currency:', err);
    return null;
  }
}

/**
 * Get the currency for the first available branch of an organization (server-side)
 */
export async function getFirstBranchCurrency(organizationId: string): Promise<string | null> {
  try {
    const supabase = await createSupabaseClient();
    
    // Get the first available branch for the organization
    const { data: firstBranch, error: firstBranchError } = await supabase
      .schema('core')
      .from('branches')
      .select('currency')
      .eq('organization_id', organizationId)
      .order('name')
      .limit(1)
      .single();

    if (firstBranchError || !firstBranch?.currency) {
      // Log meaningful errors (not empty objects or record not found)
      if (firstBranchError && Object.keys(firstBranchError).length > 0 && firstBranchError.code !== 'PGRST116') {
        console.error('Error fetching first branch currency:', firstBranchError);
      }
      return null;
    }

    return firstBranch.currency;
  } catch (err) {
    console.error('Unexpected error fetching first branch currency:', err);
    return null;
  }
}

/**
 * Get the currency for the active branch (server-side)
 * Uses the same logic as the client-side useBranchCurrency hook
 */
export async function getActiveBranchCurrency(): Promise<string> {
  try {
    const supabase = await createSupabaseClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return 'USD'; // Default fallback
    }

    // Get user profile
    const { data: userProfile, error: profileError } = await supabase
      .schema('core')
      .from('user_profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single();

    if (profileError || !userProfile) {
      return 'USD'; // Default fallback
    }

    // Get active branch from cookie
    const activeBranchId = await getActiveBranchFromCookie();

    if (activeBranchId) {
      // Get currency for specific active branch
      const currency = await getBranchCurrency(activeBranchId);
      if (currency) {
        return currency;
      }
    }

    // Fallback: get currency from first available branch
    if (userProfile.organization_id) {
      const firstBranchCurrency = await getFirstBranchCurrency(userProfile.organization_id);
      if (firstBranchCurrency) {
        return firstBranchCurrency;
      }
    }

    return 'USD'; // Default fallback
  } catch (error) {
    console.error('Error fetching active branch currency:', error);
    return 'USD'; // Default fallback
  }
}
