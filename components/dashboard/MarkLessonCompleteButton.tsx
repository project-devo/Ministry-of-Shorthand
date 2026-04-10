"use client";

import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export const MarkLessonCompleteButton = ({
  lessonId,
  isCompleted,
}: {
  lessonId: string;
  isCompleted: boolean;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleProgressUpdate = async () => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lessonId,
          completed: !isCompleted,
        }),
      });

      const result = (await response.json()) as {
        success: boolean;
        error?: string;
      };

      if (!response.ok || !result.success) {
        toast.error(result.error ?? "Unable to update lesson progress.");
        return;
      }

      toast.success(isCompleted ? "Lesson marked incomplete." : "Lesson marked complete.");
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unable to update lesson progress.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button type="button" onClick={handleProgressUpdate} disabled={isLoading}>
      {isLoading ? <LoaderCircle className="size-4 animate-spin" /> : null}
      {isCompleted ? "Mark as incomplete" : "Mark as complete"}
    </Button>
  );
};
