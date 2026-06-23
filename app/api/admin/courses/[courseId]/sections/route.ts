import { errorResponse, successResponse } from "@/lib/api";
import { requireAdminApiSession } from "@/lib/admin-session";
import { prisma } from "@/lib/prisma";
import { sectionSchema } from "@/schemas/admin";

export const POST = async (
  request: Request,
  { params }: { params: Promise<{ courseId: string }> },
) => {
  const { error } = await requireAdminApiSession();

  if (error) {
    return error;
  }

  try {
    const { courseId } = await params;
    const formData = await request.formData();
    const parsedBody = sectionSchema.safeParse({
      title: formData.get("title"),
      order: Number(formData.get("order")),
      courseId,
    });

    if (!parsedBody.success) {
      return errorResponse(parsedBody.error.issues[0]?.message ?? "Invalid section data.", 400);
    }

    await prisma.section.create({
      data: parsedBody.data,
    });

    return successResponse({ message: "Section created." }, 201);
  } catch (errorValue: unknown) {
    const message = errorValue instanceof Error ? errorValue.message : "Unable to create section.";
    return errorResponse(message, 500);
  }
};
