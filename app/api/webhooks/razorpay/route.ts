import { PaymentStatus, SubscriptionStatus } from "@prisma/client";
import { activateSubscription, ensureCourseEnrollment } from "@/lib/billing";
import { errorResponse, successResponse } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { verifyRazorpayWebhookSignature } from "@/lib/razorpay";

export const POST = async (request: Request) => {
  try {
    const payload = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!signature) {
      return errorResponse("Missing webhook signature.", 400);
    }

    const isValidSignature = verifyRazorpayWebhookSignature({
      payload,
      signature,
    });

    if (!isValidSignature) {
      return errorResponse("Invalid webhook signature.", 400);
    }

    const event = JSON.parse(payload) as {
      event: string;
      payload?: {
        payment?: {
          entity?: {
            id: string;
            order_id: string;
          };
        };
        subscription?: {
          entity?: {
            id: string;
            notes?: {
              userId?: string;
              plan?: "MONTHLY" | "ANNUAL";
            };
          };
        };
      };
    };

    if (event.event === "payment.captured") {
      const paymentEntity = event.payload?.payment?.entity;

      if (paymentEntity) {
        const payment = await prisma.payment.findUnique({
          where: {
            razorpayOrderId: paymentEntity.order_id,
          },
          select: {
            id: true,
            userId: true,
            kind: true,
            courseId: true,
            subscriptionPlan: true,
          },
        });

        if (payment) {
          await prisma.payment.update({
            where: {
              id: payment.id,
            },
            data: {
              status: PaymentStatus.PAID,
              razorpayPaymentId: paymentEntity.id,
            },
          });

          if (payment.kind === "COURSE" && payment.courseId) {
            await ensureCourseEnrollment({
              courseId: payment.courseId,
              userId: payment.userId,
            });
          }

          if (payment.kind === "SUBSCRIPTION" && payment.subscriptionPlan) {
            await activateSubscription({
              paymentId: payment.id,
              plan: payment.subscriptionPlan,
              userId: payment.userId,
            });
          }
        }
      }
    }

    if (event.event === "subscription.activated") {
      const subscriptionEntity = event.payload?.subscription?.entity;

      if (subscriptionEntity?.notes?.userId && subscriptionEntity.notes.plan) {
        await prisma.subscription.updateMany({
          where: {
            userId: subscriptionEntity.notes.userId,
            razorpaySubId: subscriptionEntity.id,
          },
          data: {
            status: SubscriptionStatus.ACTIVE,
          },
        });
      }
    }

    return successResponse({
      message: "Webhook processed.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to process webhook.";
    return errorResponse(message, 500);
  }
};
