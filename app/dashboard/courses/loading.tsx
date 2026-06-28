import { CardGridSkeleton } from "@/components/loading-skeletons";

export default function CoursesLoading() {
  return (
    <div className="space-y-8">
      <CardGridSkeleton />
    </div>
  );
}
