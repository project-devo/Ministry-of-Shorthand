import Link from "next/link";
import { CourseForm } from "@/components/admin/CourseForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { LessonQuickCreateForm } from "@/components/admin/LessonQuickCreateForm";
import { SectionCreateForm } from "@/components/admin/SectionCreateForm";
import { getCourseForAdmin, getInstructors } from "@/lib/admin";

const EditCoursePage = async ({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) => {
  const { courseId } = await params;
  const [course, instructors] = await Promise.all([
    getCourseForAdmin(courseId),
    getInstructors(),
  ]);

  if (!course) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-border bg-card/60 p-8 text-sm text-muted-foreground">
        Course not found.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Courses</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">Edit course</h1>
      </div>

      <CourseForm
        mode="edit"
        instructors={instructors}
        course={{
          id: course.id,
          title: course.title,
          slug: course.slug,
          description: course.description,
          thumbnail: course.thumbnail,
          price: course.price.toNumber(),
          level: course.level,
          instructorId: course.instructorId,
          isPublished: course.isPublished,
        }}
      />

      <div className="rounded-[1.5rem] border border-border/70 bg-card/90 p-6 shadow-lg shadow-black/5">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Sections and lessons</h2>
            <p className="text-sm text-muted-foreground">
              Build the curriculum here, then open any lesson to upload its video and PDF assets.
            </p>
          </div>
          <Link href="/admin/courses" className="text-sm font-semibold text-primary hover:underline">
            Back to courses
          </Link>
        </div>

        <div className="space-y-6">
          {course.sections.map((section) => (
            <div key={section.id} className="space-y-4 rounded-2xl border border-border/70 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">
                    Section {section.order}: {section.title}
                  </p>
                  <p className="text-sm text-muted-foreground">{section.lessons.length} lessons</p>
                </div>
                <DeleteButton endpoint={`/api/admin/sections/${section.id}`} label="Section" />
              </div>

              <LessonQuickCreateForm defaultOrder={section.lessons.length + 1} sectionId={section.id} />

              <div className="space-y-2">
                {section.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between rounded-xl border border-border/60 bg-background/60 px-4 py-3"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        Lesson {lesson.order}: {lesson.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {lesson.duration} min | {lesson.isFree ? "Free preview" : "Paid"}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/lessons/${lesson.id}`}
                        className="text-sm font-semibold text-primary hover:underline"
                      >
                        Manage lesson
                      </Link>
                      <DeleteButton endpoint={`/api/admin/lessons/${lesson.id}`} label="Lesson" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <SectionCreateForm courseId={course.id} defaultOrder={course.sections.length + 1} />
      </div>
    </div>
  );
};

export default EditCoursePage;
