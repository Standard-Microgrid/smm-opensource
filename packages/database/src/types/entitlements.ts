// Entitlement System Types
// These types define the role-based permission system

export interface Role {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  level: number;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  resource_type: string;
  action: string;
  created_at: string;
}

export interface RolePermission {
  id: string;
  role_id: string;
  permission_id: string;
  created_at: string;
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role_id: string;
  branch_id?: string;
  invited_by?: string;
  status: 'active' | 'pending' | 'suspended';
  joined_at: string;
  created_at: string;
  updated_at: string;
}

export interface UserSession {
  id: string;
  user_id: string;
  organization_id: string;
  role_id: string;
  branch_id?: string;
  session_token: string;
  expires_at: string;
  created_at: string;
}

// Extended types with relationships
export interface RoleWithPermissions extends Role {
  permissions: Permission[];
}

export interface OrganizationMemberWithRole extends OrganizationMember {
  role: Role;
  user?: {
    id: string;
    email: string;
    full_name?: string;
  };
  branch?: {
    id: string;
    name: string;
  };
}

export interface UserWithMembership {
  id: string;
  email: string;
  full_name?: string;
  organization_members: OrganizationMemberWithRole[];
}

// Role names as constants
export const ROLE_NAMES = {
  EXECUTIVE: 'executive',
  BRANCH_MANAGER: 'branch_manager',
  GRID_ADMINISTRATOR: 'grid_administrator',
} as const;

export type RoleName = typeof ROLE_NAMES[keyof typeof ROLE_NAMES];

// Permission names as constants
export const PERMISSION_NAMES = {
  // Executive permissions
  VIEW_ORGANIZATION_DASHBOARD: 'view_organization_dashboard',
  MANAGE_BRANCH_MANAGERS: 'manage_branch_managers',
  MANAGE_GRID_ADMINISTRATORS: 'manage_grid_administrators',
  VIEW_ALL_BRANCHES: 'view_all_branches',
  MANAGE_ORGANIZATION_SETTINGS: 'manage_organization_settings',
  VIEW_ORGANIZATION_REPORTS: 'view_organization_reports',

  // Branch Manager permissions
  VIEW_BRANCH_DASHBOARD: 'view_branch_dashboard',
  EDIT_BRANCH_SETTINGS: 'edit_branch_settings',
  ADD_CUSTOMERS: 'add_customers',
  EDIT_CUSTOMERS: 'edit_customers',
  VIEW_CUSTOMERS: 'view_customers',
  MANAGE_GRID_ADMINISTRATORS_BRANCH: 'manage_grid_administrators_branch',
  VIEW_BRANCH_DATA: 'view_branch_data',
  VIEW_BRANCH_REPORTS: 'view_branch_reports',

  // Grid Administrator permissions
  VIEW_GRID_DASHBOARD: 'view_grid_dashboard',
  VIEW_GRID_DATA: 'view_grid_data',
  VIEW_CUSTOMERS_GRID: 'view_customers_grid',
  VIEW_GRID_REPORTS: 'view_grid_reports',
} as const;

export type PermissionName = typeof PERMISSION_NAMES[keyof typeof PERMISSION_NAMES];

// Resource types
export const RESOURCE_TYPES = {
  DASHBOARD: 'dashboard',
  USERS: 'users',
  BRANCHES: 'branches',
  CUSTOMERS: 'customers',
  REPORTS: 'reports',
  ORGANIZATION: 'organization',
  BRANCH: 'branch',
  GRID: 'grid',
} as const;

export type ResourceType = typeof RESOURCE_TYPES[keyof typeof RESOURCE_TYPES];

// Actions
export const ACTIONS = {
  VIEW: 'view',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  ADMINISTER: 'administer',
} as const;

export type Action = typeof ACTIONS[keyof typeof ACTIONS];

// Membership status
export const MEMBERSHIP_STATUS = {
  ACTIVE: 'active',
  PENDING: 'pending',
  SUSPENDED: 'suspended',
} as const;

export type MembershipStatus = typeof MEMBERSHIP_STATUS[keyof typeof MEMBERSHIP_STATUS];

// Role hierarchy levels
export const ROLE_LEVELS = {
  EXECUTIVE: 1,
  BRANCH_MANAGER: 2,
  GRID_ADMINISTRATOR: 3,
} as const;

export type RoleLevel = typeof ROLE_LEVELS[keyof typeof ROLE_LEVELS];

// Utility types for permission checking
export interface PermissionCheck {
  permission: PermissionName;
  resource_type?: ResourceType;
  action?: Action;
}

export interface UserContext {
  user_id: string;
  organization_id: string;
  role_id: string;
  branch_id?: string;
  role: Role;
  permissions: Permission[];
}
