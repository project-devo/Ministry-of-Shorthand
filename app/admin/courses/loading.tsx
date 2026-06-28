import { TableSkeleton } from "@/components/loading-skeletons";

export default function AdminCoursesLoading() {
  return (
    <div className="space-y-8">
      <TableSkeleton />
    </div>
  );
}
