import { errorResponse, successResponse } from "@/lib/api";
import { requireAdminApiSession } from "@/lib/admin-session";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";
import { announcementSchema } from "@/schemas/admin";

const NOTIFICATION_BATCH_SIZE = 500;

export const POST = async (request: Request) => {
  const { error, session } = await requireAdminApiSession();

  if (error) {
    return error;
  }

  try {
    const rateLimitResponse = await checkRateLimit({
      key: getRateLimitKey(request, "admin:notifications", session?.user.id),
      limit: 10,
      windowMs: 10 * 60 * 1000,
    });

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const formData = await request.formData();
    const parsedBody = announcementSchema.safeParse({
      message: formData.get("message"),
      role: formData.get("role"),
    });

    if (!parsedBody.success) {
      return errorResponse(parsedBody.error.issues[0]?.message ?? "Invalid announcement data.", 400);
    }

    const where =
      parsedBody.data.role === "ALL"
        ? undefined
        : {
            role: parsedBody.data.role,
          };
    let cursor: string | undefined;
    let deliveredCount = 0;

    do {
      const users = await prisma.user.findMany({
        where,
        orderBy: {
          id: "asc",
        },
        select: {
          id: true,
        },
        take: NOTIFICATION_BATCH_SIZE,
        ...(cursor
          ? {
              cursor: {
                id: cursor,
              },
              skip: 1,
            }
          : {}),
      });

      if (users.length === 0) {
        break;
      }

      await prisma.notification.createMany({
        data: users.map((user) => ({
          userId: user.id,
          message: parsedBody.data.message,
        })),
      });

      deliveredCount += users.length;
      cursor = users.at(-1)?.id;
    } while (cursor);

    if (deliveredCount === 0) {
      return errorResponse("No users found for this announcement target.", 404);
    }

    return successResponse(
      {
        message: "Announcement sent.",
        deliveredCount,
        batchSize: NOTIFICATION_BATCH_SIZE,
      },
      201,
    );
  } catch (errorValue: unknown) {
    const message = errorValue instanceof Error ? errorValue.message : "Unable to send announcement.";
    return errorResponse(message, 500);
  }
};
