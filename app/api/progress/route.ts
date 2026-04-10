import { errorResponse, successResponse } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "@/lib/session";
import { progressSchema } from "@/schemas/dashboard";

export const POST = async (request: Request) => {
  try {
    const session = await getServerAuthSession();

    if (!session?.user?.id) {
      return errorResponse("Unauthorized.", 401);
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
