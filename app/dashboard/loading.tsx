import { DashboardSkeleton } from "@/components/loading-skeletons";

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <DashboardSkeleton />
    </div>
  );
}
