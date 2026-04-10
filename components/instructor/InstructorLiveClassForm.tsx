"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FormField } from "@/components/auth/FormField";
import { Button } from "@/components/ui/button";
import { liveClassSchema } from "@/schemas/admin";

type LiveClassFormValues = z.infer<typeof liveClassSchema>;

export const InstructorLiveClassForm = ({ instructorId }: { instructorId: string }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<LiveClassFormValues>({
    resolver: zodResolver(liveClassSchema),
    defaultValues: {
      title: "",
      scheduledAt: "",
      meetLink: "",
      instructorId,
    },
  });

  const onSubmit = async (values: LiveClassFormValues) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("scheduledAt", values.scheduledAt);
      formData.append("meetLink", values.meetLink);
      formData.append("instructorId", values.instructorId);

      const response = await fetch("/api/instructor/live-classes", {
        method: "POST",
        body: formData,
      });

      const result = (await response.json()) as { success: boolean; error?: string };

      if (!response.ok || !result.success) {
        toast.error(result.error ?? "Unable to schedule live class.");
        return;
      }

      toast.success("Live class scheduled.");
      form.reset({
        title: "",
        scheduledAt: "",
        meetLink: "",
        instructorId,
      });
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unable to schedule live class.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
      <FormField
        id="instructor-live-title"
        label="Title"
        type="text"
        error={form.formState.errors.title?.message}
        {...form.register("title")}
      />
      <FormField
        id="instructor-live-scheduled"
        label="Date and time"
        type="datetime-local"
        error={form.formState.errors.scheduledAt?.message}
        {...form.register("scheduledAt")}
      />
      <FormField
        id="instructor-live-link"
        label="Meet link"
        type="url"
        error={form.formState.errors.meetLink?.message}
        {...form.register("meetLink")}
      />
      <input type="hidden" {...form.register("instructorId")} />
      <div className="md:col-span-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <LoaderCircle className="size-4 animate-spin" /> : null}
          Schedule class
        </Button>
      </div>
    </form>
  );
};
