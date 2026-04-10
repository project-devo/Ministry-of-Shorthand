import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getStudentOverview } from "@/lib/dashboard";
import { getRequiredStudentSession } from "@/lib/session";

const DashboardHomePage = async () => {
  const session = await getRequiredStudentSession();
  const overview = await getStudentOverview(session.user.id);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Overview</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          Welcome back, {session.user.name ?? "Student"}
        </h1>
        <p className="text-base leading-7 text-muted-foreground">
          Continue your shorthand practice, review your recent results, and stay ready for your next
          live class.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-[1.5rem] border border-border/70 bg-card/90 p-6 shadow-lg shadow-black/5 lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground">Enrolled course progress</h2>
            <Link href="/dashboard/courses" className="text-sm font-semibold text-primary hover:underline">
              View all
            </Link>
          </div>
          {overview.courseProgress.length > 0 ? (
            <div className="space-y-5">
              {overview.courseProgress.map((course) => (
                <div key={course.id} className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-medium text-foreground">{course.title}</p>
                    <span className="text-sm text-muted-foreground">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">
              You have not enrolled in any courses yet. Once enrollments exist, progress will appear
              here.
            </p>
          )}
        </section>

        <section className="space-y-6">
          <article className="rounded-[1.5rem] border border-border/70 bg-card/90 p-6 shadow-lg shadow-black/5">
            <h2 className="mb-4 text-xl font-semibold text-foreground">Upcoming live class</h2>
            {overview.upcomingLiveClass ? (
              <div className="space-y-3">
                <p className="font-medium text-foreground">{overview.upcomingLiveClass.title}</p>
                <p className="text-sm text-muted-foreground">
                  With {overview.upcomingLiveClass.instructor.name} on{" "}
                  {new Intl.DateTimeFormat("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(overview.upcomingLiveClass.scheduledAt)}
                </p>
                <Link
                  href={overview.upcomingLiveClass.meetLink}
                  className={buttonVariants({ className: "w-full" })}
                  target="_blank"
                  rel="noreferrer"
                >
                  Join class
                </Link>
              </div>
            ) : (
              <p className="text-sm leading-6 text-muted-foreground">
                No upcoming live classes are scheduled right now.
              </p>
            )}
          </article>

          <article className="rounded-[1.5rem] border border-border/70 bg-card/90 p-6 shadow-lg shadow-black/5">
            <h2 className="mb-4 text-xl font-semibold text-foreground">Recent test score</h2>
            {overview.recentAttempt ? (
              <div className="space-y-3">
                <p className="font-medium text-foreground">{overview.recentAttempt.test.title}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Score</p>
                    <p className="text-2xl font-semibold text-foreground">
                      {overview.recentAttempt.score.toNumber()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Accuracy</p>
                    <p className="text-2xl font-semibold text-foreground">
                      {overview.recentAttempt.accuracy.toNumber()}%
                    </p>
                  </div>
                </div>
                <Link href="/dashboard/tests/history" className="text-sm font-semibold text-primary hover:underline">
                  View full history
                </Link>
              </div>
            ) : (
              <p className="text-sm leading-6 text-muted-foreground">
                Your recent test performance will appear here after you submit a practice test.
              </p>
            )}
          </article>
        </section>
      </div>
    </div>
  );
};

export default DashboardHomePage;
