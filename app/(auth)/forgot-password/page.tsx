import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Request a password reset email for your account.",
};

const ForgotPasswordPage = () => {
  return (
    <AuthShell
      title="Reset access"
      description="Enter your email address and we’ll send you a secure password reset link."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
};

export default ForgotPasswordPage;
