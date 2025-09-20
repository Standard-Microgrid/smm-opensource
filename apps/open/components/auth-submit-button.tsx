"use client";

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

interface AuthSubmitButtonProps {
  defaultText?: string;
  pendingText?: string;
}

export default function AuthSubmitButton({ 
  defaultText = "Sign in", 
  pendingText = "Signing in..." 
}: AuthSubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" aria-disabled={pending}>
      {pending ? pendingText : defaultText}
    </Button>
  );
}
