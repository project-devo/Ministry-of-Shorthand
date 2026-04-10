import { notFound } from "next/navigation";
import { getTestAttempt } from "@/lib/dashboard";
import { getRequiredStudentSession } from "@/lib/session";

const TestResultPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ attemptId?: string }>;
}) => {
  const session = await getRequiredStudentSession();
  const { attemptId } = await searchParams;

  if (!attemptId) {
    notFound();
  }

  const attempt = await getTestAttempt(session.user.id, attemptId);

  if (!attempt) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Result</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          {attempt.test.title} performance summary
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <article className="rounded-[1.5rem] border border-border/70 bg-card/90 p-6 shadow-lg shadow-black/5">
          <p className="text-sm text-muted-foreground">Score</p>
          <p className="mt-3 text-4xl font-semibold text-foreground">{attempt.score.toNumber()}</p>
        </article>
        <article className="rounded-[1.5rem] border border-border/70 bg-card/90 p-6 shadow-lg shadow-black/5">
          <p className="text-sm text-muted-foreground">WPM</p>
          <p className="mt-3 text-4xl font-semibold text-foreground">{attempt.actualWpm}</p>
        </article>
        <article className="rounded-[1.5rem] border border-border/70 bg-card/90 p-6 shadow-lg shadow-black/5">
          <p className="text-sm text-muted-foreground">Accuracy</p>
          <p className="mt-3 text-4xl font-semibold text-foreground">
            {attempt.accuracy.toNumber()}%
          </p>
        </article>
      </div>

      <div className="rounded-[1.5rem] border border-border/70 bg-card/90 p-6 shadow-lg shadow-black/5">
        <h2 className="mb-4 text-2xl font-semibold text-foreground">Error analysis</h2>
        <div className="space-y-3 text-sm leading-7 text-muted-foreground">
          {(Array.isArray(attempt.errorAnalysis) ? attempt.errorAnalysis : []).map((item) => (
            <p key={String(item)}>{String(item)}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestResultPage;
