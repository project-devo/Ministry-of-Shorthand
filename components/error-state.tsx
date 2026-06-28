"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  retry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again or contact support if the problem persists.",
  retry,
}: ErrorStateProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="flex max-w-md flex-col items-center text-center space-y-6">
        {/* Icon with gradient backdrop */}
        <div className="relative">
          <div className="absolute inset-0 size-20 rounded-full bg-gradient-to-br from-destructive/20 via-destructive/10 to-transparent blur-xl" />
          <div className="relative flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-destructive/15 to-destructive/5 ring-1 ring-destructive/10">
            <AlertTriangle className="size-9 text-destructive" strokeWidth={1.5} />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>

        {/* Retry button */}
        {retry && (
          <Button onClick={retry} variant="outline" size="lg">
            Try again
          </Button>
        )}
      </div>
    </div>
  );
}
