import { errorResponse, successResponse } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "@/lib/session";
import { profileSchema } from "@/schemas/profile";

export const PATCH = async (request: Request) => {
  try {
    const session = await getServerAuthSession();

    if (!session?.user?.id) {
      return errorResponse("Unauthorized.", 401);
    }

    const body = await request.json();
    const parsedBody = profileSchema.safeParse(body);

    if (!parsedBody.success) {
      return errorResponse(parsedBody.error.issues[0]?.message ?? "Invalid request body.", 400);
    }

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: parsedBody.data.name,
        image: parsedBody.data.image || null,
      },
    });

    return successResponse({
      message: "Profile updated successfully.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to update profile.";
    return errorResponse(message, 500);
  }
};
