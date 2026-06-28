import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPracticeTests, isValidPracticeLevel } from "@/lib/dashboard";
import { PracticeFilters } from "@/components/practice-filters";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Keyboard, Lock, Play, Music } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default async function DashboardPracticePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const levelParam = typeof searchParams.level === "string" ? searchParams.level : undefined;
  const speedParam = typeof searchParams.speed === "string" ? parseInt(searchParams.speed, 10) : undefined;

  const level = isValidPracticeLevel(levelParam) ? levelParam : undefined;
  const speed = !isNaN(speedParam as number) ? speedParam : undefined;

  const tests = await getPracticeTests({
    userId: session.user.id,
    level,
    speed,
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Practice Library</h1>
        <p className="text-muted-foreground mt-2">
          Select a dictation to start practicing your shorthand skills.
        </p>
      </div>

      <Suspense fallback={<div className="h-10 w-full animate-pulse bg-muted rounded-md mb-6" />}>
        <PracticeFilters />
      </Suspense>

      {tests.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {tests.map((test) => (
            <Card 
              key={test.id} 
              className={`flex flex-col overflow-hidden border-primary/20 bg-background/50 backdrop-blur-xl transition-all ${
                test.hasAccess ? "hover:border-primary/50" : "opacity-80"
              }`}
            >
              <CardHeader className="pb-3 border-b bg-muted/20">
                <div className="flex justify-between items-start gap-4">
                  <CardTitle className="text-lg line-clamp-2">{test.title}</CardTitle>
                  {!test.hasAccess && (
                    <div className="bg-muted p-2 rounded-full shrink-0">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1 pt-4 pb-2 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant={test.isFree ? "default" : "secondary"}>
                    {test.isFree ? "Free" : "Premium"}
                  </Badge>
                  <Badge variant="outline" className="bg-background/50">
                    {test.level}
                  </Badge>
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                    {test.speedWPM} WPM
                  </Badge>
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <Music className="mr-2 h-4 w-4" />
                  Audio Dictation Included
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                {test.hasAccess ? (
                  <Button className="w-full" asChild>
                    <Link href={`/dashboard/practice/${test.id}`}>
                      <Play className="mr-2 h-4 w-4" /> Start Practice
                    </Link>
                  </Button>
                ) : (
                  <Button variant="secondary" className="w-full" asChild>
                    <Link href="/dashboard/billing">
                      Upgrade to Access
                    </Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-primary/20 bg-background/50 backdrop-blur-xl text-center py-12">
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Keyboard className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">No tests found</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                No practice tests match your current filters. Try adjusting them to see more options.
              </p>
            </div>
            <Button variant="outline" asChild className="mt-4">
              <Link href="/dashboard/practice">Clear Filters</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
