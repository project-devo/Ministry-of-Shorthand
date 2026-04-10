import { Role } from "@prisma/client";
import { registerSchema } from "@/schemas/auth";
import { errorResponse, successResponse } from "@/lib/api";
import { sendVerificationEmail } from "@/lib/email";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { createToken } from "@/lib/tokens";

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const parsedBody = registerSchema.safeParse(body);

    if (!parsedBody.success) {
      return errorResponse(parsedBody.error.issues[0]?.message ?? "Invalid request body.", 400);
    }

    const email = parsedBody.data.email.toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });

    if (existingUser) {
      return errorResponse("An account with this email already exists.", 409);
    }

    const hashedPassword = await hashPassword(parsedBody.data.password);

    const user = await prisma.user.create({
      data: {
        name: parsedBody.data.name,
        email,
        password: hashedPassword,
        role: Role.STUDENT,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    const verificationToken = await createToken({
      email: user.email,
      expiresInHours: 24,
      purpose: "verify-email",
    });

    await sendVerificationEmail({
      email: user.email,
      token: verificationToken.token,
      name: user.name,
    });

    return successResponse(
      {
        message: "Registration successful. Verification email sent.",
      },
      201,
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Registration failed.";
    return errorResponse(message, 500);
  }
};
