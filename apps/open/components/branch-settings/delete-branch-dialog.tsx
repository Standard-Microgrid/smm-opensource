"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

  const handleDelete = async () => {
    if (!isConfirmationValid) return;

    setIsDeleting(true);
    setError(null);

    try {
      const result = await deleteBranch(branchId);

      if (result.success) {
        setIsOpen(false);
        setConfirmationText("");
        // Redirect to dashboard with query parameter to show toast after refresh
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
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Branch
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Branch</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-2">
              <p className="text-destructive font-medium">
                ⚠️ Caution: This action is irreversible and will permanently delete this branch and its data!
              </p>
              <p>
                To confirm deletion, please type the branch name: <strong>{branchName}</strong>
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
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

        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={() => {
              setConfirmationText("");
              setError(null);
            }}
            disabled={isDeleting}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={!isConfirmationValid || isDeleting}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete Branch"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
