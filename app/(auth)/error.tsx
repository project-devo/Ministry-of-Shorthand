"use client";

import { RouteErrorView } from "@/components/feedback/RouteErrorView";

const AuthError = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  return <RouteErrorView error={error} onRetry={reset} title="Authentication page unavailable" />;
};

export default AuthError;
