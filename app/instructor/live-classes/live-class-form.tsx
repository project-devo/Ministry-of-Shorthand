"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Plus } from "lucide-react";

const liveClassSchema = z.object({
  title: z.string().min(2, "Title is required"),
  scheduledAt: z.string().min(1, "Date and time are required"),
  meetLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export function LiveClassForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof liveClassSchema>>({
    resolver: zodResolver(liveClassSchema),
    defaultValues: {
      title: "",
      scheduledAt: "",
      meetLink: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof liveClassSchema>) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("scheduledAt", new Date(values.scheduledAt).toISOString());
      if (values.meetLink) {
        formData.append("meetLink", values.meetLink);
      }

      const response = await fetch("/api/instructor/live-classes", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to schedule live class");
      }

      toast.success("Live class scheduled successfully");
      setOpen(false);
      form.reset();
      router.refresh();
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Failed to schedule live class");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="mr-2 h-4 w-4" />
        Schedule Class
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule Live Class</DialogTitle>
          <DialogDescription>
            Create a new live session for your students.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Q&A Session for Beginners" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="scheduledAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date & Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="meetLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meeting Link (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://meet.google.com/..." {...field} />
                  </FormControl>
                  <FormDescription>
                    You can add the link later.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Schedule Class"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
