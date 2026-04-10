import { notFound } from "next/navigation";
import { PracticeTestRunner } from "@/components/dashboard/PracticeTestRunner";
import { getPracticeTest } from "@/lib/dashboard";
import { getRequiredStudentSession } from "@/lib/session";

const DashboardTestPage = async ({
  params,
}: {
  params: Promise<{ testId: string }>;
}) => {
  const session = await getRequiredStudentSession();
  const { testId } = await params;
  const test = await getPracticeTest({ testId, userId: session.user.id });

  if (!test) {
    notFound();
  }

  if (!test.hasAccess) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-border bg-card/60 p-8 text-sm text-muted-foreground">
        This premium dictation is locked for your current plan. Upgrade from the pricing page to continue.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Practice Test</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">{test.title}</h1>
        <p className="text-base leading-7 text-muted-foreground">
          Play the dictation, type your response, and submit when you are ready.
        </p>
      </div>
      <PracticeTestRunner test={{ ...test, level: test.level }} />
    </div>
  );
};

export default DashboardTestPage;
