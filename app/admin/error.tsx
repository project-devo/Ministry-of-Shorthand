"use client";

import { RouteErrorView } from "@/components/feedback/RouteErrorView";

const AdminError = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  return <RouteErrorView error={error} onRetry={reset} title="Admin panel unavailable" />;
};

export default AdminError;
