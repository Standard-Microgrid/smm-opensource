import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { getCurrentUserContext } from "@/utils/auth/server-permissions"
import { redirect } from "next/navigation"
import { BranchSettingsForm } from "@/components/branch-settings/branch-settings-form"

export default async function AddBranchPage() {
  const userContext = await getCurrentUserContext()

  if (!userContext) {
    redirect("/login");
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <a href="/dashboard">Dashboard</a>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Add Branch</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
          <div className="p-6">
            <BranchSettingsForm mode="add" />
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
