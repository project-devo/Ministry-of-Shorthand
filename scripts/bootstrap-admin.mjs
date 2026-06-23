import { PrismaClient, Role } from "@prisma/client";
import { hash } from "bcryptjs";
import { existsSync, readFileSync } from "node:fs";

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

const name = process.env.ADMIN_NAME?.trim();
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;

if (!name || !email || !password) {
  throw new Error("ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD are required.");
}

if (password.length < 12) {
  throw new Error("ADMIN_PASSWORD must contain at least 12 characters.");
}

const prisma = new PrismaClient();

try {
  const passwordHash = await hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: {
      name,
      password: passwordHash,
      role: Role.ADMIN,
      isBanned: false,
      emailVerified: new Date(),
    },
    create: {
      name,
      email,
      password: passwordHash,
      role: Role.ADMIN,
      emailVerified: new Date(),
    },
  });

  console.log("Administrator account is ready.");
} finally {
  await prisma.$disconnect();
}
