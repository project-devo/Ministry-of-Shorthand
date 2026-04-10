import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Set a new password for your Ministry of Shorthand account.",
};

const ResetPasswordPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) => {
  const { token } = await searchParams;

  return (
    <AuthShell
      title="Choose a new password"
      description="Your new password should be secure and easy for you to remember."
    >
      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Reset link missing</CardTitle>
            <CardDescription>Your password reset link is incomplete or expired.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Request a new reset link from{" "}
            <Link href="/forgot-password" className="text-primary hover:underline">
              forgot password
            </Link>
            .
          </CardContent>
        </Card>
      )}
    </AuthShell>
  );
};

export default ResetPasswordPage;
