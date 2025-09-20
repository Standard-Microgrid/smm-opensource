import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { getCurrentUserData } from "@/utils/auth/user-data"
import { getCurrentUserBranches } from "@/utils/auth/branch-data"

// Application data for the sidebar
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: "Gauge",
      isActive: true,
    },
    {
      title: "Minigrids",
      url: "/minigrids",
      icon: "Frame",
    },
  ],
}

export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Get current user data
  const userData = await getCurrentUserData();
  
  // Get current user branches
  const branches = await getCurrentUserBranches();
  
  // Fallback user data if not available
  const user = userData || {
    name: "User",
    email: "user@example.com",
    avatar: "",
    initials: "U"
  };

  // Fallback branches if not available
  const teams = branches.length > 0 ? branches : [
    {
      id: "default",
      name: "Standard Microgrid Zambia",
      logo: "PowerTimeIcon",
      location: "Lusaka, Zambia",
      locationIcon: "MapPin",
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
