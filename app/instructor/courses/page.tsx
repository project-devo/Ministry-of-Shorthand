import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getInstructorCourses } from "@/lib/instructor";
import { redirect } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function InstructorCoursesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const courses = await getInstructorCourses(session.user.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
          <p className="text-muted-foreground mt-2">
            View the courses you are assigned to teach and track student progress.
          </p>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        {courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No courses found</h3>
            <p className="text-sm text-muted-foreground max-w-sm mt-2">
              You haven&apos;t been assigned as an instructor to any courses yet. Contact an administrator to be assigned to a course.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Students</TableHead>
                <TableHead className="text-right">Sections</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">
                    {course.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{course.level}</Badge>
                  </TableCell>
                  <TableCell>
                    {course.isPublished ? (
                      <Badge className="bg-green-600 hover:bg-green-700">Published</Badge>
                    ) : (
                      <Badge variant="secondary">Draft</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {course._count.enrollments}
                  </TableCell>
                  <TableCell className="text-right">
                    {course._count.sections}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/instructor/courses/${course.id}`}>
                        View Students
                      </Link>
                    </Button>
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
