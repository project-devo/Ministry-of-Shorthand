"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  CalendarClock,
  GraduationCap,
  LayoutDashboard,
  LibraryBig,
  Upload,
} from "lucide-react";

const instructorLinks = [
  { href: "/instructor", label: "Overview", icon: LayoutDashboard },
  { href: "/instructor/courses", label: "My Courses", icon: GraduationCap },
  { href: "/instructor/upload", label: "Upload Lesson", icon: Upload },
  { href: "/instructor/live-classes", label: "Live Classes", icon: CalendarClock },
];

export const InstructorSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 border-b border-border/70 bg-card/70 lg:w-72 lg:border-r lg:border-b-0">
      <div className="flex h-full flex-col gap-6 p-5">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
            Instructor Panel
          </p>
          <h2 className="text-2xl font-semibold text-foreground">Teaching Hub</h2>
        </div>

        <nav className="grid gap-2">
          {instructorLinks.map((link) => {
            const isActive =
              pathname === link.href || (link.href !== "/instructor" && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <link.icon className="size-4" />
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/dashboard"
            className="mt-4 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <LibraryBig className="size-4" />
            Student dashboard
          </Link>
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <BookOpen className="size-4" />
            Back to site
          </Link>
        </nav>
      </div>
    </aside>
  );
};
