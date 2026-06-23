import { errorResponse, successResponse } from "@/lib/api";
import { requireAdminApiSession } from "@/lib/admin-session";
import { prisma } from "@/lib/prisma";
import { lessonSchema } from "@/schemas/admin";

export const PATCH = async (
  request: Request,
  { params }: { params: Promise<{ lessonId: string }> },
) => {
  const { error } = await requireAdminApiSession();

  if (error) {
    return error;
  }

  try {
    const body = await request.json();
    const parsedBody = lessonSchema.safeParse(body);

    if (!parsedBody.success) {
      return errorResponse(parsedBody.error.issues[0]?.message ?? "Invalid lesson data.", 400);
    }

    const { lessonId } = await params;

    await prisma.lesson.update({
      where: {
        id: lessonId,
      },
      data: {
        ...parsedBody.data,
        pdfUrl: parsedBody.data.pdfUrl || null,
      },
    });

    return successResponse({ message: "Lesson updated." });
  } catch (errorValue: unknown) {
    const message = errorValue instanceof Error ? errorValue.message : "Unable to update lesson.";
    return errorResponse(message, 500);
  }
};

export const DELETE = async (
  _request: Request,
  { params }: { params: Promise<{ lessonId: string }> },
) => {
  const { error } = await requireAdminApiSession();

  if (error) {
    return error;
  }

  try {
    const { lessonId } = await params;

    await prisma.lesson.delete({
      where: {
        id: lessonId,
      },
    });

    return successResponse({ message: "Lesson deleted." });
  } catch (errorValue: unknown) {
    const message = errorValue instanceof Error ? errorValue.message : "Unable to delete lesson.";
    return errorResponse(message, 500);
  }
};
