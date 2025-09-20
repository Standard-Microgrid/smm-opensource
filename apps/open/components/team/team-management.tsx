"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { changeUserRole, removeUserFromOrganization } from "@/app/actions/team";
import { User, Crown, Shield, Settings, Trash2 } from "lucide-react";

interface OrganizationMember {
  user_id: string;
  email: string;
  full_name: string;
  role_name: string;
  role_display_name: string;
  role_level: number;
  status: string;
  joined_at: string;
  branch_id?: string;
}

interface Role {
  id: string;
  name: string;
  display_name: string;
  level: number;
}

export function TeamManagement() {
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<OrganizationMember | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadTeamData();
  }, []);

  const loadTeamData = async () => {
    try {
      const response = await fetch("/api/team/members");
      if (response.ok) {
        const data = await response.json();
        setMembers(data.members || []);
        setRoles(data.roles || []);
      }
    } catch (error) {
      console.error("Error loading team data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async () => {
    if (!selectedUser || !selectedRole) return;

    setActionLoading(true);
    try {
      const response = await changeUserRole(selectedUser.user_id, selectedRole);
      if (response.success) {
        await loadTeamData();
        setShowRoleDialog(false);
        setSelectedUser(null);
        setSelectedRole("");
      } else {
        alert(response.error || "Failed to change role");
      }
    } catch (error) {
      console.error("Error changing role:", error);
      alert("Failed to change role");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveUser = async () => {
    if (!selectedUser) return;

    setActionLoading(true);
    try {
      const response = await removeUserFromOrganization(selectedUser.user_id);
      if (response.success) {
        await loadTeamData();
        setShowRemoveDialog(false);
        setSelectedUser(null);
      } else {
        alert(response.error || "Failed to remove user");
      }
    } catch (error) {
      console.error("Error removing user:", error);
      alert("Failed to remove user");
    } finally {
      setActionLoading(false);
    }
  };

  const openRoleDialog = (member: OrganizationMember) => {
    setSelectedUser(member);
    setSelectedRole(member.role_name);
    setShowRoleDialog(true);
  };

  const openRemoveDialog = (member: OrganizationMember) => {
    setSelectedUser(member);
    setShowRemoveDialog(true);
  };

  const getRoleIcon = (roleName: string) => {
    switch (roleName) {
      case "executive":
        return <Crown className="w-4 h-4" />;
      case "branch_manager":
        return <Shield className="w-4 h-4" />;
      case "grid_administrator":
        return <Settings className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getRoleBadgeVariant = (roleName: string) => {
    switch (roleName) {
      case "executive":
        return "default";
      case "branch_manager":
        return "secondary";
      case "grid_administrator":
        return "outline";
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading team members...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Organization Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.map((member) => (
              <div
                key={member.user_id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getRoleIcon(member.role_name)}
                    <div>
                      <div className="font-medium">
                        {member.full_name || member.email}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {member.email}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Badge variant={getRoleBadgeVariant(member.role_name)}>
                    {member.role_display_name}
                  </Badge>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openRoleDialog(member)}
                    >
                      Change Role
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openRemoveDialog(member)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Role Change Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Change the role for {selectedUser?.full_name || selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">New Role</label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.name}>
                      {role.display_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRoleDialog(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRoleChange}
              disabled={actionLoading || !selectedRole}
            >
              {actionLoading ? "Updating..." : "Update Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove User Dialog */}
      <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove User</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {selectedUser?.full_name || selectedUser?.email} from the organization?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRemoveDialog(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRemoveUser}
              disabled={actionLoading}
            >
              {actionLoading ? "Removing..." : "Remove User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
