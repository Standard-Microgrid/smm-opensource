// Country to currency and timezone mappings
// This is a simplified mapping - in production, you might want to use a more comprehensive service

export interface CountryMapping {
  currency: string;
  timezone: string;
  phonePrefix?: string;
}

export const countryMappings: Record<string, CountryMapping> = {
  // Africa - All 54 countries
  "DZ": { currency: "DZD", timezone: "Africa/Algiers", phonePrefix: "+213" }, // Algeria
  "AO": { currency: "AOA", timezone: "Africa/Luanda", phonePrefix: "+244" }, // Angola
  "BJ": { currency: "XOF", timezone: "Africa/Porto-Novo", phonePrefix: "+229" }, // Benin
  "BW": { currency: "BWP", timezone: "Africa/Gaborone", phonePrefix: "+267" }, // Botswana
  "BF": { currency: "XOF", timezone: "Africa/Ouagadougou", phonePrefix: "+226" }, // Burkina Faso
  "BI": { currency: "BIF", timezone: "Africa/Bujumbura", phonePrefix: "+257" }, // Burundi
  "CM": { currency: "XAF", timezone: "Africa/Douala", phonePrefix: "+237" }, // Cameroon
  "CV": { currency: "CVE", timezone: "Atlantic/Cape_Verde", phonePrefix: "+238" }, // Cape Verde
  "CF": { currency: "XAF", timezone: "Africa/Bangui", phonePrefix: "+236" }, // Central African Republic
  "TD": { currency: "XAF", timezone: "Africa/Ndjamena", phonePrefix: "+235" }, // Chad
  "KM": { currency: "KMF", timezone: "Indian/Comoro", phonePrefix: "+269" }, // Comoros
  "CG": { currency: "XAF", timezone: "Africa/Brazzaville", phonePrefix: "+242" }, // Republic of the Congo
  "CD": { currency: "CDF", timezone: "Africa/Kinshasa", phonePrefix: "+243" }, // Democratic Republic of the Congo
  "CI": { currency: "XOF", timezone: "Africa/Abidjan", phonePrefix: "+225" }, // Côte d'Ivoire
  "DJ": { currency: "DJF", timezone: "Africa/Djibouti", phonePrefix: "+253" }, // Djibouti
  "EG": { currency: "EGP", timezone: "Africa/Cairo", phonePrefix: "+20" }, // Egypt
  "GQ": { currency: "XAF", timezone: "Africa/Malabo", phonePrefix: "+240" }, // Equatorial Guinea
  "ER": { currency: "ERN", timezone: "Africa/Asmara", phonePrefix: "+291" }, // Eritrea
  "ET": { currency: "ETB", timezone: "Africa/Addis_Ababa", phonePrefix: "+251" }, // Ethiopia
  "GA": { currency: "XAF", timezone: "Africa/Libreville", phonePrefix: "+241" }, // Gabon
  "GM": { currency: "GMD", timezone: "Africa/Banjul", phonePrefix: "+220" }, // Gambia
  "GH": { currency: "GHS", timezone: "Africa/Accra", phonePrefix: "+233" }, // Ghana
  "GN": { currency: "GNF", timezone: "Africa/Conakry", phonePrefix: "+224" }, // Guinea
  "GW": { currency: "XOF", timezone: "Africa/Bissau", phonePrefix: "+245" }, // Guinea-Bissau
  "KE": { currency: "KES", timezone: "Africa/Nairobi", phonePrefix: "+254" }, // Kenya
  "LS": { currency: "LSL", timezone: "Africa/Maseru", phonePrefix: "+266" }, // Lesotho
  "LR": { currency: "LRD", timezone: "Africa/Monrovia", phonePrefix: "+231" }, // Liberia
  "LY": { currency: "LYD", timezone: "Africa/Tripoli", phonePrefix: "+218" }, // Libya
  "MG": { currency: "MGA", timezone: "Indian/Antananarivo", phonePrefix: "+261" }, // Madagascar
  "MW": { currency: "MWK", timezone: "Africa/Blantyre", phonePrefix: "+265" }, // Malawi
  "ML": { currency: "XOF", timezone: "Africa/Bamako", phonePrefix: "+223" }, // Mali
  "MR": { currency: "MRU", timezone: "Africa/Nouakchott", phonePrefix: "+222" }, // Mauritania
  "MU": { currency: "MUR", timezone: "Indian/Mauritius", phonePrefix: "+230" }, // Mauritius
  "MA": { currency: "MAD", timezone: "Africa/Casablanca", phonePrefix: "+212" }, // Morocco
  "MZ": { currency: "MZN", timezone: "Africa/Maputo", phonePrefix: "+258" }, // Mozambique
  "NA": { currency: "NAD", timezone: "Africa/Windhoek", phonePrefix: "+264" }, // Namibia
  "NE": { currency: "XOF", timezone: "Africa/Niamey", phonePrefix: "+227" }, // Niger
  "NG": { currency: "NGN", timezone: "Africa/Lagos", phonePrefix: "+234" }, // Nigeria
  "RW": { currency: "RWF", timezone: "Africa/Kigali", phonePrefix: "+250" }, // Rwanda
  "ST": { currency: "STN", timezone: "Africa/Sao_Tome", phonePrefix: "+239" }, // São Tomé and Príncipe
  "SN": { currency: "XOF", timezone: "Africa/Dakar", phonePrefix: "+221" }, // Senegal
  "SC": { currency: "SCR", timezone: "Indian/Mahe", phonePrefix: "+248" }, // Seychelles
  "SL": { currency: "SLE", timezone: "Africa/Freetown", phonePrefix: "+232" }, // Sierra Leone
  "SO": { currency: "SOS", timezone: "Africa/Mogadishu", phonePrefix: "+252" }, // Somalia
  "ZA": { currency: "ZAR", timezone: "Africa/Johannesburg", phonePrefix: "+27" }, // South Africa
  "SS": { currency: "SSP", timezone: "Africa/Juba", phonePrefix: "+211" }, // South Sudan
  "SD": { currency: "SDG", timezone: "Africa/Khartoum", phonePrefix: "+249" }, // Sudan
  "SZ": { currency: "SZL", timezone: "Africa/Mbabane", phonePrefix: "+268" }, // Eswatini (Swaziland)
  "TZ": { currency: "TZS", timezone: "Africa/Dar_es_Salaam", phonePrefix: "+255" }, // Tanzania
  "TG": { currency: "XOF", timezone: "Africa/Lome", phonePrefix: "+228" }, // Togo
  "TN": { currency: "TND", timezone: "Africa/Tunis", phonePrefix: "+216" }, // Tunisia
  "UG": { currency: "UGX", timezone: "Africa/Kampala", phonePrefix: "+256" }, // Uganda
  "ZM": { currency: "ZMW", timezone: "Africa/Lusaka", phonePrefix: "+260" }, // Zambia
  "ZW": { currency: "ZWL", timezone: "Africa/Harare", phonePrefix: "+263" }, // Zimbabwe
  
  // North America
  "US": { currency: "USD", timezone: "America/New_York", phonePrefix: "+1" }, // United States
  "CA": { currency: "CAD", timezone: "America/Toronto", phonePrefix: "+1" }, // Canada
  "MX": { currency: "MXN", timezone: "America/Mexico_City", phonePrefix: "+52" }, // Mexico
  
  // Europe
  "GB": { currency: "GBP", timezone: "Europe/London", phonePrefix: "+44" }, // United Kingdom
  "DE": { currency: "EUR", timezone: "Europe/Berlin", phonePrefix: "+49" }, // Germany
  "FR": { currency: "EUR", timezone: "Europe/Paris", phonePrefix: "+33" }, // France
  "IT": { currency: "EUR", timezone: "Europe/Rome", phonePrefix: "+39" }, // Italy
  "ES": { currency: "EUR", timezone: "Europe/Madrid", phonePrefix: "+34" }, // Spain
  "NL": { currency: "EUR", timezone: "Europe/Amsterdam", phonePrefix: "+31" }, // Netherlands
  
  // Asia
  "CN": { currency: "CNY", timezone: "Asia/Shanghai", phonePrefix: "+86" }, // China
  "JP": { currency: "JPY", timezone: "Asia/Tokyo", phonePrefix: "+81" }, // Japan
  "IN": { currency: "INR", timezone: "Asia/Kolkata", phonePrefix: "+91" }, // India
  "SG": { currency: "SGD", timezone: "Asia/Singapore", phonePrefix: "+65" }, // Singapore
  "HK": { currency: "HKD", timezone: "Asia/Hong_Kong", phonePrefix: "+852" }, // Hong Kong
  
  // Oceania
  "AU": { currency: "AUD", timezone: "Australia/Sydney", phonePrefix: "+61" }, // Australia
  "NZ": { currency: "NZD", timezone: "Pacific/Auckland", phonePrefix: "+64" }, // New Zealand
  
  // South America
  "BR": { currency: "BRL", timezone: "America/Sao_Paulo", phonePrefix: "+55" }, // Brazil
  "AR": { currency: "ARS", timezone: "America/Argentina/Buenos_Aires", phonePrefix: "+54" }, // Argentina
  "CL": { currency: "CLP", timezone: "America/Santiago", phonePrefix: "+56" }, // Chile
  "CO": { currency: "COP", timezone: "America/Bogota", phonePrefix: "+57" }, // Colombia
  "PE": { currency: "PEN", timezone: "America/Lima", phonePrefix: "+51" }, // Peru
};

