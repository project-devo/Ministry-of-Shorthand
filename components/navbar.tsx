"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { Button, buttonVariants } from "@/components/ui/button";
import { Bell, Menu, Moon, Sun, User as UserIcon, Settings, LogOut, CheckCircle2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { setTheme, theme } = useTheme();
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      fetch("/api/notifications")
        .then((res) => res.json())
        .then((data) => {
          if (data?.data?.unreadCount) {
            setUnreadCount(data.data.unreadCount);
          }
        })
        .catch(console.error);
    }
  }, [session]);

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup") || pathname.startsWith("/forgot-password") || pathname.startsWith("/reset-password") || pathname.startsWith("/verify-email");

  if (isAuthPage) return null;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl hidden sm:inline-block">Ministry of Shorthand</span>
            <span className="font-bold text-xl sm:hidden">MoS</span>
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium">
            <Link href="/courses" className="transition-colors hover:text-foreground/80 text-foreground/60">Courses</Link>
            <Link href="/practice" className="transition-colors hover:text-foreground/80 text-foreground/60">Practice</Link>
            <Link href="/pricing" className="transition-colors hover:text-foreground/80 text-foreground/60">Pricing</Link>
            <Link href="/selections" className="transition-colors hover:text-foreground/80 text-foreground/60">Selections</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="hidden sm:flex"
          >
            <Sun className="h-5 w-5 dark:hidden" />
            <Moon className="hidden h-5 w-5 dark:block" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {session ? (
            <>
              {session.user.role === "STUDENT" && (
                <Link 
                  href="/dashboard/notifications" 
                  className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "relative hidden sm:flex")}
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
                  )}
                  <span className="sr-only">Notifications</span>
                </Link>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost" }), "relative h-8 w-8 rounded-full p-0")}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                    <AvatarFallback>{session.user.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session.user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {session.user.role === "ADMIN" && (
                    <Link href="/admin">
                      <DropdownMenuItem><Settings className="mr-2 h-4 w-4" /> Admin Dashboard</DropdownMenuItem>
                    </Link>
                  )}
                  {(session.user.role === "ADMIN" || session.user.role === "INSTRUCTOR") && (
                    <Link href="/instructor">
                      <DropdownMenuItem><UserIcon className="mr-2 h-4 w-4" /> Instructor Dashboard</DropdownMenuItem>
                    </Link>
                  )}
                  <Link href="/dashboard">
                    <DropdownMenuItem><CheckCircle2 className="mr-2 h-4 w-4" /> Student Dashboard</DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login" className={buttonVariants({ variant: "ghost" })}>
                Log in
              </Link>
              <Link href="/signup" className={buttonVariants({ variant: "default" })}>
                Get Started
              </Link>
            </div>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
              <div className="p-6 border-b">
                <Link href="/" className="flex items-center gap-2 font-bold text-lg" onClick={() => setOpen(false)}>
                  Ministry of Shorthand
                </Link>
              </div>
              <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {[
                  { name: "Courses", href: "/courses" },
                  { name: "Practice", href: "/practice" },
                  { name: "Pricing", href: "/pricing" },
                  { name: "Selections", href: "/selections" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                      pathname === item.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="p-4 border-t space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-muted-foreground"
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                >
                  <Sun className="mr-2 h-5 w-5 dark:hidden" />
                  <Moon className="mr-2 hidden h-5 w-5 dark:block" />
                  Toggle theme
                </Button>
                {session ? (
                  <>
                    {session.user.role === "ADMIN" && (
                      <Link href="/admin" onClick={() => setOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                          <Settings className="mr-2 h-5 w-5" /> Admin Dashboard
                        </Button>
                      </Link>
                    )}
                    {(session.user.role === "ADMIN" || session.user.role === "INSTRUCTOR") && (
                      <Link href="/instructor" onClick={() => setOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                          <UserIcon className="mr-2 h-5 w-5" /> Instructor Dashboard
                        </Button>
                      </Link>
                    )}
                    <Link href="/dashboard" onClick={() => setOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                        <CheckCircle2 className="mr-2 h-5 w-5" /> Student Dashboard
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-muted-foreground"
                      onClick={() => signOut()}
                    >
                      <LogOut className="mr-2 h-5 w-5" />
                      Log out
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link href="/login" onClick={() => setOpen(false)}>
                      <Button variant="ghost" className="w-full">Log in</Button>
                    </Link>
                    <Link href="/signup" onClick={() => setOpen(false)}>
                      <Button variant="default" className="w-full">Get Started</Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
