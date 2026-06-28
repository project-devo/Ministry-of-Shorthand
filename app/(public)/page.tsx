import Link from "next/link";
import Image from "next/image";
import { getPopularCourses } from "@/lib/courses";
import { getPublishedSelectionResults } from "@/lib/selections";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, PlayCircle, Headphones, Trophy, Video, Mic, BarChart, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Ministry of Shorthand | Master Exam-Ready Stenography",
  description: "The ultimate platform for stenography aspirants. Practice tests, real-time scoring, live classes, and structured courses.",
};

export default async function LandingPage() {
  const [courses, selections] = await Promise.all([
    getPopularCourses(),
    getPublishedSelectionResults(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-background pt-24 pb-32">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)] dark:bg-grid-white/5" />
        <div className="container relative z-10 flex flex-col items-center text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-1 text-sm rounded-full">
            The #1 Platform for Shorthand Practice
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Master Exam-Ready Stenography with Real-Time Feedback
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10">
            Listen to dictations, type your transcription, and get instant, character-level accuracy scoring. Join thousands of successful candidates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/signup" className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}>
              Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/courses" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto")}>
              Explore Courses
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Features Section */}
      <section className="py-24 bg-muted/50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need to clear the skill test</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Our platform is designed specifically for SSC Steno, Court Reporter, and other shorthand exams.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-background border-border/50">
              <CardHeader>
                <Mic className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Audio Dictations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">High-quality audio dictations at various speeds (60 WPM to 120+ WPM) matching real exam standards.</p>
              </CardContent>
            </Card>
            <Card className="bg-background border-border/50">
              <CardHeader>
                <BarChart className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Real-Time Scoring</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Instant evaluation using character-level comparison. See exactly where you made mistakes.</p>
              </CardContent>
            </Card>
            <Card className="bg-background border-border/50">
              <CardHeader>
                <Video className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Live Classes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Interact directly with expert instructors during scheduled live sessions and doubt clearances.</p>
              </CardContent>
            </Card>
            <Card className="bg-background border-border/50">
              <CardHeader>
                <Trophy className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Progress Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Monitor your WPM and accuracy over time with detailed charts and test history.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 3. How It Works */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How it works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Three simple steps to improve your shorthand speed.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Headphones className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">1. Listen & Write</h3>
              <p className="text-muted-foreground">Play the audio dictation and take down notes in shorthand on your notepad.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <PlayCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">2. Transcribe</h3>
              <p className="text-muted-foreground">Type your transcription into our built-in text editor before the timer runs out.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">3. Analyze</h3>
              <p className="text-muted-foreground">Get instant results highlighting missed words, spelling errors, and exact WPM.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Courses Preview */}
      <section className="py-24 bg-muted/50">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Popular Courses</h2>
              <p className="text-muted-foreground max-w-2xl">Master the fundamentals or polish your advanced skills.</p>
            </div>
            <Link href="/courses" className="text-primary hover:underline font-medium mt-4 md:mt-0">
              View all courses &rarr;
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.length > 0 ? (
              courses.map((course) => (
                <Card key={course.id} className="overflow-hidden flex flex-col transition-all hover:border-primary/50">
                  <div className="aspect-video relative bg-muted">
                    {course.thumbnail ? (
                      <Image src={course.thumbnail} alt={course.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-secondary">
                        <Video className="h-10 w-10 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                      <Badge variant="outline">{course.level}</Badge>
                    </div>
                    <CardDescription>By {course.instructor.name}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground line-clamp-3">{course.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <span className="font-bold text-lg">₹{course.price.toString()}</span>
                    <Link href={`/courses/${course.slug}`} className={cn(buttonVariants({ size: "sm" }))}>
                      View Details
                    </Link>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-muted-foreground">
                No courses available at the moment.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. Selection Results (Testimonials) */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Successful Students</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Join the ranks of our successful alumni who cleared top exams.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {selections.length > 0 ? (
              selections.slice(0, 4).map((selection) => (
                <Card key={selection.id} className="bg-muted/30 border-none">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-24 w-24 rounded-full bg-secondary overflow-hidden mb-4 relative">
                      {selection.image ? (
                        <Image src={selection.image} alt={selection.name} fill className="object-cover" />
                      ) : (
                        <UserIcon className="h-12 w-12 absolute top-6 left-6 text-muted-foreground" />
                      )}
                    </div>
                    <h4 className="font-bold text-lg">{selection.name}</h4>
                    <Badge className="mt-2 mb-4" variant="secondary">{selection.achievement}</Badge>
                    {selection.quote && (
                      <p className="text-sm text-muted-foreground italic">"{selection.quote}"</p>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-4 text-center py-12 text-muted-foreground">
                Selection results will appear here.
              </div>
            )}
          </div>
          
          {selections.length > 4 && (
            <div className="text-center mt-10">
              <Link href="/selections" className="text-primary hover:underline font-medium">
                View all selections &rarr;
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 6. Pricing */}
      <section className="py-24 bg-muted/50 border-y">
        <div className="container max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Unlock unlimited practice tests and live classes.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Practice Pass */}
            <Card className="flex flex-col relative overflow-hidden border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl">Practice Pass</CardTitle>
                <CardDescription>Everything you need for exam practice.</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-extrabold">₹499</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 text-primary" /> Unlimited practice tests</li>
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 text-primary" /> Real-time error analysis</li>
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 text-primary" /> Progress tracking</li>
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 text-primary" /> Access to live doubt classes</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/pricing" className={cn(buttonVariants({ variant: "default" }), "w-full")}>
                  Subscribe Now
                </Link>
              </CardFooter>
            </Card>

            {/* Courses */}
            <Card className="flex flex-col border-primary/50 relative overflow-hidden bg-primary/5">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                ONE-TIME
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Video Courses</CardTitle>
                <CardDescription>Comprehensive learning from scratch.</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-extrabold">Varies</span>
                  <span className="text-muted-foreground"> per course</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 text-primary" /> Lifetime access to videos</li>
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 text-primary" /> Downloadable PDF notes</li>
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 text-primary" /> Chapter-wise exercises</li>
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 text-primary" /> Course completion certificate</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/courses" className={cn(buttonVariants({ variant: "outline" }), "w-full")}>
                  Explore Courses
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* 7. FAQ */}
      <section className="py-24 bg-background">
        <div className="container max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          </div>
          
          <Accordion className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How does the scoring system work?</AccordionTrigger>
              <AccordionContent>
                We use a character-level comparison algorithm (Levenshtein distance) to calculate exactly how many characters you missed, added, or mistyped. Your WPM is calculated using the standard 5-characters-per-word formula.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Are the dictations recorded by humans?</AccordionTrigger>
              <AccordionContent>
                Yes, all our dictations are professionally recorded by experienced dictators who understand the nuances, pauses, and pacing required for SSC and Court exams.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Can I access the courses on my mobile phone?</AccordionTrigger>
              <AccordionContent>
                Absolutely. Our website is fully responsive. You can watch course videos, read PDFs, and even attempt practice tests on your mobile device (though we recommend a physical keyboard for practice tests).
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Do I need to buy a course to take practice tests?</AccordionTrigger>
              <AccordionContent>
                No. Courses and practice tests are separate. You can subscribe to the Practice Pass independently to access all practice tests without buying any courses.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* 8. CTA Footer */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container flex flex-col items-center text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to clear your skill test?</h2>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mb-10">
            Join thousands of students who have improved their speed and accuracy with Ministry of Shorthand.
          </p>
          <Link href="/signup" className={cn(buttonVariants({ size: "lg", variant: "secondary" }), "font-bold")}>
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}

function UserIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
