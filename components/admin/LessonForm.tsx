"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import { FormField } from "@/components/auth/FormField";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { lessonSchema } from "@/schemas/admin";

type LessonFormValues = z.infer<typeof lessonSchema>;

export const LessonForm = ({
  lesson,
}: {
  lesson: LessonFormValues & { id: string };
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: lesson.title,
      order: lesson.order,
      videoUrl: lesson.videoUrl,
      duration: lesson.duration,
      isFree: lesson.isFree,
      pdfUrl: lesson.pdfUrl,
      sectionId: lesson.sectionId,
    },
  });

  const onSubmit = async (values: LessonFormValues) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/lessons/${lesson.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = (await response.json()) as { success: boolean; error?: string };

      if (!response.ok || !result.success) {
        toast.error(result.error ?? "Unable to update lesson.");
        return;
      }

      toast.success("Lesson updated.");
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unable to update lesson.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lesson settings</CardTitle>
        <CardDescription>Update the lesson media, PDF, access level, and ordering.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            id="lesson-title"
            label="Title"
            type="text"
            error={form.formState.errors.title?.message}
            {...form.register("title")}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              id="lesson-order"
              label="Order"
              type="number"
              error={form.formState.errors.order?.message}
              {...form.register("order", { valueAsNumber: true })}
            />
            <FormField
              id="lesson-duration"
              label="Duration (minutes)"
              type="number"
              error={form.formState.errors.duration?.message}
              {...form.register("duration", { valueAsNumber: true })}
            />
          </div>
          <FormField
            id="lesson-video-url"
            label="Video URL"
            type="url"
            error={form.formState.errors.videoUrl?.message}
            {...form.register("videoUrl")}
          />
          <MediaUploadField
            buttonLabel="Upload lesson video"
            description="Upload lesson media to Cloudinary and auto-fill the video URL."
            folder="ministry-of-shorthand/lesson-videos"
            target="video"
            onUploaded={(url) =>
              form.setValue("videoUrl", url, { shouldDirty: true, shouldValidate: true })
            }
          />
          <FormField
            id="lesson-pdf-url"
            label="PDF URL"
            type="url"
            error={form.formState.errors.pdfUrl?.message}
            {...form.register("pdfUrl")}
          />
          <MediaUploadField
            buttonLabel="Upload lesson PDF"
            description="Upload the handout PDF to Cloudinary and attach it to this lesson."
            folder="ministry-of-shorthand/lesson-pdfs"
            target="raw"
            onUploaded={(url) =>
              form.setValue("pdfUrl", url, { shouldDirty: true, shouldValidate: true })
            }
          />
          <label className="flex items-center gap-3 text-sm font-medium text-foreground">
            <input type="checkbox" {...form.register("isFree")} />
            Make this lesson free preview
          </label>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <LoaderCircle className="size-4 animate-spin" /> : null}
            Save lesson
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
