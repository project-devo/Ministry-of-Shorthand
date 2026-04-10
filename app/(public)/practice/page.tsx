import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { hasActiveSubscription } from "@/lib/billing";
import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "@/lib/session";
import { buildMetadata } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Dictation Practice",
  description:
    "Practice shorthand dictation at different speeds with free and premium access tiers.",
  path: "/practice",
});

const PracticePage = async () => {
  const session = await getServerAuthSession();
  const [tests, premiumUnlocked] = await Promise.all([
    prisma.practiceTest.findMany({
      select: {
        speedWPM: true,
        isFree: true,
      },
      orderBy: {
        speedWPM: "asc",
      },
    }),
    session?.user?.id ? hasActiveSubscription(session.user.id) : Promise.resolve(false),
  ]);

  const speedOptions = Array.from(new Set(tests.map((test) => test.speedWPM))).slice(0, 6);
  const freeCount = tests.filter((test) => test.isFree).length;
  const premiumCount = tests.filter((test) => !test.isFree).length;

  return (
    <section className="content-auto mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="space-y-12">
        <div className="space-y-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Practice</p>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">
            Dictation practice with adjustable speed and transcript-based scoring
          </h1>
          <p className="mx-auto max-w-3xl text-base leading-8 text-muted-foreground">
            Students can sign up, access free dictation practice after login, and upgrade later to
            unlock the premium dictation library.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <article className="rounded-[1.5rem] border border-border/70 bg-card/90 p-6 shadow-lg shadow-black/5">
            <p className="text-sm text-muted-foreground">Free dictations</p>
            <p className="mt-3 text-4xl font-semibold text-foreground">{freeCount}</p>
          </article>
          <article className="rounded-[1.5rem] border border-border/70 bg-card/90 p-6 shadow-lg shadow-black/5">
            <p className="text-sm text-muted-foreground">Premium dictations</p>
            <p className="mt-3 text-4xl font-semibold text-foreground">{premiumCount}</p>
          </article>
          <article className="rounded-[1.5rem] border border-border/70 bg-card/90 p-6 shadow-lg shadow-black/5">
            <p className="text-sm text-muted-foreground">Sample speeds</p>
            <p className="mt-3 text-2xl font-semibold text-foreground">
              {speedOptions.length > 0
                ? speedOptions.map((speed) => `${speed} WPM`).join(", ")
                : "Coming soon"}
            </p>
          </article>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-[2rem] border border-border/70 bg-card/90 p-8 shadow-lg shadow-black/5">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Free access</p>
            <h2 className="mt-3 text-3xl font-semibold text-foreground">
              Available after signup and login
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Logged-in students can begin with selected free dictations, practice at comfortable
              playback speeds, and review score, WPM, and accuracy inside the dashboard.
            </p>
          </article>
          <article className="rounded-[2rem] border border-primary/25 bg-primary/10 p-8 shadow-lg shadow-black/5">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Premium access</p>
            <h2 className="mt-3 text-3xl font-semibold text-foreground">
              Unlock the full dictation library
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Premium access unlocks more dictations, more speed coverage, and a stronger daily
              practice pipeline for serious shorthand preparation.
            </p>
          </article>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          {session?.user?.id ? (
            <Link href="/dashboard/tests" className={buttonVariants()}>
              {premiumUnlocked ? "Open premium practice" : "Open free practice"}
            </Link>
          ) : (
            <>
              <Link href="/signup" className={buttonVariants()}>
                Create free account
              </Link>
              <Link href="/login" className={buttonVariants({ variant: "outline" })}>
                Login to practice
              </Link>
            </>
          )}
          {!premiumUnlocked ? (
            <Link href="/pricing" className={buttonVariants({ variant: "outline" })}>
              View premium plans
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default PracticePage;