export function getCountryMapping(countryCode: string): CountryMapping {
  const mapping = countryMappings[countryCode];
  
  if (!mapping) {
    // Default fallback for unmapped countries
    console.warn(`No mapping found for country code: ${countryCode}, using defaults`);
    return {
      currency: "USD", // Default to USD
      timezone: "UTC", // Default to UTC
      phonePrefix: "+1" // Default to +1
    };
  }
  
  return mapping;
}

// For more sophisticated timezone detection based on city, you could:
// 1. Use a geocoding service (Google Maps, OpenStreetMap)
// 2. Use a timezone database like moment-timezone
// 3. Use a service like TimeZoneDB API
// For now, we'll use country-level timezones which is sufficient for most use cases

// Currency data extracted from country mappings
export interface Currency {
  code: string;
  name: string;
}

export const currencies: Currency[] = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound Sterling" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "MXN", name: "Mexican Peso" },
  { code: "SGD", name: "Singapore Dollar" },
  { code: "HKD", name: "Hong Kong Dollar" },
  { code: "INR", name: "Indian Rupee" },
  { code: "BRL", name: "Brazilian Real" },
  { code: "ZAR", name: "South African Rand" },
  { code: "NZD", name: "New Zealand Dollar" },
  { code: "DZD", name: "Algerian Dinar" },
  { code: "AOA", name: "Angolan Kwanza" },
  { code: "XOF", name: "West African CFA Franc" },
  { code: "BWP", name: "Botswana Pula" },
  { code: "BIF", name: "Burundian Franc" },
  { code: "XAF", name: "Central African CFA Franc" },
  { code: "CVE", name: "Cape Verdean Escudo" },
  { code: "KMF", name: "Comorian Franc" },
  { code: "CDF", name: "Congolese Franc" },
  { code: "DJF", name: "Djiboutian Franc" },
  { code: "EGP", name: "Egyptian Pound" },
  { code: "ERN", name: "Eritrean Nakfa" },
  { code: "ETB", name: "Ethiopian Birr" },
  { code: "GMD", name: "Gambian Dalasi" },
  { code: "GHS", name: "Ghanaian Cedi" },
  { code: "GNF", name: "Guinean Franc" },
  { code: "KES", name: "Kenyan Shilling" },
  { code: "LSL", name: "Lesotho Loti" },
  { code: "LRD", name: "Liberian Dollar" },
  { code: "LYD", name: "Libyan Dinar" },
  { code: "MGA", name: "Malagasy Ariary" },
  { code: "MWK", name: "Malawian Kwacha" },
  { code: "MUR", name: "Mauritian Rupee" },
  { code: "MAD", name: "Moroccan Dirham" },
  { code: "MZN", name: "Mozambican Metical" },
  { code: "NAD", name: "Namibian Dollar" },
  { code: "NGN", name: "Nigerian Naira" },
  { code: "RWF", name: "Rwandan Franc" },
  { code: "STN", name: "São Tomé and Príncipe Dobra" },
  { code: "SCR", name: "Seychellois Rupee" },
  { code: "SLE", name: "Sierra Leonean Leone" },
  { code: "SOS", name: "Somali Shilling" },
  { code: "SSP", name: "South Sudanese Pound" },
  { code: "SDG", name: "Sudanese Pound" },
  { code: "SZL", name: "Swazi Lilangeni" },
  { code: "TZS", name: "Tanzanian Shilling" },
  { code: "TND", name: "Tunisian Dinar" },
  { code: "UGX", name: "Ugandan Shilling" },
  { code: "ZMW", name: "Zambian Kwacha" },
  { code: "ZWL", name: "Zimbabwean Dollar" },
  { code: "ARS", name: "Argentine Peso" },
  { code: "CLP", name: "Chilean Peso" },
  { code: "COP", name: "Colombian Peso" },
  { code: "PEN", name: "Peruvian Sol" },
  { code: "MRU", name: "Mauritanian Ouguiya" },
];

