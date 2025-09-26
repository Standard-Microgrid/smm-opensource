"use client"

import * as React from "react"
import { ChevronsUpDown, Plus, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"
import { PowerTimeIcon } from "@/components/icons/powertime-icon"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useActiveBranch } from "@/hooks/use-active-branch"
import { TeamSwitcherSkeleton } from "./team-switcher-skeleton"
import { setActiveBranchCookie } from "@/utils/cookies"

// Helper function to get icon component from string identifier
function getIconComponent(iconName: string) {
  switch (iconName) {
    case 'MapPin':
      return MapPin;
    case 'PowerTimeIcon':
      return PowerTimeIcon;
    default:
      return PowerTimeIcon;
  }
}

// Helper function to render icon with proper props
function renderIcon(iconName: string, props: { className?: string; size?: string | number; fill?: string; suppressHydrationWarning?: boolean }) {
  const IconComponent = getIconComponent(iconName);
  
  if (iconName === 'PowerTimeIcon') {
    // PowerTimeIcon expects specific props
    return <IconComponent 
      className={props.className} 
      size={typeof props.size === 'string' ? parseInt(props.size) : props.size || 19}
      fill={props.fill || "currentColor"}
      suppressHydrationWarning={props.suppressHydrationWarning}
    />;
  } else {
    // Lucide icons - convert size to number if it's a string
    const lucideProps = {
      ...props,
      size: typeof props.size === 'string' ? parseInt(props.size) || 16 : props.size || 16
    };
    return <IconComponent {...lucideProps} />;
  }
}

export function TeamSwitcher({
  teams,
  initialActiveBranchId,
}: {
  teams: {
    id: string
    name: string
    logo: string
    location: string
    locationIcon: string
  }[]
  initialActiveBranchId?: string | null
}) {
  const { isMobile } = useSidebar()
  const { activeBranchId, setActiveBranchId } = useActiveBranch()
  const router = useRouter()
  
  // Use initialActiveBranchId if activeBranchId is not set (prevents hydration mismatch)
  const currentActiveBranchId = activeBranchId || initialActiveBranchId
  
  // Show skeleton while loading (no activeBranchId and no initialActiveBranchId)
  if (!currentActiveBranchId) {
    return <TeamSwitcherSkeleton />
  }

  // Find the active team based on the active branch ID
  const activeTeam = teams.find(team => team.id === currentActiveBranchId) || teams[0]

  const handleBranchChange = (branchId: string) => {
    setActiveBranchId(branchId)
    setActiveBranchCookie(branchId) // Save to cookie for server-side access
    // Always navigate to dashboard when changing branches
    router.push('/dashboard')
  }

  if (!activeTeam || teams.length === 0) {
    return <TeamSwitcherSkeleton />
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                {renderIcon(activeTeam.logo, { className: "size-5", suppressHydrationWarning: true })}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeTeam.name}</span>
                <span className="truncate text-xs flex items-center gap-1">
                  {renderIcon(activeTeam.locationIcon, { className: "size-3", suppressHydrationWarning: true })}
                  {activeTeam.location}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" suppressHydrationWarning={true} />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Branches
            </DropdownMenuLabel>
            {teams.map((team) => (
              <DropdownMenuItem
                key={team.id}
                onClick={() => handleBranchChange(team.id)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  {renderIcon(team.logo, { className: "size-4 shrink-0", suppressHydrationWarning: true })}
                </div>
                {team.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="gap-2 p-2">
              <a href="/add-branch">
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <Plus className="size-4" suppressHydrationWarning={true} />
                </div>
                <div className="text-muted-foreground font-medium">Add branch</div>
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
