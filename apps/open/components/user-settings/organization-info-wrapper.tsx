"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamically import OrganizationInfo with SSR disabled to prevent hydration mismatches
const OrganizationInfo = dynamic(
  () => import("./organization-info").then(mod => ({ default: mod.OrganizationInfo })),
  { 
    ssr: false,
    loading: () => (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="grid gap-4">
          <div className="grid grid-cols-[120px_1fr] gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="grid grid-cols-[120px_1fr] gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="grid grid-cols-[120px_1fr] gap-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>
      </div>
    )
  }
);

interface OrganizationInfoWrapperProps {
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

export function OrganizationInfoWrapper(props: OrganizationInfoWrapperProps) {
  return <OrganizationInfo {...props} />;
}
