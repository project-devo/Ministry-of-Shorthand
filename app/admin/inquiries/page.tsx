import { getAdminInquiries } from "@/lib/admin";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function AdminInquiriesPage() {
  const inquiries = await getAdminInquiries();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inquiries</h1>
          <p className="text-muted-foreground mt-2">
            View and manage contact form submissions.
          </p>
        </div>
      </div>

      <Card className="bg-background/50 backdrop-blur-xl border-primary/10">
        <CardHeader className="pb-4 border-b">
          <CardTitle>All Inquiries ({inquiries.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Contact Info</TableHead>
                  <TableHead>Interest</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inquiries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                      No inquiries found.
                    </TableCell>
                  </TableRow>
                ) : (
                  inquiries.map((inquiry) => (
                    <TableRow key={inquiry.id}>
                      <TableCell className="pl-6">
                        <div className="font-medium">{inquiry.name}</div>
                        <div className="text-sm text-muted-foreground">{inquiry.email}</div>
                        {inquiry.phone && <div className="text-xs text-muted-foreground">{inquiry.phone}</div>}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{inquiry.interest}</Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <p className="truncate text-sm" title={inquiry.message}>
                          {inquiry.message}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge variant={inquiry.status === "NEW" ? "destructive" : inquiry.status === "CONTACTED" ? "default" : "secondary"}>
                          {inquiry.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(inquiry.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button variant="ghost" size="sm">
                          View
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
