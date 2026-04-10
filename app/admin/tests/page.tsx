import { DeleteButton } from "@/components/admin/DeleteButton";
import { PracticeTestForm } from "@/components/admin/PracticeTestForm";
import { getAdminTests } from "@/lib/admin";

const AdminTestsPage = async () => {
  const tests = await getAdminTests();

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Practice Tests</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">Create and manage tests</h1>
      </div>

      <div className="rounded-[1.5rem] border border-border/70 bg-card/90 p-6 shadow-lg shadow-black/5">
        <PracticeTestForm />
      </div>

      <div className="overflow-x-auto rounded-[1.5rem] border border-border/70 bg-card/90 p-6 shadow-lg shadow-black/5">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border text-muted-foreground">
            <tr>
              <th className="pb-3 pr-4">Title</th>
              <th className="pb-3 pr-4">Level</th>
              <th className="pb-3 pr-4">Access</th>
              <th className="pb-3 pr-4">Speed</th>
              <th className="pb-3 pr-4">Attempts</th>
              <th className="pb-3 pr-4">Transcript</th>
              <th className="pb-3 pr-4">Audio</th>
              <th className="pb-3 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((test) => (
              <tr key={test.id} className="border-b border-border/50">
                <td className="py-4 pr-4 text-foreground">{test.title}</td>
                <td className="py-4 pr-4 text-muted-foreground">{test.level}</td>
                <td className="py-4 pr-4 text-muted-foreground">
                  {test.isFree ? "Free" : "Premium"}
                </td>
                <td className="py-4 pr-4 text-muted-foreground">{test.speedWPM} WPM</td>
                <td className="py-4 pr-4 text-muted-foreground">{test._count.attempts}</td>
                <td className="max-w-xs py-4 pr-4 text-xs leading-6 text-muted-foreground">
                  {test.transcript.slice(0, 120)}
                  {test.transcript.length > 120 ? "..." : ""}
                </td>
                <td className="py-4 pr-4">
                  <a href={test.audioUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                    Open audio
                  </a>
                </td>
                <td className="py-4 pr-4">
                  <DeleteButton endpoint={`/api/admin/tests/${test.id}`} label="Practice test" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTestsPage;
