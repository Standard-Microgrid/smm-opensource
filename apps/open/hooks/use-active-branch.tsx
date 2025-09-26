"use client"

import React, { useState, useEffect, createContext, useContext } from 'react';
import { createSupabaseClient } from '@/lib/supabase';

interface ActiveBranchContextType {
  activeBranchId: string | null;
  setActiveBranchId: (branchId: string) => void;
}

const ActiveBranchContext = createContext<ActiveBranchContextType | undefined>(undefined);

export function ActiveBranchProvider({ 
  children, 
  initialActiveBranchId 
}: { 
  children: React.ReactNode;
  initialActiveBranchId?: string | null;
}) {
  // Start with server-provided value to prevent hydration mismatch
  const [activeBranchId, setActiveBranchId] = useState<string | null>(initialActiveBranchId || null);

  useEffect(() => {
    // Load active branch from localStorage on mount, but only if no server value
    if (!initialActiveBranchId) {
      const savedBranchId = localStorage.getItem('activeBranchId');
      if (savedBranchId) {
        setActiveBranchId(savedBranchId);
      } else {
        // If no saved branch, get the first available branch for the user
        initializeFirstBranch();
      }
    }
  }, [initialActiveBranchId]);

  const initializeFirstBranch = async () => {
    try {
      const supabase = createSupabaseClient();
      
      // Get current user from auth
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
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
        return;
      }

      // Get the first available branch for the organization
      const { data: firstBranch, error: firstBranchError } = await supabase
        .schema('core')
        .from('branches')
        .select('id')
        .eq('organization_id', userProfile.organization_id)
        .eq('is_active', true)
        .order('name')
        .limit(1)
        .single();

      if (firstBranchError || !firstBranch?.id) {
        return;
      }

      // Set the first branch as active
      setActiveBranchId(firstBranch.id);
      localStorage.setItem('activeBranchId', firstBranch.id);
      
      // Also set the cookie for server-side access
      document.cookie = `activeBranchId=${firstBranch.id}; path=/; max-age=31536000; SameSite=Lax`;
      
    } catch (error) {
      console.error('Error initializing first branch:', error);
    }
  };

  const handleSetActiveBranchId = (branchId: string) => {
    setActiveBranchId(branchId);
    localStorage.setItem('activeBranchId', branchId);
  };

  return (
    <ActiveBranchContext.Provider value={{ activeBranchId, setActiveBranchId: handleSetActiveBranchId }}>
      {children}
    </ActiveBranchContext.Provider>
  );
}

export function useActiveBranch() {
  const context = useContext(ActiveBranchContext);
  if (context === undefined) {
    // Return a default context when no provider is available
    return {
      activeBranchId: null,
      setActiveBranchId: () => {
        console.warn('setActiveBranchId called but no ActiveBranchProvider is available');
      }
    };
  }
  return context;
}
