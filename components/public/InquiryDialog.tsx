"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FormField } from "@/components/auth/FormField";
import { buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { inquirySchema } from "@/schemas/admin";
import { cn } from "@/lib/utils";

type InquiryFormValues = z.infer<typeof inquirySchema>;

export const InquiryDialog = ({
  buttonLabel = "Inquiry",
  className,
}: {
  buttonLabel?: string;
  className?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      interest: "",
      message: "",
    },
  });

  const onSubmit = async (values: InquiryFormValues) => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = (await response.json()) as { success: boolean; error?: string };

      if (!response.ok || !result.success) {
        toast.error(result.error ?? "Unable to submit inquiry.");
        return;
      }

      toast.success("Inquiry submitted. We will contact you soon.");
      form.reset();
      setIsOpen(false);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unable to submit inquiry.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className={cn(buttonVariants({ variant: "outline" }), className)}
        onClick={() => setIsOpen(true)}
      >
        {buttonLabel}
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8">
          <div className="w-full max-w-xl rounded-[2rem] border border-border/70 bg-background p-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                  Inquiry
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-foreground">
                  Talk to our team
                </h2>
              </div>
              <button
                type="button"
                className="rounded-full border border-border/70 p-2 text-muted-foreground hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                <X className="size-4" />
              </button>
            </div>

            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  id="inquiry-name"
                  label="Name"
                  type="text"
                  error={form.formState.errors.name?.message}
                  {...form.register("name")}
                />
                <FormField
                  id="inquiry-phone"
                  label="Phone"
                  type="tel"
                  error={form.formState.errors.phone?.message}
                  {...form.register("phone")}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  id="inquiry-email"
                  label="Email"
                  type="email"
                  error={form.formState.errors.email?.message}
                  {...form.register("email")}
                />
                <FormField
                  id="inquiry-interest"
                  label="Interest"
                  type="text"
                  error={form.formState.errors.interest?.message}
                  {...form.register("interest")}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="inquiry-message" className="text-sm font-medium text-foreground">
                  Message
                </label>
                <Textarea
                  id="inquiry-message"
                  className="min-h-32"
                  placeholder="Tell us what course, exam, or dictation support you need..."
                  {...form.register("message")}
                />
                {form.formState.errors.message?.message ? (
                  <p className="text-sm text-destructive">{form.formState.errors.message.message}</p>
                ) : null}
              </div>
              <button
                type="submit"
                className={cn(buttonVariants(), "w-full")}
                disabled={isSubmitting}
              >
                {isSubmitting ? <LoaderCircle className="size-4 animate-spin" /> : null}
                Submit inquiry
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
};
