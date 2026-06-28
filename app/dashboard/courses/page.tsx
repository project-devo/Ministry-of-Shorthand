import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getStudentCourses } from "@/lib/dashboard";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import Link from "next/link";

export default async function DashboardCoursesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const courses = await getStudentCourses(session.user.id);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
        <p className="text-muted-foreground mt-2">
          Pick up where you left off or start a new lesson.
        </p>
      </div>

      {courses.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id} className="border-primary/20 bg-background/50 backdrop-blur-xl overflow-hidden flex flex-col hover:border-primary/50 transition-colors">
              <div className="aspect-video w-full bg-muted relative">
                {course.thumbnail ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={course.thumbnail} alt={course.title} className="object-cover w-full h-full" />
                  </>
                ) : (
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-10 w-10 text-primary/50" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-2">
                  <Badge variant="secondary" className="bg-background/80 backdrop-blur-md">
                    {course.level}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-2">{course.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Overall Progress</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
                <div className="text-xs text-muted-foreground">
                  {course.completedLessons} of {course.totalLessons} lessons completed
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button className="w-full" asChild>
                  <Link href={`/dashboard/courses/${course.id}`}>
                    {course.progress === 0 ? "Start Course" : "Continue"}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-primary/20 bg-background/50 backdrop-blur-xl text-center py-12">
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">No courses yet</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                You haven&apos;t enrolled in any courses yet. Browse our library to get started.
              </p>
            </div>
            <Button asChild className="mt-4">
              <Link href="/courses">Browse Courses</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
