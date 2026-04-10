import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your Ministry of Shorthand account.",
};

const SignupPage = () => {
  return (
    <AuthShell
      title="Create your account"
      description="Join the platform and begin your shorthand learning journey with a verified account."
    >
      <SignupForm />
    </AuthShell>
  );
};

export default SignupPage;
