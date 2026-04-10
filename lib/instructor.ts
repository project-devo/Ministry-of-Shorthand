import { prisma } from "@/lib/prisma";

export const getInstructorOverview = async (instructorId: string) => {
  const [courses, liveClasses] = await Promise.all([
    prisma.course.findMany({
      where: {
        instructorId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        slug: true,
        isPublished: true,
        _count: {
          select: {
            sections: true,
            enrollments: true,
          },
        },
      },
    }),
    prisma.liveClass.findMany({
      where: {
        instructorId,
        scheduledAt: {
          gte: new Date(),
        },
      },
      orderBy: {
        scheduledAt: "asc",
      },
      take: 3,
      select: {
        id: true,
        title: true,
        scheduledAt: true,
        meetLink: true,
      },
    }),
  ]);

  const totalStudents = courses.reduce((sum, course) => sum + course._count.enrollments, 0);

  return {
    courses,
    totalStudents,
    upcomingLiveClasses: liveClasses,
  };
};

export const getInstructorCourses = async (instructorId: string) => {
  return prisma.course.findMany({
    where: {
      instructorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      slug: true,
      price: true,
      level: true,
      isPublished: true,
      _count: {
        select: {
          sections: true,
          enrollments: true,
        },
      },
    },
  });
};

export const getInstructorCourseStudents = async (courseId: string, instructorId: string) => {
  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
      instructorId,
    },
    select: {
      id: true,
      title: true,
      sections: {
        select: {
          lessons: {
            select: {
              id: true,
            },
          },
        },
      },
      enrollments: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!course) {
    return null;
  }

  const lessonIds = course.sections.flatMap((section) => section.lessons.map((lesson) => lesson.id));
  const totalLessons = lessonIds.length;

  const progress = totalLessons
    ? await prisma.lessonProgress.findMany({
        where: {
          lessonId: {
            in: lessonIds,
          },
          completed: true,
        },
        select: {
          userId: true,
        },
      })
    : [];

  const completedByUser = new Map<string, number>();

  progress.forEach((entry) => {
    completedByUser.set(entry.userId, (completedByUser.get(entry.userId) ?? 0) + 1);
  });

  return {
    id: course.id,
    title: course.title,
    totalLessons,
    students: course.enrollments.map((enrollment) => {
      const completedLessons = completedByUser.get(enrollment.user.id) ?? 0;
      const progressPercent = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);

      return {
        id: enrollment.id,
        enrolledAt: enrollment.createdAt,
        progressPercent,
        completedLessons,
        student: enrollment.user,
      };
    }),
  };
};

export const getInstructorUploadContext = async (instructorId: string) => {
  return prisma.course.findMany({
    where: {
      instructorId,
    },
    orderBy: {
      title: "asc",
    },
    select: {
      id: true,
      title: true,
      sections: {
        orderBy: {
          order: "asc",
        },
        select: {
          id: true,
          title: true,
          order: true,
          _count: {
            select: {
              lessons: true,
            },
          },
        },
      },
    },
  });
};

export const getInstructorLiveClasses = async (instructorId: string) => {
  return prisma.liveClass.findMany({
    where: {
      instructorId,
    },
    orderBy: {
      scheduledAt: "desc",
    },
    select: {
      id: true,
      title: true,
      scheduledAt: true,
      meetLink: true,
      createdAt: true,
    },
  });
};
