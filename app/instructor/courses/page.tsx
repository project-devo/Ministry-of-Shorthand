import Link from "next/link";
import { getInstructorCourses } from "@/lib/instructor";
import { getRequiredInstructorSession } from "@/lib/session";

const InstructorCoursesPage = async () => {
  const session = await getRequiredInstructorSession();
  const courses = await getInstructorCourses(session.user.id);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Courses</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">Your teaching catalog</h1>
      </div>

      <div className="grid gap-5">
        {courses.length > 0 ? (
          courses.map((course) => (
            <article
              key={course.id}
              className="rounded-[1.5rem] border border-border/70 bg-card/90 p-6 shadow-lg shadow-black/5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-foreground">{course.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {course.level} | INR {course.price.toNumber()} | {course._count.enrollments} students
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                    {course.isPublished ? "Published" : "Draft"}
                  </span>
                  <Link
                    href={`/instructor/courses/${course.id}/students`}
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    View students
                  </Link>
                  <Link href={`/admin/courses/${course.id}`} className="text-sm font-semibold text-primary hover:underline">
                    Open in admin editor
                  </Link>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-border bg-card/60 p-8 text-sm text-muted-foreground">
            No courses are assigned to this instructor yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorCoursesPage;
