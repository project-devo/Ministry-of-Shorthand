import Link from "next/link";
import Image from "next/image";
import { getPopularCourses } from "@/lib/courses";
import { getPublishedSelectionResults } from "@/lib/selections";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, PlayCircle, Headphones, Trophy, Video, Mic, BarChart, ArrowRight, Sparkles, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/scroll-reveal";
import { StaggerContainer, StaggerItem } from "@/components/stagger-container";
import { HoverLift } from "@/components/hover-lift";

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
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/* 1. Rich Gradient Hero Section */}
      <section className="relative overflow-hidden bg-background py-24 md:py-32 lg:py-40">
        {/* Glow Mesh Backdrops */}
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)] dark:bg-grid-white/5" />
        <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-[oklch(0.60_0.20_260)]/10 to-[oklch(0.65_0.22_300)]/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-[oklch(0.65_0.22_272)]/5 to-[oklch(0.72_0.19_142)]/5 blur-3xl rounded-full pointer-events-none" />
        
        <div className="container relative z-10 flex flex-col items-center text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <ScrollReveal delay={0.1}>
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-xs uppercase tracking-wider font-semibold rounded-full border border-primary/20 bg-primary/5 text-primary-foreground backdrop-blur-md">
              <Sparkles className="h-3 w-3 mr-1 text-primary animate-pulse inline" /> The #1 Platform for Shorthand Practice
            </Badge>
          </ScrollReveal>
          
          <ScrollReveal delay={0.2}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] max-w-5xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-[oklch(0.65_0.22_272)]">
              Master Exam-Ready Stenography with Real-Time Feedback
            </h1>
          </ScrollReveal>
          
          <ScrollReveal delay={0.3}>
            <p className="text-base md:text-xl text-muted-foreground max-w-3xl mb-10 leading-relaxed">
              Listen to dictations, type your transcription, and get instant, character-level accuracy scoring. Join thousands of successful candidates.
            </p>
          </ScrollReveal>
          
          <ScrollReveal delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
              <Link 
                href="/signup" 
                className={cn(
                  buttonVariants({ size: "lg" }), 
                  "w-full sm:w-auto shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                )}
              >
                Get Started for Free <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 hover:translate-x-1" />
              </Link>
              <Link href="/courses" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto hover:bg-muted/50")}>
                Explore Courses
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 2. Features Section (Bento Box Layout) */}
      <section className="py-16 md:py-24 lg:py-32 bg-muted/30 border-y border-border/30">
        <div className="container px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">Everything you need to clear the skill test</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-base">Our platform is designed specifically for SSC Steno, Court Reporter, and other shorthand exams.</p>
            </div>
          </ScrollReveal>
          
          {/* Bento Box Grid */}
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Audio Dictations (Wide) */}
            <StaggerItem className="md:col-span-2">
              <HoverLift>
                <Card className="h-full bg-background border-border/50 overflow-hidden flex flex-col justify-between hover:border-primary/50 transition-colors duration-300">
                  <CardHeader className="p-6 md:p-8">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                        <Mic className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg md:text-xl font-semibold">Audio Dictations</CardTitle>
                    </div>
                    <CardDescription className="text-sm md:text-base text-muted-foreground mt-3 leading-relaxed">
                      High-quality audio dictations at various speeds (60 WPM to 120+ WPM) matching real exam standards.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-6 md:px-8 pb-6 md:pb-8 pt-0">
                    {/* Mock speed controller and waveform */}
                    <div className="bg-muted/40 rounded-xl p-4 border border-border/30 mt-2 space-y-4">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Exam Mode: SSC Steno Grade C</span>
                        <span className="font-semibold text-primary">100 WPM Active</span>
                      </div>
                      {/* Speed selector pills */}
                      <div className="flex flex-wrap gap-2">
                        {["60 WPM", "80 WPM", "100 WPM", "120 WPM"].map((speed) => (
                          <span 
                            key={speed}
                            className={cn(
                              "text-xs px-3 py-1.5 rounded-full border font-medium transition-colors",
                              speed === "100 WPM" 
                                ? "bg-primary border-primary text-primary-foreground shadow-sm shadow-primary/20" 
                                : "bg-background border-border/40 text-muted-foreground"
                            )}
                          >
                            {speed}
                          </span>
                        ))}
                      </div>
                      {/* Waveform visualization */}
                      <div className="h-10 flex items-center justify-between gap-1 px-1">
                        {[30, 60, 45, 80, 55, 90, 70, 40, 65, 85, 30, 50, 75, 60, 95, 40, 55, 70, 80, 45, 60, 35, 50].map((h, i) => (
                          <span 
                            key={i} 
                            style={{ height: `${h}%` }}
                            className={cn(
                              "w-full rounded-full transition-colors",
                              i < 14 ? "bg-primary" : "bg-muted-foreground/30"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </HoverLift>
            </StaggerItem>

            {/* Card 2: Real-Time Scoring (Tall) */}
            <StaggerItem className="md:col-span-1 md:row-span-2">
              <HoverLift className="h-full">
                <Card className="h-full bg-background border-border/50 flex flex-col justify-between overflow-hidden hover:border-primary/50 transition-colors duration-300">
                  <CardHeader className="p-6 md:p-8">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                        <BarChart className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg md:text-xl font-semibold">Real-Time Scoring</CardTitle>
                    </div>
                    <CardDescription className="text-sm text-muted-foreground mt-3 leading-relaxed">
                      Instant evaluation using character-level comparison. See exactly where you made mistakes.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-center px-6 md:px-8 py-4 space-y-6">
                    {/* Performance dial (95% accuracy) */}
                    <div className="relative flex items-center justify-center h-32">
                      <svg className="w-28 h-28 transform -rotate-90">
                        <circle
                          cx="56"
                          cy="56"
                          r="46"
                          className="stroke-muted/50"
                          strokeWidth="8"
                          fill="transparent"
                        />
                        <circle
                          cx="56"
                          cy="56"
                          r="46"
                          stroke="oklch(0.72 0.19 142)"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray="289"
                          strokeDashoffset="14"
                          strokeLinecap="round"
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-2xl font-bold text-foreground">95%</span>
                        <span className="text-[10px] text-emerald-500 uppercase tracking-wider font-bold">Accuracy</span>
                      </div>
                    </div>

                    {/* Diff markup mock */}
                    <div className="bg-muted/40 rounded-xl p-3 border border-border/30 text-xs font-mono space-y-1">
                      <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Error Analysis</div>
                      <div>
                        <span className="text-muted-foreground">The candidate </span>
                        <span className="bg-destructive/10 text-destructive line-through decoration-destructive/40 px-1 rounded">writed</span>
                        <span className="underline decoration-wavy decoration-amber-500/80 px-0.5"> wrote</span>
                        <span className="text-muted-foreground"> the shorthand script </span>
                        <span className="bg-primary/10 text-primary border-b border-dashed border-primary px-1 rounded">swiftly</span>
                        <span className="text-muted-foreground">.</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </HoverLift>
            </StaggerItem>

            {/* Card 3: Progress Tracking (Standard) */}
            <StaggerItem className="md:col-span-1">
              <HoverLift>
                <Card className="bg-background border-border/50 flex flex-col justify-between hover:border-primary/50 transition-colors duration-300">
                  <CardHeader className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                        <Trophy className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg font-semibold">Progress Tracking</CardTitle>
                    </div>
                    <CardDescription className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      Monitor your speed (WPM) and accuracy over time with detailed charts.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-6 pb-6 pt-0">
                    <div className="bg-muted/40 rounded-xl p-3 border border-border/30 mt-2 space-y-3">
                      {/* Stats grid */}
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="bg-background/80 rounded p-2 border border-border/20">
                          <div className="text-[10px] text-muted-foreground uppercase font-semibold">Speed</div>
                          <div className="text-base font-bold text-primary">85 WPM</div>
                        </div>
                        <div className="bg-background/80 rounded p-2 border border-border/20">
                          <div className="text-[10px] text-muted-foreground uppercase font-semibold">Accuracy</div>
                          <div className="text-base font-bold text-emerald-500">97.2%</div>
                        </div>
                      </div>
                      {/* Small line graph sparkline */}
                      <div className="h-8 relative w-full mt-1">
                        <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                          <path
                            d="M0,15 L20,12 L40,16 L60,8 L80,5 L100,2"
                            fill="none"
                            stroke="oklch(0.65 0.22 272)"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <path
                            d="M0,15 L20,12 L40,16 L60,8 L80,5 L100,2 L100,20 L0,20 Z"
                            fill="url(#sparkline-grad2)"
                            opacity="0.15"
                          />
                          <defs>
                            <linearGradient id="sparkline-grad2" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="oklch(0.65 0.22 272)" />
                              <stop offset="100%" stopColor="transparent" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </HoverLift>
            </StaggerItem>

            {/* Card 4: Live Classes (Standard) */}
            <StaggerItem className="md:col-span-1">
              <HoverLift>
                <Card className="bg-background border-border/50 flex flex-col justify-between hover:border-primary/50 transition-colors duration-300">
                  <CardHeader className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                        <Video className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg font-semibold">Live Classes</CardTitle>
                    </div>
                    <CardDescription className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      Interact directly with expert instructors during scheduled live sessions.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-6 pb-6 pt-0">
                    <div className="bg-muted/40 rounded-xl p-3 border border-border/30 mt-2 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[10px] text-destructive uppercase tracking-wider font-bold">
                          <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" /> Live Now
                        </span>
                        <span className="text-[10px] text-muted-foreground">248 Candidates</span>
                      </div>
                      <div className="bg-background/80 rounded p-2.5 border border-border/20 space-y-1">
                        <div className="text-xs font-bold truncate">Grade D Practice Session</div>
                        <div className="text-[10px] text-muted-foreground">Instructor: Kailash Chandra</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </HoverLift>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* 3. How It Works Section */}
      <section className="py-16 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">How it works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-base">Three simple steps to improve your shorthand speed.</p>
            </div>
          </ScrollReveal>
          
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <StaggerItem className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 border border-primary/20 shadow-inner">
                <Headphones className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">1. Listen & Write</h3>
              <p className="text-sm md:text-base text-muted-foreground max-w-xs leading-relaxed">Play the audio dictation and take down notes in shorthand on your notepad.</p>
            </StaggerItem>
            
            <StaggerItem className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 border border-primary/20 shadow-inner">
                <PlayCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">2. Transcribe</h3>
              <p className="text-sm md:text-base text-muted-foreground max-w-xs leading-relaxed">Type your transcription into our built-in text editor before the timer runs out.</p>
            </StaggerItem>
            
            <StaggerItem className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 border border-primary/20 shadow-inner">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">3. Analyze</h3>
              <p className="text-sm md:text-base text-muted-foreground max-w-xs leading-relaxed">Get instant results highlighting missed words, spelling errors, and exact WPM.</p>
            </StaggerItem>
          </StaggerContainer>
          
          <ScrollReveal delay={0.2} className="text-center mt-12">
            <Link 
              href="/practice" 
              className={cn(buttonVariants({ variant: "outline" }), "hover:bg-muted/50")}
            >
              Try a Practice Test Now &rarr;
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* 4. Popular Courses Preview */}
      <section className="py-16 md:py-24 lg:py-32 bg-muted/30 border-y border-border/30">
        <div className="container px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
              <div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">Popular Courses</h2>
                <p className="text-muted-foreground max-w-2xl text-base">Master the fundamentals or polish your advanced skills.</p>
              </div>
              <Link href="/courses" className="text-primary hover:underline font-medium mt-4 md:mt-0 flex items-center gap-1">
                View all courses <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </ScrollReveal>
          
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.length > 0 ? (
              courses.map((course) => (
                <StaggerItem key={course.id}>
                  <HoverLift>
                    <Card className="overflow-hidden flex flex-col h-full bg-background border-border/50 hover:border-primary/50 transition-colors duration-300">
                      <div className="aspect-video relative bg-muted">
                        {course.thumbnail ? (
                          <Image src={course.thumbnail} alt={course.title} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-secondary">
                            <BookOpen className="h-10 w-10 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <CardHeader className="p-6">
                        <div className="flex justify-between items-start gap-4 mb-2">
                          <CardTitle className="line-clamp-2 text-base md:text-lg font-semibold">{course.title}</CardTitle>
                          <Badge variant="outline" className="border-primary/30 text-primary-foreground bg-primary/5 shrink-0">{course.level}</Badge>
                        </div>
                        <CardDescription className="text-sm">By {course.instructor.name}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 px-6 pb-6 pt-0">
                        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{course.description}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center p-6 border-t border-border/30 bg-muted/10">
                        <span className="font-bold text-lg text-foreground">₹{course.price.toString()}</span>
                        <Link href={`/courses/${course.slug}`} className={cn(buttonVariants({ size: "sm" }), "shadow-sm shadow-primary/10")}>
                          View Details
                        </Link>
                      </CardFooter>
                    </Card>
                  </HoverLift>
                </StaggerItem>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-muted-foreground">
                No courses available at the moment.
              </div>
            )}
          </StaggerContainer>
        </div>
      </section>

      {/* 5. Selection Results (Testimonials) */}
      <section className="py-16 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">Our Successful Students</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-base">Join the ranks of our successful alumni who cleared top exams.</p>
            </div>
          </ScrollReveal>
          
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {selections.length > 0 ? (
              selections.slice(0, 4).map((selection) => (
                <StaggerItem key={selection.id}>
                  <HoverLift>
                    <Card className="bg-muted/20 border border-border/30 h-full hover:border-primary/40 hover:bg-muted/30 transition-all duration-300">
                      <CardContent className="p-6 flex flex-col items-center text-center justify-between h-full">
                        <div className="flex flex-col items-center">
                          <div className="h-24 w-24 rounded-full bg-secondary border-2 border-primary/20 overflow-hidden mb-4 relative shadow-sm">
                            {selection.image ? (
                              <Image src={selection.image} alt={selection.name} fill className="object-cover" />
                            ) : (
                              <UserIcon className="h-12 w-12 absolute top-6 left-6 text-muted-foreground" />
                            )}
                          </div>
                          <h4 className="font-bold text-base md:text-lg">{selection.name}</h4>
                          <Badge className="mt-2 mb-4 border-primary/20 bg-primary/5 text-primary-foreground hover:bg-primary/5" variant="outline">{selection.achievement}</Badge>
                        </div>
                        {selection.quote && (
                          <p className="text-xs md:text-sm text-muted-foreground italic leading-relaxed">&quot;{selection.quote}&quot;</p>
                        )}
                      </CardContent>
                    </Card>
                  </HoverLift>
                </StaggerItem>
              ))
            ) : (
              <div className="col-span-4 text-center py-12 text-muted-foreground">
                Selection results will appear here.
              </div>
            )}
          </StaggerContainer>
          
          {selections.length > 4 && (
            <ScrollReveal delay={0.2} className="text-center mt-10">
              <Link href="/selections" className="text-primary hover:underline font-medium inline-flex items-center gap-1">
                View all selections <ArrowRight className="h-4 w-4" />
              </Link>
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* 6. Pricing Section */}
      <section className="py-16 md:py-24 lg:py-32 bg-muted/30 border-y border-border/30">
        <div className="container px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">Simple, Transparent Pricing</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-base">Unlock unlimited practice tests and live classes.</p>
            </div>
          </ScrollReveal>
          
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Practice Pass */}
            <StaggerItem>
              <HoverLift>
                <Card className="flex flex-col h-full relative overflow-hidden bg-background border-border/50 hover:border-primary/50 transition-colors duration-300">
                  <CardHeader className="p-6 md:p-8">
                    <CardTitle className="text-xl md:text-2xl font-bold">Practice Pass</CardTitle>
                    <CardDescription className="text-sm mt-1">Everything you need for exam practice.</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-extrabold text-foreground">₹499</span>
                      <span className="text-muted-foreground text-sm font-medium">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 px-6 md:px-8 pb-6 md:pb-8 pt-0">
                    <ul className="space-y-3.5 text-sm md:text-base text-muted-foreground">
                      <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2.5 text-primary shrink-0" /> Unlimited practice tests</li>
                      <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2.5 text-primary shrink-0" /> Real-time error analysis</li>
                      <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2.5 text-primary shrink-0" /> Progress tracking</li>
                      <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2.5 text-primary shrink-0" /> Access to live doubt classes</li>
                    </ul>
                  </CardContent>
                  <CardFooter className="p-6 md:p-8 border-t border-border/30">
                    <Link href="/pricing" className={cn(buttonVariants({ variant: "default" }), "w-full shadow-md shadow-primary/10")}>
                      Subscribe Now
                    </Link>
                  </CardFooter>
                </Card>
              </HoverLift>
            </StaggerItem>

            {/* Courses Pass */}
            <StaggerItem>
              <HoverLift>
                <Card className="flex flex-col h-full border-primary/50 bg-primary/[0.02] dark:bg-primary/[0.04] relative overflow-hidden hover:border-primary/70 transition-colors duration-300">
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] uppercase tracking-widest font-bold px-3.5 py-1.5 rounded-bl-lg">
                    ONE-TIME
                  </div>
                  <CardHeader className="p-6 md:p-8">
                    <CardTitle className="text-xl md:text-2xl font-bold">Video Courses</CardTitle>
                    <CardDescription className="text-sm mt-1">Comprehensive learning from scratch.</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-extrabold text-foreground">Varies</span>
                      <span className="text-muted-foreground text-sm font-medium"> per course</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 px-6 md:px-8 pb-6 md:pb-8 pt-0">
                    <ul className="space-y-3.5 text-sm md:text-base text-muted-foreground">
                      <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2.5 text-primary shrink-0" /> Lifetime access to videos</li>
                      <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2.5 text-primary shrink-0" /> Downloadable PDF notes</li>
                      <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2.5 text-primary shrink-0" /> Chapter-wise exercises</li>
                      <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2.5 text-primary shrink-0" /> Course completion certificate</li>
                    </ul>
                  </CardContent>
                  <CardFooter className="p-6 md:p-8 border-t border-border/30">
                    <Link href="/courses" className={cn(buttonVariants({ variant: "outline" }), "w-full hover:bg-muted/50")}>
                      Explore Courses
                    </Link>
                  </CardFooter>
                </Card>
              </HoverLift>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* 7. FAQ */}
      <section className="py-16 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">Frequently Asked Questions</h2>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={0.1}>
            <Accordion className="w-full space-y-2">
              <AccordionItem value="item-1" className="border border-border/30 rounded-lg px-4 bg-muted/5">
                <AccordionTrigger className="text-sm md:text-base font-semibold hover:no-underline">How does the scoring system work?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-sm md:text-base pt-0 pb-4">
                  We use a character-level comparison algorithm (Levenshtein distance) to calculate exactly how many characters you missed, added, or mistyped. Your WPM is calculated using the standard 5-characters-per-word formula.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border border-border/30 rounded-lg px-4 bg-muted/5">
                <AccordionTrigger className="text-sm md:text-base font-semibold hover:no-underline">Are the dictations recorded by humans?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-sm md:text-base pt-0 pb-4">
                  Yes, all our dictations are professionally recorded by experienced dictators who understand the nuances, pauses, and pacing required for SSC and Court exams.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border border-border/30 rounded-lg px-4 bg-muted/5">
                <AccordionTrigger className="text-sm md:text-base font-semibold hover:no-underline">Can I access the courses on my mobile phone?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-sm md:text-base pt-0 pb-4">
                  Absolutely. Our website is fully responsive. You can watch course videos, read PDFs, and even attempt practice tests on your mobile device (though we recommend a physical keyboard for practice tests).
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4" className="border border-border/30 rounded-lg px-4 bg-muted/5">
                <AccordionTrigger className="text-sm md:text-base font-semibold hover:no-underline">Do I need to buy a course to take practice tests?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-sm md:text-base pt-0 pb-4">
                  No. Courses and practice tests are separate. You can subscribe to the Practice Pass independently to access all practice tests without buying any courses.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </ScrollReveal>
        </div>
      </section>

      {/* 8. CTA Footer */}
      <section className="py-20 md:py-28 relative overflow-hidden bg-primary text-primary-foreground text-center">
        {/* Glow overlay for CTA */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,var(--color-primary-foreground)/0.08,transparent_60%)] pointer-events-none" />
        
        <div className="container relative z-10 flex flex-col items-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">Ready to clear your skill test?</h2>
          </ScrollReveal>
          
          <ScrollReveal delay={0.1}>
            <p className="text-primary-foreground/90 text-sm md:text-lg max-w-2xl mb-10 leading-relaxed">
              Join thousands of students who have improved their speed and accuracy with Ministry of Shorthand.
            </p>
          </ScrollReveal>
          
          <ScrollReveal delay={0.2}>
            <Link 
              href="/signup" 
              className={cn(
                buttonVariants({ size: "lg", variant: "secondary" }), 
                "font-bold hover:shadow-lg hover:shadow-secondary/20 transition-all duration-300"
              )}
            >
              Create Free Account
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}

function UserIcon(props: React.SVGProps<SVGSVGElement>) {
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
