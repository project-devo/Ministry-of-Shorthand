import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasActiveSubscription } from "@/lib/billing";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Download, CreditCard, Sparkles } from "lucide-react";
import { format } from "date-fns";

export default async function BillingPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const [isPremium, payments] = await Promise.all([
    hasActiveSubscription(session.user.id),
    prisma.payment.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing & Subscription</h1>
        <p className="text-muted-foreground mt-2">
          Manage your subscription and view payment history.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-primary/20 bg-background/50 backdrop-blur-xl relative overflow-hidden">
          {isPremium && (
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-bl-full -mr-8 -mt-8 pointer-events-none" />
          )}
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Current Plan
              {isPremium && <Badge className="ml-2 bg-primary/20 text-primary hover:bg-primary/30">Active</Badge>}
            </CardTitle>
            <CardDescription>
              {isPremium ? "You are on the Pro plan." : "You are on the Free plan."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-bold">
              {isPremium ? "₹999" : "₹0"} <span className="text-sm font-normal text-muted-foreground">/ month</span>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" /> Access to free dictations
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" /> Basic progress tracking
              </li>
              {isPremium && (
                <>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" /> Access to premium dictations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" /> Detailed error analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" /> Priority support
                  </li>
                </>
              )}
            </ul>
          </CardContent>
          <CardFooter>
            {!isPremium ? (
              <Button className="w-full">
                <Sparkles className="mr-2 h-4 w-4" /> Upgrade to Pro
              </Button>
            ) : (
              <Button variant="outline" className="w-full">
                Manage Subscription
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>

      <Card className="border-primary/20 bg-background/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>Review your past transactions.</CardDescription>
        </CardHeader>
        <CardContent>
          {payments.length > 0 ? (
            <div className="rounded-md border border-primary/10 overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Invoice</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium whitespace-nowrap">
                        {format(new Date(payment.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>₹{payment.amount}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={payment.status === "PAID" ? "default" : "secondary"}
                          className={payment.status === "PAID" ? "bg-green-500/20 text-green-600 hover:bg-green-500/30" : ""}
                        >
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {payment.status === "PAID" && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={`/api/billing/invoice/${payment.id}`} target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download invoice</span>
                            </a>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 border rounded-md border-dashed">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <p className="text-muted-foreground text-sm">
                No payment history available.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
