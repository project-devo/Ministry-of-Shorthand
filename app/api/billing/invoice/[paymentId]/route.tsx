import { errorResponse } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "@/lib/session";

export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ paymentId: string }> },
) => {
  try {
    const session = await getServerAuthSession();

    if (!session?.user?.id) {
      return errorResponse("Unauthorized.", 401);
    }

    const { paymentId } = await params;

    const payment = await prisma.payment.findFirst({
      where: {
        id: paymentId,
        userId: session.user.id,
      },
      select: {
        id: true,
        amount: true,
        currency: true,
        description: true,
        createdAt: true,
        status: true,
        razorpayOrderId: true,
        razorpayPaymentId: true,
      },
    });

    if (!payment) {
      return errorResponse("Invoice not found.", 404);
    }

    return new Response(
      JSON.stringify({
        success: true,
        userName: session.user.name ?? "Student",
        payment,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to generate invoice.";
    return errorResponse(message, 500);
  }
};

