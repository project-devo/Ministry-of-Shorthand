import { DeleteButton } from "@/components/admin/DeleteButton";
import { InstructorLiveClassForm } from "@/components/instructor/InstructorLiveClassForm";
import { getInstructorLiveClasses } from "@/lib/instructor";
import { getRequiredInstructorSession } from "@/lib/session";

const InstructorLiveClassesPage = async () => {
  const session = await getRequiredInstructorSession();
  const liveClasses = await getInstructorLiveClasses(session.user.id);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Live Classes</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">Manage scheduled sessions</h1>
      </div>

      <div className="rounded-[1.5rem] border border-border/70 bg-card/90 p-6 shadow-lg shadow-black/5">
        <InstructorLiveClassForm instructorId={session.user.id} />
      </div>

      <div className="space-y-4">
        {liveClasses.length > 0 ? (
          liveClasses.map((liveClass) => (
            <article
              key={liveClass.id}
              className="rounded-[1.5rem] border border-border/70 bg-card/90 p-5 shadow-lg shadow-black/5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">{liveClass.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {new Intl.DateTimeFormat("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(liveClass.scheduledAt)}
                  </p>
                  <a
                    href={liveClass.meetLink}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
                  >
                    Open meet link
                  </a>
                </div>
                <DeleteButton endpoint={`/api/instructor/live-classes/${liveClass.id}`} label="Live class" />
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-border bg-card/60 p-8 text-sm text-muted-foreground">
            No live classes scheduled yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorLiveClassesPage;
