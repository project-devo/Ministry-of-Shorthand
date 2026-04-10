import Link from "next/link";
import { getPracticeTests, isValidPracticeLevel } from "@/lib/dashboard";
import { getRequiredStudentSession } from "@/lib/session";

const DashboardTestsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ level?: string; speed?: string }>;
}) => {
  const session = await getRequiredStudentSession();
  const { level, speed } = await searchParams;
  const selectedLevel = isValidPracticeLevel(level) ? level : undefined;
  const selectedSpeed = speed ? Number(speed) : undefined;
  const tests = await getPracticeTests({
    userId: session.user.id,
    level: selectedLevel,
    speed: Number.isFinite(selectedSpeed) ? selectedSpeed : undefined,
  });

  const speedOptions = [40, 60, 80, 100];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Practice Tests</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">Sharpen your speed with timed dictation</h1>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/dashboard/tests"
          className={`rounded-full border px-4 py-2 text-sm font-medium ${
            !selectedLevel ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground"
          }`}
        >
          All levels
        </Link>
        {["BEGINNER", "INTERMEDIATE", "ADVANCED"].map((option) => (
          <Link
            key={option}
            href={`/dashboard/tests?level=${option}`}
            className={`rounded-full border px-4 py-2 text-sm font-medium ${
              selectedLevel === option
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground"
            }`}
          >
            {option}
          </Link>
        ))}
        {speedOptions.map((speedOption) => (
          <Link
            key={speedOption}
            href={`/dashboard/tests?speed=${speedOption}`}
            className={`rounded-full border px-4 py-2 text-sm font-medium ${
              selectedSpeed === speedOption
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground"
            }`}
          >
            {speedOption} WPM
          </Link>
        ))}
      </div>

      {tests.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {tests.map((test) => (
            <article
              key={test.id}
              className="rounded-[1.5rem] border border-border/70 bg-card/90 p-6 shadow-lg shadow-black/5"
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    {test.level}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-foreground">{test.title}</h2>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-foreground">{test.speedWPM} WPM</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    {test.isPremium ? "Premium" : "Free"}
                  </p>
                </div>
              </div>
              <p className="mb-6 text-sm text-muted-foreground">
                {test.isFree
                  ? "Free logged-in practice for new students."
                  : "Premium dictation unlocked after payment or active plan."}
              </p>
              {test.hasAccess ? (
                <Link href={`/dashboard/tests/${test.id}`} className="text-sm font-semibold text-primary hover:underline">
                  Start test
                </Link>
              ) : (
                <Link href="/pricing" className="text-sm font-semibold text-primary hover:underline">
                  Unlock premium
                </Link>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-[1.5rem] border border-dashed border-border bg-card/60 p-8 text-sm text-muted-foreground">
          No practice tests match the selected filter yet.
        </div>
      )}
    </div>
  );
};

export default DashboardTestsPage;
