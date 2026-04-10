import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getUpcomingLiveClasses } from "@/lib/dashboard";
import { getRequiredStudentSession } from "@/lib/session";

const LiveClassesPage = async () => {
  await getRequiredStudentSession();
  const liveClasses = await getUpcomingLiveClasses();

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Live Classes</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">Upcoming sessions</h1>
      </div>

      {liveClasses.length > 0 ? (
        <div className="space-y-4">
          {liveClasses.map((liveClass) => (
            <article
              key={liveClass.id}
              className="rounded-[1.5rem] border border-border/70 bg-card/90 p-6 shadow-lg shadow-black/5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-foreground">{liveClass.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    With {liveClass.instructor.name} on{" "}
                    {new Intl.DateTimeFormat("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(liveClass.scheduledAt)}
                  </p>
                </div>
                <Link
                  href={liveClass.meetLink}
                  target="_blank"
                  rel="noreferrer"
                  className={buttonVariants({ className: "w-full sm:w-auto" })}
                >
                  Join class
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-[1.5rem] border border-dashed border-border bg-card/60 p-8 text-sm text-muted-foreground">
          No live classes are scheduled yet.
        </div>
      )}
    </div>
  );
};

export default LiveClassesPage;
