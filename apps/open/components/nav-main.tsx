"use client"

import React from "react"
import { type LucideIcon, Gauge, Frame } from "lucide-react"

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Helper function to get icon component from string identifier
function getIconComponent(iconName: string): LucideIcon | undefined {
  switch (iconName) {
    case 'Gauge':
      return Gauge;
    case 'Frame':
      return Frame;
    default:
      return undefined;
  }
}

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: string
    isActive?: boolean
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild tooltip={item.title}>
              <a href={item.url}>
                {item.icon && getIconComponent(item.icon) && React.createElement(getIconComponent(item.icon)!, { suppressHydrationWarning: true })}
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
