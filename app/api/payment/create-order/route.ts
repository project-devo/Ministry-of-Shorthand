import { PaymentKind } from "@prisma/client";
import { createPendingPayment, SUBSCRIPTION_PRICING } from "@/lib/billing";
import { errorResponse, successResponse } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { getRazorpayInstance } from "@/lib/razorpay";
import { getServerAuthSession } from "@/lib/session";
import { createOrderSchema } from "@/schemas/payment";

export const POST = async (request: Request) => {
  try {
    const session = await getServerAuthSession();

    if (!session?.user?.id) {
      return errorResponse("Unauthorized.", 401);
    }

    if (session.user.role !== "STUDENT") {
      return errorResponse("Only student accounts can create payment orders.", 403);
    }

    const body = await request.json();
    const parsedBody = createOrderSchema.safeParse(body);

    if (!parsedBody.success) {
      return errorResponse(parsedBody.error.issues[0]?.message ?? "Invalid request body.", 400);
    }

    const razorpay = getRazorpayInstance();

    if (parsedBody.data.type === "COURSE") {
      const course = await prisma.course.findFirst({
        where: {
          id: parsedBody.data.courseId,
          isPublished: true,
        },
        select: {
          id: true,
          title: true,
          price: true,
        },
      });

      if (!course) {
        return errorResponse("Course not found.", 404);
      }

      if (course.price.toNumber() <= 0) {
        return errorResponse("This course is free. Use direct enrollment instead.", 400);
      }

      const order = await razorpay.orders.create({
        amount: Math.round(course.price.toNumber() * 100),
        currency: "INR",
        receipt: `course_${course.id.slice(0, 12)}`,
        notes: {
          type: "COURSE",
          courseId: course.id,
          userId: session.user.id,
        },
      });

      await createPendingPayment({
        amount: course.price.toNumber(),
        courseId: course.id,
        description: course.title,
        kind: PaymentKind.COURSE,
        razorpayOrderId: order.id,
        userId: session.user.id,
      });

      return successResponse({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      });
    }

    const plan = parsedBody.data.plan;

    if (!plan) {
      return errorResponse("Subscription plan is required.", 400);
    }

    const amount = SUBSCRIPTION_PRICING[plan];

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `plan_${plan.toLowerCase()}_${session.user.id.slice(0, 10)}`,
      notes: {
        type: "SUBSCRIPTION",
        plan,
        userId: session.user.id,
      },
    });

    await createPendingPayment({
      amount,
      description: `${plan} subscription`,
      kind: PaymentKind.SUBSCRIPTION,
      razorpayOrderId: order.id,
      subscriptionPlan: plan,
      userId: session.user.id,
    });

    return successResponse({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to create payment order.";
    return errorResponse(message, 500);
  }
};
