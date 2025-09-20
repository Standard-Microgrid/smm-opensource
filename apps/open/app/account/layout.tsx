import Content from "@/components/content";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ActiveBranchProvider } from "@/hooks/use-active-branch";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Content>
      <ActiveBranchProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            {children}
          </SidebarInset>
        </SidebarProvider>
      </ActiveBranchProvider>
    </Content>
  );
}
