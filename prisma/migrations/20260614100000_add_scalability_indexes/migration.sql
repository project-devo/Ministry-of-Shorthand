CREATE INDEX IF NOT EXISTS "User_role_isBanned_idx" ON "User"("role", "isBanned");
CREATE INDEX IF NOT EXISTS "User_createdAt_idx" ON "User"("createdAt");

CREATE INDEX IF NOT EXISTS "Session_userId_idx" ON "Session"("userId");
CREATE INDEX IF NOT EXISTS "Session_expires_idx" ON "Session"("expires");

CREATE INDEX IF NOT EXISTS "VerificationToken_expires_idx" ON "VerificationToken"("expires");

CREATE INDEX IF NOT EXISTS "Course_isPublished_createdAt_idx" ON "Course"("isPublished", "createdAt");
CREATE INDEX IF NOT EXISTS "Course_isPublished_level_createdAt_idx" ON "Course"("isPublished", "level", "createdAt");

CREATE INDEX IF NOT EXISTS "Enrollment_userId_createdAt_idx" ON "Enrollment"("userId", "createdAt");

CREATE INDEX IF NOT EXISTS "LessonProgress_userId_completed_idx" ON "LessonProgress"("userId", "completed");

CREATE INDEX IF NOT EXISTS "PracticeTest_level_speedWPM_idx" ON "PracticeTest"("level", "speedWPM");
CREATE INDEX IF NOT EXISTS "PracticeTest_isFree_level_speedWPM_idx" ON "PracticeTest"("isFree", "level", "speedWPM");
CREATE INDEX IF NOT EXISTS "PracticeTest_createdAt_idx" ON "PracticeTest"("createdAt");

CREATE INDEX IF NOT EXISTS "TestAttempt_userId_createdAt_idx" ON "TestAttempt"("userId", "createdAt");

CREATE INDEX IF NOT EXISTS "LiveClass_scheduledAt_idx" ON "LiveClass"("scheduledAt");
CREATE INDEX IF NOT EXISTS "LiveClass_instructorId_scheduledAt_idx" ON "LiveClass"("instructorId", "scheduledAt");

CREATE INDEX IF NOT EXISTS "Subscription_userId_status_endDate_idx" ON "Subscription"("userId", "status", "endDate");
CREATE INDEX IF NOT EXISTS "Subscription_status_endDate_idx" ON "Subscription"("status", "endDate");

CREATE INDEX IF NOT EXISTS "Payment_userId_createdAt_idx" ON "Payment"("userId", "createdAt");
CREATE INDEX IF NOT EXISTS "Payment_status_createdAt_idx" ON "Payment"("status", "createdAt");

CREATE INDEX IF NOT EXISTS "Notification_userId_createdAt_idx" ON "Notification"("userId", "createdAt");

CREATE INDEX IF NOT EXISTS "Inquiry_createdAt_idx" ON "Inquiry"("createdAt");
