import { PrismaClient, Role, PracticeLevel } from "@prisma/client";
import { hash } from "bcryptjs";
import { existsSync, readFileSync } from "fs";
import path from "path";

const loadEnvFile = (filePath: string) => {
  if (!existsSync(filePath)) {
    return;
  }
  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match || process.env[match[1]]) {
      continue;
    }
    process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, "$2");
  }
};

loadEnvFile(path.resolve(process.cwd(), ".env.local"));
loadEnvFile(path.resolve(process.cwd(), ".env"));

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await hash("Password123!", 12);
  const now = new Date();

  // 1. Seed Student
  console.log("Seeding student...");
  await prisma.user.upsert({
    where: { email: "student@test.com" },
    update: {
      name: "E2E Student",
      password: passwordHash,
      role: Role.STUDENT,
      onboardingCompleted: true,
      emailVerified: now,
    },
    create: {
      name: "E2E Student",
      email: "student@test.com",
      password: passwordHash,
      role: Role.STUDENT,
      onboardingCompleted: true,
      emailVerified: now,
    },
  });

  // 2. Seed Admin
  console.log("Seeding admin...");
  await prisma.user.upsert({
    where: { email: "admin@test.com" },
    update: {
      name: "E2E Admin",
      password: passwordHash,
      role: Role.ADMIN,
      onboardingCompleted: true,
      emailVerified: now,
    },
    create: {
      name: "E2E Admin",
      email: "admin@test.com",
      password: passwordHash,
      role: Role.ADMIN,
      onboardingCompleted: true,
      emailVerified: now,
    },
  });

  // 3. Seed Instructor
  console.log("Seeding instructor...");
  await prisma.user.upsert({
    where: { email: "instructor@test.com" },
    update: {
      name: "E2E Instructor",
      password: passwordHash,
      role: Role.INSTRUCTOR,
      onboardingCompleted: true,
      emailVerified: now,
    },
    create: {
      name: "E2E Instructor",
      email: "instructor@test.com",
      password: passwordHash,
      role: Role.INSTRUCTOR,
      onboardingCompleted: true,
      emailVerified: now,
    },
  });

  // 4. Seed Mock Practice Test
  console.log("Seeding mock practice test...");
  await prisma.practiceTest.upsert({
    where: { id: "e2e-sample-test" },
    update: {
      title: "E2E Dictation Speed Test",
      speedWPM: 80,
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      level: PracticeLevel.BEGINNER,
      isFree: true,
      transcript: "This is a mock sample transcript for the E2E dictation speed test. Please type these words exactly as they are written.",
    },
    create: {
      id: "e2e-sample-test",
      title: "E2E Dictation Speed Test",
      speedWPM: 80,
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      level: PracticeLevel.BEGINNER,
      isFree: true,
      transcript: "This is a mock sample transcript for the E2E dictation speed test. Please type these words exactly as they are written.",
    },
  });

  console.log("Database seeded successfully for E2E tests!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
