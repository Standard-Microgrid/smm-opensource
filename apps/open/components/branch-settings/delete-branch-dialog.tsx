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
  Label,
} from "@smm/ui-core";
import { Trash2 } from "lucide-react";
import { deleteBranch } from "@/app/actions/branch-settings";

interface DeleteBranchDialogProps {
  branchName: string;
  branchId: string;
}

export function DeleteBranchDialog({ branchName, branchId }: DeleteBranchDialogProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isConfirmationValid = confirmationText === branchName;

  const handleDelete = useCallback(async () => {
    if (!isConfirmationValid) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const result = await deleteBranch(branchId);

      if (result.success) {
        // Reset form
        setConfirmationText("");
        setError(null);
        setIsOpen(false);
        
        // Show success toast
        toast.success("Branch deleted successfully");
        
        // Navigate to dashboard
        router.push('/dashboard?deleted=true');
      } else {
        setError(result.error || "Failed to delete branch");
        toast.error(result.error || "Failed to delete branch");
      }
    } catch (error) {
      console.error('❌ Delete Branch - Unexpected error:', error);
      setError("An unexpected error occurred");
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  }, [isConfirmationValid, branchId, router]);

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
          Delete Branch
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
          <DialogTitle>Delete Branch</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the branch &quot;{branchName}&quot;? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="confirmation">Branch Name</Label>
            <Input
              id="confirmation"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder={`Type "${branchName}" to confirm`}
              className={!isConfirmationValid && confirmationText ? "border-destructive" : ""}
            />
            {!isConfirmationValid && confirmationText && (
              <p className="text-sm text-destructive">
                Branch name does not match. Please type exactly: {branchName}
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
            onClick={handleDelete}
            disabled={!isConfirmationValid || isDeleting}
            variant="destructive"
          >
            {isDeleting ? "Deleting..." : "Delete Branch"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}