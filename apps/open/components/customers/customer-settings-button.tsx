"use client"

import { Button } from "@/components/ui/button"
import { Settings2 } from "lucide-react"

export function CustomerSettingsButton() {
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="text-muted-foreground hover:text-foreground"
      asChild
    >
      <a href="/customer-settings">
        <Settings2 className="h-4 w-4 mr-2" suppressHydrationWarning={true} />
        Customer Settings
      </a>
    </Button>
  )
}

