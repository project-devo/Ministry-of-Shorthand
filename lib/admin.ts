import { Role } from "@prisma/client";
import { getPagination, type PaginationInput } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";

export const getAdminDashboardData = async () => {
  const signupWindowStart = new Date();
  signupWindowStart.setMonth(signupWindowStart.getMonth() - 12);

  const [totalUsers, revenueAggregate, activeSubscriptions, signupsByMonth] = await Promise.all([
    prisma.user.count(),
    prisma.payment.aggregate({
      where: {
        status: "PAID",
      },
      _sum: {
        amount: true,
      },
    }),
    prisma.subscription.count({
      where: {
        status: "ACTIVE",
        endDate: {
          gte: new Date(),
        },
      },
    }),
    prisma.user.findMany({
      where: {
        createdAt: {
          gte: signupWindowStart,
        },
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    }),
  ]);

  const signupChartMap = new Map<string, number>();

  signupsByMonth.forEach((user) => {
    const label = new Intl.DateTimeFormat("en-IN", {
      month: "short",
      year: "numeric",
    }).format(user.createdAt);

    signupChartMap.set(label, (signupChartMap.get(label) ?? 0) + 1);
  });

  return {
    totalUsers,
    totalRevenue: revenueAggregate._sum.amount ?? 0,
    activeSubscriptions,
    signupChartData: Array.from(signupChartMap.entries()).map(([label, signups]) => ({
      label,
      signups,
    })),
  };
};

export const getAdminCourses = async () => {
  const { take } = getPagination({ pageSize: 100 });

  return prisma.course.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take,
    select: {
      id: true,
      title: true,
      slug: true,
      price: true,
      level: true,
      isPublished: true,
      instructor: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          sections: true,
          enrollments: true,
        },
      },
    },
  });
};

export const getCourseForAdmin = async (courseId: string) => {
  return prisma.course.findUnique({
    where: {
      id: courseId,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      thumbnail: true,
      price: true,
      level: true,
      isPublished: true,
      instructorId: true,
      sections: {
        orderBy: {
          order: "asc",
        },
        select: {
          id: true,
          title: true,
          order: true,
          lessons: {
            orderBy: {
              order: "asc",
            },
            select: {
              id: true,
              title: true,
              order: true,
              duration: true,
              isFree: true,
            },
          },
        },
      },
    },
  });
};

export const getInstructors = async () => {
  return prisma.user.findMany({
    where: {
      role: {
        in: [Role.INSTRUCTOR, Role.ADMIN],
      },
      isBanned: false,
    },
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      role: true,
    },
  });
};

export const getLessonForAdmin = async (lessonId: string) => {
  return prisma.lesson.findUnique({
    where: {
      id: lessonId,
    },
    select: {
      id: true,
      title: true,
      order: true,
      videoUrl: true,
      duration: true,
      isFree: true,
      pdfUrl: true,
      sectionId: true,
      section: {
        select: {
          title: true,
          course: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
    },
  });
};

export const getAdminUsers = async (query?: string, role?: Role, pagination?: PaginationInput) => {
  const { skip, take } = getPagination(pagination);

  const where: Record<string, unknown> = {};

  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { email: { contains: query, mode: "insensitive" } },
    ];
  }

  if (role) {
    where.role = role;
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isBanned: true,
        emailVerified: true,
        createdAt: true,
      },
    }),
    prisma.user.count({
      where: Object.keys(where).length > 0 ? where : undefined,
    }),
  ]);

  return { users, total };
};

export const getAdminTests = async () => {
  const { take } = getPagination({ pageSize: 100 });

  return prisma.practiceTest.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take,
    select: {
      id: true,
      title: true,
      speedWPM: true,
      level: true,
      isFree: true,
      audioUrl: true,
      transcript: true,
      _count: {
        select: {
          attempts: true,
        },
      },
    },
  });
};

export const getAdminInquiries = async () => {
  const { take } = getPagination({ pageSize: 100 });

  return prisma.inquiry.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      interest: true,
      message: true,
      status: true,
      createdAt: true,
    },
  });
};

export const getAdminSelectionResults = async () => {
  const { take } = getPagination({ pageSize: 100 });

  return prisma.selectionResult.findMany({
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        createdAt: "desc",
      },
    ],
    take,
    select: {
      id: true,
      name: true,
      achievement: true,
      batch: true,
      quote: true,
      image: true,
      sortOrder: true,
      isPublished: true,
      createdAt: true,
    },
  });
};

export const getAdminLiveClasses = async () => {
  const { take } = getPagination({ pageSize: 100 });

  return prisma.liveClass.findMany({
    orderBy: {
      scheduledAt: "desc",
    },
    take,
    select: {
      id: true,
      title: true,
      scheduledAt: true,
      meetLink: true,
      instructor: {
        select: {
          name: true,
        },
      },
    },
  });
};
