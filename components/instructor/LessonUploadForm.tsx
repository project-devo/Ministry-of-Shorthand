"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FormField } from "@/components/auth/FormField";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { lessonSchema } from "@/schemas/admin";

const uploadLessonSchema = lessonSchema.pick({
  title: true,
  order: true,
  videoUrl: true,
  duration: true,
  isFree: true,
  pdfUrl: true,
  sectionId: true,
});

type UploadLessonValues = z.infer<typeof uploadLessonSchema>;

type UploadCourse = {
  id: string;
  title: string;
  sections: Array<{
    id: string;
    title: string;
    order: number;
    _count: {
      lessons: number;
    };
  }>;
};

export const LessonUploadForm = ({ courses }: { courses: UploadCourse[] }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<UploadLessonValues>({
    resolver: zodResolver(uploadLessonSchema),
    defaultValues: {
      title: "",
      order: 1,
      videoUrl: "",
      duration: 10,
      isFree: false,
      pdfUrl: "",
      sectionId: courses[0]?.sections[0]?.id ?? "",
    },
  });

  const selectedSectionId = form.watch("sectionId");

  const sectionOptions = useMemo(
    () =>
      courses.flatMap((course) =>
        course.sections.map((section) => ({
          courseTitle: course.title,
          id: section.id,
          label: `Section ${section.order}: ${section.title}`,
          nextOrder: section._count.lessons + 1,
        })),
      ),
    [courses],
  );

  const selectedSection = sectionOptions.find((section) => section.id === selectedSectionId);

  const onSubmit = async (values: UploadLessonValues) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/instructor/lessons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = (await response.json()) as { success: boolean; error?: string };

      if (!response.ok || !result.success) {
        toast.error(result.error ?? "Unable to create lesson.");
        return;
      }

      toast.success("Lesson uploaded.");
      form.reset({
        title: "",
        order: selectedSection?.nextOrder ?? 1,
        videoUrl: "",
        duration: 10,
        isFree: false,
        pdfUrl: "",
        sectionId: values.sectionId,
      });
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unable to create lesson.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      <FormField
        id="lesson-upload-title"
        label="Lesson title"
        type="text"
        error={form.formState.errors.title?.message}
        {...form.register("title")}
      />

      <div className="space-y-2">
        <Label htmlFor="lesson-upload-section">Course section</Label>
        <select
          id="lesson-upload-section"
          className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm"
          {...form.register("sectionId", {
            onChange: (event) => {
              const nextSection = sectionOptions.find((section) => section.id === event.target.value);
              if (nextSection) {
                form.setValue("order", nextSection.nextOrder, { shouldDirty: true });
              }
            },
          })}
        >
          {sectionOptions.map((section) => (
            <option key={section.id} value={section.id}>
              {section.courseTitle} | {section.label}
            </option>
          ))}
        </select>
        {form.formState.errors.sectionId?.message ? (
          <p className="text-sm text-destructive">{form.formState.errors.sectionId.message}</p>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          id="lesson-upload-order"
          label="Lesson order"
          type="number"
          error={form.formState.errors.order?.message}
          {...form.register("order", { valueAsNumber: true })}
        />
        <FormField
          id="lesson-upload-duration"
          label="Duration (minutes)"
          type="number"
          error={form.formState.errors.duration?.message}
          {...form.register("duration", { valueAsNumber: true })}
        />
      </div>

      <FormField
        id="lesson-upload-video-url"
        label="Video URL"
        type="url"
        error={form.formState.errors.videoUrl?.message}
        {...form.register("videoUrl")}
      />
      <MediaUploadField
        buttonLabel="Upload lesson video"
        description="Upload lesson media to Cloudinary and auto-fill the video URL."
        endpoint="/api/instructor/uploads"
        folder="ministry-of-shorthand/lesson-videos"
        target="video"
        onUploaded={(url) => form.setValue("videoUrl", url, { shouldDirty: true, shouldValidate: true })}
      />

      <FormField
        id="lesson-upload-pdf-url"
        label="PDF URL"
        type="url"
        error={form.formState.errors.pdfUrl?.message}
        {...form.register("pdfUrl")}
      />
      <MediaUploadField
        buttonLabel="Upload lesson PDF"
        description="Upload a companion PDF and auto-fill the resource URL."
        endpoint="/api/instructor/uploads"
        folder="ministry-of-shorthand/lesson-pdfs"
        target="raw"
        onUploaded={(url) => form.setValue("pdfUrl", url, { shouldDirty: true, shouldValidate: true })}
      />

      <label className="flex items-center gap-3 text-sm font-medium text-foreground">
        <input type="checkbox" {...form.register("isFree")} />
        Make this lesson a free preview
      </label>

      <Button type="submit" disabled={isLoading || sectionOptions.length === 0}>
        {isLoading ? <LoaderCircle className="size-4 animate-spin" /> : null}
        Upload lesson
      </Button>
    </form>
  );
};
