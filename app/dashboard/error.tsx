"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/error-state";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <ErrorState
      title="Dashboard couldn't load"
      description="We ran into a problem loading your dashboard. This is usually temporary — please try again."
      retry={reset}
    />
  );
}
