import { getAdminTests } from "@/lib/admin";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function AdminTestsPage() {
  const tests = await getAdminTests();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Practice Tests</h1>
          <p className="text-muted-foreground mt-2">
            Manage dictation and transcription tests.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/tests/new">
            <Plus className="mr-2 h-4 w-4" />
            New Test
          </Link>
        </Button>
      </div>

      <Card className="bg-background/50 backdrop-blur-xl border-primary/10">
        <CardHeader className="pb-4 border-b">
          <CardTitle>All Tests ({tests.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Title</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Speed</TableHead>
                  <TableHead>Access</TableHead>
                  <TableHead>Attempts</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                      No practice tests found.
                    </TableCell>
                  </TableRow>
                ) : (
                  tests.map((test) => (
                    <TableRow key={test.id}>
                      <TableCell className="pl-6 font-medium">
                        {test.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{test.level}</Badge>
                      </TableCell>
                      <TableCell>
                        {test.speedWPM} WPM
                      </TableCell>
                      <TableCell>
                        {test.isFree ? (
                          <Badge variant="secondary">Free</Badge>
                        ) : (
                          <Badge variant="default">Premium</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {test._count.attempts}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/tests/${test.id}`}>
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
