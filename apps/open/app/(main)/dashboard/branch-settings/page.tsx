import { getCurrentUserContext } from "@/utils/auth/server-permissions";
import { redirect } from "next/navigation";
import { getBranchSettings } from "@/app/actions/branch-settings";
import { BranchSettingsForm } from "@/components/branch-settings/branch-settings-form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default async function BranchSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ branchId?: string }>;
}) {
  const userContext = await getCurrentUserContext();
  
  if (!userContext) {
    redirect("/login");
  }

  // Get current branch settings
  const resolvedSearchParams = await searchParams;
  const branchResult = await getBranchSettings(resolvedSearchParams.branchId);
  const initialData = branchResult.success && branchResult.data ? branchResult.data : undefined;

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
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Branch Settings</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <BranchSettingsForm initialData={initialData} />
      </div>
    </SidebarInset>
  );
}
