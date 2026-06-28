import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export const getPublishedSelectionResults = unstable_cache(async () => {
  return prisma.selectionResult.findMany({
    where: {
      isPublished: true,
    },
    orderBy: {
      sortOrder: "asc",
    },
  });
}, ["selection-results"], { revalidate: 3600 });
