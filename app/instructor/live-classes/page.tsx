import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getInstructorLiveClasses } from "@/lib/instructor";
import { redirect } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Video } from "lucide-react";
import { LiveClassForm } from "./live-class-form";
import { DeleteLiveClassButton } from "./delete-live-class-button";

export const dynamic = "force-dynamic";

export default async function InstructorLiveClassesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const liveClasses = await getInstructorLiveClasses(session.user.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Live Classes</h1>
          <p className="text-muted-foreground mt-2">
            Schedule and manage live interactive sessions for your students.
          </p>
        </div>
        <LiveClassForm />
      </div>

      <div className="rounded-md border bg-card">
        {liveClasses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Video className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No live classes</h3>
            <p className="text-sm text-muted-foreground max-w-sm mt-2">
              You haven&apos;t scheduled any live classes yet. Click the button above to schedule one.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Meeting Link</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {liveClasses.map((liveClass) => (
                <TableRow key={liveClass.id}>
                  <TableCell className="font-medium">
                    {liveClass.title}
                  </TableCell>
                  <TableCell>
                    {new Date(liveClass.scheduledAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {liveClass.meetLink ? (
                      <a 
                        href={liveClass.meetLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        Join Link
                      </a>
                    ) : (
                      <span className="text-muted-foreground italic">Not set</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DeleteLiveClassButton liveClassId={liveClass.id} />
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
