"use client"

import { useState } from "react"
import { type LucideIcon } from "lucide-react"

import { ScrollArea } from "@/components/ui/scroll-area"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavGrids({
  grids,
}: {
  grids: {
    id: string
    name: string
    url: string
    icon?: LucideIcon
    status?: "active" | "inactive" | "maintenance"
  }[]
}) {
  const [selectedGrid, setSelectedGrid] = useState<string | null>(null)

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "inactive":
        return "bg-gray-400"
      case "maintenance":
        return "bg-yellow-500"
      default:
        return "bg-gray-400"
    }
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Grids</SidebarGroupLabel>
      <ScrollArea className="h-[200px] w-full">
        <SidebarMenu>
          {grids.map((grid) => (
            <SidebarMenuItem key={grid.id}>
              <SidebarMenuButton
                asChild
                tooltip={grid.name}
                className={`relative ${
                  selectedGrid === grid.id ? "bg-sidebar-accent" : ""
                }`}
                onClick={() => setSelectedGrid(grid.id)}
              >
                <a href={grid.url} className="flex items-center gap-2">
                  {grid.icon && <grid.icon className="h-4 w-4" />}
                  <span className="flex-1 truncate">{grid.name}</span>
                  <div
                    className={`h-2 w-2 rounded-full ${getStatusColor(grid.status)}`}
                    title={grid.status || "unknown"}
                  />
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </ScrollArea>
    </SidebarGroup>
  )
}
