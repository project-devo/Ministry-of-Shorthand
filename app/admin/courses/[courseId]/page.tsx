import { getCourseForAdmin, getInstructors } from "@/lib/admin";
import { notFound } from "next/navigation";
import { CourseForm } from "./course-form";
import { SectionsList } from "./sections-list";

export default async function AdminCoursePage({
  params,
}: {
  params: { courseId: string };
}) {
  const isNew = params.courseId === "new";
  const course = !isNew ? await getCourseForAdmin(params.courseId) : null;

  if (!isNew && !course) {
    notFound();
  }

  const instructors = await getInstructors();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isNew ? "Create Course" : "Edit Course"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isNew 
              ? "Add a new course to the platform." 
              : `Manage settings and curriculum for ${course?.title}.`}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CourseForm initialData={course} instructors={instructors} />
        </div>
        
        {!isNew && course && (
          <div className="lg:col-span-1">
            <SectionsList courseId={course.id} sections={course.sections} />
          </div>
        )}
      </div>
    </div>
  );
}
