import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  // Admin and Instructor can also access the student dashboard
  // Only completely unauthenticated or banned users are prevented.
  // We rely on proxy.ts for strict role-based routing checks if needed.

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-background">
      <DashboardSidebar user={session.user} />
      <div className="flex-1 flex flex-col w-full min-w-0">
        <DashboardHeader user={session.user} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
