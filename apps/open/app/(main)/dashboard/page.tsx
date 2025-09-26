import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { ChartLineActiveCustomers } from "@/components/chart-line-active-customers"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Frame, Activity } from "lucide-react"
import { getCurrentUserContext } from "@/utils/auth/server-permissions"
import { checkOnboardingStatus } from "@/utils/auth/onboarding-check"
import { createSupabaseClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { getActiveBranchCurrency } from "@/utils/currency"
import { OnboardingForm } from "@/components/onboarding/onboarding-form"
import { DashboardClient } from "@/components/dashboard/dashboard-client"
import { BranchSettingsButton } from "@/components/dashboard/branch-settings-button"
import { Currency } from "@/components/currency"

export default async function Page() {
  // First check if user is authenticated at all
  const supabase = await createSupabaseClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    redirect("/login")
  }

  // Try to get user context, but don't fail if it's not available
  const userContext = await getCurrentUserContext()

  // Check onboarding status (only if userContext is available)
  const onboardingStatus = userContext ? await checkOnboardingStatus(userContext.user_id) : { isComplete: false, missingFields: ['user_profile'] }
  
  // Get user profile data
  const { data: userProfile } = await supabase
    .schema('core')
    .from('user_profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  // Prefer full_name from profile, fallback to user metadata from OAuth
  const fullName = userProfile?.full_name || user?.user_metadata?.full_name || ''
  
  // Get the active branch currency server-side to prevent hydration mismatch
  const initialCurrency = await getActiveBranchCurrency()
  
  
  return (
    <>
      <DashboardClient />
      <SidebarInset>
      {/* Onboarding Overlay */}
      {!onboardingStatus.isComplete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 py-6">
          <div className="bg-background rounded-lg shadow-lg max-w-md w-full">
            <OnboardingForm initialFullName={fullName} />
          </div>
        </div>
      )}
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
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <BranchSettingsButton />
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium">ARPG</h3>
                <Frame className="h-4 w-4 text-muted-foreground" suppressHydrationWarning />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  <Currency amount={2456} decimals={0} initialCurrency={initialCurrency} />
                </div>
                <p className="text-xs text-muted-foreground">
                  1 month rolling avg
                </p>
              </div>
            </div>
            
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium">ARPU</h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                  suppressHydrationWarning
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  <Currency amount={12.34} initialCurrency={initialCurrency} />
                </div>
                <p className="text-xs text-muted-foreground">
                  1 month rolling avg
                </p>
              </div>
            </div>
            
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium">Total Revenue</h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                  suppressHydrationWarning
                >
                  <line x1="12" x2="12" y1="2" y2="22" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  <Currency amount={14736} decimals={0} initialCurrency={initialCurrency} />
                </div>
                <p className="text-xs text-muted-foreground">
                  This month
                </p>
              </div>
            </div>
            
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium">% Uptime</h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                  suppressHydrationWarning
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12,6 12,12 16,14" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold">98.7%</div>
                <p className="text-xs text-muted-foreground">
                  1 month rolling avg
                </p>
              </div>
            </div>
            
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium">% Active</h3>
                <Activity className="h-4 w-4 text-muted-foreground" suppressHydrationWarning />
              </div>
              <div>
                <div className="text-2xl font-bold">87.3%</div>
                <p className="text-xs text-muted-foreground">
                  Used energy this month
                </p>
              </div>
            </div>
            
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium">% Active 3M</h3>
                <Activity className="h-4 w-4 text-muted-foreground" suppressHydrationWarning />
              </div>
              <div>
                <div className="text-2xl font-bold">92.1%</div>
                <p className="text-xs text-muted-foreground">
                  Purchased in 3 months
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4 rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <ChartAreaInteractive initialCurrency={initialCurrency} />
            </div>
            <div className="col-span-3 rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Lusaka Central</p>
                    <p className="text-xs text-muted-foreground">Grid online</p>
                  </div>
                  <p className="text-xs text-muted-foreground">2m ago</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Ndola Industrial</p>
                    <p className="text-xs text-muted-foreground">Maintenance mode</p>
                  </div>
                  <p className="text-xs text-muted-foreground">1h ago</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Kitwe North</p>
                    <p className="text-xs text-muted-foreground">New customer connected</p>
                  </div>
                  <p className="text-xs text-muted-foreground">3h ago</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Livingstone Resort</p>
                    <p className="text-xs text-muted-foreground">Energy generation peak</p>
                  </div>
                  <p className="text-xs text-muted-foreground">5h ago</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Chipata East</p>
                    <p className="text-xs text-muted-foreground">Battery fully charged</p>
                  </div>
                  <p className="text-xs text-muted-foreground">6h ago</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Solwezi Mining</p>
                    <p className="text-xs text-muted-foreground">High demand alert</p>
                  </div>
                  <p className="text-xs text-muted-foreground">8h ago</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Lusaka Central</p>
                    <p className="text-xs text-muted-foreground">Customer payment received</p>
                  </div>
                  <p className="text-xs text-muted-foreground">12h ago</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Ndola Industrial</p>
                    <p className="text-xs text-muted-foreground">System update completed</p>
                  </div>
                  <p className="text-xs text-muted-foreground">1d ago</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Kitwe North</p>
                    <p className="text-xs text-muted-foreground">New installation completed</p>
                  </div>
                  <p className="text-xs text-muted-foreground">2d ago</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Livingstone Resort</p>
                    <p className="text-xs text-muted-foreground">Connection restored</p>
                  </div>
                  <p className="text-xs text-muted-foreground">3d ago</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <ChartLineActiveCustomers />
          </div>
        </div>
      </div>
    </SidebarInset>
    </>
  )
}
