import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getStudentCoursePlayer } from "@/lib/dashboard";
import { CoursePlayer } from "@/components/course-player";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function DashboardCoursePlayerPage({
  params,
}: {
  params: { courseId: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const course = await getStudentCoursePlayer(session.user.id, params.courseId);

  if (!course) {
    // If not enrolled or doesn't exist
    notFound();
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/courses">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-bold tracking-tight">{course.title}</h1>
      </div>
      
      <CoursePlayer course={course} />
    </div>
  );
}
