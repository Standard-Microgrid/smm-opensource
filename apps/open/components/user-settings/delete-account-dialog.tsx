"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
  Input,
} from "@smm/ui-core";
import { Trash2 } from "lucide-react";
import { deleteAccount } from "@/app/actions/user-settings";

interface DeleteAccountDialogProps {
  userFullName: string;
}

export function DeleteAccountDialog({ userFullName }: DeleteAccountDialogProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isConfirmationValid = confirmationText === userFullName;

  const handleDelete = useCallback(async () => {
    if (!isConfirmationValid) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const result = await deleteAccount();

      if (result.success) {
        // Reset form
        setConfirmationText("");
        setError(null);
        setIsOpen(false);
        
        // Show success toast
        toast.success("Account deleted successfully");
        
        // Navigate to home page or logout
        router.push('/');
      } else {
        setError(result.error || "Failed to delete account");
        toast.error(result.error || "Failed to delete account");
      }
    } catch (error) {
      console.error('❌ Delete Account - Unexpected error:', error);
      setError("An unexpected error occurred");
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  }, [isConfirmationValid, router]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset form when dialog closes
      setConfirmationText("");
      setError(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          type="button"
          variant="destructive" 
          size="sm"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Account
        </Button>
      </DialogTrigger>
      
      <DialogContent 
        className="z-[99999]"
        style={{ 
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 99999,
          minWidth: '400px',
          maxWidth: '500px'
        }}
      >
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive font-medium">
              ⚠️ Warning: This will permanently delete your account and all associated data.
            </p>
          </div>

          <div className="space-y-3">
            <Input
              id="confirmation"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder={`Type "${userFullName}" to confirm`}
              className={!isConfirmationValid && confirmationText ? "border-destructive" : ""}
            />
            {!isConfirmationValid && confirmationText && (
              <p className="text-sm text-destructive">
                Full name does not match. Please type exactly: {userFullName}
              </p>
            )}
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={!isConfirmationValid || isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
