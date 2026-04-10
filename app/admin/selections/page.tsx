import Image from "next/image";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { SelectionResultForm } from "@/components/admin/SelectionResultForm";
import { getAdminSelectionResults } from "@/lib/admin";

const AdminSelectionsPage = async () => {
  const selections = await getAdminSelectionResults();

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Selections</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          Student success and result highlights
        </h1>
      </div>

      <div className="rounded-[1.5rem] border border-border/70 bg-card/90 p-6 shadow-lg shadow-black/5">
        <SelectionResultForm />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {selections.length > 0 ? (
          selections.map((selection) => (
            <article
              key={selection.id}
              className="rounded-[1.5rem] border border-border/70 bg-card/90 p-6 shadow-lg shadow-black/5"
            >
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative h-28 w-28 overflow-hidden rounded-2xl border border-border/70 bg-muted">
                  {selection.image ? (
                    <Image
                      src={selection.image}
                      alt={`${selection.name} selection result`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-3xl font-semibold text-primary">
                      {selection.name.slice(0, 1)}
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground">{selection.name}</h2>
                    <p className="text-sm text-muted-foreground">{selection.batch}</p>
                  </div>
                  <p className="text-base text-foreground">{selection.achievement}</p>
                  {selection.quote ? (
                    <p className="text-sm leading-7 text-muted-foreground">
                      &quot;{selection.quote}&quot;
                    </p>
                  ) : null}
                  <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    <span>{selection.isPublished ? "Published" : "Hidden"}</span>
                    <span>Sort {selection.sortOrder}</span>
                  </div>
                </div>
                <div className="shrink-0">
                  <DeleteButton endpoint={`/api/admin/selections/${selection.id}`} label="Selection result" />
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-border bg-card/60 p-8 text-sm text-muted-foreground xl:col-span-2">
            No selection results have been added yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSelectionsPage;
