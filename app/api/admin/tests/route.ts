import { errorResponse, successResponse } from "@/lib/api";
import { requireAdminApiSession } from "@/lib/admin-session";
import { prisma } from "@/lib/prisma";
import { practiceTestSchema } from "@/schemas/admin";

export const POST = async (request: Request) => {
  const { error } = await requireAdminApiSession();

  if (error) {
    return error;
  }

  try {
    const body = await request.json();
    const parsedBody = practiceTestSchema.safeParse(body);

    if (!parsedBody.success) {
      return errorResponse(parsedBody.error.issues[0]?.message ?? "Invalid test data.", 400);
    }

    await prisma.practiceTest.create({
      data: parsedBody.data,
    });

    return successResponse({ message: "Practice test created." }, 201);
  } catch (errorValue: unknown) {
    const message = errorValue instanceof Error ? errorValue.message : "Unable to create test.";
    return errorResponse(message, 500);
  }
};
