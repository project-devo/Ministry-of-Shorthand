import Link from "next/link";
import { InquiryDialog } from "@/components/public/InquiryDialog";
import { ModeToggle } from "@/components/layout/ModeToggle";

const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/practice", label: "Practice" },
  { href: "/courses", label: "Courses" },
  { href: "/selections", label: "Selections" },
  { href: "/blog", label: "Blog" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.24em] text-foreground"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
              MS
            </span>
            <span className="hidden sm:inline">Ministry of Shorthand</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <InquiryDialog buttonLabel="Inquiry" className="hidden h-10 md:inline-flex" />
            <Link
              href="/login"
              className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground md:inline"
            >
              Login
            </Link>
            <ModeToggle />
          </div>
        </div>

        <nav className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1 md:hidden">
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="shrink-0 rounded-full border border-border/70 bg-card/80 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <InquiryDialog buttonLabel="Inquiry" className="shrink-0 rounded-full" />
        </nav>
      </div>
    </header>
  );
};
