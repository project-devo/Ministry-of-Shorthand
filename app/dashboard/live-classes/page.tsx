import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUpcomingLiveClasses } from "@/lib/dashboard";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Clock, User, Calendar } from "lucide-react";
import { format } from "date-fns";

export default async function LiveClassesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const upcomingClasses = await getUpcomingLiveClasses();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Live Classes</h1>
        <p className="text-muted-foreground mt-2">
          Join upcoming live sessions with our expert instructors.
        </p>
      </div>

      {upcomingClasses.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {upcomingClasses.map((liveClass) => (
            <Card key={liveClass.id} className="border-primary/20 bg-background/50 backdrop-blur-xl overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full -mr-8 -mt-8 pointer-events-none transition-transform group-hover:scale-110 group-hover:bg-primary/20" />
              
              <CardHeader className="pb-3">
                <CardTitle className="text-lg line-clamp-2">{liveClass.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4 text-primary/70" />
                    <span className="font-medium text-foreground">{format(new Date(liveClass.scheduledAt), "EEEE, MMMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4 text-primary/70" />
                    <span>{format(new Date(liveClass.scheduledAt), "h:mm a")}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <User className="mr-2 h-4 w-4 text-primary/70" />
                    <span>{liveClass.instructor.name}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2 pb-4">
                <Button className="w-full shadow-md hover:shadow-lg transition-all" asChild>
                  <a href={liveClass.meetLink} target="_blank" rel="noopener noreferrer">
                    <Video className="mr-2 h-4 w-4" /> Join Class
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-primary/20 bg-background/50 backdrop-blur-xl text-center py-12">
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Video className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">No upcoming classes</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                There are no live classes scheduled at the moment. Please check back later.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
