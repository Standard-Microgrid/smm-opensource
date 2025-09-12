import InPageSidebar from "@/components/in-page-sidebar";

export default async function ProtectedSidebar() {
  return (
    <InPageSidebar
      basePath="/protected"
      items={[
        {
          label: "Account",
          href: "/",
        },
        {
          label: "Minigrids",
          href: "/minigrids",
        },
        {
          label: "Meters",
          href: "/meters",
        },
        {
          label: "Customers",
          href: "/customers",
        },
      ]}
    />
  );
}
