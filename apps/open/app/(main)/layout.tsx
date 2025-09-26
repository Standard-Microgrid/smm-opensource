import { AppSidebar } from "@/components/app-sidebar"
import { ActiveBranchProvider } from "@/hooks/use-active-branch"
import { CurrencyProvider } from "@/hooks/use-currency"
import {
  SidebarProvider,
} from "@/components/ui/sidebar"
import { getActiveBranchFromCookie } from "@/utils/cookies"
import { getBranchCurrency } from "@/utils/currency"

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get the active branch from cookie for the provider
  const initialActiveBranchId = await getActiveBranchFromCookie()
  
  // Get the currency for the active branch
  const initialCurrency = initialActiveBranchId ? await getBranchCurrency(initialActiveBranchId) : null

  return (
    <ActiveBranchProvider initialActiveBranchId={initialActiveBranchId}>
      <CurrencyProvider initialCurrency={initialCurrency}>
        <SidebarProvider>
          <AppSidebar />
          {children}
        </SidebarProvider>
      </CurrencyProvider>
    </ActiveBranchProvider>
  )
}