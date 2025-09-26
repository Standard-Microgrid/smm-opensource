"use client"

import React, { useState, useEffect, createContext, useContext } from 'react';
import { useActiveBranch } from './use-active-branch';

interface CurrencyContextType {
  currency: string;
  setCurrency: (currency: string) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({
  children,
  initialCurrency
}: {
  children: React.ReactNode;
  initialCurrency?: string | null;
}) {
  // Start with server-provided value to prevent hydration mismatch
  const [currency, setCurrency] = useState<string>(initialCurrency || 'USD');
  const [isInitialized, setIsInitialized] = useState(false);
  const { activeBranchId } = useActiveBranch();

  useEffect(() => {
    // Load currency from localStorage on mount, but only if no server value
    if (!initialCurrency) {
      const savedCurrency = localStorage.getItem('activeCurrency');
      if (savedCurrency) {
        setCurrency(savedCurrency);
      }
    }
    setIsInitialized(true);
  }, [initialCurrency]);

  // Update currency when activeBranchId changes
  useEffect(() => {
    if (activeBranchId && isInitialized) {
      // Fetch currency for the new active branch
      fetchBranchCurrency(activeBranchId);
    }
  }, [activeBranchId, isInitialized]);

  const fetchBranchCurrency = async (branchId: string) => {
    try {
      const response = await fetch(`/api/branch/${branchId}/currency`);
      if (response.ok) {
        const data = await response.json();
        if (data.currency) {
          setCurrency(data.currency);
          localStorage.setItem('activeCurrency', data.currency);
        }
      }
    } catch (error) {
      console.error('Error fetching branch currency:', error);
    }
  };

  const handleSetCurrency = (newCurrency: string) => {
    setCurrency(newCurrency);
    localStorage.setItem('activeCurrency', newCurrency);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: handleSetCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    return {
      currency: 'USD',
      setCurrency: () => {
        console.warn('setCurrency called but no CurrencyProvider is available');
      }
    };
  }
  return context;
}
