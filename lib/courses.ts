import type { CourseLevel } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const courseLevelOptions: CourseLevel[] = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

export const getPopularCourses = async () => {
  return prisma.course.findMany({
    where: {
      isPublished: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      thumbnail: true,
      price: true,
      level: true,
      instructor: {
        select: {
          name: true,
        },
      },
    },
  });
};

export const getPublishedCourses = async (level?: CourseLevel) => {
  return prisma.course.findMany({
    where: {
      isPublished: true,
      ...(level ? { level } : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      thumbnail: true,
      price: true,
      level: true,
      instructor: {
        select: {
          name: true,
        },
      },
      sections: {
        select: {
          id: true,
        },
      },
    },
  });
};

export const getCourseBySlug = async (slug: string) => {
  return prisma.course.findFirst({
    where: {
      slug,
      isPublished: true,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      thumbnail: true,
      price: true,
      level: true,
      instructor: {
        select: {
          name: true,
          image: true,
          email: true,
        },
      },
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
              pdfUrl: true,
            },
          },
        },
      },
    },
  });
};
