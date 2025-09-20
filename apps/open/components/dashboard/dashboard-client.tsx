"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export function DashboardClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const updated = searchParams.get('updated');
    const created = searchParams.get('created');
    const deleted = searchParams.get('deleted');
    
    if (updated === 'true') {
      // Check if we've already shown this toast in this session
      const toastKey = 'branch-settings-updated-toast';
      const hasShownToast = sessionStorage.getItem(toastKey);
      
      if (!hasShownToast) {
        // Mark that we've shown this toast
        sessionStorage.setItem(toastKey, 'true');
        
        // Show toast
        toast.success("Branch settings updated successfully!");
        
        // Clean up the URL by removing the query parameter after a short delay
        setTimeout(() => {
          const url = new URL(window.location.href);
          url.searchParams.delete('updated');
          router.replace(url.pathname + url.search, { scroll: false });
        }, 100);
      }
    } else if (created === 'true') {
      // Check if we've already shown this toast in this session
      const toastKey = 'branch-created-toast';
      const hasShownToast = sessionStorage.getItem(toastKey);
      
      if (!hasShownToast) {
        // Mark that we've shown this toast
        sessionStorage.setItem(toastKey, 'true');
        
        // Show toast
        toast.success("Branch created successfully!");
        
        // Clean up the URL by removing the query parameter after a short delay
        setTimeout(() => {
          const url = new URL(window.location.href);
          url.searchParams.delete('created');
          router.replace(url.pathname + url.search, { scroll: false });
        }, 100);
      }
    } else if (deleted === 'true') {
      // Check if we've already shown this toast in this session
      const toastKey = 'branch-deleted-toast';
      const hasShownToast = sessionStorage.getItem(toastKey);
      
      if (!hasShownToast) {
        // Mark that we've shown this toast
        sessionStorage.setItem(toastKey, 'true');
        
        // Show toast
        toast.success("Branch deleted successfully!");
        
        // Clean up the URL by removing the query parameter after a short delay
        setTimeout(() => {
          const url = new URL(window.location.href);
          url.searchParams.delete('deleted');
          router.replace(url.pathname + url.search, { scroll: false });
        }, 100);
      }
    }
  }, [searchParams, router]);

  return null; // This component doesn't render anything
}
