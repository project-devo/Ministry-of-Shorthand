import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your Ministry of Shorthand account.",
};

const LoginPageWithSearchParams = async ({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; verified?: string }>;
}) => {
  const { callbackUrl, verified } = await searchParams;

  return (
    <AuthShell
      title="Sign in to continue"
      description="Access your courses, practice tests, progress tracking, and live classes."
    >
      <LoginForm callbackUrl={callbackUrl} verifiedState={verified} />
    </AuthShell>
  );
};

export default LoginPageWithSearchParams;
