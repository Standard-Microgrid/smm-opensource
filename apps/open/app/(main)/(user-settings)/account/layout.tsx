import { SidebarInset } from "@/components/ui/sidebar";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarInset>
      {children}
    </SidebarInset>
  );
}
