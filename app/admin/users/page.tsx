import { getAdminUsers } from "@/lib/admin";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: { q?: string; role?: string; page?: string };
}) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const roleFilter = searchParams.role ? (searchParams.role as Role) : undefined;
  
  const { users, total } = await getAdminUsers(searchParams.q, roleFilter, { page, pageSize: 20 });
  const totalPages = Math.ceil(total / 20);

  async function handleSearch(formData: FormData) {
    "use server";
    const q = formData.get("q") as string;
    if (q) {
      redirect(`/admin/users?q=${encodeURIComponent(q)}`);
    } else {
      redirect(`/admin/users`);
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground mt-2">
            Manage all users, instructors, and admins across the platform.
          </p>
        </div>
      </div>

      <Card className="bg-background/50 backdrop-blur-xl border-primary/10">
        <CardHeader className="pb-4 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>All Users ({total})</CardTitle>
            <form action={handleSearch} className="flex items-center gap-2 max-w-sm w-full">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  name="q"
                  type="search" 
                  placeholder="Search name or email..." 
                  className="pl-9 bg-background/50" 
                  defaultValue={searchParams.q || ""}
                />
              </div>
              <Button type="submit" variant="secondary">Search</Button>
            </form>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Name & Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="pl-6">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.role === "ADMIN" ? "destructive" : user.role === "INSTRUCTOR" ? "default" : "secondary"}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.isBanned ? (
                          <Badge variant="destructive">Banned</Badge>
                        ) : user.emailVerified ? (
                          <Badge variant="outline" className="text-green-500 border-green-500/30">Active</Badge>
                        ) : (
                          <Badge variant="outline" className="text-yellow-500 border-yellow-500/30">Unverified</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {format(new Date(user.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button variant="ghost" size="sm">
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {totalPages > 1 && (
            <div className="p-4 border-t flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing page {page} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={page <= 1}
                  asChild={page > 1}
                >
                  {page > 1 ? (
                    <a href={`/admin/users?page=${page - 1}${searchParams.q ? `&q=${searchParams.q}` : ''}`}>Previous</a>
                  ) : "Previous"}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={page >= totalPages}
                  asChild={page < totalPages}
                >
                  {page < totalPages ? (
                    <a href={`/admin/users?page=${page + 1}${searchParams.q ? `&q=${searchParams.q}` : ''}`}>Next</a>
                  ) : "Next"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
