import { settlePaidPayment } from "@/lib/billing";
import { errorResponse, successResponse } from "@/lib/api";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";
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

    const rateLimitResponse = await checkRateLimit({
      key: getRateLimitKey(request, "payment:verify", session.user.id),
      limit: 20,
      windowMs: 10 * 60 * 1000,
    });

    if (rateLimitResponse) {
      return rateLimitResponse;
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

    const payment = await settlePaidPayment({
      orderId: parsedBody.data.razorpay_order_id,
      paymentId: parsedBody.data.razorpay_payment_id,
      userId: session.user.id,
    });

    if (!payment) {
      return errorResponse("Payment record not found.", 404);
    }

    return successResponse({
      message: "Payment verified successfully.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to verify payment.";
    return errorResponse(message, 500);
  }
};
