import Link from "next/link";
import { CheckCircle2, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Pricing | Ministry of Shorthand",
  description: "Affordable plans for shorthand practice and video courses.",
};

export default function PricingPage() {
  return (
    <div className="container py-16">
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <Badge variant="secondary" className="mb-4">Simple, Transparent Pricing</Badge>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Invest in Your Stenography Career</h1>
        <p className="text-lg text-muted-foreground">
          Choose the Practice Pass for unlimited dictations, or purchase video courses for structured learning. No hidden fees.
        </p>
      </div>

      {/* Subscription Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-24">
        {/* Monthly Plan */}
        <Card className="flex flex-col relative overflow-hidden transition-all hover:border-primary/50">
          <CardHeader>
            <CardTitle className="text-2xl">Monthly Pass</CardTitle>
            <CardDescription>Perfect for intensive exam prep.</CardDescription>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-5xl font-extrabold">₹499</span>
              <span className="text-muted-foreground">/mo</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
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
          <CardFooter>
            <Link href="/dashboard/billing" className={cn(buttonVariants({ className: "w-full text-lg h-12" }))}>
              Subscribe Monthly
            </Link>
          </CardFooter>
        </Card>

        {/* Annual Plan */}
        <Card className="flex flex-col relative overflow-hidden border-primary bg-primary/5">
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
            SAVE 20%
          </div>
          <CardHeader>
            <CardTitle className="text-2xl">Annual Pass</CardTitle>
            <CardDescription>Best value for long-term practice.</CardDescription>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-5xl font-extrabold">₹4,790</span>
              <span className="text-muted-foreground">/yr</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
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
          <CardFooter>
            <Link href="/dashboard/billing" className={cn(buttonVariants({ className: "w-full text-lg h-12" }))}>
              Subscribe Annually
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/* Feature Comparison or FAQ */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Pass vs. Courses</h2>
          <p className="text-muted-foreground">Understand the difference between our subscription pass and individual courses.</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-primary/20">
                <th className="p-4 font-bold text-lg w-1/3">Feature</th>
                <th className="p-4 font-bold text-lg text-center w-1/3">Practice Pass</th>
                <th className="p-4 font-bold text-lg text-center w-1/3">Video Courses</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="p-4 font-medium">Payment Model</td>
                <td className="p-4 text-center text-muted-foreground">Monthly or Annual Subscription</td>
                <td className="p-4 text-center text-muted-foreground">One-time payment per course</td>
              </tr>
              <tr>
                <td className="p-4 font-medium">Access Duration</td>
                <td className="p-4 text-center text-muted-foreground">While subscription is active</td>
                <td className="p-4 text-center text-muted-foreground">Lifetime access</td>
              </tr>
              <tr>
                <td className="p-4 font-medium">Practice Tests & Scoring</td>
                <td className="p-4 text-center"><CheckCircle2 className="h-5 w-5 text-primary mx-auto" /></td>
                <td className="p-4 text-center"><X className="h-5 w-5 text-muted-foreground mx-auto" /></td>
              </tr>
              <tr>
                <td className="p-4 font-medium">Structured Video Lessons</td>
                <td className="p-4 text-center"><X className="h-5 w-5 text-muted-foreground mx-auto" /></td>
                <td className="p-4 text-center"><CheckCircle2 className="h-5 w-5 text-primary mx-auto" /></td>
              </tr>
              <tr>
                <td className="p-4 font-medium">Downloadable PDF Notes</td>
                <td className="p-4 text-center"><X className="h-5 w-5 text-muted-foreground mx-auto" /></td>
                <td className="p-4 text-center"><CheckCircle2 className="h-5 w-5 text-primary mx-auto" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* CTA */}
      <div className="mt-24 text-center bg-muted py-12 px-6 rounded-2xl border">
        <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          If you&apos;re not sure which option is right for you, or if you need help with bulk enrollment for your institute, get in touch with us.
        </p>
        <Link href="/about#contact" className={cn(buttonVariants({ variant: "outline" }))}>
          Contact Support
        </Link>
      </div>
    </div>
  );
}
