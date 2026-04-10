import { AnnouncementForm } from "@/components/admin/AnnouncementForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AdminNotificationsPage = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Notifications</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">Send announcements</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Broadcast message</CardTitle>
          <CardDescription>Send an announcement to all users or only one role group.</CardDescription>
        </CardHeader>
        <CardContent>
          <AnnouncementForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminNotificationsPage;
