"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { AudioPlayer } from "@/components/dashboard/AudioPlayer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const formatSeconds = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const PracticeTestRunner = ({
  test,
}: {
  test: {
    id: string;
    title: string;
    speedWPM: number;
    audioUrl: string;
    level: string;
  };
}) => {
  const router = useRouter();
  const [responseText, setResponseText] = useState("");
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const interval = window.setInterval(() => {
      setSecondsElapsed((currentValue) => currentValue + 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isRunning]);

  const wordCount = useMemo(() => {
    const normalized = responseText.trim();
    if (!normalized) {
      return 0;
    }

    return normalized.split(/\s+/).length;
  }, [responseText]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setIsRunning(false);

      const apiResponse = await fetch("/api/tests/attempts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          testId: test.id,
          timeTaken: secondsElapsed,
          responseText,
        }),
      });

      const result = (await apiResponse.json()) as {
        success: boolean;
        data?: {
          attemptId: string;
        };
        error?: string;
      };

      if (!apiResponse.ok || !result.success || !result.data) {
        toast.error(result.error ?? "Unable to submit test.");
        setIsSubmitting(false);
        return;
      }

      router.push(`/dashboard/tests/${test.id}/result?attemptId=${result.data.attemptId}`);
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unable to submit test.";
      toast.error(message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[1.5rem] border border-border/70 bg-card/80 p-6 shadow-lg shadow-black/5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Target speed</p>
            <p className="text-xl font-semibold text-foreground">{test.speedWPM} WPM</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Timer</p>
            <p className="text-xl font-semibold text-foreground">{formatSeconds(secondsElapsed)}</p>
          </div>
          <Button type="button" variant="outline" onClick={() => setIsRunning((value) => !value)}>
            {isRunning ? "Pause timer" : "Start timer"}
          </Button>
        </div>
        <AudioPlayer source={test.audioUrl} />
      </div>

      <div className="rounded-[1.5rem] border border-border/70 bg-card/80 p-6 shadow-lg shadow-black/5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Type your dictation</h2>
            <p className="text-sm text-muted-foreground">
              Keep writing while the audio plays. Word count: {wordCount}
            </p>
          </div>
        </div>
        <Textarea
          value={responseText}
          onChange={(event) => setResponseText(event.target.value)}
          placeholder="Type your shorthand dictation response here..."
          className="min-h-72"
        />
        <div className="mt-4 flex justify-end">
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting || wordCount === 0}>
            {isSubmitting ? <LoaderCircle className="size-4 animate-spin" /> : null}
            Submit test
          </Button>
        </div>
      </div>
    </div>
  );
};
