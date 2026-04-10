"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FormField } from "@/components/auth/FormField";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { loginSchema } from "@/schemas/auth";

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = ({
  callbackUrl = "/dashboard",
  verifiedState,
}: {
  callbackUrl?: string;
  verifiedState?: string;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const hasShownQueryToast = useRef(false);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (hasShownQueryToast.current) {
      return;
    }

    if (verifiedState === "success") {
      toast.success("Email verified. You can sign in now.");
      hasShownQueryToast.current = true;
      return;
    }

    if (verifiedState === "invalid" || verifiedState === "missing") {
      toast.error("This verification link is invalid or expired.");
      hasShownQueryToast.current = true;
    }
  }, [verifiedState]);

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setIsLoading(true);
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
        callbackUrl,
      });

      if (!result || result.error) {
        toast.error(result?.error ?? "Invalid email or password.");
        return;
      }

      toast.success("Welcome back.");
      router.push(result.url ?? callbackUrl);
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Login failed.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Use your email or continue with Google.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <GoogleSignInButton />
        <div className="flex items-center gap-4">
          <Separator className="flex-1" />
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">or</span>
          <Separator className="flex-1" />
        </div>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            id="email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            error={form.formState.errors.email?.message}
            {...form.register("email")}
          />
          <FormField
            id="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            error={form.formState.errors.password?.message}
            {...form.register("password")}
          />
          <div className="flex items-center justify-between text-sm">
            <Link href="/forgot-password" className="text-primary hover:underline">
              Forgot password?
            </Link>
            <Link href="/signup" className="text-primary hover:underline">
              Create account
            </Link>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <LoaderCircle className="size-4 animate-spin" /> : null}
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
