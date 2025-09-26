import { createBrowserClient } from '@smm/shared/supabase'

// For client components - maintain original function name for compatibility
export const createSupabaseClient = createBrowserClient

// Pre-configured client instance (for client components)
export const supabase = createBrowserClient()

// Re-export everything from shared for flexibility
export { 
  createBrowserClient,
  updateSession 
} from '@smm/shared/supabase'
