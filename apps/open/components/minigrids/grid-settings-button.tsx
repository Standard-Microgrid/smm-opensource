"use client"

import { Button } from "@/components/ui/button"
import { Settings2 } from "lucide-react"

export function GridSettingsButton() {
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="text-muted-foreground hover:text-foreground"
      asChild
    >
      <a href="/grid-settings">
        <Settings2 className="h-4 w-4 mr-2" suppressHydrationWarning={true} />
        Grid Settings
      </a>
    </Button>
  )
}
