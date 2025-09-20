"use client"

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
import { useUserData } from "@/hooks/use-user-data"
import { useBranchData } from "@/hooks/use-branch-data"

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

export function AppSidebarClient({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Get real user data using the hook
  const userData = useUserData();
  
  // Get real branch data using the hook
  const branches = useBranchData();
  
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
