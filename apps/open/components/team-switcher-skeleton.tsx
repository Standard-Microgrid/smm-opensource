import { Skeleton } from "@/components/ui/skeleton"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function TeamSwitcherSkeleton() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" className="pointer-events-none">
          {/* Logo skeleton */}
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <Skeleton className="h-5 w-5 rounded" />
          </div>
          
          {/* Text content skeleton */}
          <div className="grid flex-1 text-left text-sm leading-tight">
            <Skeleton className="h-4 w-32 mb-1" />
            <div className="flex items-center gap-1">
              <Skeleton className="h-3 w-3 rounded" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          
          {/* Chevron skeleton */}
          <Skeleton className="ml-auto h-4 w-4" />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
