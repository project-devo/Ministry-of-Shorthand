import { errorResponse, successResponse } from "@/lib/api";
import { requireAdminApiSession } from "@/lib/admin-session";
import { prisma } from "@/lib/prisma";

export const POST = async (
  request: Request,
  { params }: { params: Promise<{ sectionId: string }> },
) => {
  const { error } = await requireAdminApiSession();

  if (error) {
    return error;
  }

  try {
    const { sectionId } = await params;
    const formData = await request.formData();

    const title = String(formData.get("title") ?? "");
    const order = Number(formData.get("order"));
    const duration = Number(formData.get("duration"));

    if (!title || !Number.isFinite(order) || !Number.isFinite(duration)) {
      return errorResponse("Title, order, and duration are required.", 400);
    }

    await prisma.lesson.create({
      data: {
        title,
        order,
        duration,
        sectionId,
        videoUrl: "https://example.com/video-placeholder.mp4",
        pdfUrl: null,
        isFree: false,
      },
    });

    return successResponse({ message: "Lesson created." }, 201);
  } catch (errorValue: unknown) {
    const message = errorValue instanceof Error ? errorValue.message : "Unable to create lesson.";
    return errorResponse(message, 500);
  }
};
