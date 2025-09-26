import { createSupabaseClient } from "@/lib/supabase-server";
import { UserSettingsForm } from "@/components/user-settings/user-settings-form";
import { OrganizationInfoWrapper } from "@/components/user-settings/organization-info-wrapper";
import { PasswordManagementForm } from "@/components/user-settings/password-management-form";
import { DeleteAccountDialog } from "@/components/user-settings/delete-account-dialog";
import { getUserSettings } from "@/app/actions/user-settings";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DangerZone } from "@smm/ui-core";

export default async function AccountPage() {
  const client = await createSupabaseClient();
  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    return (
      <div>There was an error loading your account. Please try again.</div>
    );
  }

  // Get user settings data
  const userSettingsResult = await getUserSettings();
  const userProfile = userSettingsResult.success ? userSettingsResult.data : null;
  
  // Log any errors for debugging
  if (!userSettingsResult.success) {
    console.error('Failed to fetch user settings:', userSettingsResult.error);
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center justify-between w-full px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Account Settings</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="space-y-6">
            {/* Editable User Information */}
            <div className="border rounded-lg p-6">
              <UserSettingsForm 
                initialData={{
                  email: userProfile?.email || user.email || "",
                  fullName: userProfile?.full_name || user.user_metadata?.full_name || "",
                  phoneNumber: userProfile?.phone_number || "",
                }}
              />
            </div>

            {/* Password Management */}
            <div className="border rounded-lg p-6">
              <PasswordManagementForm userEmail={user.email || ""} />
            </div>

            {/* Organization Information (Read-only) */}
            <div className="border rounded-lg p-6">
              <OrganizationInfoWrapper 
                organization={userProfile?.organizations}
                branch={userProfile?.branches}
                role={userProfile?.roles}
              />
            </div>

            {/* Account Information (Read-only) */}
            <div className="border rounded-lg p-6 space-y-4">
              <h2 className="font-medium">Account Information</h2>
              <div className="grid gap-2 text-sm">
                <div className="grid grid-cols-[120px_1fr]">
                  <div className="text-muted-foreground">User ID</div>
                  <div className="font-mono">{user?.id}</div>
                </div>
                <div className="grid grid-cols-[120px_1fr]">
                  <div className="text-muted-foreground">Last Sign In</div>
                  <div>
                    {user.last_sign_in_at
                      ? new Date(user.last_sign_in_at).toLocaleString()
                      : "Never"}
                  </div>
                </div>
                <div className="grid grid-cols-[120px_1fr]">
                  <div className="text-muted-foreground">Status</div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Authenticated
                  </div>
                </div>
                <div className="grid grid-cols-[120px_1fr]">
                  <div className="text-muted-foreground">Providers</div>
                  <div>
                    {user.identities
                      ?.map(identity => identity.provider)
                      .join(", ") || "Email"}
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <DangerZone
              title="Danger Zone"
              description="Irreversible and destructive actions. Please proceed with caution."
              actionTitle="Delete Account"
              actionDescription="Permanently delete your account and all associated data. This action cannot be undone."
            >
              <DeleteAccountDialog 
                userFullName={userProfile?.full_name || user.user_metadata?.full_name || ""} 
              />
            </DangerZone>
        </div>
      </div>
    </SidebarInset>
  );
}
