import { errorResponse, successResponse } from "@/lib/api";
import { sendVerificationEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";
import { createToken } from "@/lib/tokens";

export const POST = async (request: Request) => {
  try {
    const rateLimitResponse = await checkRateLimit({
      key: getRateLimitKey(request, "auth:resend"),
      limit: 3,
      windowMs: 15 * 60 * 1000,
    });

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const body = await request.json();
    const email = body.email?.toLowerCase();

    if (!email) {
      return errorResponse("Email is required.", 400);
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
      },
    });

    if (!user) {
      // Don't reveal user existence
      return successResponse({ message: "Verification email sent if account exists." }, 200);
    }

    if (user.emailVerified) {
      return errorResponse("Email is already verified.", 400);
    }

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
        message: "Verification email sent.",
      },
      200,
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to resend verification.";
    return errorResponse(message, 500);
  }
};
