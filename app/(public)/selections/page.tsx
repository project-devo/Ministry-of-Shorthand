import Image from "next/image";
import { InquiryDialog } from "@/components/public/InquiryDialog";
import { getPublishedSelectionResults } from "@/lib/dashboard";
import { buildMetadata } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Our Selections",
  description:
    "See student success stories and shorthand selection results from Ministry of Shorthand.",
  path: "/selections",
});

const SelectionsPage = async () => {
  const selections = await getPublishedSelectionResults();

  return (
    <section className="content-auto mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="space-y-12">
        <div className="space-y-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
            Our Selections
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">
            Student results that reflect disciplined preparation
          </h1>
          <p className="mx-auto max-w-3xl text-base leading-8 text-muted-foreground">
            These student outcomes highlight the kind of consistency, guided practice, and exam
            focus the institute is built to support.
          </p>
        </div>

        {selections.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {selections.map((selection) => (
              <article
                key={selection.id}
                className="rounded-[2rem] border border-border/70 bg-card/90 p-6 shadow-lg shadow-black/5"
              >
                <div className="flex flex-col gap-5 sm:flex-row">
                  <div className="relative h-28 w-28 overflow-hidden rounded-2xl border border-border/70 bg-muted">
                    {selection.image ? (
                      <Image
                        src={selection.image}
                        alt={`${selection.name} success result`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-3xl font-semibold text-primary">
                        {selection.name.slice(0, 1)}
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h2 className="text-2xl font-semibold text-foreground">{selection.name}</h2>
                      <p className="text-sm text-muted-foreground">{selection.batch}</p>
                    </div>
                    <p className="text-base leading-7 text-foreground">{selection.achievement}</p>
                    {selection.quote ? (
                      <p className="text-sm leading-7 text-muted-foreground">
                        &quot;{selection.quote}&quot;
                      </p>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-border bg-card/60 p-8 text-sm text-muted-foreground">
            Selection results will appear here once they are added from the admin panel.
          </div>
        )}

        <div className="rounded-[2rem] border border-border/70 bg-gradient-to-br from-primary/15 via-card to-accent/10 p-8 text-center shadow-xl shadow-black/5">
          <h2 className="text-3xl font-semibold text-foreground">Want to discuss your preparation path?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
            Use the inquiry form for course guidance, admissions questions, or practice-plan support.
          </p>
          <div className="mt-6 flex justify-center">
            <InquiryDialog buttonLabel="Submit an inquiry" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SelectionsPage;
