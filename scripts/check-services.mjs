import { PrismaClient } from "@prisma/client";
import { Redis } from "@upstash/redis";
import { v2 as cloudinary } from "cloudinary";
import { existsSync, readFileSync } from "node:fs";
import { Resend } from "resend";

const loadEnvFile = (path) => {
  if (!existsSync(path)) {
    return;
  }

  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);

    if (!match || process.env[match[1]]) {
      continue;
    }

    process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, "$2");
  }
};

loadEnvFile(".env.local");
loadEnvFile(".env");

const results = [];
const check = async (name, action) => {
  try {
    await action();
    results.push({ name, status: "READY" });
  } catch (error) {
    results.push({
      name,
      status: "FAILED",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const prisma = new PrismaClient();

await check("Neon PostgreSQL", async () => {
  await prisma.$queryRaw`SELECT 1`;
});

await check("Upstash Redis", async () => {
  await Redis.fromEnv().ping();
});

await check("Cloudinary", async () => {
  if (process.env.CLOUDINARY_URL) {
    cloudinary.config(process.env.CLOUDINARY_URL);
  } else {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }

  await cloudinary.api.ping();
});

const serviceTestEmail = process.env.SERVICE_TEST_EMAIL?.trim();

if (serviceTestEmail) {
  await check("Resend email", async () => {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: serviceTestEmail,
      subject: "Ministry of Shorthand backend verification",
      html: "<p>Your Resend backend integration is working.</p>",
    });

    if (result.error) {
      throw new Error(result.error.message);
    }
  });
} else {
  results.push({ name: "Resend email", status: "SKIPPED (SERVICE_TEST_EMAIL not set)" });
}

await prisma.$disconnect();

for (const result of results) {
  console.log(`${result.status}  ${result.name}${result.message ? `: ${result.message}` : ""}`);
}

if (results.some((result) => result.status === "FAILED")) {
  process.exitCode = 1;
}
