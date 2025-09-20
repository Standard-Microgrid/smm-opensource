import { Message } from "@/components/form-message"
import Link from "next/link"
import Image from "next/image"
import { PowerTimeIcon } from "@/components/icons/powertime-icon"
import { ResetPasswordForm } from "@/components/reset-password-form"
import { createSupabaseClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"

export default async function ResetPasswordPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  
  // Check if we have an active session for password reset
  const supabase = await createSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    // No active session, redirect to login
    return redirect('/login?message=' + encodeURIComponent('Please request a password reset from the login page.'));
  }
  
  // Convert searchParams to Message format for the form
  const message: Message | undefined = searchParams.message ? {
    error: searchParams.message as string
  } : undefined;

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <PowerTimeIcon className="size-4" />
            </div>
            Standard Microgrid Manager
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <ResetPasswordForm searchParams={message} />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/images/Admire_resized.jpg"
          alt="SMM Platform - Smart Meter Management"
          fill
          className="object-cover"
        />
      </div>
    </div>
  )
}
