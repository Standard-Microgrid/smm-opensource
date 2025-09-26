"use client";

import { useState } from "react";
import { Clock, Mail } from "lucide-react";
import { Alert, AlertDescription } from "@smm/ui-core/components/alert";
import { Button } from "@/components/ui/button";

interface EmailChangeNotificationProps {
  currentEmail: string;
  pendingEmail?: string;
  onDismiss?: () => void;
}

export function EmailChangeNotification({ 
  currentEmail, 
  pendingEmail, 
  onDismiss 
}: EmailChangeNotificationProps) {
  const [isVisible, setIsVisible] = useState(!!pendingEmail);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible || !pendingEmail) return null;

  return (
    <Alert className="border-amber-200 bg-amber-50">
      <Mail className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-amber-800">
        <div className="space-y-2">
          <p className="font-medium">Email change pending confirmation</p>
          <p className="text-sm">
            We&apos;ve sent confirmation emails to both your current email ({currentEmail}) 
            and your new email ({pendingEmail}). Please check both inboxes and click 
            the confirmation links to complete the email change.
          </p>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-3 w-3" />
            <span>Your email will be updated once both confirmations are received.</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDismiss}
            className="mt-2"
          >
            Dismiss
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
