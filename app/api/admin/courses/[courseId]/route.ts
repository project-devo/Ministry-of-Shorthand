import { errorResponse, successResponse } from "@/lib/api";
import { requireAdminApiSession } from "@/lib/admin-session";
import { prisma } from "@/lib/prisma";
import { courseSchema } from "@/schemas/admin";

export const PATCH = async (
  request: Request,
  { params }: { params: Promise<{ courseId: string }> },
) => {
  const { error } = await requireAdminApiSession();

  if (error) {
    return error;
  }

  try {
    const body = await request.json();
    const parsedBody = courseSchema.safeParse(body);

    if (!parsedBody.success) {
      return errorResponse(parsedBody.error.issues[0]?.message ?? "Invalid request body.", 400);
    }

    const { courseId } = await params;

    await prisma.course.update({
      where: {
        id: courseId,
      },
      data: parsedBody.data,
    });

    return successResponse({ message: "Course updated." });
  } catch (errorValue: unknown) {
    const message = errorValue instanceof Error ? errorValue.message : "Unable to update course.";
    return errorResponse(message, 500);
  }
};

export const DELETE = async (
  _request: Request,
  { params }: { params: Promise<{ courseId: string }> },
) => {
  const { error } = await requireAdminApiSession();

  if (error) {
    return error;
  }

  try {
    const { courseId } = await params;

    await prisma.course.delete({
      where: {
        id: courseId,
      },
    });

    return successResponse({ message: "Course deleted." });
  } catch (errorValue: unknown) {
    const message = errorValue instanceof Error ? errorValue.message : "Unable to delete course.";
    return errorResponse(message, 500);
  }
};
