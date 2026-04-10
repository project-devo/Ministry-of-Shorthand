"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FormField } from "@/components/auth/FormField";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { resetPasswordSchema } from "@/schemas/auth";

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordForm = ({ token }: { token: string }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          ...values,
        }),
      });

      const result = (await response.json()) as {
        success: boolean;
        error?: string;
      };

      if (!response.ok || !result.success) {
        toast.error(result.error ?? "Unable to reset your password.");
        return;
      }

      toast.success("Password updated. You can sign in now.");
      router.push("/login");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Reset failed.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset password</CardTitle>
        <CardDescription>Create a new password for your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            id="reset-password"
            type="password"
            label="New password"
            placeholder="Enter your new password"
            error={form.formState.errors.password?.message}
            {...form.register("password")}
          />
          <FormField
            id="reset-confirm-password"
            type="password"
            label="Confirm new password"
            placeholder="Re-enter your new password"
            error={form.formState.errors.confirmPassword?.message}
            {...form.register("confirmPassword")}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <LoaderCircle className="size-4 animate-spin" /> : null}
            {isLoading ? "Updating password..." : "Update password"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Want to sign in instead?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Go to login
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
};
