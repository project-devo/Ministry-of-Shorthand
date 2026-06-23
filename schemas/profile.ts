import { z } from "zod";

export const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long.")
    .max(100, "Name must be 100 characters or fewer."),
  image: z.union([z.url("Enter a valid image URL."), z.literal("")]),
});

export const profilePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, "Current password must be at least 8 characters long."),
    newPassword: z.string().min(8, "New password must be at least 8 characters long."),
    confirmPassword: z
      .string()
      .min(8, "Confirm password must be at least 8 characters long."),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });
