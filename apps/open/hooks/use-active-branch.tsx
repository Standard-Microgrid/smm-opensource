"use client"

import React, { useState, useEffect, createContext, useContext } from 'react';

interface ActiveBranchContextType {
  activeBranchId: string | null;
  setActiveBranchId: (branchId: string) => void;
}

const ActiveBranchContext = createContext<ActiveBranchContextType | undefined>(undefined);

export function ActiveBranchProvider({ children }: { children: React.ReactNode }) {
  const [activeBranchId, setActiveBranchId] = useState<string | null>(null);

  useEffect(() => {
    // Load active branch from localStorage on mount
    const savedBranchId = localStorage.getItem('activeBranchId');
    if (savedBranchId) {
      setActiveBranchId(savedBranchId);
    }
  }, []);


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
