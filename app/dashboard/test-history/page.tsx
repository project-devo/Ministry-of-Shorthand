import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTestHistory } from "@/lib/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { History, ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function TestHistoryPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const history = await getTestHistory(session.user.id);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Test History</h1>
        <p className="text-muted-foreground mt-2">
          Review your past performances and track your progress.
        </p>
      </div>

      <Card className="border-primary/20 bg-background/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-lg">All Attempts</CardTitle>
        </CardHeader>
        <CardContent>
          {history.length > 0 ? (
            <div className="rounded-md border border-primary/10 overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Test Title</TableHead>
                    <TableHead>Target Speed</TableHead>
                    <TableHead>Your Speed</TableHead>
                    <TableHead>Accuracy</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((attempt) => (
                    <TableRow key={attempt.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium whitespace-nowrap">
                        {format(new Date(attempt.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>{attempt.test.title}</TableCell>
                      <TableCell>{attempt.test.speedWPM} WPM</TableCell>
                      <TableCell>{attempt.actualWpm} WPM</TableCell>
                      <TableCell>
                        <Badge variant={Number(attempt.accuracy) >= 95 ? "default" : "secondary"}>
                          {Number(attempt.accuracy).toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell>{Number(attempt.score).toFixed(1)}</TableCell>
                      <TableCell className="text-right">
                        <Link 
                          href={`/dashboard/practice/${attempt.test.id}/result?attemptId=${attempt.id}`}
                          className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                        >
                          View <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <History className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">No test history</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  You haven&apos;t taken any practice tests yet. Take a test to see your history here.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
