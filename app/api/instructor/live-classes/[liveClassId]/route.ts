import { errorResponse, successResponse } from "@/lib/api";
import { requireInstructorApiSession } from "@/lib/instructor-session";
import { prisma } from "@/lib/prisma";

export const DELETE = async (
  _request: Request,
  { params }: { params: Promise<{ liveClassId: string }> },
) => {
  const { error, session } = await requireInstructorApiSession();

  if (error || !session) {
    return error;
  }

  try {
    const { liveClassId } = await params;

    const deleted = await prisma.liveClass.deleteMany({
      where: {
        id: liveClassId,
        instructorId: session.user.id,
      },
    });

    if (deleted.count === 0) {
      return errorResponse("Live class not found.", 404);
    }

    return successResponse({ message: "Live class deleted." });
  } catch (errorValue: unknown) {
    const message = errorValue instanceof Error ? errorValue.message : "Unable to delete live class.";
    return errorResponse(message, 500);
  }
};
