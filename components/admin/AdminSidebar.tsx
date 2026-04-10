"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BellRing,
  BookCopy,
  CalendarClock,
  GraduationCap,
  Mail,
  LayoutDashboard,
  NotebookPen,
  ScrollText,
  Trophy,
  Users,
} from "lucide-react";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/courses", label: "Courses", icon: BookCopy },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/tests", label: "Practice Tests", icon: ScrollText },
  { href: "/admin/selections", label: "Selections", icon: Trophy },
  { href: "/admin/inquiries", label: "Inquiries", icon: Mail },
  { href: "/admin/live-classes", label: "Live Classes", icon: CalendarClock },
  { href: "/admin/notifications", label: "Notifications", icon: BellRing },
];

export const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 border-b border-border/70 bg-card/70 lg:w-72 lg:border-r lg:border-b-0">
      <div className="flex h-full flex-col gap-6 p-5">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
            Admin Panel
          </p>
          <h2 className="text-2xl font-semibold text-foreground">Control Center</h2>
        </div>

        <nav className="grid gap-2">
          {adminLinks.map((link) => {
            const isActive =
              pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));

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
            href="/"
            className="mt-4 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <GraduationCap className="size-4" />
            Back to site
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <NotebookPen className="size-4" />
            Student dashboard
          </Link>
        </nav>
      </div>
    </aside>
  );
};
