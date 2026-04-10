import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export const CourseCard = ({
  course,
}: {
  course: {
    title: string;
    slug: string;
    description: string;
    thumbnail: string;
    level: string;
    price: { toNumber(): number };
    instructor: {
      name: string;
    };
    sectionsCount?: number;
  };
}) => {
  return (
    <article className="overflow-hidden rounded-[1.5rem] border border-border/70 bg-card/90 shadow-lg shadow-black/5">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        />
      </div>
      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between gap-4">
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-secondary-foreground">
            {course.level}
          </span>
          <span className="text-sm font-semibold text-primary">Rs. {course.price.toNumber()}</span>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">{course.title}</h3>
          <p className="text-sm leading-6 text-muted-foreground">{course.description}</p>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Instructor: {course.instructor.name}</span>
          {course.sectionsCount ? <span>{course.sectionsCount} sections</span> : null}
        </div>
        <Link href={`/courses/${course.slug}`} className={buttonVariants({ className: "w-full" })}>
          View course
        </Link>
      </div>
    </article>
  );
};
