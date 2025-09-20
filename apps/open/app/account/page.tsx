import { createSupabaseClient } from "@/lib/supabase-server";
import { UserSettingsForm } from "@/components/user-settings/user-settings-form";
import { OrganizationInfoWrapper } from "@/components/user-settings/organization-info-wrapper";
import { PasswordManagementForm } from "@/components/user-settings/password-management-form";
import { getUserSettings } from "@/app/actions/user-settings";

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
    <div className="space-y-8">
      <div className="flex flex-col">
        <h1 className="text-2xl font-medium">Account Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and profile information
        </p>
      </div>

      <div className="space-y-6">
        {/* Editable User Information */}
        <div className="border rounded-lg p-6">
          <UserSettingsForm 
            initialData={{
              email: userProfile?.email || user.email || "",
              fullName: userProfile?.full_name || user.user_metadata?.full_name || null,
              phoneNumber: userProfile?.phone_number || null,
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
      </div>
    </div>
  );
}
