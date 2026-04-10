import { errorResponse, successResponse } from "@/lib/api";
import { requireAdminApiSession } from "@/lib/admin-session";
import { prisma } from "@/lib/prisma";
import { userBanSchema } from "@/schemas/admin";

export const PATCH = async (
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) => {
  const { error, session } = await requireAdminApiSession();

  if (error || !session) {
    return error ?? errorResponse("Unauthorized.", 401);
  }

  try {
    const body = await request.json();
    const parsedBody = userBanSchema.safeParse(body);

    if (!parsedBody.success) {
      return errorResponse(parsedBody.error.issues[0]?.message ?? "Invalid ban data.", 400);
    }

    const { userId } = await params;

    if (session.user.id === userId && parsedBody.data.isBanned) {
      return errorResponse("You cannot ban your own admin account.", 400);
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isBanned: parsedBody.data.isBanned,
      },
    });

    return successResponse({ message: "User status updated." });
  } catch (errorValue: unknown) {
    const message = errorValue instanceof Error ? errorValue.message : "Unable to update user status.";
    return errorResponse(message, 500);
  }
};
