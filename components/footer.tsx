"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup") || pathname.startsWith("/forgot-password") || pathname.startsWith("/reset-password") || pathname.startsWith("/verify-email");
  const isDashboardPage = pathname.startsWith("/dashboard") || pathname.startsWith("/admin") || pathname.startsWith("/instructor");

  if (isAuthPage || isDashboardPage) return null;

  return (
    <footer className="bg-muted/20">
      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Ministry of Shorthand</h3>
            <p className="text-sm text-muted-foreground">
              Master Exam-Ready Stenography with our comprehensive courses, practice tests, and live classes.
            </p>
            <p className="text-xs text-primary/60 font-medium uppercase tracking-wider mt-2">Practice • Learn • Succeed</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/courses" className="hover:text-primary transition-colors duration-200">Courses</Link></li>
              <li><Link href="/practice" className="hover:text-primary transition-colors duration-200">Practice Tests</Link></li>
              <li><Link href="/pricing" className="hover:text-primary transition-colors duration-200">Pricing</Link></li>
              <li><Link href="/selections" className="hover:text-primary transition-colors duration-200">Selections</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider">About</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors duration-200">About Us</Link></li>
              <li><Link href="/about#contact" className="hover:text-primary transition-colors duration-200">Contact</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors duration-200">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors duration-200">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-14 pt-8 border-t flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Ministry of Shorthand. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
