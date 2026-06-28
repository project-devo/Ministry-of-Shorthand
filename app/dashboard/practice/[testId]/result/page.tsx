import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTestAttempt } from "@/lib/dashboard";
import { TestResult } from "@/components/test-result";

export default async function PracticeTestResultPage({
  params,
  searchParams,
}: {
  params: { testId: string };
  searchParams: { attemptId?: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (!searchParams.attemptId) {
    redirect(`/dashboard/practice/${params.testId}`);
  }

  const attempt = await getTestAttempt(session.user.id, searchParams.attemptId);

  if (!attempt || attempt.test.id !== params.testId) {
    notFound();
  }

  return (
    <div className="py-6 flex items-center justify-center min-h-[calc(100vh-12rem)]">
      {/* We need to cast attempt.errorAnalysis to string[] since prisma returns JsonValue */}
      <TestResult 
        attempt={{ 
          ...attempt, 
          score: Number(attempt.score),
          accuracy: Number(attempt.accuracy),
          errorAnalysis: attempt.errorAnalysis as string[] 
        }} 
      />
    </div>
  );
}
