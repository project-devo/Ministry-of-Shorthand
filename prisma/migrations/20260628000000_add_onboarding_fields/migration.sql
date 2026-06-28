-- AlterTable
ALTER TABLE "User" ADD COLUMN "shorthandLevel" "PracticeLevel",
ADD COLUMN "examTarget" TEXT,
ADD COLUMN "preferredSpeed" INTEGER,
ADD COLUMN "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false;
