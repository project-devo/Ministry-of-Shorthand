import { ensureCourseEnrollment } from "@/lib/billing";
import { errorResponse, successResponse } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "@/lib/session";
import { freeEnrollmentSchema } from "@/schemas/payment";

export const POST = async (request: Request) => {
  try {
    const session = await getServerAuthSession();

    if (!session?.user?.id) {
      return errorResponse("Unauthorized.", 401);
    }

    if (session.user.role !== "STUDENT") {
      return errorResponse("Only student accounts can enroll in courses.", 403);
    }

    const body = await request.json();
    const parsedBody = freeEnrollmentSchema.safeParse(body);

    if (!parsedBody.success) {
      return errorResponse(parsedBody.error.issues[0]?.message ?? "Invalid request body.", 400);
    }

    const course = await prisma.course.findFirst({
      where: {
        id: parsedBody.data.courseId,
        isPublished: true,
      },
      select: {
        id: true,
        price: true,
      },
    });

    if (!course) {
      return errorResponse("Course not found.", 404);
    }

    if (course.price.toNumber() > 0) {
      return errorResponse("This course requires payment.", 400);
    }

    await ensureCourseEnrollment({
      courseId: course.id,
      userId: session.user.id,
    });

    return successResponse({
      message: "Free enrollment completed.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to complete enrollment.";
    return errorResponse(message, 500);
  }
};
