import { errorResponse, successResponse } from "@/lib/api";
import { requireAdminApiSession } from "@/lib/admin-session";
import { prisma } from "@/lib/prisma";
import { userRoleSchema } from "@/schemas/admin";

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
    const parsedBody = userRoleSchema.safeParse(body);

    if (!parsedBody.success) {
      return errorResponse(parsedBody.error.issues[0]?.message ?? "Invalid role data.", 400);
    }

    const { userId } = await params;

    if (session.user.id === userId && parsedBody.data.role !== "ADMIN") {
      return errorResponse("You cannot remove your own admin access.", 400);
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role: parsedBody.data.role,
      },
    });

    return successResponse({ message: "User role updated." });
  } catch (errorValue: unknown) {
    const message = errorValue instanceof Error ? errorValue.message : "Unable to update role.";
    return errorResponse(message, 500);
  }
};
