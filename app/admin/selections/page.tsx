import { getAdminSelectionResults } from "@/lib/admin";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import Image from "next/image";

export default async function AdminSelectionsPage() {
  const selections = await getAdminSelectionResults();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Selection Results</h1>
          <p className="text-muted-foreground mt-2">
            Manage successful student stories for the public page.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/selections/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Result
          </Link>
        </Button>
      </div>

      <Card className="bg-background/50 backdrop-blur-xl border-primary/10">
        <CardHeader className="pb-4 border-b">
          <CardTitle>Selection Results ({selections.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6 w-16">Photo</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Achievement</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selections.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                      No selection results found.
                    </TableCell>
                  </TableRow>
                ) : (
                  selections.map((selection) => (
                    <TableRow key={selection.id}>
                      <TableCell className="pl-6">
                        {selection.image ? (
                          <div className="relative h-10 w-10 rounded-full overflow-hidden">
                            <Image 
                              src={selection.image} 
                              alt={selection.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                            {selection.name.charAt(0)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {selection.name}
                      </TableCell>
                      <TableCell>
                        {selection.achievement}
                      </TableCell>
                      <TableCell>
                        {selection.batch || "-"}
                      </TableCell>
                      <TableCell>
                        {selection.sortOrder}
                      </TableCell>
                      <TableCell>
                        {selection.isPublished ? (
                          <Badge variant="outline" className="text-green-500 border-green-500/30">Published</Badge>
                        ) : (
                          <Badge variant="secondary">Draft</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/selections/${selection.id}`}>
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
