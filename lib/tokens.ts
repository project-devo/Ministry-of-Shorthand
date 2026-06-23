import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";

const buildTokenIdentifier = (purpose: "verify-email" | "reset-password", email: string) => {
  return `${purpose}:${email.toLowerCase()}`;
};

export const createToken = async ({
  email,
  expiresInHours,
  purpose,
}: {
  email: string;
  expiresInHours: number;
  purpose: "verify-email" | "reset-password";
}) => {
  const identifier = buildTokenIdentifier(purpose, email);
  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);

  await prisma.verificationToken.deleteMany({
    where: {
      identifier,
    },
  });

  return prisma.verificationToken.create({
    data: {
      identifier,
      token,
      expires,
    },
  });
};

export const getTokenRecord = async ({
  purpose,
  token,
}: {
  purpose: "verify-email" | "reset-password";
  token: string;
}) => {
  const record = await prisma.verificationToken.findUnique({
    where: {
      token,
    },
  });

  if (!record) {
    return null;
  }

  if (!record.identifier.startsWith(`${purpose}:`)) {
    return null;
  }

  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({
      where: {
        token,
      },
    });

    return null;
  }

  return record;
};

export const extractEmailFromIdentifier = (identifier: string) => {
  const [, email] = identifier.split(":");
  return email;
};
