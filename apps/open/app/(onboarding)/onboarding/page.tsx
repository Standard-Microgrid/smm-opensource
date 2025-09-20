import { getCurrentUserContext } from "@/utils/auth/server-permissions";
import { checkOnboardingStatus } from "@/utils/auth/onboarding-check";
import { createSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";

export default async function OnboardingPage() {
  const userContext = await getCurrentUserContext();
  
  if (!userContext) {
    redirect("/login");
  }

  // Check if user has already completed onboarding
  const onboardingStatus = await checkOnboardingStatus(userContext.user_id);
  
  if (onboardingStatus.isComplete) {
    redirect("/dashboard");
  }

  // Get user data for pre-populating the form
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Get user profile data
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('full_name')
    .eq('id', userContext.user_id)
    .single();

  // Prefer full_name from profile, fallback to user metadata from OAuth
  const fullName = userProfile?.full_name || user?.user_metadata?.full_name || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="flex flex-col items-center justify-center px-4 py-20">
        <div className="mx-auto max-w-4xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Welcome to SMM Platform</h1>
            <p className="text-xl text-muted-foreground">
              Let&apos;s set up your organization and get you started
            </p>
          </div>
          
          <OnboardingForm initialFullName={fullName} />
        </div>
      </div>
    </div>
  );
}
