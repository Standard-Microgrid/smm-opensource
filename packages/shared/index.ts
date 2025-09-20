// Supabase utilities (client-side only)
export { createBrowserClient, updateSession } from './supabase'

// Database types (re-export from database package)
export type { Database } from '../database/types/supabase'


// Country mappings and data
export * from './src/country-mappings'
export * from './src/countries'

// Utility functions
export * from './src/utils/styles'
