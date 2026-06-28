"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, Circle, PlayCircle, FileText, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type CourseData = {
  id: string;
  title: string;
  sections: Array<{
    id: string;
    title: string;
    order: number;
    lessons: Array<{
      id: string;
      title: string;
      order: number;
      videoUrl: string | null;
      duration: number | null;
      pdfUrl: string | null;
      progress: Array<{ completed: boolean }>;
    }>;
  }>;
};

export function CoursePlayer({ course }: { course: CourseData }) {
  const router = useRouter();
  
  // Flatten lessons for easy prev/next navigation
  const allLessons = useMemo(() => {
    return course.sections.flatMap(section => 
      section.lessons.map(lesson => ({
        ...lesson,
        sectionId: section.id,
        sectionTitle: section.title,
        isCompleted: lesson.progress.length > 0 && lesson.progress[0].completed
      }))
    );
  }, [course]);

  // Find first uncompleted lesson, or just the first lesson
  const firstUncompleted = allLessons.find(l => !l.isCompleted) || allLessons[0];
  
  const [activeLessonId, setActiveLessonId] = useState<string | null>(firstUncompleted?.id || null);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);

  const activeLesson = allLessons.find(l => l.id === activeLessonId);
  const activeLessonIndex = allLessons.findIndex(l => l.id === activeLessonId);
  const hasNext = activeLessonIndex < allLessons.length - 1;
  const hasPrev = activeLessonIndex > 0;

  const handleMarkComplete = async () => {
    if (!activeLesson) return;
    
    setIsMarkingComplete(true);
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: activeLesson.id, completed: true })
      });
      
      if (!res.ok) throw new Error("Failed to mark complete");
      
      toast.success("Lesson completed!");
      router.refresh();
      
      // Auto advance
      if (hasNext) {
        setActiveLessonId(allLessons[activeLessonIndex + 1].id);
      }
    } catch (error) {
      toast.error("Error", { description: "Could not save progress" });
    } finally {
      setIsMarkingComplete(false);
    }
  };

  if (!activeLesson) {
    return <div>No lessons found in this course.</div>;
  }

  // Default active accordion based on the active lesson
  const defaultAccordionValue = activeLesson.sectionId;

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-10rem)]">
      {/* Video Player Area */}
      <div className="flex-1 flex flex-col min-h-0 space-y-4">
        <div className="bg-black aspect-video rounded-xl overflow-hidden shadow-xl border relative flex items-center justify-center">
          {activeLesson.videoUrl ? (
            <video 
              src={activeLesson.videoUrl} 
              controls 
              className="w-full h-full object-contain"
              controlsList="nodownload"
            />
          ) : (
            <div className="text-muted-foreground flex flex-col items-center">
              <PlayCircle className="h-16 w-16 mb-2 opacity-50" />
              <p>No video available for this lesson</p>
            </div>
          )}
        </div>
        
        <Card className="flex-none border-primary/20 bg-background/50 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="text-sm text-primary font-medium mb-1">{activeLesson.sectionTitle}</div>
                <h2 className="text-2xl font-bold">{activeLesson.title}</h2>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {activeLesson.pdfUrl && (
                  <Button variant="outline" asChild>
                    <a href={activeLesson.pdfUrl} target="_blank" rel="noopener noreferrer">
                      <FileText className="mr-2 h-4 w-4" />
                      Materials
                    </a>
                  </Button>
                )}
                
                {!activeLesson.isCompleted ? (
                  <Button onClick={handleMarkComplete} disabled={isMarkingComplete}>
                    {isMarkingComplete ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                    )}
                    Mark Complete
                  </Button>
                ) : (
                  <Button variant="secondary" disabled>
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    Completed
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-8 pt-4 border-t">
              <Button 
                variant="ghost" 
                disabled={!hasPrev}
                onClick={() => setActiveLessonId(allLessons[activeLessonIndex - 1].id)}
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous Lesson
              </Button>
              <Button 
                variant="ghost" 
                disabled={!hasNext}
                onClick={() => setActiveLessonId(allLessons[activeLessonIndex + 1].id)}
              >
                Next Lesson <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Curriculum Sidebar */}
      <Card className="w-full lg:w-80 xl:w-96 flex-none flex flex-col h-full border-primary/20 bg-background/50 backdrop-blur-xl overflow-hidden">
        <div className="p-4 border-b font-semibold bg-muted/30">Course Content</div>
        <ScrollArea className="flex-1">
          <Accordion 
            defaultValue={[defaultAccordionValue]}
            className="w-full"
          >
            {course.sections.map((section) => (
              <AccordionItem value={section.id} key={section.id} className="border-b-0">
                <AccordionTrigger className="px-4 hover:bg-muted/50 text-sm font-semibold">
                  <div className="text-left">
                    <div>{section.title}</div>
                    <div className="text-xs font-normal text-muted-foreground mt-1">
                      {section.lessons.filter(l => l.progress.length > 0 && l.progress[0].completed).length} / {section.lessons.length} lessons
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-0">
                  <div className="flex flex-col">
                    {section.lessons.map((lesson) => {
                      const isCompleted = lesson.progress.length > 0 && lesson.progress[0].completed;
                      const isActive = activeLessonId === lesson.id;
                      
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => setActiveLessonId(lesson.id)}
                          className={cn(
                            "flex items-start gap-3 px-4 py-3 text-sm text-left transition-colors",
                            isActive ? "bg-primary/10 border-l-2 border-primary" : "hover:bg-muted border-l-2 border-transparent",
                          )}
                        >
                          <div className="mt-0.5 flex-shrink-0">
                            {isCompleted ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <Circle className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className={cn("font-medium", isActive ? "text-primary" : "text-foreground")}>
                              {lesson.title}
                            </p>
                            {lesson.duration && (
                              <p className="text-xs text-muted-foreground flex items-center">
                                <PlayCircle className="mr-1 h-3 w-3" />
                                {Math.floor(lesson.duration / 60)} min
                              </p>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>
      </Card>
    </div>
  );
}
