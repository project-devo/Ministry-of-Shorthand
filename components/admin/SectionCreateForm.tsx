"use client";

import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export const SectionCreateForm = ({
  courseId,
  defaultOrder,
}: {
  courseId: string;
  defaultOrder: number;
}) => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState(defaultOrder);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("order", String(order));

      const response = await fetch(`/api/admin/courses/${courseId}/sections`, {
        method: "POST",
        body: formData,
      });

      const result = (await response.json()) as { success: boolean; error?: string };
      if (!response.ok || !result.success) {
        toast.error(result.error ?? "Unable to create section.");
        return;
      }

      toast.success("Section created.");
      setTitle("");
      setOrder((value) => value + 1);
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unable to create section.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-3 md:grid-cols-3">
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="New section title"
        className="flex h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm md:col-span-2"
      />
      <input
        value={order}
        onChange={(event) => setOrder(Number(event.target.value))}
        type="number"
        className="flex h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm"
      />
      <Button type="submit" disabled={isLoading} className="md:col-span-3">
        {isLoading ? <LoaderCircle className="size-4 animate-spin" /> : null}
        Add section
      </Button>
    </form>
  );
};
