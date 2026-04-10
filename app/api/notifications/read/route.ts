import { errorResponse, successResponse } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "@/lib/session";
import { markNotificationReadSchema } from "@/schemas/dashboard";

export const POST = async (request: Request) => {
  try {
    const session = await getServerAuthSession();

    if (!session?.user?.id) {
      return errorResponse("Unauthorized.", 401);
    }

    const body = await request.json();
    const parsedBody = markNotificationReadSchema.safeParse(body);

    if (!parsedBody.success) {
      return errorResponse(parsedBody.error.issues[0]?.message ?? "Invalid request body.", 400);
    }

    await prisma.notification.updateMany({
      where: {
        id: parsedBody.data.notificationId,
        userId: session.user.id,
      },
      data: {
        isRead: true,
      },
    });

    return successResponse({
      message: "Notification marked as read.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to update notification.";
    return errorResponse(message, 500);
  }
};
