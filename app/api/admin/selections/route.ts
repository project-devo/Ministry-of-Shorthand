import { errorResponse, successResponse } from "@/lib/api";
import { requireAdminApiSession } from "@/lib/admin-session";
import { prisma } from "@/lib/prisma";
import { selectionResultSchema } from "@/schemas/admin";

export const POST = async (request: Request) => {
  const { error } = await requireAdminApiSession();

  if (error) {
    return error;
  }

  try {
    const body = await request.json();
    const parsedBody = selectionResultSchema.safeParse(body);

    if (!parsedBody.success) {
      return errorResponse(parsedBody.error.issues[0]?.message ?? "Invalid selection result data.", 400);
    }

    await prisma.selectionResult.create({
      data: {
        ...parsedBody.data,
        quote: parsedBody.data.quote || null,
        image: parsedBody.data.image || null,
      },
    });

    return successResponse({ message: "Selection result created." }, 201);
  } catch (errorValue: unknown) {
    const message = errorValue instanceof Error ? errorValue.message : "Unable to create selection result.";
    return errorResponse(message, 500);
  }
};
