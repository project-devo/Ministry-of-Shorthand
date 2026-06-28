import { DashboardSkeleton } from "@/components/loading-skeletons";

export default function AdminLoading() {
  return (
    <div className="space-y-8">
      <DashboardSkeleton />
    </div>
  );
}
