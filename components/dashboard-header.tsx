"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  Menu,
  LayoutDashboard, 
  BookOpen, 
  Keyboard, 
  History, 
  Video, 
  Bell, 
  CreditCard, 
  User,
  LogOut,
  Moon,
  Sun
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Courses", href: "/dashboard/courses", icon: BookOpen },
  { name: "Practice Tests", href: "/dashboard/practice", icon: Keyboard },
  { name: "Test History", href: "/dashboard/test-history", icon: History },
  { name: "Live Classes", href: "/dashboard/live-classes", icon: Video },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { name: "Profile", href: "/dashboard/profile", icon: User },
];

export function DashboardHeader({ user }: { user: { name?: string | null; image?: string | null } }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-xl px-4 md:px-6">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger render={<Button variant="ghost" size="icon" className="lg:hidden" />}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0">
          <div className="p-6 border-b">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg" onClick={() => setOpen(false)}>
              <div className="h-8 w-8 bg-primary text-primary-foreground flex items-center justify-center rounded-lg">
                MO
              </div>
              MoShorthand
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {navItems.map((item) => {
              const isActive = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
          <div className="p-4 border-t">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-muted-foreground"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Sign Out
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      
      <div className="flex-1">
        {/* Breadcrumb or Page Title could go here */}
      </div>
      
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="text-muted-foreground"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        
        <Link href="/dashboard/profile">
          <Avatar className="h-8 w-8 cursor-pointer border hover:border-primary transition-colors">
            <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
            <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
}
