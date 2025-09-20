import { cn } from "@smm/ui-core/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signInAction } from "@/app/actions"
import AuthSubmitButton from "@/components/auth-submit-button"
import { FormMessage, Message } from "@/components/form-message"
import { GoogleSignInButton } from "@/components/google-signin-button"

export function LoginForm({
  className,
  searchParams,
  ...props
}: React.ComponentProps<"form"> & { searchParams?: Message }) {
  return (
    <form className={cn("flex flex-col gap-6", className)} action={signInAction} {...props}>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="/forgot-password"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input id="password" name="password" type="password" required />
        </div>
        <AuthSubmitButton />
        {searchParams && <FormMessage message={searchParams} />}
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or
          </span>
        </div>
        <GoogleSignInButton />
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="/sign-up" className="underline underline-offset-4">
          Sign up
        </a>
      </div>
    </form>
  )
}
