// Role-based access control component
// This component conditionally renders content based on user permissions

"use client";

import { useEffect, useState } from 'react';
import { hasPermission, hasAnyPermission, hasAllPermissions, hasRoleLevel } from '@/utils/auth/permissions';
import type { PermissionName } from '@smm/database';

interface RoleGuardProps {
  children: React.ReactNode;
  permission?: PermissionName;
  permissions?: PermissionName[];
  requireAll?: boolean; // If true, user must have ALL permissions; if false, user needs ANY permission
  roleLevel?: number; // Minimum role level required (1=Executive, 2=Branch Manager, 3=Grid Administrator)
  fallback?: React.ReactNode;
  loading?: React.ReactNode;
}

export function RoleGuard({
  children,
  permission,
  permissions,
  requireAll = false,
  roleLevel,
  fallback = null,
  loading = <div>Loading...</div>
}: RoleGuardProps) {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAccess() {
      try {
        setIsLoading(true);
        let access = false;

        // Check single permission
        if (permission) {
          access = await hasPermission(permission);
        }
        // Check multiple permissions
        else if (permissions && permissions.length > 0) {
          if (requireAll) {
            access = await hasAllPermissions(permissions);
          } else {
            access = await hasAnyPermission(permissions);
          }
        }
        // Check role level
        else if (roleLevel !== undefined) {
          access = await hasRoleLevel(roleLevel);
        }
        // If no conditions specified, deny access
        else {
          access = false;
        }

        setHasAccess(access);
      } catch (error) {
        console.error('Error checking permissions:', error);
        setHasAccess(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkAccess();
  }, [permission, permissions, requireAll, roleLevel]);

  if (isLoading) {
    return <>{loading}</>;
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}

// Convenience components for common use cases
export function ExecutiveOnly({ children, fallback = null }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RoleGuard roleLevel={1} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function BranchManagerOrAbove({ children, fallback = null }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RoleGuard roleLevel={2} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function CanManageUsers({ children, fallback = null }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RoleGuard 
      permissions={['manage_branch_managers', 'manage_grid_administrators', 'manage_grid_administrators_branch']} 
      fallback={fallback}
    >
      {children}
    </RoleGuard>
  );
}

export function CanEditCustomers({ children, fallback = null }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RoleGuard 
      permissions={['add_customers', 'edit_customers']} 
      fallback={fallback}
    >
      {children}
    </RoleGuard>
  );
}

export function CanViewReports({ children, fallback = null }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RoleGuard 
      permissions={['view_organization_reports', 'view_branch_reports', 'view_grid_reports']} 
      fallback={fallback}
    >
      {children}
    </RoleGuard>
  );
}
