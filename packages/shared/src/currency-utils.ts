/**
 * Currency utility functions for formatting and displaying currency values
 */

export interface CurrencySymbol {
  symbol: string;
  position: 'before' | 'after';
  spacing: boolean;
}

/**
 * Get currency symbol and formatting information for a given currency code
 */
export function getCurrencySymbol(currencyCode: string): CurrencySymbol {
  const currencyMap: Record<string, CurrencySymbol> = {
    // Major currencies
    'USD': { symbol: '$', position: 'before', spacing: false },
    'EUR': { symbol: '€', position: 'after', spacing: true },
    'GBP': { symbol: '£', position: 'before', spacing: false },
    'JPY': { symbol: '¥', position: 'before', spacing: false },
    'CAD': { symbol: 'C$', position: 'before', spacing: false },
    'AUD': { symbol: 'A$', position: 'before', spacing: false },
    'CHF': { symbol: 'CHF', position: 'after', spacing: true },
    'CNY': { symbol: '¥', position: 'before', spacing: false },
    'SEK': { symbol: 'kr', position: 'after', spacing: true },
    'NZD': { symbol: 'NZ$', position: 'before', spacing: false },
    'MXN': { symbol: '$', position: 'before', spacing: false },
    'SGD': { symbol: 'S$', position: 'before', spacing: false },
    'HKD': { symbol: 'HK$', position: 'before', spacing: false },
    'NOK': { symbol: 'kr', position: 'after', spacing: true },
    'TRY': { symbol: '₺', position: 'after', spacing: true },
    'RUB': { symbol: '₽', position: 'after', spacing: true },
    'INR': { symbol: '₹', position: 'before', spacing: false },
    'BRL': { symbol: 'R$', position: 'before', spacing: false },
    'ZAR': { symbol: 'R', position: 'before', spacing: false },
    'KRW': { symbol: '₩', position: 'before', spacing: false },
    
    // African currencies
    'DZD': { symbol: 'د.ج', position: 'after', spacing: true },
    'AOA': { symbol: 'Kz', position: 'after', spacing: true },
    'XOF': { symbol: 'CFA', position: 'after', spacing: true },
    'BWP': { symbol: 'P', position: 'before', spacing: false },
    'BIF': { symbol: 'FBu', position: 'after', spacing: true },
    'XAF': { symbol: 'FCFA', position: 'after', spacing: true },
    'CVE': { symbol: '$', position: 'before', spacing: false },
    'KMF': { symbol: 'CF', position: 'after', spacing: true },
    'CDF': { symbol: 'FC', position: 'after', spacing: true },
    'DJF': { symbol: 'Fdj', position: 'after', spacing: true },
    'EGP': { symbol: '£', position: 'before', spacing: false },
    'ERN': { symbol: 'Nfk', position: 'after', spacing: true },
    'ETB': { symbol: 'Br', position: 'before', spacing: false },
    'GMD': { symbol: 'D', position: 'before', spacing: false },
    'GHS': { symbol: '₵', position: 'before', spacing: false },
    'GNF': { symbol: 'FG', position: 'after', spacing: true },
    'KES': { symbol: 'KSh', position: 'before', spacing: false },
    'LSL': { symbol: 'L', position: 'before', spacing: false },
    'LRD': { symbol: 'L$', position: 'before', spacing: false },
    'LYD': { symbol: 'ل.د', position: 'after', spacing: true },
    'MGA': { symbol: 'Ar', position: 'after', spacing: true },
    'MWK': { symbol: 'MK', position: 'before', spacing: false },
    'MUR': { symbol: '₨', position: 'before', spacing: false },
    'MAD': { symbol: 'د.م.', position: 'after', spacing: true },
    'MZN': { symbol: 'MT', position: 'after', spacing: true },
    'NAD': { symbol: 'N$', position: 'before', spacing: false },
    'NGN': { symbol: '₦', position: 'before', spacing: false },
    'RWF': { symbol: 'RF', position: 'after', spacing: true },
    'STN': { symbol: 'Db', position: 'after', spacing: true },
    'SCR': { symbol: '₨', position: 'before', spacing: false },
    'SLE': { symbol: 'Le', position: 'before', spacing: false },
    'SOS': { symbol: 'S', position: 'before', spacing: false },
    'SSP': { symbol: 'SS£', position: 'before', spacing: false },
    'SDG': { symbol: 'ج.س.', position: 'after', spacing: true },
    'SZL': { symbol: 'L', position: 'before', spacing: false },
    'TZS': { symbol: 'TSh', position: 'before', spacing: false },
    'TND': { symbol: 'د.ت', position: 'after', spacing: true },
    'UGX': { symbol: 'USh', position: 'before', spacing: false },
    'ZMW': { symbol: 'ZK', position: 'before', spacing: false },
    'ZWL': { symbol: 'Z$', position: 'before', spacing: false },
    
    // South American currencies
    'ARS': { symbol: '$', position: 'before', spacing: false },
    'CLP': { symbol: '$', position: 'before', spacing: false },
    'COP': { symbol: '$', position: 'before', spacing: false },
    'PEN': { symbol: 'S/', position: 'before', spacing: false },
    'MRU': { symbol: 'UM', position: 'after', spacing: true },
  };

  return currencyMap[currencyCode] || { symbol: currencyCode, position: 'before', spacing: false };
}

/**
 * Format a currency value with the appropriate symbol and positioning
 */
export function formatCurrency(amount: number, currencyCode: string, options?: {
  decimals?: number;
  locale?: string;
}): string {
  const { decimals = 2, locale = 'en-US' } = options || {};
  const currencyInfo = getCurrencySymbol(currencyCode);
  
  // Format the number with appropriate decimal places
  const formattedNumber = amount.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  
  // Apply currency symbol with proper positioning and spacing
  if (currencyInfo.position === 'before') {
    return currencyInfo.spacing 
      ? `${currencyInfo.symbol} ${formattedNumber}`
      : `${currencyInfo.symbol}${formattedNumber}`;
  } else {
    return currencyInfo.spacing 
      ? `${formattedNumber} ${currencyInfo.symbol}`
      : `${formattedNumber}${currencyInfo.symbol}`;
  }
}

/**
 * Get just the currency symbol for a given currency code
 */
export function getCurrencySymbolOnly(currencyCode: string): string {
  return getCurrencySymbol(currencyCode).symbol;
}
