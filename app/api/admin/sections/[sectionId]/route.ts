import { errorResponse, successResponse } from "@/lib/api";
import { requireAdminApiSession } from "@/lib/admin-session";
import { prisma } from "@/lib/prisma";

export const DELETE = async (
  _request: Request,
  { params }: { params: Promise<{ sectionId: string }> },
) => {
  const { error } = await requireAdminApiSession();

  if (error) {
    return error;
  }

  try {
    const { sectionId } = await params;

    await prisma.section.delete({
      where: {
        id: sectionId,
      },
    });

    return successResponse({ message: "Section deleted." });
  } catch (errorValue: unknown) {
    const message = errorValue instanceof Error ? errorValue.message : "Unable to delete section.";
    return errorResponse(message, 500);
  }
};
