import { errorResponse, successResponse } from "@/lib/api";
import { requireInstructorApiSession } from "@/lib/instructor-session";
import { prisma } from "@/lib/prisma";
import { lessonSchema } from "@/schemas/admin";

export const POST = async (request: Request) => {
  const { error, session } = await requireInstructorApiSession();

  if (error || !session) {
    return error;
  }

  try {
    const body = await request.json();
    const parsedBody = lessonSchema.safeParse(body);

    if (!parsedBody.success) {
      return errorResponse(parsedBody.error.issues[0]?.message ?? "Invalid lesson data.", 400);
    }

    const section = await prisma.section.findFirst({
      where: {
        id: parsedBody.data.sectionId,
        course: {
          instructorId: session.user.id,
        },
      },
      select: {
        id: true,
      },
    });

    if (!section) {
      return errorResponse("You do not have permission to add lessons to this section.", 403);
    }

    await prisma.lesson.create({
      data: {
        ...parsedBody.data,
        pdfUrl: parsedBody.data.pdfUrl || null,
      },
    });

    return successResponse({ message: "Lesson created." }, 201);
  } catch (errorValue: unknown) {
    const message = errorValue instanceof Error ? errorValue.message : "Unable to create lesson.";
    return errorResponse(message, 500);
  }
};
