"use client";

import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export const NotificationsManager = ({
  notifications,
}: {
  notifications: Array<{
    id: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
  }>;
}) => {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const markAsRead = async (notificationId: string) => {
    try {
      setLoadingId(notificationId);
      const response = await fetch("/api/notifications/read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notificationId,
        }),
      });

      const result = (await response.json()) as {
        success: boolean;
        error?: string;
      };

      if (!response.ok || !result.success) {
        toast.error(result.error ?? "Unable to mark notification as read.");
        return;
      }

      toast.success("Notification updated.");
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unable to update notification.";
      toast.error(message);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <article
          key={notification.id}
          className={`rounded-[1.5rem] border p-5 shadow-lg shadow-black/5 ${
            notification.isRead
              ? "border-border/70 bg-card/80"
              : "border-primary/30 bg-primary/10"
          }`}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <p className="text-base leading-7 text-foreground">{notification.message}</p>
              <p className="text-sm text-muted-foreground">
                {new Intl.DateTimeFormat("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(notification.createdAt))}
              </p>
            </div>
            {!notification.isRead ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => markAsRead(notification.id)}
                disabled={loadingId === notification.id}
              >
                {loadingId === notification.id ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : null}
                Mark as read
              </Button>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
};
