"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/error-state";

export default function InstructorError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Instructor error:", error);
  }, [error]);

  return (
    <ErrorState
      title="Instructor portal error"
      description="We couldn't load the instructor portal. This is usually temporary — please try again."
      retry={reset}
    />
  );
}
