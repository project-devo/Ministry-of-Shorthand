import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { InstructorSidebar } from "@/components/instructor-sidebar";
import { InstructorHeader } from "@/components/instructor-header";
import { prisma } from "@/lib/prisma";

export default async function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  // Instructor layouts allow INSTRUCTOR (and ADMIN)
  if (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, image: true },
  });

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-background">
      <InstructorSidebar user={user} />
      <div className="flex-1 flex flex-col min-w-0">
        <InstructorHeader user={user} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
