import { z } from "zod";

export const createOrderSchema = z
  .object({
    type: z.enum(["COURSE", "SUBSCRIPTION"]),
    courseId: z.string().optional(),
    plan: z.enum(["MONTHLY", "ANNUAL"]).optional(),
  })
  .superRefine((value, ctx) => {
    if (value.type === "COURSE" && !value.courseId) {
      ctx.addIssue({
        code: "custom",
        message: "Course ID is required for course payments.",
        path: ["courseId"],
      });
    }

    if (value.type === "SUBSCRIPTION" && !value.plan) {
      ctx.addIssue({
        code: "custom",
        message: "Subscription plan is required.",
        path: ["plan"],
      });
    }
  });

export const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1, "Order ID is required."),
  razorpay_payment_id: z.string().min(1, "Payment ID is required."),
  razorpay_signature: z.string().min(1, "Payment signature is required."),
});

export const freeEnrollmentSchema = z.object({
  courseId: z.string().min(1, "Course ID is required."),
});
