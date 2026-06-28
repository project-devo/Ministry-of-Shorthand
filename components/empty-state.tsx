"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; href: string };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center p-6">
      <div className="flex max-w-sm flex-col items-center text-center space-y-5">
        {/* Icon */}
        {icon && (
          <div className="flex size-16 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground ring-1 ring-border/50">
            <div className="[&_svg]:size-7 [&_svg]:stroke-[1.5]">{icon}</div>
          </div>
        )}

        {/* Text */}
        <div className="space-y-1.5">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">
            {title}
          </h3>
          {description && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        {/* Action */}
        {action && (
          <Button asChild variant="outline" size="lg">
            <Link href={action.href}>{action.label}</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
