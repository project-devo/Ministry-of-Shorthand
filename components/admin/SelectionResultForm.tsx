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
import { selectionResultSchema } from "@/schemas/admin";

type SelectionResultFormValues = z.infer<typeof selectionResultSchema>;

export const SelectionResultForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<SelectionResultFormValues>({
    resolver: zodResolver(selectionResultSchema),
    defaultValues: {
      name: "",
      achievement: "",
      batch: "",
      quote: "",
      image: "",
      sortOrder: 1,
      isPublished: true,
    },
  });

  const onSubmit = async (values: SelectionResultFormValues) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/selections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = (await response.json()) as { success: boolean; error?: string };

      if (!response.ok || !result.success) {
        toast.error(result.error ?? "Unable to save selection result.");
        return;
      }

      toast.success("Selection result created.");
      form.reset({
        name: "",
        achievement: "",
        batch: "",
        quote: "",
        image: "",
        sortOrder: 1,
        isPublished: true,
      });
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unable to save selection result.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField id="selection-name" label="Student name" type="text" error={form.formState.errors.name?.message} {...form.register("name")} />
        <FormField id="selection-batch" label="Batch / year" type="text" error={form.formState.errors.batch?.message} {...form.register("batch")} />
      </div>
      <FormField id="selection-achievement" label="Achievement" type="text" error={form.formState.errors.achievement?.message} {...form.register("achievement")} />
      <FormField id="selection-image" label="Image URL" type="url" error={form.formState.errors.image?.message} {...form.register("image")} />
      <MediaUploadField
        buttonLabel="Upload student image"
        description="Upload an optional result photo."
        folder="ministry-of-shorthand/selections"
        target="image"
        onUploaded={(url) => form.setValue("image", url, { shouldDirty: true, shouldValidate: true })}
      />
      <div className="space-y-2">
        <label htmlFor="selection-quote" className="text-sm font-medium text-foreground">
          Quote
        </label>
        <Textarea id="selection-quote" placeholder="Optional student quote..." {...form.register("quote")} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          id="selection-sort"
          label="Sort order"
          type="number"
          error={form.formState.errors.sortOrder?.message}
          {...form.register("sortOrder", { valueAsNumber: true })}
        />
        <label className="flex items-center gap-3 self-end text-sm font-medium text-foreground">
          <input type="checkbox" {...form.register("isPublished")} />
          Publish result
        </label>
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? <LoaderCircle className="size-4 animate-spin" /> : null}
        Save selection result
      </Button>
    </form>
  );
};
