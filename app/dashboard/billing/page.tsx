import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getBillingData } from "@/lib/billing";
import { getRequiredStudentSession } from "@/lib/session";

const BillingPage = async () => {
  const session = await getRequiredStudentSession();
  const billing = await getBillingData(session.user.id);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Billing</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">Payments and subscription status</h1>
      </div>

      <div className="rounded-[1.5rem] border border-border/70 bg-card/90 p-6 shadow-lg shadow-black/5">
        <h2 className="mb-4 text-2xl font-semibold text-foreground">Active plan</h2>
        {billing.activePlan ? (
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <span className="font-semibold text-foreground">{billing.activePlan.plan}</span> plan is
              active.
            </p>
            <p>
              Valid from{" "}
              {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(
                billing.activePlan.startDate,
              )}{" "}
              to{" "}
              {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(
                billing.activePlan.endDate,
              )}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No active subscription plan found.</p>
        )}
      </div>

      <div className="rounded-[1.5rem] border border-border/70 bg-card/90 p-6 shadow-lg shadow-black/5">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold text-foreground">Payment history</h2>
          <Link href="/pricing" className="text-sm font-semibold text-primary hover:underline">
            View pricing
          </Link>
        </div>
        {billing.paymentHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-border text-muted-foreground">
                <tr>
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3 pr-4">Description</th>
                  <th className="pb-3 pr-4">Amount</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {billing.paymentHistory.map((payment) => (
                  <tr key={payment.id} className="border-b border-border/50">
                    <td className="py-4 pr-4 text-muted-foreground">
                      {new Intl.DateTimeFormat("en-IN", {
                        dateStyle: "medium",
                      }).format(payment.createdAt)}
                    </td>
                    <td className="py-4 pr-4 text-foreground">
                      {payment.description ??
                        payment.course?.title ??
                        payment.subscriptionPlan ??
                        payment.kind}
                    </td>
                    <td className="py-4 pr-4 text-foreground">
                      {payment.currency} {payment.amount}
                    </td>
                    <td className="py-4 pr-4 text-muted-foreground">{payment.status}</td>
                    <td className="py-4 pr-4">
                      <Link
                        href={`/api/billing/invoice/${payment.id}`}
                        className={buttonVariants({ variant: "outline", size: "sm" })}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Download PDF
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No payment history found yet.</p>
        )}
      </div>
    </div>
  );
};

export default BillingPage;
