"use client";

import { useSyncExternalStore } from "react";

export const TestResultInsights = ({
  attemptId,
  fallbackWpm,
  fallbackAnalysis,
}: {
  attemptId: string;
  fallbackWpm: number;
  fallbackAnalysis: string[];
}) => {
  const storedValue = useSyncExternalStore(
    () => () => undefined,
    () => window.sessionStorage.getItem(`test-result-${attemptId}`),
    () => null,
  );

  let wpm = fallbackWpm;
  let analysis = fallbackAnalysis;

  if (storedValue) {
    try {
      const parsedValue = JSON.parse(storedValue) as {
        actualWpm?: number;
        errorAnalysis?: string[];
      };

      if (typeof parsedValue.actualWpm === "number") {
        wpm = parsedValue.actualWpm;
      }

      if (Array.isArray(parsedValue.errorAnalysis) && parsedValue.errorAnalysis.length > 0) {
        analysis = parsedValue.errorAnalysis;
      }
    } catch {
      wpm = fallbackWpm;
      analysis = fallbackAnalysis;
    }
  }

  return (
    <>
      <article className="rounded-[1.5rem] border border-border/70 bg-card/90 p-6 shadow-lg shadow-black/5">
        <p className="text-sm text-muted-foreground">WPM</p>
        <p className="mt-3 text-4xl font-semibold text-foreground">{wpm}</p>
      </article>

      <div className="rounded-[1.5rem] border border-border/70 bg-card/90 p-6 shadow-lg shadow-black/5 md:col-span-3">
        <h2 className="mb-4 text-2xl font-semibold text-foreground">Error analysis</h2>
        <div className="space-y-3 text-sm leading-7 text-muted-foreground">
          {analysis.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </div>
    </>
  );
};
