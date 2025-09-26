"use server";

import { createSupabaseClient } from "@/lib/supabase-server";
import { requireAuth } from "@/utils/auth/server-permissions";
import { revalidatePath } from "next/cache";

export async function changeUserRole(userId: string, newRoleName: string) {
  try {
    const userContext = await requireAuth();
    
    // Check if user has permission to manage roles
    const canManageRoles = userContext.permissions.some(
      (permission) => 
        permission.name === 'manage_branch_managers' || 
        permission.name === 'manage_grid_administrators' ||
        permission.name === 'manage_grid_administrators_branch'
    );

    if (!canManageRoles) {
      return { success: false, error: "Insufficient permissions" };
    }

    // Prevent users from changing their own role
    if (userId === userContext.user_id) {
      return { success: false, error: "You cannot change your own role" };
    }

    const supabase = await createSupabaseClient();

    // Get the new role
    const { data: newRole, error: roleError } = await supabase
      .from('core.roles')
      .select('id, name, display_name')
      .eq('name', newRoleName)
      .single();

    if (roleError || !newRole) {
      return { success: false, error: "Invalid role" };
    }

    // Get current user's role for audit
    const { data: currentMember, error: currentError } = await supabase
      .from('organization_members')
      .select(`
        role_id,
        role:roles(name, display_name)
      `)
      .eq('user_id', userId)
      .eq('organization_id', userContext.organization_id)
      .eq('status', 'active')
      .single();

    if (currentError || !currentMember) {
      return { success: false, error: "User not found in organization" };
    }

    // Update the user's role
    const { error: updateError } = await supabase
      .from('organization_members')
      .update({ 
        role_id: newRole.id,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('organization_id', userContext.organization_id)
      .eq('status', 'active');

    if (updateError) {
      return { success: false, error: "Failed to update role" };
    }

    // Log the role change for audit
    const { error: auditError } = await supabase
      .from('role_changes')
      .insert({
        organization_id: userContext.organization_id,
        user_id: userId,
        from_role_id: currentMember.role_id,
        to_role_id: newRole.id,
        changed_by: userContext.user_id,
        reason: `Role changed from ${currentMember.role[0]?.display_name || 'Unknown'} to ${newRole.display_name}`
      });

    if (auditError) {
      console.error("Failed to log role change:", auditError);
      // Don't fail the operation for audit logging issues
    }

    revalidatePath("/(org-settings)/team");
    return { success: true };
  } catch (error) {
    console.error("Error changing user role:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function removeUserFromOrganization(userId: string) {
  try {
    const userContext = await requireAuth();
    
    // Check if user has permission to manage roles
    const canManageRoles = userContext.permissions.some(
      (permission) => 
        permission.name === 'manage_branch_managers' || 
        permission.name === 'manage_grid_administrators' ||
        permission.name === 'manage_grid_administrators_branch'
    );

    if (!canManageRoles) {
      return { success: false, error: "Insufficient permissions" };
    }

    // Prevent users from removing themselves
    if (userId === userContext.user_id) {
      return { success: false, error: "You cannot remove yourself from the organization" };
    }

    const supabase = await createSupabaseClient();

    // Check if the user to be removed is the last executive
    const { data: userToRemove, error: userError } = await supabase
      .from('organization_members')
      .select(`
        role_id,
        role:roles(name)
      `)
      .eq('user_id', userId)
      .eq('organization_id', userContext.organization_id)
      .eq('status', 'active')
      .single();

    if (userError || !userToRemove) {
      return { success: false, error: "User not found in organization" };
    }

    // If removing an executive, check if they're the last one
    if (userToRemove.role[0]?.name === 'executive') {
      const { data: executiveCount, error: countError } = await supabase
        .from('organization_members')
        .select('id', { count: 'exact' })
        .eq('organization_id', userContext.organization_id)
        .eq('status', 'active')
        .eq('role_id', userToRemove.role_id);

      if (countError || (executiveCount && executiveCount.length <= 1)) {
        return { 
          success: false, 
          error: "Cannot remove the last executive. Promote another user to executive first." 
        };
      }
    }

    // Soft delete the user profile (which removes them from all organizations)
    const { error: deleteError } = await supabase
      .from('core.user_profiles')
      .update({ 
        deleted_at: new Date().toISOString(),
        deleted_by: userContext.user_id
      })
      .eq('id', userId)
      .is('deleted_at', null);

    if (deleteError) {
      return { success: false, error: "Failed to remove user" };
    }

    revalidatePath("/(org-settings)/team");
    return { success: true };
  } catch (error) {
    console.error("Error removing user:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getOrganizationMembers() {
  try {
    const userContext = await requireAuth();
    
    // Check if user has permission to view team members
    const canViewTeam = userContext.permissions.some(
      (permission) => 
        permission.name === 'manage_branch_managers' || 
        permission.name === 'manage_grid_administrators' ||
        permission.name === 'manage_grid_administrators_branch' ||
        permission.name === 'view_organization_dashboard'
    );

    if (!canViewTeam) {
      return { success: false, error: "Insufficient permissions" };
    }

    const supabase = await createSupabaseClient();

    // Get organization members using the database function
    const { data: members, error: membersError } = await supabase
      .rpc('get_organization_members', {
        p_organization_id: userContext.organization_id
      });

    if (membersError) {
      return { success: false, error: "Failed to load team members" };
    }

    // Get available roles
    const { data: roles, error: rolesError } = await supabase
      .from('core.roles')
      .select('id, name, display_name, level')
      .order('level', { ascending: true });

    if (rolesError) {
      return { success: false, error: "Failed to load roles" };
    }

    return { 
      success: true, 
      members: members || [], 
      roles: roles || [] 
    };
  } catch (error) {
    console.error("Error getting organization members:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
