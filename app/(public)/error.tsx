"use client";

import { RouteErrorView } from "@/components/feedback/RouteErrorView";

const PublicError = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  return <RouteErrorView error={error} onRetry={reset} title="Public page unavailable" />;
};

export default PublicError;
