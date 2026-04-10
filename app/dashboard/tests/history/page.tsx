import { TestHistoryChart } from "@/components/dashboard/TestHistoryChart";
import { getTestHistory } from "@/lib/dashboard";
import { getRequiredStudentSession } from "@/lib/session";

const TestHistoryPage = async () => {
  const session = await getRequiredStudentSession();
  const history = await getTestHistory(session.user.id);

  const chartData = history.map((attempt) => ({
    date: new Intl.DateTimeFormat("en-IN", {
      month: "short",
      day: "numeric",
    }).format(attempt.createdAt),
    score: attempt.score.toNumber(),
  }));

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">History</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">Track your test performance</h1>
      </div>

      <div className="rounded-[1.5rem] border border-border/70 bg-card/90 p-6 shadow-lg shadow-black/5">
        {history.length > 0 ? (
          <TestHistoryChart data={chartData} />
        ) : (
          <p className="text-sm leading-6 text-muted-foreground">
            Submit a few practice tests to see your score history chart.
          </p>
        )}
      </div>

      {history.length > 0 ? (
        <div className="space-y-4">
          {history.slice().reverse().map((attempt) => (
            <article
              key={attempt.id}
              className="rounded-[1.5rem] border border-border/70 bg-card/90 p-5 shadow-lg shadow-black/5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-foreground">{attempt.test.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Intl.DateTimeFormat("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(attempt.createdAt)}
                  </p>
                </div>
                <div className="flex gap-6 text-sm text-muted-foreground">
                  <span>Score: {attempt.score.toNumber()}</span>
                  <span>Accuracy: {attempt.accuracy.toNumber()}%</span>
                  <span>Target: {attempt.test.speedWPM} WPM</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default TestHistoryPage;
