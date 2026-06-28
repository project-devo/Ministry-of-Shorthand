import { getAdminCourses } from "@/lib/admin";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function AdminCoursesPage() {
  const courses = await getAdminCourses();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
          <p className="text-muted-foreground mt-2">
            Manage all courses, curriculum, and enrollments.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/courses/new">
            <Plus className="mr-2 h-4 w-4" />
            New Course
          </Link>
        </Button>
      </div>

      <Card className="bg-background/50 backdrop-blur-xl border-primary/10">
        <CardHeader className="pb-4 border-b">
          <CardTitle>All Courses ({courses.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Title</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Metrics</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                      No courses found.
                    </TableCell>
                  </TableRow>
                ) : (
                  courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="pl-6 font-medium">
                        {course.title}
                        <div className="text-xs text-muted-foreground font-normal mt-1">
                          by {course.instructor.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{course.level}</Badge>
                      </TableCell>
                      <TableCell>
                        {Number(course.price) > 0 ? `₹${Number(course.price)}` : "Free"}
                      </TableCell>
                      <TableCell>
                        {course.isPublished ? (
                          <Badge variant="outline" className="text-green-500 border-green-500/30">Published</Badge>
                        ) : (
                          <Badge variant="secondary">Draft</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{course._count.sections} sections</div>
                          <div className="text-muted-foreground">{course._count.enrollments} students</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/courses/${course.id}`}>
                            Manage
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
