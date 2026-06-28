import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getStudentNotifications } from "@/lib/dashboard";
import { NotificationsList } from "@/components/notifications-list";

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const notifications = await getStudentNotifications(session.user.id);

  return (
    <div className="space-y-6 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground mt-2">
          Stay updated on your courses, tests, and new features.
        </p>
      </div>

      <NotificationsList initialNotifications={notifications} />
    </div>
  );
}
