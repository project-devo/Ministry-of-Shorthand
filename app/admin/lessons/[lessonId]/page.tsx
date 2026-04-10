import { LessonForm } from "@/components/admin/LessonForm";
import { getLessonForAdmin } from "@/lib/admin";

const LessonAdminPage = async ({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) => {
  const { lessonId } = await params;
  const lesson = await getLessonForAdmin(lessonId);

  if (!lesson) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-border bg-card/60 p-8 text-sm text-muted-foreground">
        Lesson not found.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Lessons</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">Manage lesson</h1>
        <p className="text-base text-muted-foreground">
          {lesson.section.course.title} · {lesson.section.title}
        </p>
      </div>
      <LessonForm
        lesson={{
          id: lesson.id,
          title: lesson.title,
          order: lesson.order,
          videoUrl: lesson.videoUrl,
          duration: lesson.duration,
          isFree: lesson.isFree,
          pdfUrl: lesson.pdfUrl ?? "",
          sectionId: lesson.sectionId,
        }}
      />
    </div>
  );
};

export default LessonAdminPage;
