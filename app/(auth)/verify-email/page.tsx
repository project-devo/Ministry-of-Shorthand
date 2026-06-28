"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");
  const email = searchParams?.get("email");
  
  const [status, setStatus] = useState<"loading" | "success" | "error" | "pending">("pending");
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (token) {
      verifyToken(token);
    }
  }, [token]);

  const verifyToken = async (tokenString: string) => {
    setStatus("loading");
    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: tokenString }),
      });

      if (!response.ok) {
        throw new Error("Invalid or expired token");
      }

      setStatus("success");
    } catch (_error) {
      setStatus("error");
    }
  };

  const handleResend = async () => {
    if (!email) return;
    
    setIsResending(true);
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to resend");
      }

      toast.success("Verification email sent", {
        description: "Please check your inbox.",
      });
    } catch (_error) {
      toast.error("Error", {
        description: "Could not resend verification email. Please try again later.",
      });
    } finally {
      setIsResending(false);
    }
  };

  if (status === "loading") {
    return (
      <Card className="border-primary/20 shadow-xl glass-card backdrop-blur-xl bg-background/80 text-center">
        <CardContent className="pt-10 pb-10">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <h2 className="text-xl font-semibold">Verifying your email...</h2>
            <p className="text-muted-foreground text-sm">Please wait while we confirm your account.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status === "success") {
    return (
      <Card className="border-primary/20 shadow-xl glass-card backdrop-blur-xl bg-background/80 text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Email Verified!</CardTitle>
          <CardDescription>
            Your account has been successfully verified.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-6">
            You can now sign in and start your stenography journey.
          </p>
          <Link href="/login" className={cn(buttonVariants({ variant: "default" }), "w-full")}>
            Continue to Login
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (status === "error") {
    return (
      <Card className="border-primary/20 shadow-xl glass-card backdrop-blur-xl bg-background/80 text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-destructive/20 text-destructive rounded-full flex items-center justify-center">
              <XCircle className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Verification Failed</CardTitle>
          <CardDescription>
            The verification link is invalid or has expired.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {email ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We can send you a new verification link.
              </p>
              <Button onClick={handleResend} disabled={isResending} className="w-full">
                {isResending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Resend Verification Link
              </Button>
            </div>
          ) : (
            <Link href="/login" className={cn(buttonVariants({ variant: "default" }), "w-full")}>
              Back to Login
            </Link>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 shadow-xl glass-card backdrop-blur-xl bg-background/80 text-center">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 bg-primary/20 text-primary rounded-full flex items-center justify-center">
            <Mail className="h-8 w-8" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
        <CardDescription>
          We&apos;ve sent a verification link to {email ? <span className="font-medium text-foreground">{email}</span> : "your email address"}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-6">
          Click the link in the email to verify your account and get started. If you don&apos;t see it, check your spam folder.
        </p>
        
        {email && (
          <Button variant="outline" onClick={handleResend} disabled={isResending} className="w-full">
            {isResending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Resend Email
          </Button>
        )}
      </CardContent>
      <CardFooter className="flex justify-center border-t px-6 py-4 mt-2">
        <Link href="/login" className="text-sm text-primary font-medium hover:underline">
          Back to login
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <Card className="border-primary/20 shadow-xl glass-card backdrop-blur-xl bg-background/80 text-center p-8">
        <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto" />
      </Card>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
