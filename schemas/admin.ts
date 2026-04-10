import { z } from "zod";

export const courseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters long.")
    .regex(/^[a-z0-9-]+$/, "Slug must contain lowercase letters, numbers, and hyphens only."),
  description: z.string().min(20, "Description must be at least 20 characters long."),
  thumbnail: z.url("Thumbnail must be a valid URL."),
  price: z.number().min(0, "Price cannot be negative."),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  instructorId: z.string().min(1, "Instructor is required."),
  isPublished: z.boolean(),
});

export const sectionSchema = z.object({
  title: z.string().min(2, "Section title is required."),
  order: z.number().int().min(1, "Section order must be at least 1."),
  courseId: z.string().min(1, "Course is required."),
});

export const lessonSchema = z.object({
  title: z.string().min(2, "Lesson title is required."),
  order: z.number().int().min(1, "Lesson order must be at least 1."),
  videoUrl: z.url("Video URL must be valid."),
  duration: z.number().int().min(1, "Duration must be at least 1 minute."),
  isFree: z.boolean(),
  pdfUrl: z.union([z.url("PDF URL must be valid."), z.literal("")]),
  sectionId: z.string().min(1, "Section is required."),
});

export const userRoleSchema = z.object({
  userId: z.string().min(1, "User ID is required."),
  role: z.enum(["STUDENT", "INSTRUCTOR", "ADMIN"]),
});

export const userBanSchema = z.object({
  userId: z.string().min(1, "User ID is required."),
  isBanned: z.boolean(),
});

export const practiceTestSchema = z.object({
  title: z.string().min(3, "Test title must be at least 3 characters long."),
  speedWPM: z.number().int().min(20, "Speed must be at least 20 WPM."),
  audioUrl: z.url("Audio URL must be valid."),
  transcript: z.string().min(20, "Transcript must be at least 20 characters long."),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  isFree: z.boolean(),
});

export const liveClassSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  scheduledAt: z.string().min(1, "Schedule date is required."),
  meetLink: z.url("Meet link must be valid."),
  instructorId: z.string().min(1, "Instructor is required."),
});

export const announcementSchema = z.object({
  message: z.string().min(5, "Announcement message must be at least 5 characters long."),
  role: z.enum(["ALL", "STUDENT", "INSTRUCTOR", "ADMIN"]),
});

export const inquirySchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.email("Email must be valid."),
  phone: z.string().min(8, "Phone number is required."),
  interest: z.string().min(2, "Interest is required."),
  message: z.string().min(10, "Message must be at least 10 characters long."),
});

export const selectionResultSchema = z.object({
  name: z.string().min(2, "Student name is required."),
  achievement: z.string().min(3, "Achievement is required."),
  batch: z.string().min(2, "Batch is required."),
  quote: z.string().optional(),
  image: z.union([z.url("Image URL must be valid."), z.literal("")]),
  sortOrder: z.number().int().min(1, "Sort order must be at least 1."),
  isPublished: z.boolean(),
});
