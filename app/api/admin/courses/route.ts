import { errorResponse, successResponse } from "@/lib/api";
import { requireAdminApiSession } from "@/lib/admin-session";
import { prisma } from "@/lib/prisma";
import { courseSchema } from "@/schemas/admin";

export const POST = async (request: Request) => {
  const { error } = await requireAdminApiSession();

  if (error) {
    return error;
  }

  try {
    const body = await request.json();
    const parsedBody = courseSchema.safeParse(body);

    if (!parsedBody.success) {
      return errorResponse(parsedBody.error.issues[0]?.message ?? "Invalid request body.", 400);
    }

    await prisma.course.create({
      data: {
        ...parsedBody.data,
        price: parsedBody.data.price,
      },
    });

    return successResponse({ message: "Course created." }, 201);
  } catch (errorValue: unknown) {
    const message = errorValue instanceof Error ? errorValue.message : "Unable to create course.";
    return errorResponse(message, 500);
  }
};
