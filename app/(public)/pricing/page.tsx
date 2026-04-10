import { getBillingData } from "@/lib/billing";
import { getServerAuthSession } from "@/lib/session";
import { Check } from "lucide-react";
import { SubscriptionButton } from "@/components/payment/SubscriptionButton";
import { pricingPlans } from "@/lib/public-content";
import { buildMetadata } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Pricing",
  description:
    "Choose between free access, monthly flexibility, or annual shorthand learning plans.",
  path: "/pricing",
});

const PricingPage = async () => {
  const session = await getServerAuthSession();
  const billingData = session?.user?.id ? await getBillingData(session.user.id) : null;

  return (
    <section className="content-auto mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 space-y-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Pricing</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          Plans that support serious shorthand preparation
        </h1>
        <p className="mx-auto max-w-2xl text-base leading-7 text-muted-foreground">
          Start with free logged-in dictation practice, stay flexible month to month, or commit to
          a full preparation cycle with annual premium access.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {pricingPlans.map((plan, index) => (
          <article
            key={plan.name}
            className={`rounded-[2rem] border p-8 shadow-xl shadow-black/5 ${
              index === 1
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border/70 bg-card/90 text-card-foreground"
            }`}
          >
            <div className="mb-8 space-y-3">
              <h2 className="text-2xl font-semibold">{plan.name}</h2>
              <p className="text-4xl font-semibold">{plan.price}</p>
              <p className={index === 1 ? "text-primary-foreground/85" : "text-muted-foreground"}>
                {plan.description}
              </p>
            </div>
            <div className="space-y-4">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <Check className="mt-0.5 size-4 shrink-0" />
                  <p className="text-sm leading-6">{feature}</p>
                </div>
              ))}
            </div>
            {plan.name === "Free" ? null : (
              <div className="mt-8">
                <SubscriptionButton
                  isAuthenticated={Boolean(session?.user?.id)}
                  isCurrentPlan={billingData?.activePlan?.plan === plan.name.toUpperCase()}
                  plan={plan.name.toUpperCase() as "MONTHLY" | "ANNUAL"}
                  price={plan.price}
                  userEmail={session?.user?.email}
                  userName={session?.user?.name}
                />
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};

export default PricingPage;
