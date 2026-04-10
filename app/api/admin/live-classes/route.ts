import { errorResponse, successResponse } from "@/lib/api";
import { requireAdminApiSession } from "@/lib/admin-session";
import { prisma } from "@/lib/prisma";
import { liveClassSchema } from "@/schemas/admin";

export const POST = async (request: Request) => {
  const { error } = await requireAdminApiSession();

  if (error) {
    return error;
  }

  try {
    const formData = await request.formData();
    const parsedBody = liveClassSchema.safeParse({
      title: formData.get("title"),
      scheduledAt: formData.get("scheduledAt"),
      meetLink: formData.get("meetLink"),
      instructorId: formData.get("instructorId"),
    });

    if (!parsedBody.success) {
      return errorResponse(parsedBody.error.issues[0]?.message ?? "Invalid live class data.", 400);
    }

    await prisma.liveClass.create({
      data: {
        title: parsedBody.data.title,
        scheduledAt: new Date(parsedBody.data.scheduledAt),
        meetLink: parsedBody.data.meetLink,
        instructorId: parsedBody.data.instructorId,
      },
    });

    return successResponse({ message: "Live class scheduled." }, 201);
  } catch (errorValue: unknown) {
    const message = errorValue instanceof Error ? errorValue.message : "Unable to schedule live class.";
    return errorResponse(message, 500);
  }
};
