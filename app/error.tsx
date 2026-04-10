"use client";

import { RouteErrorView } from "@/components/feedback/RouteErrorView";

const RootError = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  return <RouteErrorView error={error} onRetry={reset} title="Unable to load this page" />;
};

export default RootError;
