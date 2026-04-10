"use client";

import { RouteErrorView } from "@/components/feedback/RouteErrorView";

const InstructorError = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  return <RouteErrorView error={error} onRetry={reset} title="Instructor panel unavailable" />;
};

export default InstructorError;
