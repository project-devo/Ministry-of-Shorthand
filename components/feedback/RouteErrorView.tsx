"use client";

import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export const RouteErrorView = ({
  error,
  onRetry,
  title = "Something went wrong",
}: {
  error?: Error & { digest?: string };
  onRetry: () => void;
  title?: string;
}) => {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full rounded-[2rem] border border-border/70 bg-card/90 p-8 text-center shadow-xl shadow-black/5">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Error</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          {error?.message ?? "The page could not be loaded right now. Please try again."}
        </p>
        <div className="mt-6 flex justify-center">
          <Button type="button" onClick={onRetry}>
            <RefreshCcw className="size-4" />
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
};
