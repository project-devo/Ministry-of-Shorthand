import { errorResponse, successResponse } from "@/lib/api";
import { requireAdminApiSession } from "@/lib/admin-session";
import { prisma } from "@/lib/prisma";
import { announcementSchema } from "@/schemas/admin";

export const POST = async (request: Request) => {
  const { error } = await requireAdminApiSession();

  if (error) {
    return error;
  }

  try {
    const formData = await request.formData();
    const parsedBody = announcementSchema.safeParse({
      message: formData.get("message"),
      role: formData.get("role"),
    });

    if (!parsedBody.success) {
      return errorResponse(parsedBody.error.issues[0]?.message ?? "Invalid announcement data.", 400);
    }

    const users = await prisma.user.findMany({
      where:
        parsedBody.data.role === "ALL"
          ? undefined
          : {
              role: parsedBody.data.role,
            },
      select: {
        id: true,
      },
    });

    if (users.length === 0) {
      return errorResponse("No users found for this announcement target.", 404);
    }

    await prisma.notification.createMany({
      data: users.map((user) => ({
        userId: user.id,
        message: parsedBody.data.message,
      })),
    });

    return successResponse({ message: "Announcement sent." }, 201);
  } catch (errorValue: unknown) {
    const message = errorValue instanceof Error ? errorValue.message : "Unable to send announcement.";
    return errorResponse(message, 500);
  }
};
