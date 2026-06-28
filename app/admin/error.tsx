"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/error-state";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin error:", error);
  }, [error]);

  return (
    <ErrorState
      title="Admin panel error"
      description="Something went wrong loading the admin panel. Please try again or contact your system administrator."
      retry={reset}
    />
  );
}
