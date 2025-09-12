"use client"

import * as React from "react"
import {
  Frame,
  Gauge,
  MapPin,
  Settings2,
  Zap,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavGrids } from "@/components/nav-grids"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// Application data for the sidebar
const data = {
  user: {
    name: "User",
    email: "user@example.com",
    avatar: "/avatars/user.jpg",
  },
  teams: [
    {
      name: "Standard Microgrid Zambia",
      logo: Zap,
      location: "Lusaka, Zambia",
      locationIcon: MapPin,
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Gauge,
      isActive: true,
    },
    {
      title: "Minigrids",
      url: "/minigrids",
      icon: Frame,
    },
      {
      title: "Branch Settings",
      url: "/protected/branch-settings",
      icon: Settings2,
    },
  ],
  grids: [
    {
      id: "grid-1",
      name: "Ngwerere I",
      url: "/protected/grids/ngwerere-i",
      icon: Frame,
      status: "active" as const,
    },
    {
      id: "grid-2",
      name: "Ngwerere II",
      url: "/protected/grids/ngwerere-ii",
      icon: Frame,
      status: "active" as const,
    },
    {
      id: "grid-3",
      name: "Kamuchanga",
      url: "/protected/grids/kamuchanga",
      icon: Frame,
      status: "maintenance" as const,
    },
    {
      id: "grid-4",
      name: "Undi",
      url: "/protected/grids/undi",
      icon: Frame,
      status: "active" as const,
    },
    {
      id: "grid-5",
      name: "Chapita",
      url: "/protected/grids/chapita",
      icon: Frame,
      status: "active" as const,
    },
    {
      id: "grid-6",
      name: "Kapiri Mposhi",
      url: "/protected/grids/kapiri-mposhi",
      icon: Frame,
      status: "active" as const,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavGrids grids={data.grids} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
