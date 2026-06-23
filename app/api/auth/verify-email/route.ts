import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extractEmailFromIdentifier, getTokenRecord } from "@/lib/tokens";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/login?verified=missing", request.url));
  }

  const tokenRecord = await getTokenRecord({
    purpose: "verify-email",
    token,
  });

  if (!tokenRecord) {
    return NextResponse.redirect(new URL("/login?verified=invalid", request.url));
  }

  const email = extractEmailFromIdentifier(tokenRecord.identifier);

  await prisma.user.update({
    where: {
      email,
    },
    data: {
      emailVerified: new Date(),
    },
  });

  await prisma.verificationToken.delete({
    where: {
      token: tokenRecord.token,
    },
  });

  return NextResponse.redirect(new URL("/login?verified=success", request.url));
};
