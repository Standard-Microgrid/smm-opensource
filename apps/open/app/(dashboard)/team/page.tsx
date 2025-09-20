import { getCurrentUserContext } from "@/utils/auth/server-permissions";
import { redirect } from "next/navigation";
import { TeamManagement } from "@/components/team/team-management";

export default async function TeamPage() {
  const userContext = await getCurrentUserContext();
  
  if (!userContext) {
    redirect("/login");
  }

  // Check if user has permission to manage team
  const canManageTeam = userContext.permissions.some(
    (permission) => 
      permission.name === 'manage_branch_managers' || 
      permission.name === 'manage_grid_administrators' ||
      permission.name === 'manage_grid_administrators_branch'
  );

  if (!canManageTeam) {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Team Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage your organization members and their roles
        </p>
      </div>
      
      <TeamManagement />
    </div>
  );
}
