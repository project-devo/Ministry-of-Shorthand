import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getInstructorCourseStudents } from "@/lib/instructor";
import { notFound, redirect } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const dynamic = "force-dynamic";

export default async function InstructorCourseDetailPage({
  params,
}: {
  params: { courseId: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const course = await getInstructorCourseStudents(params.courseId, session.user.id);

  if (!course) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/instructor/courses">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
          <p className="text-muted-foreground mt-1">
            Student Progress ({course.students.length} enrolled)
          </p>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        {course.students.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <h3 className="text-lg font-medium">No students enrolled yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm mt-2">
              Once students enroll in this course, their progress will appear here.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Enrolled Date</TableHead>
                <TableHead>Lessons Completed</TableHead>
                <TableHead className="w-[200px]">Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {course.students.map((enrollment) => (
                <TableRow key={enrollment.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{enrollment.student.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{enrollment.student.name}</p>
                        <p className="text-xs text-muted-foreground">{enrollment.student.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(enrollment.enrolledAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {enrollment.completedLessons} / {course.totalLessons}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={enrollment.progressPercent} className="h-2" />
                      <span className="text-xs font-medium w-8 text-right">
                        {enrollment.progressPercent}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
