import type { ReactNode } from "react";

export const AuthShell = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) => {
  return (
    <section className="flex min-h-[calc(100vh-81px)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden rounded-[2rem] border border-border/70 bg-gradient-to-br from-primary/20 via-background to-accent/20 p-10 lg:flex lg:flex-col lg:justify-between">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
              Ministry of Shorthand
            </p>
            <h2 className="max-w-md text-4xl font-semibold leading-tight text-foreground">
              Learn shorthand with structured lessons, live support, and measurable progress.
            </h2>
            <p className="max-w-lg text-base leading-7 text-muted-foreground">
              Built for Indian stenography aspirants who need disciplined practice, progress
              tracking, and a clean learning experience across every device.
            </p>
          </div>
          <div className="grid gap-4 text-sm text-muted-foreground">
            <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
              Structured courses, free lessons, timed practice tests, and live classes all share
              one account system.
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
              Sign in with email or Google and keep your role-based access under one secure auth
              flow.
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-full max-w-md space-y-3">
            <div className="space-y-2 text-center lg:text-left">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
              <p className="text-sm leading-6 text-muted-foreground">{description}</p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};
