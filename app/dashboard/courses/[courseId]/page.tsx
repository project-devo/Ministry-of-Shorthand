import Link from "next/link";
import { CheckCircle2, Circle, FileDown } from "lucide-react";
import { LazyVideoPlayer } from "@/components/dashboard/LazyVideoPlayer";
import { MarkLessonCompleteButton } from "@/components/dashboard/MarkLessonCompleteButton";
import { buttonVariants } from "@/components/ui/button";
import { getStudentCoursePlayer } from "@/lib/dashboard";
import { getRequiredStudentSession } from "@/lib/session";

const CoursePlayerPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ lessonId?: string }>;
}) => {
  const session = await getRequiredStudentSession();
  const { courseId } = await params;
  const { lessonId } = await searchParams;
  const course = await getStudentCoursePlayer(session.user.id, courseId);

  if (!course) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-border bg-card/60 p-8 text-sm text-muted-foreground">
        This course is not available for your student account.
      </div>
    );
  }

  const lessons = course.sections.flatMap((section) =>
    section.lessons.map((lesson) => ({
      ...lesson,
      sectionId: section.id,
      sectionTitle: section.title,
      completed: lesson.progress[0]?.completed ?? false,
    })),
  );

  const selectedLesson = lessons.find((lesson) => lesson.id === lessonId) ?? lessons[0];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Course Player</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">{course.title}</h1>
      </div>

      {selectedLesson ? (
        <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
          <aside className="rounded-[1.5rem] border border-border/70 bg-card/90 p-4 shadow-lg shadow-black/5">
            <div className="mb-4 px-2">
              <h2 className="text-lg font-semibold text-foreground">Lessons</h2>
            </div>
            <div className="space-y-6">
              {course.sections.map((section) => (
                <div key={section.id} className="space-y-2">
                  <p className="px-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    {section.title}
                  </p>
                  <div className="space-y-1">
                    {section.lessons.map((lesson) => {
                      const isActive = selectedLesson.id === lesson.id;
                      const isCompleted = lesson.progress[0]?.completed ?? false;

                      return (
                        <Link
                          key={lesson.id}
                          href={`/dashboard/courses/${course.id}?lessonId=${lesson.id}`}
                          className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors ${
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="size-4 shrink-0" />
                          ) : (
                            <Circle className="size-4 shrink-0" />
                          )}
                          <span>{lesson.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <div className="space-y-6">
            <div className="rounded-[1.5rem] border border-border/70 bg-card/90 p-5 shadow-lg shadow-black/5">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{selectedLesson.sectionTitle}</p>
                  <h2 className="text-2xl font-semibold text-foreground">{selectedLesson.title}</h2>
                </div>
                <p className="text-sm text-muted-foreground">{selectedLesson.duration} min</p>
              </div>
              <LazyVideoPlayer source={selectedLesson.videoUrl} />
            </div>

            <div className="flex flex-col gap-4 rounded-[1.5rem] border border-border/70 bg-card/90 p-6 shadow-lg shadow-black/5 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">Lesson resources</h3>
                <p className="text-sm text-muted-foreground">
                  Download the attached PDF and keep your completion status updated.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {selectedLesson.pdfUrl ? (
                  <Link
                    href={selectedLesson.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={buttonVariants({ variant: "outline" })}
                  >
                    <FileDown className="size-4" />
                    Download PDF
                  </Link>
                ) : null}
                <MarkLessonCompleteButton
                  lessonId={selectedLesson.id}
                  isCompleted={selectedLesson.completed}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-[1.5rem] border border-dashed border-border bg-card/60 p-8 text-sm text-muted-foreground">
          This course does not contain any lessons yet.
        </div>
      )}
    </div>
  );
};

export default CoursePlayerPage;
