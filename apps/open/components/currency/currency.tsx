"use client"

import React from 'react';
import { formatCurrency, getCurrencySymbolOnly } from '@smm/shared/src/currency-utils';
import { useCurrency } from '@/hooks/use-currency';

interface CurrencyProps {
  amount: number;
  currencyCode?: string; // Optional override for currency code
  initialCurrency?: string; // Server-side provided currency to prevent flashing
  decimals?: number;
  locale?: string;
  showSymbol?: boolean; // Whether to show the currency symbol
  className?: string;
}

/**
 * Currency component that displays formatted currency values
 * Uses the current branch's currency by default, but can be overridden
 */
export function Currency({ 
  amount, 
  currencyCode, 
  initialCurrency,
  decimals = 2, 
  locale = 'en-US',
  showSymbol = true,
  className = ""
}: CurrencyProps) {
  const { currency: contextCurrency } = useCurrency();
  
  // Use provided currency code, initial currency, or fall back to context currency
  const currency = currencyCode || initialCurrency || contextCurrency;
  
  if (showSymbol) {
    // Show full formatted currency
    return (
      <span className={className}>
        {formatCurrency(amount, currency, { decimals, locale })}
      </span>
    );
  } else {
    // Show just the number without currency symbol
    return (
      <span className={className}>
        {amount.toLocaleString(locale, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}
      </span>
    );
  }
}

/**
 * Currency symbol component that shows just the currency symbol
 */
export function CurrencySymbol({ 
  currencyCode, 
  initialCurrency,
  className = "" 
}: { 
  currencyCode?: string; 
  initialCurrency?: string;
  className?: string; 
}) {
  const { currency: contextCurrency } = useCurrency();
  
  // Use provided currency code, initial currency, or fall back to context currency
  const currency = currencyCode || initialCurrency || contextCurrency;
  
  const symbol = getCurrencySymbolOnly(currency);
  
  return <span className={className}>{symbol}</span>;
}
