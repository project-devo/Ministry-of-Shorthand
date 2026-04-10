import { resetPasswordApiSchema } from "@/schemas/auth";
import { errorResponse, successResponse } from "@/lib/api";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { extractEmailFromIdentifier, getTokenRecord } from "@/lib/tokens";

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const parsedBody = resetPasswordApiSchema.safeParse(body);

    if (!parsedBody.success) {
      return errorResponse(parsedBody.error.issues[0]?.message ?? "Invalid request body.", 400);
    }

    const tokenRecord = await getTokenRecord({
      purpose: "reset-password",
      token: parsedBody.data.token,
    });

    if (!tokenRecord) {
      return errorResponse("This reset link is invalid or has expired.", 400);
    }

    const email = extractEmailFromIdentifier(tokenRecord.identifier);
    const hashedPassword = await hashPassword(parsedBody.data.password);

    await prisma.user.update({
      where: {
        email,
      },
      data: {
        password: hashedPassword,
      },
    });

    await prisma.verificationToken.delete({
      where: {
        token: tokenRecord.token,
      },
    });

    return successResponse({
      message: "Password updated successfully.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Password reset failed.";
    return errorResponse(message, 500);
  }
};
