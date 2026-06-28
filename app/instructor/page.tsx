import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getInstructorOverview } from "@/lib/instructor";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Video } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function InstructorDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { courses, totalStudents, upcomingLiveClasses } = await getInstructorOverview(session.user.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Instructor Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back, {session.user.name}. Here&apos;s an overview of your teaching activity.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-muted-foreground">
              {courses.filter((c) => c.isPublished).length} published
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Enrolled across all courses
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Live Classes</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingLiveClasses.length}</div>
            <p className="text-xs text-muted-foreground">
              Scheduled in the future
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Courses</CardTitle>
            <CardDescription>Your recently created courses.</CardDescription>
          </CardHeader>
          <CardContent>
            {courses.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No courses yet. Contact admin to assign you to a course.
              </div>
            ) : (
              <div className="space-y-4">
                {courses.slice(0, 5).map((course) => (
                  <div key={course.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{course.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {course._count.enrollments} students • {course._count.sections} sections
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/instructor/courses/${course.id}`}>View</Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
            {courses.length > 5 && (
              <div className="mt-4">
                <Button variant="link" className="w-full" asChild>
                  <Link href="/instructor/courses">View all courses</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Live Classes</CardTitle>
            <CardDescription>Your next scheduled sessions.</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingLiveClasses.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No upcoming live classes.
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingLiveClasses.map((liveClass) => (
                  <div key={liveClass.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{liveClass.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(liveClass.scheduledAt).toLocaleString()}
                      </p>
                    </div>
                    {liveClass.meetLink && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={liveClass.meetLink} target="_blank" rel="noopener noreferrer">Join</a>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4">
              <Button variant="link" className="w-full" asChild>
                <Link href="/instructor/live-classes">Manage live classes</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
