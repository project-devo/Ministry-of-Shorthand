import { errorResponse, successResponse } from "@/lib/api";
import { requireAdminApiSession } from "@/lib/admin-session";
import { prisma } from "@/lib/prisma";

export const DELETE = async (
  _request: Request,
  { params }: { params: Promise<{ testId: string }> },
) => {
  const { error } = await requireAdminApiSession();

  if (error) {
    return error;
  }

  try {
    const { testId } = await params;

    await prisma.practiceTest.delete({
      where: {
        id: testId,
      },
    });

    return successResponse({ message: "Practice test deleted." });
  } catch (errorValue: unknown) {
    const message = errorValue instanceof Error ? errorValue.message : "Unable to delete test.";
    return errorResponse(message, 500);
  }
};
