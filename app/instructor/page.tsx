import Link from "next/link";
import { getInstructorOverview } from "@/lib/instructor";
import { getRequiredInstructorSession } from "@/lib/session";

const InstructorHomePage = async () => {
  const session = await getRequiredInstructorSession();
  const data = await getInstructorOverview(session.user.id);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Instructor Overview</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          Welcome back, {session.user.name}
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <article className="rounded-[1.5rem] border border-border/70 bg-card/90 p-6 shadow-lg shadow-black/5">
          <p className="text-sm text-muted-foreground">My courses</p>
          <p className="mt-3 text-4xl font-semibold text-foreground">{data.courses.length}</p>
        </article>
        <article className="rounded-[1.5rem] border border-border/70 bg-card/90 p-6 shadow-lg shadow-black/5">
          <p className="text-sm text-muted-foreground">Total students enrolled</p>
          <p className="mt-3 text-4xl font-semibold text-foreground">{data.totalStudents}</p>
        </article>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[1.5rem] border border-border/70 bg-card/90 p-6 shadow-lg shadow-black/5">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground">My courses</h2>
            <Link href="/instructor/courses" className="text-sm font-semibold text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {data.courses.length > 0 ? (
              data.courses.map((course) => (
                <article key={course.id} className="rounded-2xl border border-border/60 bg-background/70 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {course._count.enrollments} students | {course._count.sections} sections
                      </p>
                    </div>
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                      {course.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                </article>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Your assigned courses will appear here.</p>
            )}
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-border/70 bg-card/90 p-6 shadow-lg shadow-black/5">
          <h2 className="mb-5 text-2xl font-semibold text-foreground">Upcoming live classes</h2>
          <div className="space-y-4">
            {data.upcomingLiveClasses.length > 0 ? (
              data.upcomingLiveClasses.map((liveClass) => (
                <article key={liveClass.id} className="rounded-2xl border border-border/60 bg-background/70 p-4">
                  <h3 className="font-semibold text-foreground">{liveClass.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {new Intl.DateTimeFormat("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(liveClass.scheduledAt)}
                  </p>
                </article>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No upcoming sessions scheduled yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default InstructorHomePage;
