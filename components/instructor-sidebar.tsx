"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  BookOpen, 
  Video, 
  Upload,
  LogOut
} from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Overview", href: "/instructor", icon: LayoutDashboard },
  { name: "My Courses", href: "/instructor/courses", icon: BookOpen },
  { name: "Lesson Upload", href: "/instructor/upload", icon: Upload },
  { name: "Live Classes", href: "/instructor/live-classes", icon: Video },
];

export function InstructorSidebar({ user }: { user: any }) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r bg-background/50 backdrop-blur-xl h-screen sticky top-0">
      <div className="p-6 border-b">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 bg-amber-600 text-white flex items-center justify-center rounded-lg font-bold shadow-md group-hover:scale-105 transition-transform">
            MO
          </div>
          <span className="font-bold text-lg tracking-tight">
            MoShorthand
          </span>
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          // Exact match for overview to avoid highlighting everything
          const isReallyActive = item.href === "/instructor" ? pathname === "/instructor" : isActive;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isReallyActive 
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", isReallyActive ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground")} />
              {item.name}
            </Link>
          );
        })}
      </div>
      
      <div className="p-4 border-t">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
