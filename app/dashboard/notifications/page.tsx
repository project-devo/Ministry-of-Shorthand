import { NotificationsManager } from "@/components/dashboard/NotificationsManager";
import { getStudentNotifications } from "@/lib/dashboard";
import { getRequiredStudentSession } from "@/lib/session";

const NotificationsPage = async () => {
  const session = await getRequiredStudentSession();
  const notifications = await getStudentNotifications(session.user.id);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Notifications</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">Stay updated</h1>
      </div>

      {notifications.length > 0 ? (
        <NotificationsManager notifications={notifications} />
      ) : (
        <div className="rounded-[1.5rem] border border-dashed border-border bg-card/60 p-8 text-sm text-muted-foreground">
          No notifications yet.
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
