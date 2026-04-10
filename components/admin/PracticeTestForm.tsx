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
import { Textarea } from "@/components/ui/textarea";
import { practiceTestSchema } from "@/schemas/admin";

type PracticeTestFormValues = z.infer<typeof practiceTestSchema>;

export const PracticeTestForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<PracticeTestFormValues>({
    resolver: zodResolver(practiceTestSchema),
    defaultValues: {
      title: "",
      speedWPM: 80,
      audioUrl: "",
      transcript: "",
      level: "BEGINNER",
      isFree: false,
    },
  });

  const onSubmit = async (values: PracticeTestFormValues) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = (await response.json()) as { success: boolean; error?: string };
      if (!response.ok || !result.success) {
        toast.error(result.error ?? "Unable to create practice test.");
        return;
      }

      toast.success("Practice test created.");
      form.reset();
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unable to create practice test.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="grid gap-4 md:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
      <FormField id="test-title" label="Title" type="text" error={form.formState.errors.title?.message} {...form.register("title")} />
      <FormField
        id="test-speed"
        label="Speed WPM"
        type="number"
        error={form.formState.errors.speedWPM?.message}
        {...form.register("speedWPM", { valueAsNumber: true })}
      />
      <div className="space-y-4 md:col-span-2">
        <FormField
          id="test-audio"
          label="Audio URL"
          type="url"
          error={form.formState.errors.audioUrl?.message}
          {...form.register("audioUrl")}
        />
        <MediaUploadField
          buttonLabel="Upload test audio"
          description="Upload dictation audio to Cloudinary and auto-fill the audio URL."
          folder="ministry-of-shorthand/test-audio"
          target="audio"
          onUploaded={(url) =>
            form.setValue("audioUrl", url, { shouldDirty: true, shouldValidate: true })
          }
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground" htmlFor="test-level">
          Level
        </label>
        <select
          id="test-level"
          className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm"
          {...form.register("level")}
        >
          <option value="BEGINNER">Beginner</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="ADVANCED">Advanced</option>
        </select>
      </div>
      <div className="space-y-2 md:col-span-2">
        <label htmlFor="test-transcript" className="text-sm font-medium text-foreground">
          Reference transcript
        </label>
        <Textarea
          id="test-transcript"
          className="min-h-40"
          placeholder="Paste the full reference transcript used to evaluate student dictation accuracy."
          {...form.register("transcript")}
        />
        {form.formState.errors.transcript?.message ? (
          <p className="text-sm text-destructive">{form.formState.errors.transcript.message}</p>
        ) : null}
      </div>
      <label className="flex items-center gap-3 text-sm font-medium text-foreground md:col-span-2">
        <input type="checkbox" {...form.register("isFree")} />
        Make this a free dictation
      </label>
      <div className="md:col-span-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <LoaderCircle className="size-4 animate-spin" /> : null}
          Create test
        </Button>
      </div>
    </form>
  );
};
