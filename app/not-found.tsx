import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

const NotFoundPage = () => {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full rounded-[2rem] border border-border/70 bg-card/90 p-8 text-center shadow-xl shadow-black/5">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">404</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground">Page not found</h1>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          The page you requested does not exist, may have moved, or is still being prepared.
        </p>
        <div className="mt-6 flex justify-center">
          <Link href="/" className={buttonVariants()}>
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