// Timezone data extracted from country mappings
export interface Timezone {
  value: string;
  label: string;
  gmtOffset: string;
}

export const timezones: Timezone[] = [
  { value: "Africa/Algiers", label: "Africa/Algiers", gmtOffset: "GMT+1" },
  { value: "Africa/Luanda", label: "Africa/Luanda", gmtOffset: "GMT+1" },
  { value: "Africa/Porto-Novo", label: "Africa/Porto-Novo", gmtOffset: "GMT+1" },
  { value: "Africa/Gaborone", label: "Africa/Gaborone", gmtOffset: "GMT+2" },
  { value: "Africa/Ouagadougou", label: "Africa/Ouagadougou", gmtOffset: "GMT+0" },
  { value: "Africa/Bujumbura", label: "Africa/Bujumbura", gmtOffset: "GMT+2" },
  { value: "Africa/Douala", label: "Africa/Douala", gmtOffset: "GMT+1" },
  { value: "Atlantic/Cape_Verde", label: "Atlantic/Cape_Verde", gmtOffset: "GMT-1" },
  { value: "Africa/Bangui", label: "Africa/Bangui", gmtOffset: "GMT+1" },
  { value: "Africa/Ndjamena", label: "Africa/Ndjamena", gmtOffset: "GMT+1" },
  { value: "Indian/Comoro", label: "Indian/Comoro", gmtOffset: "GMT+3" },
  { value: "Africa/Brazzaville", label: "Africa/Brazzaville", gmtOffset: "GMT+1" },
  { value: "Africa/Kinshasa", label: "Africa/Kinshasa", gmtOffset: "GMT+1" },
  { value: "Africa/Abidjan", label: "Africa/Abidjan", gmtOffset: "GMT+0" },
  { value: "Africa/Djibouti", label: "Africa/Djibouti", gmtOffset: "GMT+3" },
  { value: "Africa/Cairo", label: "Africa/Cairo", gmtOffset: "GMT+2" },
  { value: "Africa/Malabo", label: "Africa/Malabo", gmtOffset: "GMT+1" },
  { value: "Africa/Asmara", label: "Africa/Asmara", gmtOffset: "GMT+3" },
  { value: "Africa/Addis_Ababa", label: "Africa/Addis_Ababa", gmtOffset: "GMT+3" },
  { value: "Africa/Libreville", label: "Africa/Libreville", gmtOffset: "GMT+1" },
  { value: "Africa/Banjul", label: "Africa/Banjul", gmtOffset: "GMT+0" },
  { value: "Africa/Accra", label: "Africa/Accra", gmtOffset: "GMT+0" },
  { value: "Africa/Conakry", label: "Africa/Conakry", gmtOffset: "GMT+0" },
  { value: "Africa/Bissau", label: "Africa/Bissau", gmtOffset: "GMT+0" },
  { value: "Africa/Nairobi", label: "Africa/Nairobi", gmtOffset: "GMT+3" },
  { value: "Africa/Maseru", label: "Africa/Maseru", gmtOffset: "GMT+2" },
  { value: "Africa/Monrovia", label: "Africa/Monrovia", gmtOffset: "GMT+0" },
  { value: "Africa/Tripoli", label: "Africa/Tripoli", gmtOffset: "GMT+2" },
  { value: "Indian/Antananarivo", label: "Indian/Antananarivo", gmtOffset: "GMT+3" },
  { value: "Africa/Blantyre", label: "Africa/Blantyre", gmtOffset: "GMT+2" },
  { value: "Africa/Bamako", label: "Africa/Bamako", gmtOffset: "GMT+0" },
  { value: "Africa/Nouakchott", label: "Africa/Nouakchott", gmtOffset: "GMT+0" },
  { value: "Indian/Mauritius", label: "Indian/Mauritius", gmtOffset: "GMT+4" },
  { value: "Africa/Casablanca", label: "Africa/Casablanca", gmtOffset: "GMT+1" },
  { value: "Africa/Maputo", label: "Africa/Maputo", gmtOffset: "GMT+2" },
  { value: "Africa/Windhoek", label: "Africa/Windhoek", gmtOffset: "GMT+2" },
  { value: "Africa/Niamey", label: "Africa/Niamey", gmtOffset: "GMT+1" },
  { value: "Africa/Lagos", label: "Africa/Lagos", gmtOffset: "GMT+1" },
  { value: "Africa/Kigali", label: "Africa/Kigali", gmtOffset: "GMT+2" },
  { value: "Africa/Sao_Tome", label: "Africa/Sao_Tome", gmtOffset: "GMT+0" },
  { value: "Africa/Dakar", label: "Africa/Dakar", gmtOffset: "GMT+0" },
  { value: "Indian/Mahe", label: "Indian/Mahe", gmtOffset: "GMT+4" },
  { value: "Africa/Freetown", label: "Africa/Freetown", gmtOffset: "GMT+0" },
  { value: "Africa/Mogadishu", label: "Africa/Mogadishu", gmtOffset: "GMT+3" },
  { value: "Africa/Johannesburg", label: "Africa/Johannesburg", gmtOffset: "GMT+2" },
  { value: "Africa/Juba", label: "Africa/Juba", gmtOffset: "GMT+2" },
  { value: "Africa/Khartoum", label: "Africa/Khartoum", gmtOffset: "GMT+2" },
  { value: "Africa/Mbabane", label: "Africa/Mbabane", gmtOffset: "GMT+2" },
  { value: "Africa/Dar_es_Salaam", label: "Africa/Dar_es_Salaam", gmtOffset: "GMT+3" },
  { value: "Africa/Lome", label: "Africa/Lome", gmtOffset: "GMT+0" },
  { value: "Africa/Tunis", label: "Africa/Tunis", gmtOffset: "GMT+1" },
  { value: "Africa/Kampala", label: "Africa/Kampala", gmtOffset: "GMT+3" },
  { value: "Africa/Lusaka", label: "Africa/Lusaka", gmtOffset: "GMT+2" },
  { value: "Africa/Harare", label: "Africa/Harare", gmtOffset: "GMT+2" },
  { value: "America/New_York", label: "America/New_York", gmtOffset: "GMT-5" },
  { value: "America/Toronto", label: "America/Toronto", gmtOffset: "GMT-5" },
  { value: "America/Mexico_City", label: "America/Mexico_City", gmtOffset: "GMT-6" },
  { value: "Europe/London", label: "Europe/London", gmtOffset: "GMT+0" },
  { value: "Europe/Berlin", label: "Europe/Berlin", gmtOffset: "GMT+1" },
  { value: "Europe/Paris", label: "Europe/Paris", gmtOffset: "GMT+1" },
  { value: "Europe/Rome", label: "Europe/Rome", gmtOffset: "GMT+1" },
  { value: "Europe/Madrid", label: "Europe/Madrid", gmtOffset: "GMT+1" },
  { value: "Europe/Amsterdam", label: "Europe/Amsterdam", gmtOffset: "GMT+1" },
  { value: "Asia/Shanghai", label: "Asia/Shanghai", gmtOffset: "GMT+8" },
  { value: "Asia/Tokyo", label: "Asia/Tokyo", gmtOffset: "GMT+9" },
  { value: "Asia/Kolkata", label: "Asia/Kolkata", gmtOffset: "GMT+5:30" },
  { value: "Asia/Singapore", label: "Asia/Singapore", gmtOffset: "GMT+8" },
  { value: "Asia/Hong_Kong", label: "Asia/Hong_Kong", gmtOffset: "GMT+8" },
  { value: "Australia/Sydney", label: "Australia/Sydney", gmtOffset: "GMT+10" },
  { value: "Pacific/Auckland", label: "Pacific/Auckland", gmtOffset: "GMT+12" },
  { value: "America/Sao_Paulo", label: "America/Sao_Paulo", gmtOffset: "GMT-3" },
  { value: "America/Argentina/Buenos_Aires", label: "America/Argentina/Buenos_Aires", gmtOffset: "GMT-3" },
  { value: "America/Santiago", label: "America/Santiago", gmtOffset: "GMT-3" },
  { value: "America/Bogota", label: "America/Bogota", gmtOffset: "GMT-5" },
  { value: "America/Lima", label: "America/Lima", gmtOffset: "GMT-5" },
];
