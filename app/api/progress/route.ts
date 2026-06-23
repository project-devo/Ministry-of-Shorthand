import { errorResponse, successResponse } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";
import { getServerAuthSession } from "@/lib/session";
import { progressSchema } from "@/schemas/dashboard";

export const POST = async (request: Request) => {
  try {
    const session = await getServerAuthSession();

    if (!session?.user?.id) {
      return errorResponse("Unauthorized.", 401);
    }

    const rateLimitResponse = await checkRateLimit({
      key: getRateLimitKey(request, "progress:update", session.user.id),
      limit: 120,
      windowMs: 10 * 60 * 1000,
    });

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const body = await request.json();
    const parsedBody = progressSchema.safeParse(body);

    if (!parsedBody.success) {
      return errorResponse(parsedBody.error.issues[0]?.message ?? "Invalid request body.", 400);
    }

    await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId: parsedBody.data.lessonId,
        },
      },
      update: {
        completed: parsedBody.data.completed,
      },
      create: {
        userId: session.user.id,
        lessonId: parsedBody.data.lessonId,
        completed: parsedBody.data.completed,
      },
    });

    return successResponse({
      message: "Progress updated successfully.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to update progress.";
    return errorResponse(message, 500);
  }
};
