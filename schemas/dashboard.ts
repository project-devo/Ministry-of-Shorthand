import { z } from "zod";

export const progressSchema = z.object({
  lessonId: z.string().min(1, "Lesson ID is required."),
  completed: z.boolean(),
});

export const testAttemptSchema = z.object({
  testId: z.string().min(1, "Test ID is required."),
  responseText: z.string().min(10, "Please type enough of the dictation before submitting."),
  timeTaken: z.number().min(0),
});

export const markNotificationReadSchema = z.object({
  notificationId: z.string().min(1, "Notification ID is required."),
});
