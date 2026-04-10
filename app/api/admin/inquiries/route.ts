import { errorResponse, successResponse } from "@/lib/api";
import { requireAdminApiSession } from "@/lib/admin-session";
import { prisma } from "@/lib/prisma";

export const GET = async () => {
  const { error } = await requireAdminApiSession();

  if (error) {
    return error;
  }

  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return successResponse({ inquiries });
  } catch (errorValue: unknown) {
    const message = errorValue instanceof Error ? errorValue.message : "Unable to fetch inquiries.";
    return errorResponse(message, 500);
  }
};
