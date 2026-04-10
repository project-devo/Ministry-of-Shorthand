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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { courseSchema } from "@/schemas/admin";

type CourseFormValues = z.infer<typeof courseSchema>;

export const CourseForm = ({
  course,
  instructors,
  mode,
}: {
  course?: Partial<CourseFormValues> & { id?: string };
  instructors: Array<{ id: string; name: string; role: string }>;
  mode: "create" | "edit";
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: course?.title ?? "",
      slug: course?.slug ?? "",
      description: course?.description ?? "",
      thumbnail: course?.thumbnail ?? "",
      price: course?.price ?? 0,
      level: course?.level ?? "BEGINNER",
      instructorId: course?.instructorId ?? instructors[0]?.id ?? "",
      isPublished: course?.isPublished ?? false,
    },
  });

  const onSubmit = async (values: CourseFormValues) => {
    try {
      setIsLoading(true);
      const endpoint =
        mode === "create" ? "/api/admin/courses" : `/api/admin/courses/${course?.id}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = (await response.json()) as { success: boolean; error?: string };

      if (!response.ok || !result.success) {
        toast.error(result.error ?? "Unable to save course.");
        return;
      }

      toast.success(mode === "create" ? "Course created." : "Course updated.");
      router.push("/admin/courses");
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unable to save course.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === "create" ? "Create course" : "Edit course"}</CardTitle>
        <CardDescription>Manage course details, price, instructor, and publish state.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            id="course-title"
            label="Title"
            type="text"
            placeholder="Pitman Shorthand Foundation"
            error={form.formState.errors.title?.message}
            {...form.register("title")}
          />
          <FormField
            id="course-slug"
            label="Slug"
            type="text"
            placeholder="pitman-shorthand-foundation"
            error={form.formState.errors.slug?.message}
            {...form.register("slug")}
          />
          <div className="space-y-2">
            <Label htmlFor="course-description">Description</Label>
            <Textarea
              id="course-description"
              placeholder="Write a detailed course description..."
              {...form.register("description")}
            />
            {form.formState.errors.description?.message ? (
              <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
            ) : null}
          </div>
          <FormField
            id="course-thumbnail"
            label="Thumbnail URL"
            type="url"
            placeholder="https://..."
            error={form.formState.errors.thumbnail?.message}
            {...form.register("thumbnail")}
          />
          <MediaUploadField
            buttonLabel="Upload thumbnail"
            description="Upload a course cover image to Cloudinary and auto-fill the thumbnail URL."
            folder="ministry-of-shorthand/course-thumbnails"
            target="image"
            onUploaded={(url) =>
              form.setValue("thumbnail", url, { shouldDirty: true, shouldValidate: true })
            }
          />
          <FormField
            id="course-price"
            label="Price"
            type="number"
            error={form.formState.errors.price?.message}
            {...form.register("price", { valueAsNumber: true })}
          />
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="course-level">Level</Label>
              <select
                id="course-level"
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm"
                {...form.register("level")}
              >
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="course-instructor">Instructor</Label>
              <select
                id="course-instructor"
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm"
                {...form.register("instructorId")}
              >
                {instructors.map((instructor) => (
                  <option key={instructor.id} value={instructor.id}>
                    {instructor.name} ({instructor.role})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <label className="flex items-center gap-3 text-sm font-medium text-foreground">
            <input type="checkbox" {...form.register("isPublished")} />
            Publish this course
          </label>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <LoaderCircle className="size-4 animate-spin" /> : null}
            {mode === "create" ? "Create course" : "Save changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
