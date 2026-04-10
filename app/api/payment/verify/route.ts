import { PaymentStatus, SubscriptionStatus } from "@prisma/client";
import { activateSubscription, ensureCourseEnrollment } from "@/lib/billing";
import { errorResponse, successResponse } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { verifyRazorpayPaymentSignature } from "@/lib/razorpay";
import { getServerAuthSession } from "@/lib/session";
import { verifyPaymentSchema } from "@/schemas/payment";

export const POST = async (request: Request) => {
  try {
    const session = await getServerAuthSession();

    if (!session?.user?.id) {
      return errorResponse("Unauthorized.", 401);
    }

    if (session.user.role !== "STUDENT") {
      return errorResponse("Only student accounts can verify payments.", 403);
    }

    const body = await request.json();
    const parsedBody = verifyPaymentSchema.safeParse(body);

    if (!parsedBody.success) {
      return errorResponse(parsedBody.error.issues[0]?.message ?? "Invalid request body.", 400);
    }

    const isValidSignature = verifyRazorpayPaymentSignature({
      orderId: parsedBody.data.razorpay_order_id,
      paymentId: parsedBody.data.razorpay_payment_id,
      signature: parsedBody.data.razorpay_signature,
    });

    if (!isValidSignature) {
      return errorResponse("Invalid payment signature.", 400);
    }

    const payment = await prisma.payment.findUnique({
      where: {
        razorpayOrderId: parsedBody.data.razorpay_order_id,
      },
      select: {
        id: true,
        userId: true,
        kind: true,
        courseId: true,
        subscriptionPlan: true,
        status: true,
      },
    });

    if (!payment || payment.userId !== session.user.id) {
      return errorResponse("Payment record not found.", 404);
    }

    await prisma.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status: PaymentStatus.PAID,
        razorpayPaymentId: parsedBody.data.razorpay_payment_id,
      },
    });

    if (payment.kind === "COURSE" && payment.courseId) {
      await ensureCourseEnrollment({
        courseId: payment.courseId,
        userId: session.user.id,
      });
    }

    if (payment.kind === "SUBSCRIPTION" && payment.subscriptionPlan) {
      await prisma.subscription.updateMany({
        where: {
          userId: session.user.id,
          status: SubscriptionStatus.ACTIVE,
        },
        data: {
          status: SubscriptionStatus.CANCELLED,
        },
      });

      await activateSubscription({
        paymentId: payment.id,
        plan: payment.subscriptionPlan,
        userId: session.user.id,
      });
    }

    return successResponse({
      message: "Payment verified successfully.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to verify payment.";
    return errorResponse(message, 500);
  }
};
