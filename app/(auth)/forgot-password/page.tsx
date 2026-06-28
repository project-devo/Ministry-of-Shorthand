"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: Record<string, string>) => {
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      });

      if (!response.ok) {
        // We still show success even if email not found to prevent email enumeration
      }

      setSubmittedEmail(data.email);
      setIsSubmitted(true);
    } catch (_error) {
      toast.error("Error", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
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
            We&apos;ve sent a password reset link to <span className="font-medium text-foreground">{submittedEmail}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-6">
            Click the link in the email to reset your password. If you don&apos;t see it, check your spam folder.
          </p>
          <Link href="/login" className={cn(buttonVariants({ variant: "default" }), "w-full")}>
            Back to Login
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 shadow-xl glass-card backdrop-blur-xl bg-background/80">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
        <CardDescription>
          Enter your email address and we&apos;ll send you a link to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              {...register("email", { 
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message as string}</p>
            )}
          </div>
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Reset Link
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t px-6 py-4 mt-2">
        <Link href="/login" className="text-sm text-primary font-medium hover:underline">
          Back to login
        </Link>
      </CardFooter>
    </Card>
  );
}
