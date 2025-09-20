// Permission checking utilities
// These utilities help check user permissions and role-based access

import type {
  Role,
  Permission,
  UserContext,
  PermissionName,
  RoleName,
  RoleLevel,
  RESOURCE_TYPES,
  ACTIONS,
} from '../types/entitlements';

/**
 * Check if a user has a specific permission
 */
export function hasPermission(
  userContext: UserContext,
  permissionName: PermissionName
): boolean {
  return userContext.permissions.some(
    (permission) => permission.name === permissionName
  );
}

/**
 * Check if a user has any of the specified permissions
 */
export function hasAnyPermission(
  userContext: UserContext,
  permissionNames: PermissionName[]
): boolean {
  return permissionNames.some((permissionName) =>
    hasPermission(userContext, permissionName)
  );
}

/**
 * Check if a user has all of the specified permissions
 */
export function hasAllPermissions(
  userContext: UserContext,
  permissionNames: PermissionName[]
): boolean {
  return permissionNames.every((permissionName) =>
    hasPermission(userContext, permissionName)
  );
}

/**
 * Check if a user has permission for a specific resource and action
 */
export function hasResourcePermission(
  userContext: UserContext,
  resourceType: string,
  action: string
): boolean {
  return userContext.permissions.some(
    (permission) =>
      permission.resource_type === resourceType && permission.action === action
  );
}

/**
 * Check if a user's role level is at or above the specified level
 * Lower numbers = higher authority (Executive = 1, Grid Administrator = 3)
 */
export function hasRoleLevel(
  userContext: UserContext,
  requiredLevel: RoleLevel
): boolean {
  return userContext.role.level <= requiredLevel;
}

/**
 * Check if a user can manage users with a specific role
 */
export function canManageRole(
  userContext: UserContext,
  targetRoleName: RoleName
): boolean {
  // Executive can manage all roles
  if (userContext.role.name === ROLE_NAMES.EXECUTIVE) {
    return true;
  }

  // Branch Manager can manage Grid Administrators
  if (
    userContext.role.name === ROLE_NAMES.BRANCH_MANAGER &&
    targetRoleName === ROLE_NAMES.GRID_ADMINISTRATOR
  ) {
    return true;
  }

  return false;
}

/**
 * Check if a user can access data for a specific branch
 */
export function canAccessBranch(
  userContext: UserContext,
  branchId: string
): boolean {
  // Executive can access all branches
  if (userContext.role.name === ROLE_NAMES.EXECUTIVE) {
    return true;
  }

  // Branch Manager can access their assigned branch
  if (
    userContext.role.name === ROLE_NAMES.BRANCH_MANAGER &&
    userContext.branch_id === branchId
  ) {
    return true;
  }

  // Grid Administrator can access their assigned branch
  if (
    userContext.role.name === ROLE_NAMES.GRID_ADMINISTRATOR &&
    userContext.branch_id === branchId
  ) {
    return true;
  }

  return false;
}

/**
 * Get all permissions for a specific role
 */
export function getRolePermissions(
  role: Role,
  allPermissions: Permission[],
  rolePermissions: Array<{ role_id: string; permission_id: string }>
): Permission[] {
  const rolePermissionIds = rolePermissions
    .filter((rp) => rp.role_id === role.id)
    .map((rp) => rp.permission_id);

  return allPermissions.filter((permission) =>
    rolePermissionIds.includes(permission.id)
  );
}

/**
 * Check if a user can perform an action on a resource
 */
export function canPerformAction(
  userContext: UserContext,
  resourceType: string,
  action: string
): boolean {
  return hasResourcePermission(userContext, resourceType, action);
}

/**
 * Get user's effective permissions (including inherited permissions)
 */
export function getEffectivePermissions(userContext: UserContext): Permission[] {
  const permissions = [...userContext.permissions];

  // Executive inherits all permissions
  if (userContext.role.name === ROLE_NAMES.EXECUTIVE) {
    // In a real implementation, you might want to add all permissions here
    // For now, we'll just return the user's assigned permissions
  }

  return permissions;
}

/**
 * Validate user context
 */
export function validateUserContext(userContext: UserContext): boolean {
  return !!(
    userContext.user_id &&
    userContext.organization_id &&
    userContext.role_id &&
    userContext.role &&
    userContext.permissions
  );
}

/**
 * Check if user is active member of organization
 */
export function isActiveMember(
  userContext: UserContext,
  organizationId: string
): boolean {
  return (
    userContext.organization_id === organizationId &&
    validateUserContext(userContext)
  );
}

// Import ROLE_NAMES from types
import { ROLE_NAMES } from '../types/entitlements';
