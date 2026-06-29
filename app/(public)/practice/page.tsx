import Link from "next/link";
import { getPublicPracticeTests } from "@/lib/practice";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Headphones, Activity, Lock, ArrowRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ScrollReveal } from "@/components/scroll-reveal";
import { HoverLift } from "@/components/hover-lift";

export const metadata = {
  title: "Practice Tests | Ministry of Shorthand",
  description: "Test your stenography speed and accuracy with our real-time shorthand dictation practice tool.",
};

export default async function PracticeLandingPage() {
  const allTests = await getPublicPracticeTests();
  
  // Group tests by level
  const beginnnerTests = allTests.filter(t => t.level === "BEGINNER");
  const intermediateTests = allTests.filter(t => t.level === "INTERMEDIATE");
  const advancedTests = allTests.filter(t => t.level === "ADVANCED");

  return (
    <div className="container px-6 sm:px-8 lg:px-12 py-16 md:py-24">
      <ScrollReveal>
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <Badge variant="secondary" className="mb-4">Real-Time Evaluation</Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 font-heading">Dictation Practice Tests</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Listen to professional dictations, transcribe them, and get instant character-level accuracy scoring and WPM evaluation.
          </p>
        </div>
      </ScrollReveal>

      <Tabs defaultValue="all" className="w-full max-w-5xl mx-auto">
        <div className="flex justify-center mb-8">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="beginner">Beginner</TabsTrigger>
            <TabsTrigger value="intermediate">Inter.</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="space-y-12 mt-0">
          {beginnnerTests.length > 0 && <TestSection title="Beginner (60-80 WPM)" tests={beginnnerTests} />}
          {intermediateTests.length > 0 && <TestSection title="Intermediate (80-100 WPM)" tests={intermediateTests} />}
          {advancedTests.length > 0 && <TestSection title="Advanced (100+ WPM)" tests={advancedTests} />}
        </TabsContent>
        
        <TabsContent value="beginner" className="mt-0">
          <TestSection title="Beginner Practice Tests" tests={beginnnerTests} />
        </TabsContent>
        
        <TabsContent value="intermediate" className="mt-0">
          <TestSection title="Intermediate Practice Tests" tests={intermediateTests} />
        </TabsContent>
        
        <TabsContent value="advanced" className="mt-0">
          <TestSection title="Advanced Practice Tests" tests={advancedTests} />
        </TabsContent>
      </Tabs>

      {allTests.length === 0 && (
        <div className="text-center py-24 bg-muted/30 rounded-lg border border-dashed max-w-5xl mx-auto">
          <Headphones className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No practice tests found</h3>
          <p className="text-muted-foreground mt-2">
            Check back later for new dictation tests.
          </p>
        </div>
      )}

      {/* Promo Banner */}
      <ScrollReveal>
        <div className="mt-20 bg-primary text-primary-foreground rounded-2xl p-8 md:p-12 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,var(--color-primary-foreground)/0.08,transparent_60%)] pointer-events-none" />
          <div className="max-w-xl relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 font-heading">Want unlimited access?</h2>
            <p className="text-primary-foreground/80 text-lg leading-relaxed">
              Subscribe to our Practice Pass for just ₹499/month and get unlimited access to all tests across all speeds, plus detailed error analysis.
            </p>
          </div>
          <Link href="/pricing" className={cn(buttonVariants({ size: "lg", variant: "secondary" }), "font-bold shrink-0 relative z-10 shadow-lg")}>
            Get Practice Pass
          </Link>
        </div>
      </ScrollReveal>
    </div>
  );
}

function TestSection({ title, tests }: { title: string; tests: { id: string; title: string; speedWPM: number; isFree: boolean; [key: string]: unknown }[] }) {
  if (tests.length === 0) return null;
  
  return (
    <div className="space-y-8">
      <ScrollReveal>
        <div className="flex items-center gap-3 border-b border-border/50 pb-3">
          <div className="p-1.5 rounded-md bg-primary/10">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold font-heading">{title}</h2>
        </div>
      </ScrollReveal>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map((test) => (
          <HoverLift key={test.id}>
            <Card className="flex flex-col h-full hover:border-primary/50 transition-colors duration-300 bg-background border-border/50">
              <CardHeader className="pb-3 p-6">
                <div className="flex justify-between items-start">
                  <Badge variant={test.isFree ? "default" : "secondary"}>
                    {test.isFree ? "Free" : "Premium"}
                  </Badge>
                  <div className="flex items-center text-sm font-bold bg-muted px-2.5 py-1 rounded-md">
                    {test.speedWPM} WPM
                  </div>
                </div>
                <CardTitle className="text-lg mt-3 line-clamp-1">{test.title}</CardTitle>
              </CardHeader>
              
              <CardFooter className="pt-3 mt-auto border-t border-border/30 p-6">
                <Link 
                  href={test.isFree ? `/dashboard/practice/${test.id}` : `/pricing`}
                  className={cn(buttonVariants({ variant: test.isFree ? "default" : "outline" }), "w-full group")}
                >
                  {test.isFree ? (
                    <>Start Practice <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /></>
                  ) : (
                    <>Subscribe to Unlock <Lock className="ml-2 h-4 w-4" /></>
                  )}
                </Link>
              </CardFooter>
            </Card>
          </HoverLift>
        ))}
      </div>
    </div>
  );
}
