import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Headphones, PlayCircle, Trophy } from "lucide-react";
import { InquiryDialog } from "@/components/public/InquiryDialog";
import { CourseCard } from "@/components/public/CourseCard";
import { buttonVariants } from "@/components/ui/button";
import { getPopularCourses } from "@/lib/courses";
import { getPublishedSelectionResults } from "@/lib/dashboard";
import { featureList, howItWorksSteps, pricingPlans, testimonialList } from "@/lib/public-content";
import { buildMetadata } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Home",
  description:
    "Ministry of Shorthand offers shorthand courses, dictation practice, premium preparation, and institute-style support for serious aspirants.",
  path: "/",
});

const LandingPage = async () => {
  const [popularCourses, selectionResults] = await Promise.all([
    getPopularCourses(),
    getPublishedSelectionResults(4),
  ]);

  return (
    <div className="space-y-24 pb-24">
      <section className="border-b border-border/50">
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-24">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              Shorthand training, dictation practice, and selection-focused preparation
            </div>
            <div className="space-y-6">
              <h1 className="max-w-3xl text-5xl font-semibold leading-tight tracking-tight text-foreground sm:text-6xl">
                Learn shorthand with structured teaching and practice at the speed you need.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                Ministry of Shorthand combines institute-style courses, free logged-in dictation
                practice, premium preparation, and guided support for SSC, court, and stenography
                aspirants.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/practice" className={buttonVariants({ className: "h-12 px-6" })}>
                Start dictation practice
                <Headphones className="size-4" />
              </Link>
              <Link
                href="/courses"
                className={buttonVariants({
                  variant: "outline",
                  className: "h-12 px-6",
                })}
              >
                Explore courses
                <ArrowRight className="size-4" />
              </Link>
              <InquiryDialog buttonLabel="Inquiry" className="h-12 px-6" />
            </div>
            <div className="grid gap-4 text-sm text-muted-foreground sm:grid-cols-3">
              <div className="rounded-2xl border border-border/70 bg-card/70 p-4">
                Free dictation practice available after signup
              </div>
              <div className="rounded-2xl border border-border/70 bg-card/70 p-4">
                Premium content unlocks deeper speed practice
              </div>
              <div className="rounded-2xl border border-border/70 bg-card/70 p-4">
                Student selections and institute-style guidance
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-card/80 p-4 shadow-2xl shadow-black/10">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">
              <Image
                src="/hero-illustration.svg"
                alt="Students learning shorthand with lessons and dictation tools"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="content-auto mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
            Features
          </p>
          <h2 className="text-3xl font-semibold text-foreground">
            Everything needed for shorthand preparation
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featureList.map((feature) => (
            <article
              key={feature.title}
              className="rounded-[1.5rem] border border-border/70 bg-card/80 p-6 shadow-lg shadow-black/5"
            >
              <feature.icon className="mb-5 size-8 text-primary" />
              <h3 className="mb-3 text-xl font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm leading-6 text-muted-foreground">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-auto mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
            How It Works
          </p>
          <h2 className="text-3xl font-semibold text-foreground">
            A practical path from free practice to premium preparation
          </h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {howItWorksSteps.map((step, index) => (
            <article
              key={step.title}
              className="rounded-[1.5rem] border border-border/70 bg-card/80 p-6 shadow-lg shadow-black/5"
            >
              <div className="mb-6 flex size-12 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                0{index + 1}
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">{step.title}</h3>
              <p className="text-sm leading-6 text-muted-foreground">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-auto mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-gradient-to-br from-primary/15 via-card to-accent/10 p-8 shadow-xl shadow-black/5 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                Dictation Practice
              </p>
              <h2 className="text-3xl font-semibold text-foreground">
                Practice at different speeds with transcript-based results
              </h2>
              <p className="text-base leading-7 text-muted-foreground">
                Free practice is available after login. Premium plans unlock more dictations, more
                speed coverage, and a stronger daily practice rhythm.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/practice" className={buttonVariants()}>
                  View practice options
                  <PlayCircle className="size-4" />
                </Link>
                <Link href="/pricing" className={buttonVariants({ variant: "outline" })}>
                  Unlock premium
                </Link>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-2xl border border-border/70 bg-background/75 p-4">
                <p className="text-sm font-medium text-foreground">Free access</p>
                <p className="mt-2 text-sm text-muted-foreground">Available after signup and login.</p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/75 p-4">
                <p className="text-sm font-medium text-foreground">Speed control</p>
                <p className="mt-2 text-sm text-muted-foreground">Playback can be adjusted to support progression.</p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/75 p-4">
                <p className="text-sm font-medium text-foreground">Premium depth</p>
                <p className="mt-2 text-sm text-muted-foreground">More dictations and stronger exam preparation.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="content-auto mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              Popular Courses
            </p>
            <h2 className="text-3xl font-semibold text-foreground">
              Published courses students can start now
            </h2>
          </div>
          <Link href="/courses" className="text-sm font-semibold text-primary hover:underline">
            Browse all courses
          </Link>
        </div>
        {popularCourses.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {popularCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-border bg-card/60 p-8 text-sm text-muted-foreground">
            Published courses will appear here once they are added from the admin side.
          </div>
        )}
      </section>

      <section className="content-auto mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              Our Selections
            </p>
            <h2 className="text-3xl font-semibold text-foreground">
              Results that reflect disciplined shorthand preparation
            </h2>
          </div>
          <Link href="/selections" className="text-sm font-semibold text-primary hover:underline">
            View all results
          </Link>
        </div>
        {selectionResults.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {selectionResults.map((selection) => (
              <article
                key={selection.id}
                className="rounded-[1.5rem] border border-border/70 bg-card/80 p-5 shadow-lg shadow-black/5"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="relative h-14 w-14 overflow-hidden rounded-full border border-border/70 bg-muted">
                    {selection.image ? (
                      <Image
                        src={selection.image}
                        alt={`${selection.name} selection result`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center font-semibold text-primary">
                        {selection.name.slice(0, 1)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{selection.name}</h3>
                    <p className="text-xs text-muted-foreground">{selection.batch}</p>
                  </div>
                </div>
                <p className="text-sm leading-6 text-foreground">{selection.achievement}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-border bg-card/60 p-8 text-sm text-muted-foreground">
            Selection results will appear here once they are added from the admin panel.
          </div>
        )}
      </section>

      <section className="content-auto mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
            Testimonials
          </p>
          <h2 className="text-3xl font-semibold text-foreground">
            Learners want structure they can trust
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {testimonialList.map((testimonial) => (
            <article
              key={testimonial.name}
              className="rounded-[1.5rem] border border-border/70 bg-card/80 p-6 shadow-lg shadow-black/5"
            >
              <p className="mb-6 text-base leading-7 text-foreground">
                &quot;{testimonial.quote}&quot;
              </p>
              <div>
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="content-auto mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-gradient-to-br from-primary/15 via-card to-accent/10 p-8 shadow-xl shadow-black/5 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                Pricing
              </p>
              <h2 className="text-3xl font-semibold text-foreground">
                Choose a study plan that matches your preparation level
              </h2>
              <p className="text-base leading-7 text-muted-foreground">
                Start with free logged-in practice, move monthly for flexibility, or choose annual
                access for the most efficient exam cycle.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/pricing" className={buttonVariants({ variant: "outline" })}>
                  See all plans
                </Link>
                <InquiryDialog buttonLabel="Talk to our team" className="h-10 px-5" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {pricingPlans.map((plan) => (
                <div
                  key={plan.name}
                  className="rounded-2xl border border-border/70 bg-background/75 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">{plan.name}</h3>
                    <span className="text-sm font-semibold text-primary">{plan.price}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="content-auto mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-border/70 bg-card/90 p-8 text-center shadow-lg shadow-black/5">
          <div className="mx-auto max-w-3xl space-y-4">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Trophy className="size-6" />
            </div>
            <h2 className="text-3xl font-semibold text-foreground">
              Need guidance about courses, practice plans, or admissions?
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Use the inquiry form and the team can respond with course guidance, payment help, or
              the right dictation practice path for your current level.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <InquiryDialog buttonLabel="Open inquiry form" className="h-12 px-6" />
              <Link
                href="/about"
                className={buttonVariants({ variant: "outline", className: "h-12 px-6" })}
              >
                Learn about the institute
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
