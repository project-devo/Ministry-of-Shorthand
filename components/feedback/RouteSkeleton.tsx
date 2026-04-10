export const RouteSkeleton = ({
  blocks = 4,
  title = "Loading content",
}: {
  blocks?: number;
  title?: string;
}) => {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-3">
        <div className="h-4 w-32 animate-pulse rounded-full bg-secondary" />
        <div className="h-10 w-full max-w-xl animate-pulse rounded-2xl bg-secondary" />
        <div className="h-5 w-full max-w-2xl animate-pulse rounded-2xl bg-secondary/80" />
        <span className="sr-only">{title}</span>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: blocks }).map((_, index) => (
          <div
            key={`${title}-${index}`}
            className="space-y-4 rounded-[1.5rem] border border-border/70 bg-card/80 p-6 shadow-lg shadow-black/5"
          >
            <div className="aspect-[16/10] animate-pulse rounded-[1.25rem] bg-secondary" />
            <div className="h-6 w-3/4 animate-pulse rounded-full bg-secondary" />
            <div className="h-4 w-full animate-pulse rounded-full bg-secondary/80" />
            <div className="h-4 w-2/3 animate-pulse rounded-full bg-secondary/80" />
          </div>
        ))}
      </div>
    </div>
  );
};
