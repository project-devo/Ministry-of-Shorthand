import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { getStudentCourses } from "@/lib/dashboard";
import { getRequiredStudentSession } from "@/lib/session";

const DashboardCoursesPage = async () => {
  const session = await getRequiredStudentSession();
  const courses = await getStudentCourses(session.user.id);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">My Courses</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">Continue your enrolled courses</h1>
      </div>

      {courses.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {courses.map((course) => (
            <article
              key={course.id}
              className="rounded-[1.5rem] border border-border/70 bg-card/90 p-6 shadow-lg shadow-black/5"
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    {course.level}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-foreground">{course.title}</h2>
                </div>
                <span className="text-sm text-muted-foreground">{course.progress}%</span>
              </div>
              <div className="space-y-2">
                <Progress value={course.progress} />
                <p className="text-sm text-muted-foreground">
                  {course.completedLessons} of {course.totalLessons} lessons completed
                </p>
              </div>
              <div className="mt-6">
                <Link href={`/dashboard/courses/${course.id}`} className="text-sm font-semibold text-primary hover:underline">
                  Open course player
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-[1.5rem] border border-dashed border-border bg-card/60 p-8 text-sm text-muted-foreground">
          No course enrollments found yet. Once a student enrolls, their learning dashboard will show
          up here.
        </div>
      )}
    </div>
  );
};

export default DashboardCoursesPage;
