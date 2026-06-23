import { errorResponse, successResponse } from "@/lib/api";
import { hashPassword, verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";
import { getServerAuthSession } from "@/lib/session";
import { profilePasswordSchema } from "@/schemas/profile";

export const PATCH = async (request: Request) => {
  try {
    const session = await getServerAuthSession();

    if (!session?.user?.id) {
      return errorResponse("Unauthorized.", 401);
    }

    const rateLimitResponse = await checkRateLimit({
      key: getRateLimitKey(request, "profile:password", session.user.id),
      limit: 10,
      windowMs: 15 * 60 * 1000,
    });

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const body = await request.json();
    const parsedBody = profilePasswordSchema.safeParse(body);

    if (!parsedBody.success) {
      return errorResponse(parsedBody.error.issues[0]?.message ?? "Invalid request body.", 400);
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        password: true,
      },
    });

    if (!user?.password) {
      return errorResponse("Password login is not configured for this account.", 400);
    }

    const isPasswordValid = await verifyPassword(
      parsedBody.data.currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      return errorResponse("Current password is incorrect.", 400);
    }

    const hashedPassword = await hashPassword(parsedBody.data.newPassword);

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    return successResponse({
      message: "Password updated successfully.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to update password.";
    return errorResponse(message, 500);
  }
};
