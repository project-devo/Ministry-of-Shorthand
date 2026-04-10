import Link from "next/link";
import { InquiryDialog } from "@/components/public/InquiryDialog";

export const Footer = () => {
  return (
    <footer className="border-t border-border/70 bg-background/80">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-10 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-foreground">
            Ministry of Shorthand
          </p>
          <p className="max-w-md text-sm text-muted-foreground">
            Exam-focused shorthand and stenography learning for disciplined, long-term progress.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <Link href="/practice" className="hover:text-foreground">
            Practice
          </Link>
          <Link href="/courses" className="hover:text-foreground">
            Courses
          </Link>
          <Link href="/selections" className="hover:text-foreground">
            Selections
          </Link>
          <Link href="/pricing" className="hover:text-foreground">
            Pricing
          </Link>
          <Link href="/blog" className="hover:text-foreground">
            Blog
          </Link>
          <Link href="/about" className="hover:text-foreground">
            About
          </Link>
          <InquiryDialog
            buttonLabel="Inquiry"
            className="h-auto border-none bg-transparent px-0 py-0 text-sm font-normal text-muted-foreground shadow-none hover:bg-transparent hover:text-foreground"
          />
        </div>
      </div>
    </footer>
  );
};
