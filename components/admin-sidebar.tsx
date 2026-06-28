"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  BookOpen, 
  Keyboard, 
  Users,
  MessageSquare,
  Bell, 
  Video, 
  Award,
  Upload,
  LogOut
} from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Courses", href: "/admin/courses", icon: BookOpen },
  { name: "Practice Tests", href: "/admin/tests", icon: Keyboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
  { name: "Notifications", href: "/admin/notifications", icon: Bell },
  { name: "Live Classes", href: "/admin/live-classes", icon: Video },
  { name: "Selections", href: "/admin/selections", icon: Award },
  { name: "Uploads", href: "/admin/uploads", icon: Upload },
];

export function AdminSidebar({ user: _user }: { user?: unknown }) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r bg-background/50 backdrop-blur-xl h-screen sticky top-0">
      <div className="p-6 border-b">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 bg-red-600 text-white flex items-center justify-center rounded-lg font-bold shadow-md group-hover:scale-105 transition-transform">
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
          const isReallyActive = item.href === "/admin" ? pathname === "/admin" : isActive;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isReallyActive 
                  ? "bg-red-500/10 text-red-600 dark:text-red-400" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", isReallyActive ? "text-red-600 dark:text-red-400" : "text-muted-foreground")} />
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
