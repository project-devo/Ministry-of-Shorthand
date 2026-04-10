"use client";

import { RouteErrorView } from "@/components/feedback/RouteErrorView";

const DashboardError = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  return <RouteErrorView error={error} onRetry={reset} title="Dashboard unavailable" />;
};

export default DashboardError;
