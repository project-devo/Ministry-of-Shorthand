import { SignupChart } from "@/components/admin/SignupChart";
import { getAdminDashboardData } from "@/lib/admin";

const AdminHomePage = async () => {
  const data = await getAdminDashboardData();

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Admin Dashboard</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">Platform overview</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <article className="rounded-[1.5rem] border border-border/70 bg-card/90 p-6 shadow-lg shadow-black/5">
          <p className="text-sm text-muted-foreground">Total users</p>
          <p className="mt-3 text-4xl font-semibold text-foreground">{data.totalUsers}</p>
        </article>
        <article className="rounded-[1.5rem] border border-border/70 bg-card/90 p-6 shadow-lg shadow-black/5">
          <p className="text-sm text-muted-foreground">Total revenue</p>
          <p className="mt-3 text-4xl font-semibold text-foreground">INR {data.totalRevenue}</p>
        </article>
        <article className="rounded-[1.5rem] border border-border/70 bg-card/90 p-6 shadow-lg shadow-black/5">
          <p className="text-sm text-muted-foreground">Active subscriptions</p>
          <p className="mt-3 text-4xl font-semibold text-foreground">{data.activeSubscriptions}</p>
        </article>
      </div>

      <div className="rounded-[1.5rem] border border-border/70 bg-card/90 p-6 shadow-lg shadow-black/5">
        <h2 className="mb-6 text-2xl font-semibold text-foreground">New signups</h2>
        {data.signupChartData.length > 0 ? (
          <SignupChart data={data.signupChartData} />
        ) : (
          <p className="text-sm text-muted-foreground">Signup data will appear once users register.</p>
        )}
      </div>
    </div>
  );
};

export default AdminHomePage;
