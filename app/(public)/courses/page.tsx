import Link from "next/link";
import Image from "next/image";
import { getPublishedCourses, courseLevelOptions } from "@/lib/courses";
import { CourseLevel } from "@prisma/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Video, BookOpen } from "lucide-react";

export const metadata = {
  title: "Courses | Ministry of Shorthand",
  description: "Browse our comprehensive catalog of shorthand courses designed for all levels.",
};

interface CoursesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const resolvedSearchParams = await searchParams;
  const levelParam = typeof resolvedSearchParams.level === "string" ? resolvedSearchParams.level : undefined;
  
  // Validate level
  const validLevel = courseLevelOptions.includes(levelParam as CourseLevel) ? (levelParam as CourseLevel) : undefined;
  
  const courses = await getPublishedCourses(validLevel);

  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Course Catalog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            From learning the basic strokes to mastering high-speed dictations, find the perfect course for your stenography journey.
          </p>
        </div>
        
        {/* Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto">
          <Link 
            href="/courses"
            className={cn(buttonVariants({ variant: !validLevel ? "default" : "outline" }), "rounded-full")}
          >
            All
          </Link>
          {courseLevelOptions.map((level) => (
            <Link 
              key={level}
              href={`/courses?level=${level}`}
              className={cn(buttonVariants({ variant: validLevel === level ? "default" : "outline" }), "rounded-full")}
            >
              {level.charAt(0) + level.slice(1).toLowerCase()}
            </Link>
          ))}
        </div>
      </div>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden flex flex-col transition-all hover:border-primary/50 group">
              <div className="aspect-video relative bg-muted overflow-hidden">
                {course.thumbnail ? (
                  <Image 
                    src={course.thumbnail} 
                    alt={course.title} 
                    fill 
                    className="object-cover transition-transform group-hover:scale-105" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-secondary transition-transform group-hover:scale-105">
                    <Video className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute top-3 right-3 flex gap-2">
                  <Badge className="bg-background/80 backdrop-blur text-foreground border-border">{course.level}</Badge>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="line-clamp-2 text-xl">{course.title}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-2">
                  <span className="font-medium">By {course.instructor.name}</span>
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1">
                <p className="text-muted-foreground line-clamp-3 mb-4">{course.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{course.sections.length} Sections</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between items-center border-t bg-muted/20 pt-4">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Price</span>
                  <span className="font-extrabold text-2xl">
                    {Number(course.price) === 0 ? "Free" : `₹${course.price.toString()}`}
                  </span>
                </div>
                <Link href={`/courses/${course.slug}`} className={cn(buttonVariants({ variant: "default" }))}>
                  View Course
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-muted/30 rounded-lg border border-dashed">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No courses found</h3>
          <p className="text-muted-foreground mt-2 mb-6">
            We couldn&apos;t find any published courses matching your criteria.
          </p>
          {validLevel && (
            <Link href="/courses" className={cn(buttonVariants({ variant: "outline" }))}>
              Clear filters
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
