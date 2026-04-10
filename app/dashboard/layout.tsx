import type { ReactNode } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { getRequiredStudentSession } from "@/lib/session";

export const dynamic = "force-dynamic";

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  await getRequiredStudentSession();

  return (
    <div className="min-h-[calc(100vh-81px)] bg-muted/30">
      <div className="mx-auto flex w-full max-w-7xl flex-col lg:min-h-[calc(100vh-81px)] lg:flex-row">
        <DashboardSidebar />
        <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
