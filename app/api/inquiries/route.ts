import { Role } from "@prisma/client";
import { errorResponse, successResponse } from "@/lib/api";
import { sendInquiryNotificationEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { inquirySchema } from "@/schemas/admin";

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const parsedBody = inquirySchema.safeParse(body);

    if (!parsedBody.success) {
      return errorResponse(parsedBody.error.issues[0]?.message ?? "Invalid inquiry data.", 400);
    }

    const inquiry = await prisma.inquiry.create({
      data: parsedBody.data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        interest: true,
        message: true,
      },
    });

    const adminRecipients = await prisma.user.findMany({
      where: {
        role: Role.ADMIN,
        isBanned: false,
      },
      select: {
        email: true,
      },
    });

    await sendInquiryNotificationEmail({
      inquiry,
      recipients: adminRecipients.map((admin) => admin.email),
    });

    return successResponse({ message: "Inquiry submitted successfully." }, 201);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to submit inquiry.";
    return errorResponse(message, 500);
  }
};
