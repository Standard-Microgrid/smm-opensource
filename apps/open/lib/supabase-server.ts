import { createServerClient } from '@smm/shared/server'

// For server components - maintain original function name for compatibility
export const createSupabaseClient = createServerClient

// Also re-export for consistency
export { createServerClient } from '@smm/shared/server'
