import { errorResponse, successResponse } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";
import { getServerAuthSession } from "@/lib/session";
import { onboardingSchema } from "@/schemas/profile";

export const POST = async (request: Request) => {
  try {
    const session = await getServerAuthSession();

    if (!session?.user?.id) {
      return errorResponse("Unauthorized.", 401);
    }

    const rateLimitResponse = await checkRateLimit({
      key: getRateLimitKey(request, "profile:onboarding", session.user.id),
      limit: 10,
      windowMs: 10 * 60 * 1000,
    });

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const body = await request.json();
    const parsedBody = onboardingSchema.safeParse(body);

    if (!parsedBody.success) {
      return errorResponse(parsedBody.error.issues[0]?.message ?? "Invalid request body.", 400);
    }

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        shorthandLevel: parsedBody.data.shorthandLevel,
        examTarget: parsedBody.data.examTarget,
        preferredSpeed: parsedBody.data.preferredSpeed,
        onboardingCompleted: true,
      },
    });

    return successResponse({
      message: "Onboarding completed successfully.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to save onboarding data.";
    return errorResponse(message, 500);
  }
};
