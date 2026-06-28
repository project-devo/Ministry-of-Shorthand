import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getCourseBySlug } from "@/lib/courses";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, PlayCircle, Video, FileText, User, Clock } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  
  if (!course) {
    return { title: "Course Not Found" };
  }
  
  return {
    title: `${course.title} | Ministry of Shorthand`,
    description: course.description.substring(0, 160),
  };
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  
  if (!course) {
    notFound();
  }
  
  const totalLessons = course.sections.reduce((acc, section) => acc + section.lessons.length, 0);
  const totalDuration = course.sections.reduce((acc, section) => {
    return acc + section.lessons.reduce((lAcc, lesson) => lAcc + lesson.duration, 0);
  }, 0);
  
  const isFree = Number(course.price) === 0;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-muted py-12 md:py-20 border-b">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <Badge variant="outline" className="bg-background">{course.level}</Badge>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">{course.title}</h1>
              <p className="text-lg text-muted-foreground max-w-3xl whitespace-pre-line">
                {course.description}
              </p>
              
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden relative">
                    {course.instructor.image ? (
                      <Image src={course.instructor.image} alt={course.instructor.name} fill className="object-cover" />
                    ) : (
                      <User className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">Instructor</p>
                    <p className="text-sm text-muted-foreground">{course.instructor.name}</p>
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-sm text-muted-foreground">Recently</p>
                </div>
              </div>
            </div>
            
            {/* Enrollment Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 border-primary/20 shadow-lg">
                <div className="aspect-video relative bg-secondary rounded-t-lg overflow-hidden">
                  {course.thumbnail ? (
                    <Image src={course.thumbnail} alt={course.title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                    <PlayCircle className="h-16 w-16 text-white" />
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="mb-6">
                    <span className="text-4xl font-extrabold">
                      {isFree ? "Free" : `₹${course.price.toString()}`}
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    <Link href={`/enroll/${course.slug}`} className={cn(buttonVariants({ className: "w-full text-lg h-12" }))}>
                      {isFree ? "Enroll for Free" : "Buy Now"}
                    </Link>
                    <p className="text-xs text-center text-muted-foreground">30-Day Money-Back Guarantee</p>
                  </div>
                  
                  <div className="mt-8 space-y-4">
                    <h4 className="font-bold">This course includes:</h4>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-center gap-3">
                        <Video className="h-4 w-4 text-primary" />
                        <span>{Math.round(totalDuration / 60)} hours on-demand video</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-primary" />
                        <span>PDF notes and assignments</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>Full lifetime access</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span>Certificate of completion</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section className="py-16">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Course Curriculum</h2>
          
          <div className="flex justify-between items-center mb-4 text-sm text-muted-foreground">
            <span>{course.sections.length} sections • {totalLessons} lessons</span>
            <span>{Math.floor(totalDuration / 60)}h {totalDuration % 60}m total length</span>
          </div>
          
          <Accordion className="w-full border rounded-lg overflow-hidden" defaultValue={course.sections.slice(0, 1).map(s => s.id)}>
            {course.sections.map((section) => {
              const sectionDuration = section.lessons.reduce((acc, lesson) => acc + lesson.duration, 0);
              
              return (
                <AccordionItem key={section.id} value={section.id} className="border-b last:border-0">
                  <AccordionTrigger className="hover:bg-muted/50 px-4 py-4 bg-muted/20">
                    <div className="flex justify-between items-center w-full pr-4 text-left">
                      <span className="font-bold text-base">{section.title}</span>
                      <span className="text-sm font-normal text-muted-foreground whitespace-nowrap">
                        {section.lessons.length} lessons • {Math.floor(sectionDuration / 60)}m {sectionDuration % 60}s
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-0 pb-0">
                    <ul className="flex flex-col">
                      {section.lessons.map((lesson) => (
                        <li key={lesson.id} className="flex justify-between items-center py-4 px-4 md:px-8 border-b last:border-0 hover:bg-muted/30">
                          <div className="flex items-start gap-4">
                            {lesson.videoUrl ? (
                              <PlayCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                            ) : (
                              <FileText className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                            )}
                            <div className="flex flex-col">
                              <span className="text-sm md:text-base font-medium">{lesson.title}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            {lesson.isFree && (
                              <Badge variant="secondary" className="text-xs text-primary bg-primary/10">Preview</Badge>
                            )}
                            <span className="text-sm text-muted-foreground font-mono">
                              {Math.floor(lesson.duration / 60)}:{String(lesson.duration % 60).padStart(2, '0')}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
