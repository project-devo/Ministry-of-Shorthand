import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPracticeTest } from "@/lib/dashboard";
import { TestRunner } from "@/components/test-runner";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function PracticeTestRunnerPage({
  params,
}: {
  params: { testId: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const test = await getPracticeTest({
    testId: params.testId,
    userId: session.user.id,
  });

  if (!test) {
    notFound();
  }

  if (!test.hasAccess) {
    redirect("/dashboard/practice");
  }

  return (
    <div className="space-y-4 h-full flex flex-col animate-in fade-in duration-500">
      <div className="flex items-center gap-4 shrink-0">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/practice">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Practice Test</h1>
        </div>
      </div>
      
      <TestRunner test={test} />
    </div>
  );
}
