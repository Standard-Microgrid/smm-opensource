import { getCurrentUserContext } from "@/utils/auth/server-permissions";
import { redirect } from "next/navigation";
import { OrganizationSetup } from "@/components/onboarding/organization-setup";

export default async function OrganizationOnboardingPage() {
  const userContext = await getCurrentUserContext();
  
  if (!userContext) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="flex flex-col items-center justify-center px-4 py-20">
        <div className="mx-auto max-w-2xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome to SMM Platform</h1>
            <p className="text-muted-foreground">
              Let&apos;s set up your organization to get started
            </p>
          </div>
          
          <OrganizationSetup />
        </div>
      </div>
    </div>
  );
}
