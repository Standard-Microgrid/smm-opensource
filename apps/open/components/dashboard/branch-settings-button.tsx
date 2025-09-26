"use client"

import { Button } from "@/components/ui/button"
import { Settings2 } from "lucide-react"
import { useActiveBranch } from "@/hooks/use-active-branch"

export function BranchSettingsButton() {
  const { activeBranchId } = useActiveBranch()
  
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="text-muted-foreground hover:text-foreground"
      asChild
    >
      <a href={`/dashboard/branch-settings${activeBranchId ? `?branchId=${activeBranchId}` : ''}`}>
        <Settings2 className="h-4 w-4 mr-2" suppressHydrationWarning={true} />
        Branch Settings
      </a>
    </Button>
  )
}
