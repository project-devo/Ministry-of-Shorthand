import Link from "next/link";
import type { CourseLevel } from "@prisma/client";
import { CourseCard } from "@/components/public/CourseCard";
import { getPublishedCourses } from "@/lib/courses";
import { buildMetadata } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Courses",
  description:
    "Browse shorthand and stenography courses by level, curriculum depth, and learning goals.",
  path: "/courses",
});

const levelOptions: Array<{ label: string; value: CourseLevel | "ALL" }> = [
  { label: "All levels", value: "ALL" },
  { label: "Beginner", value: "BEGINNER" },
  { label: "Intermediate", value: "INTERMEDIATE" },
  { label: "Advanced", value: "ADVANCED" },
];

const CoursesPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ level?: string }>;
}) => {
  const { level } = await searchParams;
  const activeLevel =
    level === "BEGINNER" || level === "INTERMEDIATE" || level === "ADVANCED" ? level : undefined;
  const courses = await getPublishedCourses(activeLevel);

  return (
    <section className="content-auto mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Courses</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          Explore published shorthand programs
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">
          Filter by level and browse courses designed for disciplined practice, exam preparation,
          and long-term improvement.
        </p>
      </div>

      <div className="mb-10 flex flex-wrap gap-3">
        {levelOptions.map((option) => {
          const href = option.value === "ALL" ? "/courses" : `/courses?level=${option.value}`;
          const isActive = option.value === "ALL" ? !activeLevel : activeLevel === option.value;

          return (
            <Link
              key={option.value}
              href={href}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {option.label}
            </Link>
          );
        })}
      </div>

      {courses.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={{
                ...course,
                sectionsCount: course.sections.length,
              }}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-[1.5rem] border border-dashed border-border bg-card/60 p-8 text-sm text-muted-foreground">
          No published courses match this filter yet. Try another level or add published courses in
          the admin panel.
        </div>
      )}
    </section>
  );
};

export default CoursesPage;
