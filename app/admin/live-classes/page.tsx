import { DeleteButton } from "@/components/admin/DeleteButton";
import { LiveClassForm } from "@/components/admin/LiveClassForm";
import { getAdminLiveClasses, getInstructors } from "@/lib/admin";

const AdminLiveClassesPage = async () => {
  const [liveClasses, instructors] = await Promise.all([
    getAdminLiveClasses(),
    getInstructors(),
  ]);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Live Classes</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">Schedule live sessions</h1>
      </div>

      <div className="rounded-[1.5rem] border border-border/70 bg-card/90 p-6 shadow-lg shadow-black/5">
        <LiveClassForm instructors={instructors} />
      </div>

      <div className="space-y-4">
        {liveClasses.map((liveClass) => (
          <article
            key={liveClass.id}
            className="rounded-[1.5rem] border border-border/70 bg-card/90 p-5 shadow-lg shadow-black/5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">{liveClass.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {liveClass.instructor.name} |{" "}
                  {new Intl.DateTimeFormat("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(liveClass.scheduledAt)}
                </p>
              </div>
              <DeleteButton endpoint={`/api/admin/live-classes/${liveClass.id}`} label="Live class" />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default AdminLiveClassesPage;
