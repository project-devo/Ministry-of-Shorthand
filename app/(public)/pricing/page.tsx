import Link from "next/link";
import { CheckCircle2, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/scroll-reveal";
import { HoverLift } from "@/components/hover-lift";

export const metadata = {
  title: "Pricing | Ministry of Shorthand",
  description: "Affordable plans for shorthand practice and video courses.",
};

export default function PricingPage() {
  return (
    <div className="container px-6 sm:px-8 lg:px-12 py-16 md:py-24">
      <ScrollReveal>
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <Badge variant="secondary" className="mb-4">Simple, Transparent Pricing</Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 font-heading">Invest in Your Stenography Career</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Choose the Practice Pass for unlimited dictations, or purchase video courses for structured learning. No hidden fees.
          </p>
        </div>
      </ScrollReveal>

      {/* Subscription Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-24">
        {/* Monthly Plan */}
        <HoverLift>
          <Card className="flex flex-col h-full relative overflow-hidden transition-all hover:border-primary/50 bg-background border-border/50">
            <CardHeader className="p-6 md:p-8">
              <CardTitle className="text-2xl font-heading">Monthly Pass</CardTitle>
              <CardDescription className="mt-1">Perfect for intensive exam prep.</CardDescription>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-5xl font-extrabold">₹499</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 px-6 md:px-8">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Unlimited access to all practice tests</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Real-time character-level scoring</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Detailed progress tracking & history</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Access to live doubt-clearing sessions</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="p-6 md:p-8 border-t border-border/30">
              <Link href="/dashboard/billing" className={cn(buttonVariants({ className: "w-full text-lg h-12" }))}>
                Subscribe Monthly
              </Link>
            </CardFooter>
          </Card>
        </HoverLift>

        {/* Annual Plan */}
        <HoverLift>
          <Card className="flex flex-col h-full border-primary/50 bg-primary/[0.03] relative overflow-hidden hover:border-primary/70 transition-colors duration-300">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] uppercase tracking-widest font-bold px-3.5 py-1.5 rounded-bl-lg">
              SAVE 20%
            </div>
            <CardHeader className="p-6 md:p-8">
              <CardTitle className="text-2xl font-heading">Annual Pass</CardTitle>
              <CardDescription className="mt-1">Best value for long-term practice.</CardDescription>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-5xl font-extrabold">₹4,790</span>
                <span className="text-muted-foreground">/yr</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 px-6 md:px-8">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="font-medium">Everything in Monthly, plus:</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>2 months free compared to monthly</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Priority email support</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Early access to new dictation speeds</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="p-6 md:p-8 border-t border-border/30">
              <Link href="/dashboard/billing" className={cn(buttonVariants({ className: "w-full text-lg h-12" }))}>
                Subscribe Annually
              </Link>
            </CardFooter>
          </Card>
        </HoverLift>
      </div>

      {/* Feature Comparison or FAQ */}
      <ScrollReveal>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 font-heading">Pass vs. Courses</h2>
            <p className="text-muted-foreground">Understand the difference between our subscription pass and individual courses.</p>
          </div>
          
          <div className="overflow-x-auto rounded-xl border border-border/50">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-primary/20 bg-muted/30">
                  <th className="p-4 md:p-5 font-bold text-lg w-1/3">Feature</th>
                  <th className="p-4 md:p-5 font-bold text-lg text-center w-1/3">Practice Pass</th>
                  <th className="p-4 md:p-5 font-bold text-lg text-center w-1/3">Video Courses</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                <tr className="hover:bg-muted/20 transition-colors">
                  <td className="p-4 md:p-5 font-medium">Payment Model</td>
                  <td className="p-4 md:p-5 text-center text-muted-foreground">Monthly or Annual Subscription</td>
                  <td className="p-4 md:p-5 text-center text-muted-foreground">One-time payment per course</td>
                </tr>
                <tr className="hover:bg-muted/20 transition-colors bg-muted/10">
                  <td className="p-4 md:p-5 font-medium">Access Duration</td>
                  <td className="p-4 md:p-5 text-center text-muted-foreground">While subscription is active</td>
                  <td className="p-4 md:p-5 text-center text-muted-foreground">Lifetime access</td>
                </tr>
                <tr className="hover:bg-muted/20 transition-colors">
                  <td className="p-4 md:p-5 font-medium">Practice Tests & Scoring</td>
                  <td className="p-4 md:p-5 text-center"><CheckCircle2 className="h-5 w-5 text-primary mx-auto" /></td>
                  <td className="p-4 md:p-5 text-center"><X className="h-5 w-5 text-muted-foreground/50 mx-auto" /></td>
                </tr>
                <tr className="hover:bg-muted/20 transition-colors bg-muted/10">
                  <td className="p-4 md:p-5 font-medium">Structured Video Lessons</td>
                  <td className="p-4 md:p-5 text-center"><X className="h-5 w-5 text-muted-foreground/50 mx-auto" /></td>
                  <td className="p-4 md:p-5 text-center"><CheckCircle2 className="h-5 w-5 text-primary mx-auto" /></td>
                </tr>
                <tr className="hover:bg-muted/20 transition-colors">
                  <td className="p-4 md:p-5 font-medium">Downloadable PDF Notes</td>
                  <td className="p-4 md:p-5 text-center"><X className="h-5 w-5 text-muted-foreground/50 mx-auto" /></td>
                  <td className="p-4 md:p-5 text-center"><CheckCircle2 className="h-5 w-5 text-primary mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </ScrollReveal>
      
      {/* CTA */}
      <ScrollReveal>
        <div className="mt-24 text-center bg-muted/30 py-14 px-8 rounded-2xl border border-border/50">
          <h3 className="text-2xl font-bold mb-4 font-heading">Still have questions?</h3>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
            If you&apos;re not sure which option is right for you, or if you need help with bulk enrollment for your institute, get in touch with us.
          </p>
          <Link href="/about#contact" className={cn(buttonVariants({ variant: "outline" }))}>
            Contact Support
          </Link>
        </div>
      </ScrollReveal>
    </div>
  );
}
