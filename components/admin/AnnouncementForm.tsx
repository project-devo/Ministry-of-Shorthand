"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { announcementSchema } from "@/schemas/admin";

type AnnouncementFormValues = z.infer<typeof announcementSchema>;

export const AnnouncementForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      message: "",
      role: "ALL",
    },
  });

  const onSubmit = async (values: AnnouncementFormValues) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("message", values.message);
      formData.append("role", values.role);

      const response = await fetch("/api/admin/notifications", {
        method: "POST",
        body: formData,
      });

      const result = (await response.json()) as { success: boolean; error?: string };
      if (!response.ok || !result.success) {
        toast.error(result.error ?? "Unable to send announcement.");
        return;
      }

      toast.success("Announcement sent.");
      form.reset();
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unable to send announcement.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <select
        className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm"
        {...form.register("role")}
      >
        <option value="ALL">All users</option>
        <option value="STUDENT">Students</option>
        <option value="INSTRUCTOR">Instructors</option>
        <option value="ADMIN">Admins</option>
      </select>
      <Textarea
        placeholder="Write the announcement..."
        {...form.register("message")}
      />
      {form.formState.errors.message?.message ? (
        <p className="text-sm text-destructive">{form.formState.errors.message.message}</p>
      ) : null}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? <LoaderCircle className="size-4 animate-spin" /> : null}
        Send announcement
      </Button>
    </form>
  );
};
