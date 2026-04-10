"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  BookOpen,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  Radio,
  ScrollText,
  UserRound,
} from "lucide-react";

const sidebarLinks = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/dashboard/courses", label: "My Courses", icon: GraduationCap },
  { href: "/dashboard/tests", label: "Practice Tests", icon: ScrollText },
  { href: "/dashboard/live-classes", label: "Live Classes", icon: Radio },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/profile", label: "Profile", icon: UserRound },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
];

export const DashboardSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 border-b border-border/70 bg-card/70 lg:w-72 lg:border-r lg:border-b-0">
      <div className="flex h-full flex-col gap-6 p-5">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
            Student Panel
          </p>
          <h2 className="text-2xl font-semibold text-foreground">Dashboard</h2>
        </div>

        <nav className="grid gap-2">
          {sidebarLinks.map((link) => {
            const isActive =
              pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));

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
            <BookOpen className="size-4" />
            Back to site
          </Link>
        </nav>
      </div>
    </aside>
  );
};
