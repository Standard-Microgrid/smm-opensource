// Server-side utilities only
// Import and re-export the server client directly
import { createSupabaseClient } from './supabase/server'

export const createServerClient = createSupabaseClient
