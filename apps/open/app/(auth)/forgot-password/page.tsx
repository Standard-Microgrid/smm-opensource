import { Message } from "@/components/form-message"
import Link from "next/link"
import Image from "next/image"
import { PowerTimeIcon } from "@/components/icons/powertime-icon"
import { ForgotPasswordForm } from "@/components/forgot-password-form"

export default async function ForgotPasswordPage(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
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
            <ForgotPasswordForm searchParams={searchParams} />
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
