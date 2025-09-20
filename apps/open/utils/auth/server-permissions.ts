// Server-side permission checking utilities
// These utilities work with server-side Supabase client for API routes and server actions

import { createSupabaseClient } from '@/lib/supabase-server';
import type { UserContext, PermissionName, Permission } from '@smm/database';

/**
 * Get the current user's context including role and permissions (server-side)
 */
export async function getCurrentUserContext(): Promise<UserContext | null> {
  try {
    const supabase = await createSupabaseClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    console.log('👤 User Context Debug - Auth:', {
      hasUser: !!user,
      userEmail: user?.email,
      userError: userError?.message
    });

    if (userError || !user) {
      console.log('👤 User Context Debug - No user found');
      return null;
    }

    // Get user's profile (simplified query)
    const { data: profile, error: profileError } = await supabase
      .schema('core')
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .is('deleted_at', null)
      .single();

    console.log('👤 User Context Debug - Profile:', {
      hasProfile: !!profile,
      profileError: profileError ? {
        message: profileError.message,
        details: profileError.details,
        hint: profileError.hint,
        code: profileError.code
      } : null,
      organizationId: profile?.organization_id,
      branchId: profile?.branch_id,
      roleId: profile?.role_id
    });

    let currentProfile = profile;
    if (profileError || !profile) {
      console.error('Profile error:', profileError);
      console.error('User ID:', user.id);
      console.error('Profile data:', profile);
      
      // If profile doesn't exist, create a basic one
      if (profileError?.code === 'PGRST116' || !profile) {
        console.log('👤 User Context Debug - Creating missing profile...');
        const { data: newProfile, error: createError } = await supabase
          .schema('core')
          .from('user_profiles')
          .insert({
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || '',
            phone_number: '',
            organization_id: null,
            branch_id: null,
            role_id: null,
            access_scope: {},
            is_active: true
          })
          .select()
          .single();

        if (createError || !newProfile) {
          console.error('Failed to create profile:', createError);
          return null;
        }
        
        console.log('👤 User Context Debug - Profile created:', newProfile);
        // Use the newly created profile
        currentProfile = newProfile;
      } else {
        return null;
      }
    }

    // For now, return basic user context without permissions (until entitlement system is deployed)
    const permissions: Permission[] = [];

    // Build user context
    const userContext = {
      user_id: user.id,
      organization_id: currentProfile.organization_id,
      role_id: currentProfile.role_id,
      branch_id: currentProfile.branch_id,
      role: currentProfile.role,
      permissions: permissions
    };

    console.log('👤 User Context Debug - Final context:', userContext);

    return userContext;
  } catch (error) {
    console.error('Error getting user context:', error);
    return null;
  }
}

/**
 * Check if current user has a specific permission (server-side)
 */
export async function hasPermission(permissionName: PermissionName): Promise<boolean> {
  const userContext = await getCurrentUserContext();
  if (!userContext) return false;

  return userContext.permissions.some(
    (permission) => permission.name === permissionName
  );
}

/**
 * Check if current user has any of the specified permissions (server-side)
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
 * Check if current user has all of the specified permissions (server-side)
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
 * Check if current user can access a specific branch (server-side)
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
 * Check if current user can manage users with a specific role (server-side)
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
 * Get current user's role level (server-side)
 */
export async function getUserRoleLevel(): Promise<number | null> {
  const userContext = await getCurrentUserContext();
  return userContext?.role.level || null;
}

/**
 * Check if current user's role level is at or above the specified level (server-side)
 */
export async function hasRoleLevel(requiredLevel: number): Promise<boolean> {
  const userRoleLevel = await getUserRoleLevel();
  if (userRoleLevel === null) return false;

  // Lower numbers = higher authority
  return userRoleLevel <= requiredLevel;
}

/**
 * Require permission - throws error if user doesn't have permission (server-side)
 */
export async function requirePermission(permissionName: PermissionName): Promise<void> {
  const hasAccess = await hasPermission(permissionName);
  if (!hasAccess) {
    throw new Error(`Access denied: Missing permission '${permissionName}'`);
  }
}

/**
 * Require role level - throws error if user doesn't have required role level (server-side)
 */
export async function requireRoleLevel(requiredLevel: number): Promise<void> {
  const hasAccess = await hasRoleLevel(requiredLevel);
  if (!hasAccess) {
    throw new Error(`Access denied: Insufficient role level. Required: ${requiredLevel}`);
  }
}

/**
 * Require authentication - throws error if user is not authenticated (server-side)
 */
export async function requireAuth(): Promise<UserContext> {
  const userContext = await getCurrentUserContext();
  if (!userContext) {
    throw new Error('Authentication required');
  }
  return userContext;
}

/**
 * Get current user's organization ID (server-side)
 */
export async function getCurrentOrganizationId(): Promise<string | null> {
  const userContext = await getCurrentUserContext();
  return userContext?.organization_id || null;
}

