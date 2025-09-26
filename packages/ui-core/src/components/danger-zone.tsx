import { ReactNode } from "react";
import { cn } from "../lib/utils";

interface DangerZoneProps {
  title: string;
  description: string;
  actionTitle: string;
  actionDescription: string;
  children: ReactNode;
  className?: string;
}

export function DangerZone({
  title,
  description,
  actionTitle,
  actionDescription,
  children,
  className
}: DangerZoneProps) {
  return (
    <div className={cn("border border-destructive/20 rounded-lg p-6 space-y-4", className)}>
      <div className="space-y-2">
        <h2 className="font-medium text-destructive">{title}</h2>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      
      <div className="p-4 border border-destructive/20 rounded-md bg-destructive/5 space-y-3">
        <div className="space-y-1">
          <h3 className="font-medium text-destructive">{actionTitle}</h3>
          <p className="text-sm text-muted-foreground">
            {actionDescription}
          </p>
        </div>
        <div className="flex justify-start">
          {children}
        </div>
      </div>
    </div>
  );
}
