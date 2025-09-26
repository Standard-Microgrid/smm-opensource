import { cn } from "@smm/ui-core/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { forgotPasswordAction } from "@/app/actions"
import AuthSubmitButton from "@/components/auth-submit-button"
import { FormMessage, Message } from "@/components/form-message"
import Link from "next/link"

export function ForgotPasswordForm({
  className,
  searchParams,
  ...props
}: React.ComponentProps<"form"> & { searchParams?: Message }) {
  return (
    <form className={cn("flex flex-col gap-6", className)} action={forgotPasswordAction} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Reset your password</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            placeholder="m@example.com" 
            required 
          />
        </div>
        <AuthSubmitButton defaultText="Send reset link" pendingText="Sending..." />
        {searchParams && <FormMessage message={searchParams} />}
      </div>
      <div className="text-center text-sm">
        Remember your password?{" "}
        <Link href="/login" className="underline underline-offset-4">
          Sign in
        </Link>
      </div>
    </form>
  )
}
