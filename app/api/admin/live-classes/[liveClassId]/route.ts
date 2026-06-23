import { errorResponse, successResponse } from "@/lib/api";
import { requireAdminApiSession } from "@/lib/admin-session";
import { prisma } from "@/lib/prisma";

export const DELETE = async (
  _request: Request,
  { params }: { params: Promise<{ liveClassId: string }> },
) => {
  const { error } = await requireAdminApiSession();

  if (error) {
    return error;
  }

  try {
    const { liveClassId } = await params;

    await prisma.liveClass.delete({
      where: {
        id: liveClassId,
      },
    });

    return successResponse({ message: "Live class deleted." });
  } catch (errorValue: unknown) {
    const message = errorValue instanceof Error ? errorValue.message : "Unable to delete live class.";
    return errorResponse(message, 500);
  }
};
