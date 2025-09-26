"use client";

import { Building2, MapPin, Shield } from "lucide-react";

interface OrganizationInfoProps {
  organization?: {
    name: string;
  } | null;
  branch?: {
    name: string;
  } | null;
  role?: {
    name: string;
  } | null;
}

export function OrganizationInfo({ organization, branch, role }: OrganizationInfoProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Building2 className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-medium">Organization Information</h3>
      </div>
      
      <div className="grid gap-4">
        {/* Organization */}
        <div className="grid grid-cols-[120px_1fr] gap-4">
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Organization
          </div>
          <div className="text-sm font-medium">
            {organization?.name || "Not assigned"}
          </div>
        </div>

        {/* Branch */}
        <div className="grid grid-cols-[120px_1fr] gap-4">
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Branch
          </div>
          <div className="text-sm font-medium">
            {branch?.name || "Not assigned"}
          </div>
        </div>

        {/* Role */}
        <div className="grid grid-cols-[120px_1fr] gap-4">
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Role
          </div>
          <div className="text-sm font-medium">
            {role?.name || "Not assigned"}
          </div>
        </div>
      </div>
    </div>
  );
}
