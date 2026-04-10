import { UserActions } from "@/components/admin/UserActions";
import { getAdminUsers } from "@/lib/admin";

const AdminUsersPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) => {
  const { query } = await searchParams;
  const users = await getAdminUsers(query);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Users</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">Manage user access</h1>
      </div>

      <form className="max-w-md">
        <input
          type="text"
          name="query"
          defaultValue={query ?? ""}
          placeholder="Search by name or email"
          className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm"
        />
      </form>

      <div className="overflow-x-auto rounded-[1.5rem] border border-border/70 bg-card/90 p-6 shadow-lg shadow-black/5">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border text-muted-foreground">
            <tr>
              <th className="pb-3 pr-4">Name</th>
              <th className="pb-3 pr-4">Email</th>
              <th className="pb-3 pr-4">Role</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-border/50">
                <td className="py-4 pr-4 text-foreground">{user.name}</td>
                <td className="py-4 pr-4 text-muted-foreground">{user.email}</td>
                <td className="py-4 pr-4 text-muted-foreground">{user.role}</td>
                <td className="py-4 pr-4 text-muted-foreground">
                  {user.isBanned ? "Banned" : "Active"}
                </td>
                <td className="py-4 pr-4">
                  <UserActions userId={user.id} role={user.role} isBanned={user.isBanned} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersPage;
