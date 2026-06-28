import { errorResponse, successResponse } from "@/lib/api";
import { getStudentNotifications } from "@/lib/dashboard";
import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "@/lib/session";

export const GET = async (request: Request) => {
  try {
    const session = await getServerAuthSession();

    if (!session?.user?.id) {
      return errorResponse("Unauthorized.", 401);
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") ?? undefined;
    const pageSize = searchParams.get("pageSize") ?? undefined;

    const [notifications, unreadCount] = await Promise.all([
      getStudentNotifications(session.user.id, { page, pageSize }),
      prisma.notification.count({
        where: {
          userId: session.user.id,
          isRead: false,
        },
      }),
    ]);

    return successResponse({ notifications, unreadCount });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to fetch notifications.";
    return errorResponse(message, 500);
  }
};
