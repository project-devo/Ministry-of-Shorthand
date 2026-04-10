import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock3, FileText, PlayCircle, UserRound } from "lucide-react";
import { CourseEnrollButton } from "@/components/payment/CourseEnrollButton";
import { getCourseBySlug } from "@/lib/courses";
import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "@/lib/session";
import { buildMetadata } from "@/lib/site";

export const dynamic = "force-dynamic";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  let course = null;

  try {
    course = await getCourseBySlug(slug);
  } catch {
    course = null;
  }

  if (!course) {
    return buildMetadata({
      title: "Course Not Found",
      description: "The requested course could not be found.",
    });
  }

  return buildMetadata({
    title: course.title,
    description: course.description,
    image: course.thumbnail,
    path: `/courses/${course.slug}`,
  });
};

const CourseDetailPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  const session = await getServerAuthSession();

  if (!course) {
    notFound();
  }

  const existingEnrollment =
    session?.user?.id
      ? await prisma.enrollment.findFirst({
          where: {
            userId: session.user.id,
            courseId: course.id,
          },
          select: {
            id: true,
          },
        })
      : null;

  const freePreviewLesson = course.sections
    .flatMap((section) => section.lessons)
    .find((lesson) => lesson.isFree);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <div className="space-y-4">
            <span className="inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-secondary-foreground">
              {course.level}
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground">
              {course.title}
            </h1>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">
              {course.description}
            </p>
          </div>

          <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] border border-border/70">
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 60vw, 100vw"
            />
          </div>

          <div className="rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-lg shadow-black/5">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                <UserRound className="size-5" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{course.instructor.name}</p>
                <p className="text-sm text-muted-foreground">Course instructor</p>
              </div>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              This course is led by an instructor account on the platform and designed to support
              structured shorthand progression.
            </p>
          </div>

          <div className="rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-lg shadow-black/5">
            <h2 className="mb-6 text-2xl font-semibold text-foreground">Curriculum</h2>
            <div className="space-y-6">
              {course.sections.map((section) => (
                <div key={section.id} className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-lg font-semibold text-foreground">
                      Section {section.order}: {section.title}
                    </h3>
                    <span className="text-sm text-muted-foreground">
                      {section.lessons.length} lessons
                    </span>
                  </div>
                  <div className="space-y-3">
                    {section.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-background/70 p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">
                              Lesson {lesson.order}: {lesson.title}
                            </p>
                            {lesson.isFree ? (
                              <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary">
                                Free preview
                              </span>
                            ) : null}
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="inline-flex items-center gap-2">
                              <Clock3 className="size-4" />
                              {lesson.duration} min
                            </span>
                            <span className="inline-flex items-center gap-2">
                              <FileText className="size-4" />
                              {lesson.pdfUrl ? "PDF included" : "No PDF attached"}
                            </span>
                          </div>
                        </div>
                        {lesson.isFree ? (
                          <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                            <PlayCircle className="size-4" />
                            Preview available
                          </span>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-border/70 bg-card/90 p-6 shadow-xl shadow-black/5">
            <div className="mb-6 space-y-2">
              <p className="text-sm text-muted-foreground">Course price</p>
              <p className="text-4xl font-semibold text-foreground">
                Rs. {course.price.toNumber()}
              </p>
            </div>
            <CourseEnrollButton
              courseId={course.id}
              courseSlug={course.slug}
              description={course.title}
              isAuthenticated={Boolean(session?.user?.id)}
              isEnrolled={Boolean(existingEnrollment)}
              isFree={course.price.toNumber() <= 0}
              price={course.price.toNumber()}
              userEmail={session?.user?.email}
              userName={session?.user?.name}
            />
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Sign in to enroll and unlock your dashboard, lessons, and practice progress.
            </p>
          </div>

          <div className="rounded-[2rem] border border-border/70 bg-card/90 p-6 shadow-xl shadow-black/5">
            <h2 className="mb-4 text-xl font-semibold text-foreground">Free preview lesson</h2>
            {freePreviewLesson ? (
              <div className="space-y-3">
                <p className="font-medium text-foreground">{freePreviewLesson.title}</p>
                <p className="text-sm text-muted-foreground">
                  Start with a free lesson before enrolling fully in the course.
                </p>
                <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4 text-sm text-primary">
                  Preview lesson available in the course curriculum above.
                </div>
              </div>
            ) : (
              <p className="text-sm leading-6 text-muted-foreground">
                This course does not currently have a free preview lesson configured.
              </p>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
};

export default CourseDetailPage;
