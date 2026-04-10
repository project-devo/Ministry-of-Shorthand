import { getInstructorCourseStudents } from "@/lib/instructor";
import { getRequiredInstructorSession } from "@/lib/session";

const InstructorCourseStudentsPage = async ({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) => {
  const session = await getRequiredInstructorSession();
  const { courseId } = await params;
  const course = await getInstructorCourseStudents(courseId, session.user.id);

  if (!course) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-border bg-card/60 p-8 text-sm text-muted-foreground">
        Course not found or not assigned to you.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Students</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">{course.title}</h1>
        <p className="text-base text-muted-foreground">
          {course.students.length} enrolled students | {course.totalLessons} lessons in curriculum
        </p>
      </div>

      <div className="overflow-x-auto rounded-[1.5rem] border border-border/70 bg-card/90 p-6 shadow-lg shadow-black/5">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border text-muted-foreground">
            <tr>
              <th className="pb-3 pr-4">Student</th>
              <th className="pb-3 pr-4">Email</th>
              <th className="pb-3 pr-4">Progress</th>
              <th className="pb-3 pr-4">Completed lessons</th>
              <th className="pb-3 pr-4">Enrolled</th>
            </tr>
          </thead>
          <tbody>
            {course.students.map((entry) => (
              <tr key={entry.id} className="border-b border-border/50">
                <td className="py-4 pr-4 text-foreground">{entry.student.name}</td>
                <td className="py-4 pr-4 text-muted-foreground">{entry.student.email}</td>
                <td className="py-4 pr-4">
                  <div className="w-48 space-y-2">
                    <div className="h-2 rounded-full bg-secondary">
                      <div
                        className="h-2 rounded-full bg-primary transition-all"
                        style={{ width: `${entry.progressPercent}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">{entry.progressPercent}% complete</p>
                  </div>
                </td>
                <td className="py-4 pr-4 text-muted-foreground">
                  {entry.completedLessons} / {course.totalLessons}
                </td>
                <td className="py-4 pr-4 text-muted-foreground">
                  {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(entry.enrolledAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {course.students.length === 0 ? (
          <p className="pt-6 text-sm text-muted-foreground">No students have enrolled in this course yet.</p>
        ) : null}
      </div>
    </div>
  );
};

export default InstructorCourseStudentsPage;
