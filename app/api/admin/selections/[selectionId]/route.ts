import { errorResponse, successResponse } from "@/lib/api";
import { requireAdminApiSession } from "@/lib/admin-session";
import { prisma } from "@/lib/prisma";

export const DELETE = async (
  _request: Request,
  { params }: { params: Promise<{ selectionId: string }> },
) => {
  const { error } = await requireAdminApiSession();

  if (error) {
    return error;
  }

  try {
    const { selectionId } = await params;

    await prisma.selectionResult.delete({
      where: {
        id: selectionId,
      },
    });

    return successResponse({ message: "Selection result deleted." });
  } catch (errorValue: unknown) {
    const message = errorValue instanceof Error ? errorValue.message : "Unable to delete selection result.";
    return errorResponse(message, 500);
  }
};
