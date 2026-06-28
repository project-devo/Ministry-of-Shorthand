import type { CourseLevel } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export const courseLevelOptions: CourseLevel[] = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

export const getPopularCourses = unstable_cache(async () => {
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
}, ["popular-courses"], { revalidate: 300 });

export const getPublishedCourses = unstable_cache(async (level?: CourseLevel) => {
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
}, ["published-courses"], { revalidate: 300 });

export const getCourseBySlug = unstable_cache(async (slug: string) => {
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
              videoUrl: true,
              pdfUrl: true,
            },
          },
        },
      },
    },
  });
}, ["course-by-slug"], { revalidate: 300 });
