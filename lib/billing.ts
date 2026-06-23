import { PaymentKind, PaymentStatus, SubscriptionPlan, SubscriptionStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getPagination, type PaginationInput } from "@/lib/pagination";

export const SUBSCRIPTION_PRICING: Record<SubscriptionPlan, number> = {
  MONTHLY: 999,
  ANNUAL: 8999,
};

export const getPlanDuration = (plan: SubscriptionPlan) => {
  const startDate = new Date();
  const endDate = new Date(startDate);

  if (plan === "MONTHLY") {
    endDate.setMonth(endDate.getMonth() + 1);
  } else {
    endDate.setFullYear(endDate.getFullYear() + 1);
  }

  return { startDate, endDate };
};

export const ensureCourseEnrollment = async ({
  courseId,
  userId,
}: {
  courseId: string;
  userId: string;
}) => {
  return prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
    update: {},
    create: {
      userId,
      courseId,
    },
  });
};

export const activateSubscription = async ({
  paymentId,
  plan,
  userId,
  razorpaySubId,
}: {
  paymentId?: string;
  plan: SubscriptionPlan;
  userId: string;
  razorpaySubId?: string;
}) => {
  const { startDate, endDate } = getPlanDuration(plan);

  const subscription = await prisma.subscription.create({
    data: {
      userId,
      plan,
      status: SubscriptionStatus.ACTIVE,
      razorpaySubId: razorpaySubId ?? null,
      startDate,
      endDate,
    },
  });

  if (paymentId) {
    await prisma.payment.update({
      where: {
        id: paymentId,
      },
      data: {
        status: PaymentStatus.PAID,
      },
    });
  }

  return subscription;
};

export const getBillingData = async (userId: string, pagination?: PaginationInput) => {
  const { skip, take } = getPagination(pagination);
  const [activePlan, paymentHistory] = await Promise.all([
    prisma.subscription.findFirst({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE,
        endDate: {
          gte: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        plan: true,
        status: true,
        startDate: true,
        endDate: true,
      },
    }),
    prisma.payment.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take,
      select: {
        id: true,
        kind: true,
        description: true,
        amount: true,
        currency: true,
        status: true,
        razorpayOrderId: true,
        razorpayPaymentId: true,
        subscriptionPlan: true,
        createdAt: true,
        course: {
          select: {
            title: true,
          },
        },
      },
    }),
  ]);

  return { activePlan, paymentHistory };
};

export const hasActiveSubscription = async (userId: string) => {
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: SubscriptionStatus.ACTIVE,
      endDate: {
        gte: new Date(),
      },
    },
    select: {
      id: true,
    },
  });

  return Boolean(subscription);
};

export const settlePaidPayment = async ({
  orderId,
  paymentId,
  userId,
}: {
  orderId: string;
  paymentId: string;
  userId?: string;
}) => {
  return prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({
      where: {
        razorpayOrderId: orderId,
      },
      select: {
        id: true,
        userId: true,
        kind: true,
        courseId: true,
        subscriptionPlan: true,
        status: true,
        razorpayPaymentId: true,
      },
    });

    if (!payment || (userId && payment.userId !== userId)) {
      return null;
    }

    const updatedPayment = await tx.payment.updateMany({
      where: {
        id: payment.id,
        status: {
          not: PaymentStatus.PAID,
        },
      },
      data: {
        status: PaymentStatus.PAID,
        razorpayPaymentId: payment.razorpayPaymentId ?? paymentId,
      },
    });

    if (updatedPayment.count === 0) {
      return payment;
    }

    if (payment.kind === "COURSE" && payment.courseId) {
      await tx.enrollment.upsert({
        where: {
          userId_courseId: {
            userId: payment.userId,
            courseId: payment.courseId,
          },
        },
        update: {},
        create: {
          userId: payment.userId,
          courseId: payment.courseId,
        },
      });
    }

    if (payment.kind === "SUBSCRIPTION" && payment.subscriptionPlan) {
      const { startDate, endDate } = getPlanDuration(payment.subscriptionPlan);

      await tx.subscription.updateMany({
        where: {
          userId: payment.userId,
          status: SubscriptionStatus.ACTIVE,
        },
        data: {
          status: SubscriptionStatus.CANCELLED,
        },
      });

      await tx.subscription.create({
        data: {
          userId: payment.userId,
          plan: payment.subscriptionPlan,
          status: SubscriptionStatus.ACTIVE,
          startDate,
          endDate,
        },
      });
    }

    return payment;
  });
};

export const createPendingPayment = async ({
  amount,
  courseId,
  description,
  kind,
  razorpayOrderId,
  subscriptionPlan,
  userId,
}: {
  amount: number;
  courseId?: string;
  description: string;
  kind: PaymentKind;
  razorpayOrderId: string;
  subscriptionPlan?: SubscriptionPlan;
  userId: string;
}) => {
  return prisma.payment.create({
    data: {
      userId,
      kind,
      courseId,
      subscriptionPlan,
      description,
      amount,
      currency: "INR",
      razorpayOrderId,
      status: PaymentStatus.PENDING,
    },
  });
};
