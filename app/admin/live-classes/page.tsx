import { getAdminLiveClasses } from "@/lib/admin";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";
import { Plus, ExternalLink } from "lucide-react";

export default async function AdminLiveClassesPage() {
  const liveClasses = await getAdminLiveClasses();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Live Classes</h1>
          <p className="text-muted-foreground mt-2">
            Manage scheduled live sessions and meet links.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/live-classes/new">
            <Plus className="mr-2 h-4 w-4" />
            Schedule Class
          </Link>
        </Button>
      </div>

      <Card className="bg-background/50 backdrop-blur-xl border-primary/10">
        <CardHeader className="pb-4 border-b">
          <CardTitle>Scheduled Classes ({liveClasses.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Title</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Scheduled For</TableHead>
                  <TableHead>Meet Link</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {liveClasses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                      No live classes scheduled.
                    </TableCell>
                  </TableRow>
                ) : (
                  liveClasses.map((liveClass) => (
                    <TableRow key={liveClass.id}>
                      <TableCell className="pl-6 font-medium">
                        {liveClass.title}
                      </TableCell>
                      <TableCell>
                        {liveClass.instructor.name}
                      </TableCell>
                      <TableCell>
                        {format(new Date(liveClass.scheduledAt), "MMM d, yyyy h:mm a")}
                      </TableCell>
                      <TableCell>
                        {liveClass.meetLink ? (
                          <a 
                            href={liveClass.meetLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-primary hover:underline text-sm"
                          >
                            Join Link <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-muted-foreground text-sm">Not set</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/live-classes/${liveClass.id}`}>
                            Edit
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
