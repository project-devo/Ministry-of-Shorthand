import { buildMetadata } from "@/lib/site";

export const metadata = buildMetadata({
  title: "About",
  description:
    "Learn about the mission behind Ministry of Shorthand and the institute's student-first approach.",
  path: "/about",
});

const AboutPage = () => {
  return (
    <section className="content-auto mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="space-y-10">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">About</p>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">
            A focused institute for shorthand and stenography preparation
          </h1>
          <p className="max-w-3xl text-base leading-8 text-muted-foreground">
            Ministry of Shorthand is built for students who want a disciplined learning environment,
            structured dictation practice, and a clearer route toward shorthand-heavy competitive
            exams and professional opportunities.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-[1.5rem] border border-border/70 bg-card/90 p-6 shadow-lg shadow-black/5">
            <h2 className="mb-3 text-2xl font-semibold text-foreground">Our mission</h2>
            <p className="text-sm leading-7 text-muted-foreground">
              Build a serious shorthand institute experience online that combines strong pedagogy,
              repeated dictation practice, clean technology, and student-first clarity.
            </p>
          </article>
          <article className="rounded-[1.5rem] border border-border/70 bg-card/90 p-6 shadow-lg shadow-black/5">
            <h2 className="mb-3 text-2xl font-semibold text-foreground">Our approach</h2>
            <p className="text-sm leading-7 text-muted-foreground">
              We believe shorthand improvement comes from structured lessons, regular dictation,
              transcript-aware evaluation, guided revision, and measurable progress over time.
            </p>
          </article>
        </div>

        <div className="rounded-[2rem] border border-border/70 bg-gradient-to-br from-primary/10 via-card to-accent/10 p-8 shadow-xl shadow-black/5">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">Why this platform exists</h2>
          <div className="space-y-4 text-sm leading-7 text-muted-foreground">
            <p>
              Many shorthand aspirants still rely on scattered notes, inconsistent routines, and
              dictation workflows that do not reflect the seriousness of their preparation.
              Ministry of Shorthand exists to bring structure and confidence into that process.
            </p>
            <p>
              The institute model combines public guidance, free logged-in practice, premium
              dictation content, paid courses, and student result visibility through one system.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
