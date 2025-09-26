import type { Database } from './supabase'

// Export the raw generated types
export type { Database } from './supabase'

// Helper types for easier usage
export type Tables<T extends keyof Database['core']['Tables']> = 
  Database['core']['Tables'][T]['Row']

export type TablesInsert<T extends keyof Database['core']['Tables']> = 
  Database['core']['Tables'][T]['Insert']

export type TablesUpdate<T extends keyof Database['core']['Tables']> = 
  Database['core']['Tables'][T]['Update']

// Your specific table types (based on your schema)
// Note: These are temporarily using 'any' until database types are properly generated
export type Organization = any
export type Branch = any
export type Grid = any
export type Customer = any
export type UserProfile = any

// Insert and Update types for common operations
export type CustomerInsert = any
export type CustomerUpdate = any
export type GridInsert = any
export type GridUpdate = any

// Add more types as needed based on your schema

// Export entitlement types
export type {
  Role,
  Permission,
  RolePermission,
  OrganizationMember,
  UserSession,
  RoleWithPermissions,
  OrganizationMemberWithRole,
  UserWithMembership,
  RoleName,
  PermissionName,
  ResourceType,
  Action,
  MembershipStatus,
  RoleLevel,
  PermissionCheck,
  UserContext
} from './entitlements'

export {
  ROLE_NAMES,
  PERMISSION_NAMES,
  RESOURCE_TYPES,
  ACTIONS,
  MEMBERSHIP_STATUS,
  ROLE_LEVELS
} from './entitlements'