import { forgotPasswordSchema } from "@/schemas/auth";
import { errorResponse, successResponse } from "@/lib/api";
import { sendPasswordResetEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";
import { createToken } from "@/lib/tokens";

export const POST = async (request: Request) => {
  try {
    const rateLimitResponse = await checkRateLimit({
      key: getRateLimitKey(request, "auth:forgot-password"),
      limit: 5,
      windowMs: 15 * 60 * 1000,
    });

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const body = await request.json();
    const parsedBody = forgotPasswordSchema.safeParse(body);

    if (!parsedBody.success) {
      return errorResponse(parsedBody.error.issues[0]?.message ?? "Invalid request body.", 400);
    }

    const email = parsedBody.data.email.toLowerCase();
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        email: true,
      },
    });

    if (user) {
      const resetToken = await createToken({
        email: user.email,
        expiresInHours: 2,
        purpose: "reset-password",
      });

      await sendPasswordResetEmail({
        email: user.email,
        token: resetToken.token,
      });
    }

    return successResponse({
      message: "If the email exists, a reset link has been sent.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to process request.";
    return errorResponse(message, 500);
  }
};
