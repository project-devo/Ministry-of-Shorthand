import type { CourseLevel, PracticeLevel } from "@prisma/client";
import { hasActiveSubscription } from "@/lib/billing";
import { prisma } from "@/lib/prisma";

const computeCourseProgress = (completedLessons: number, totalLessons: number) => {
  if (totalLessons === 0) {
    return 0;
  }

  return Math.round((completedLessons / totalLessons) * 100);
};

export const getStudentOverview = async (userId: string) => {
  const [enrollments, upcomingLiveClass, recentAttempt] = await Promise.all([
    prisma.enrollment.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            thumbnail: true,
            sections: {
              select: {
                lessons: {
                  select: {
                    id: true,
                    progress: {
                      where: {
                        userId,
                        completed: true,
                      },
                      select: {
                        id: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      take: 4,
    }),
    prisma.liveClass.findFirst({
      where: {
        scheduledAt: {
          gte: new Date(),
        },
      },
      orderBy: {
        scheduledAt: "asc",
      },
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
    }),
    prisma.testAttempt.findFirst({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        score: true,
        accuracy: true,
        actualWpm: true,
        timeTaken: true,
        createdAt: true,
        test: {
          select: {
            id: true,
            title: true,
            speedWPM: true,
          },
        },
      },
    }),
  ]);

  const courseProgress = enrollments.map((enrollment) => {
    const allLessons = enrollment.course.sections.flatMap((section) => section.lessons);
    const completedLessons = allLessons.filter((lesson) => lesson.progress.length > 0).length;

    return {
      id: enrollment.course.id,
      title: enrollment.course.title,
      slug: enrollment.course.slug,
      thumbnail: enrollment.course.thumbnail,
      progress: computeCourseProgress(completedLessons, allLessons.length),
    };
  });

  return {
    courseProgress,
    upcomingLiveClass,
    recentAttempt,
  };
};

export const getStudentCourses = async (userId: string) => {
  const enrollments = await prisma.enrollment.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      createdAt: true,
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          thumbnail: true,
          level: true,
          sections: {
            select: {
              lessons: {
                select: {
                  id: true,
                  title: true,
                  progress: {
                    where: {
                      userId,
                      completed: true,
                    },
                    select: {
                      id: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return enrollments.map((enrollment) => {
    const lessons = enrollment.course.sections.flatMap((section) => section.lessons);
    const completedLessons = lessons.filter((lesson) => lesson.progress.length > 0).length;

    return {
      id: enrollment.course.id,
      title: enrollment.course.title,
      slug: enrollment.course.slug,
      thumbnail: enrollment.course.thumbnail,
      level: enrollment.course.level,
      enrolledAt: enrollment.createdAt,
      totalLessons: lessons.length,
      completedLessons,
      progress: computeCourseProgress(completedLessons, lessons.length),
    };
  });
};

export const getStudentCoursePlayer = async (userId: string, courseId: string) => {
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId,
      courseId,
    },
    select: {
      course: {
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
              lessons: {
                orderBy: {
                  order: "asc",
                },
                select: {
                  id: true,
                  title: true,
                  order: true,
                  videoUrl: true,
                  duration: true,
                  pdfUrl: true,
                  progress: {
                    where: {
                      userId,
                    },
                    select: {
                      completed: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!enrollment) {
    return null;
  }

  return enrollment.course;
};

export const getPracticeTests = async ({
  userId,
  level,
  speed,
}: {
  userId: string;
  level?: PracticeLevel;
  speed?: number;
}) => {
  const [tests, hasPremiumAccess] = await Promise.all([
    prisma.practiceTest.findMany({
      where: {
        ...(level ? { level } : {}),
        ...(speed ? { speedWPM: speed } : {}),
      },
      orderBy: [
        {
          isFree: "desc",
        },
        {
          level: "asc",
        },
        {
          speedWPM: "asc",
        },
      ],
      select: {
        id: true,
        title: true,
        speedWPM: true,
        audioUrl: true,
        level: true,
        isFree: true,
      },
    }),
    hasActiveSubscription(userId),
  ]);

  return tests.map((test) => ({
    ...test,
    hasAccess: test.isFree || hasPremiumAccess,
    isPremium: !test.isFree,
  }));
};

export const getPracticeTest = async ({
  testId,
  userId,
}: {
  testId: string;
  userId: string;
}) => {
  const test = await prisma.practiceTest.findUnique({
    where: {
      id: testId,
    },
    select: {
      id: true,
      title: true,
      speedWPM: true,
      audioUrl: true,
      transcript: true,
      level: true,
      isFree: true,
    },
  });

  if (!test) {
    return null;
  }

  const hasPremiumAccess = await hasActiveSubscription(userId);

  return {
    ...test,
    hasAccess: test.isFree || hasPremiumAccess,
    isPremium: !test.isFree,
  };
};

export const getTestAttempt = async (userId: string, attemptId: string) => {
  return prisma.testAttempt.findFirst({
    where: {
      id: attemptId,
      userId,
    },
    select: {
      id: true,
      score: true,
      accuracy: true,
      actualWpm: true,
      timeTaken: true,
      responseText: true,
      errorAnalysis: true,
      createdAt: true,
      test: {
        select: {
          id: true,
          title: true,
          speedWPM: true,
          level: true,
        },
      },
    },
  });
};

export const getTestHistory = async (userId: string) => {
  return prisma.testAttempt.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
      score: true,
      accuracy: true,
      actualWpm: true,
      timeTaken: true,
      createdAt: true,
      test: {
        select: {
          title: true,
          speedWPM: true,
        },
      },
    },
  });
};

export const getUpcomingLiveClasses = async () => {
  return prisma.liveClass.findMany({
    where: {
      scheduledAt: {
        gte: new Date(),
      },
    },
    orderBy: {
      scheduledAt: "asc",
    },
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

export const getStudentNotifications = async (userId: string) => {
  return prisma.notification.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      message: true,
      isRead: true,
      createdAt: true,
    },
  });
};

export const getStudentProfile = async (userId: string) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
    },
  });
};

export const getPublishedSelectionResults = async (take?: number) => {
  return prisma.selectionResult.findMany({
    where: {
      isPublished: true,
    },
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
    },
  });
};

export const isValidCourseLevel = (value?: string): value is CourseLevel => {
  return value === "BEGINNER" || value === "INTERMEDIATE" || value === "ADVANCED";
};

export const isValidPracticeLevel = (value?: string): value is PracticeLevel => {
  return value === "BEGINNER" || value === "INTERMEDIATE" || value === "ADVANCED";
};
