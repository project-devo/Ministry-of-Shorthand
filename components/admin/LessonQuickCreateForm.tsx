"use client";

import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export const LessonQuickCreateForm = ({
  defaultOrder,
  sectionId,
}: {
  defaultOrder: number;
  sectionId: string;
}) => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState(defaultOrder);
  const [duration, setDuration] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("order", String(order));
      formData.append("duration", String(duration));

      const response = await fetch(`/api/admin/sections/${sectionId}/lessons`, {
        method: "POST",
        body: formData,
      });

      const result = (await response.json()) as { success: boolean; error?: string };
      if (!response.ok || !result.success) {
        toast.error(result.error ?? "Unable to create lesson.");
        return;
      }

      toast.success("Lesson created.");
      setTitle("");
      setOrder((value) => value + 1);
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unable to create lesson.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-3 rounded-xl border border-dashed border-border p-4 md:grid-cols-5">
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Lesson title"
        className="flex h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm md:col-span-2"
      />
      <input
        value={order}
        onChange={(event) => setOrder(Number(event.target.value))}
        type="number"
        className="flex h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm"
      />
      <input
        value={duration}
        onChange={(event) => setDuration(Number(event.target.value))}
        type="number"
        placeholder="Duration"
        className="flex h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm"
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? <LoaderCircle className="size-4 animate-spin" /> : null}
        Add lesson
      </Button>
    </form>
  );
};
