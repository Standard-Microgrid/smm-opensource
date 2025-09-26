import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AuthCodeError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Authentication Error</h1>
          <p className="text-muted-foreground">
            There was an error signing you in. This could be due to:
          </p>
        </div>
        
        <ul className="text-sm text-muted-foreground text-left space-y-2">
          <li>• The authentication request was cancelled</li>
          <li>• The authentication request expired</li>
          <li>• There was a network error</li>
        </ul>
        
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/login">Try Again</Link>
          </Button>
          
          <Button variant="outline" asChild className="w-full">
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
