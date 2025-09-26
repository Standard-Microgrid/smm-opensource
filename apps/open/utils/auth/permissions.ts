// Client-side permission checking utilities
// These utilities work with the Supabase client to check user permissions

import { createSupabaseClient } from '@/lib/supabase-server';
import type { UserContext, PermissionName, Permission } from '@smm/database';

/**
 * Get the current user's context including role and permissions
 */
export async function getCurrentUserContext(): Promise<UserContext | null> {
  try {
    const supabase = await createSupabaseClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return null;
    }

    // Get user's organization membership
    const { data: membership, error: membershipError } = await supabase
      .from('organization_members')
      .select(`
        *,
        role:roles(*),
        branch:branches(id, name)
      `)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (membershipError || !membership) {
      return null;
    }

    // Get user's permissions
    const { data: permissions, error: permissionsError } = await supabase
      .from('role_permissions')
      .select(`
        permission:permissions(*)
      `)
      .eq('role_id', membership.role_id);

    if (permissionsError || !permissions) {
      return null;
    }

    return {
      user_id: user.id,
      organization_id: membership.organization_id,
      role_id: membership.role_id,
      branch_id: membership.branch_id,
      role: membership.role,
      permissions: permissions.map((p: { permission: Permission[] }) => p.permission[0]).filter(Boolean),
    };
  } catch (error) {
    console.error('Error getting user context:', error);
    return null;
  }
}

/**
 * Check if current user has a specific permission
 */
export async function hasPermission(permissionName: PermissionName): Promise<boolean> {
  const userContext = await getCurrentUserContext();
  if (!userContext) return false;

  return userContext.permissions.some(
    (permission: { name: string }) => permission.name === permissionName
  );
}

/**
 * Check if current user has any of the specified permissions
 */
export async function hasAnyPermission(permissionNames: PermissionName[]): Promise<boolean> {
  const userContext = await getCurrentUserContext();
  if (!userContext) return false;

  return permissionNames.some((permissionName) =>
    userContext.permissions.some(
      (permission: { name: string }) => permission.name === permissionName
    )
  );
}

/**
 * Check if current user has all of the specified permissions
 */
export async function hasAllPermissions(permissionNames: PermissionName[]): Promise<boolean> {
  const userContext = await getCurrentUserContext();
  if (!userContext) return false;

  return permissionNames.every((permissionName) =>
    userContext.permissions.some(
      (permission: { name: string }) => permission.name === permissionName
    )
  );
}

/**
 * Check if current user can access a specific branch
 */
export async function canAccessBranch(branchId: string): Promise<boolean> {
  const userContext = await getCurrentUserContext();
  if (!userContext) return false;

  // Executive can access all branches
  if (userContext.role.name === 'executive') {
    return true;
  }

  // Other roles can only access their assigned branch
  return userContext.branch_id === branchId;
}

/**
 * Check if current user can manage users with a specific role
 */
export async function canManageRole(targetRoleName: string): Promise<boolean> {
  const userContext = await getCurrentUserContext();
  if (!userContext) return false;

  // Executive can manage all roles
  if (userContext.role.name === 'executive') {
    return true;
  }

  // Branch Manager can manage Grid Administrators
  if (
    userContext.role.name === 'branch_manager' &&
    targetRoleName === 'grid_administrator'
  ) {
    return true;
  }

  return false;
}

/**
 * Get current user's role level (1 = Executive, 2 = Branch Manager, 3 = Grid Administrator)
 */
export async function getUserRoleLevel(): Promise<number | null> {
  const userContext = await getCurrentUserContext();
  return userContext?.role.level || null;
}

/**
 * Check if current user's role level is at or above the specified level
 */
export async function hasRoleLevel(requiredLevel: number): Promise<boolean> {
  const userRoleLevel = await getUserRoleLevel();
  if (userRoleLevel === null) return false;

  // Lower numbers = higher authority
  return userRoleLevel <= requiredLevel;
}

/**
 * Require permission - throws error if user doesn't have permission
 */
export async function requirePermission(permissionName: PermissionName): Promise<void> {
  const hasAccess = await hasPermission(permissionName);
  if (!hasAccess) {
    throw new Error(`Access denied: Missing permission '${permissionName}'`);
  }
}

/**
 * Require role level - throws error if user doesn't have required role level
 */
export async function requireRoleLevel(requiredLevel: number): Promise<void> {
  const hasAccess = await hasRoleLevel(requiredLevel);
  if (!hasAccess) {
    throw new Error(`Access denied: Insufficient role level. Required: ${requiredLevel}`);
  }
}
