import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getStudentOverview } from "@/lib/dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Target, 
  Trophy, 
  Flame,
  ArrowRight,
  Clock,
  Video,
  User
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const overview = await getStudentOverview(session.user.id);
  
  // Basic mock stats until we have full test history aggregation
  // In a real app we would compute this in getStudentOverview
  const stats = {
    testsTaken: 12, // Mock
    avgAccuracy: 94, // Mock
    streakDays: 3, // Mock
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-heading">Welcome back, {session.user.name?.split(" ")[0]}!</h1>
        <p className="text-muted-foreground mt-2">
          Here&apos;s an overview of your stenography progress.
        </p>
      </div>

      <div className="grid gap-5 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/20 bg-background/50 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium">Courses Enrolled</CardTitle>
            <div className="p-1.5 rounded-md bg-primary/10"><BookOpen className="h-4 w-4 text-primary" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.courseProgress.length}</div>
            <p className="text-xs text-muted-foreground">Active courses</p>
          </CardContent>
        </Card>
        
        <Card className="border-primary/20 bg-background/50 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium">Tests Taken</CardTitle>
            <div className="p-1.5 rounded-md bg-cyan-500/10"><Target className="h-4 w-4 text-cyan-500" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.testsTaken}</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>
        
        <Card className="border-primary/20 bg-background/50 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium">Avg Accuracy</CardTitle>
            <div className="p-1.5 rounded-md bg-emerald-500/10"><Trophy className="h-4 w-4 text-emerald-500" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgAccuracy}%</div>
            <p className="text-xs text-muted-foreground">+1.2% improvement</p>
          </CardContent>
        </Card>
        
        <Card className="border-primary/20 bg-background/50 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <div className="p-1.5 rounded-md bg-orange-500/10"><Flame className="h-4 w-4 text-orange-500" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.streakDays} Days</div>
            <p className="text-xs text-muted-foreground">Keep it up!</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4 border-primary/20 bg-background/50 backdrop-blur-xl flex flex-col">
          <CardHeader>
            <CardTitle>Continue Learning</CardTitle>
            <CardDescription>Pick up where you left off</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            {overview.courseProgress.length > 0 ? (
              <div className="space-y-8">
                {overview.courseProgress.slice(0, 3).map((course) => (
                  <div key={course.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-full sm:w-24 h-16 rounded-md bg-muted overflow-hidden flex-shrink-0 relative">
                      {course.thumbnail ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={course.thumbnail} alt={course.title} className="object-cover w-full h-full" />
                        </>
                      ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-primary" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2 w-full">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-sm line-clamp-1">{course.title}</h4>
                        <span className="text-xs font-medium text-muted-foreground">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                    <Button variant="outline" size="sm" asChild className="w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
                      <Link href={`/dashboard/courses/${course.id}`}>Continue</Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">No courses yet</p>
                  <p className="text-sm text-muted-foreground">Enroll in a course to get started.</p>
                </div>
                <Button asChild>
                  <Link href="/courses">Browse Courses</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="col-span-1 lg:col-span-3 space-y-4">
          <Card className="border-primary/20 bg-background/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {overview.recentAttempt ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{overview.recentAttempt.test.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(overview.recentAttempt.createdAt), "MMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                    <Badge variant={Number(overview.recentAttempt.accuracy) >= 95 ? "default" : "secondary"} className="bg-background/50">
                      {Number(overview.recentAttempt.accuracy).toFixed(1)}% Acc
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Speed: <span className="font-medium text-foreground">{overview.recentAttempt.actualWpm} WPM</span></span>
                    <Link href={`/dashboard/practice/${overview.recentAttempt.test.id}/result`} className="text-primary hover:underline flex items-center">
                      View Details <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  No practice tests taken yet.
                </div>
              )}
            </CardContent>
          </Card>

          {overview.upcomingLiveClass && (
            <Card className="border-primary/50 shadow-md bg-primary/5 backdrop-blur-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-bl-full -mr-8 -mt-8 pointer-events-none" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <Video className="mr-2 h-4 w-4 text-primary" /> 
                  Upcoming Live Class
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h3 className="font-bold line-clamp-1">{overview.upcomingLiveClass.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1.5 h-3.5 w-3.5" />
                    {format(new Date(overview.upcomingLiveClass.scheduledAt), "EEE, MMM d • h:mm a")}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="mr-1.5 h-3.5 w-3.5" />
                    {overview.upcomingLiveClass.instructor.name}
                  </div>
                  <Button asChild className="w-full mt-2">
                    <a href={overview.upcomingLiveClass.meetLink} target="_blank" rel="noopener noreferrer">
                      Join Class
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

