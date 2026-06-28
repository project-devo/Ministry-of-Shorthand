"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Check, Circle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Notification = {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
};

export function NotificationsList({ initialNotifications }: { initialNotifications: Notification[] }) {
  const router = useRouter();
  const [notifications, setNotifications] = useState(initialNotifications);
  
  const handleMarkAsRead = async (id: string) => {
    // Optimistic update
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
    
    try {
      const res = await fetch("/api/notifications/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id })
      });
      
      if (!res.ok) throw new Error("Failed to mark as read");
      
      router.refresh();
    } catch (_error) {
      // Revert optimistic update
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, isRead: false } : n)
      );
      toast.error("Failed to update notification");
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id);
    if (unreadIds.length === 0) return;
    
    // Optimistic update
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    
    try {
      const res = await fetch("/api/notifications/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true })
      });
      
      if (!res.ok) throw new Error("Failed to mark all as read");
      
      toast.success("All notifications marked as read");
      router.refresh();
    } catch (_error) {
      // Refresh to restore state since reverting all is complex
      router.refresh();
      toast.error("Failed to update notifications");
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{unreadCount} Unread</h2>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <Check className="mr-2 h-4 w-4" /> Mark all as read
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={cn(
                "border-primary/20 bg-background/50 backdrop-blur-xl transition-all cursor-pointer",
                !notification.isRead ? "border-l-4 border-l-primary" : "opacity-75"
              )}
              onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
            >
              <CardContent className="p-4 flex items-start gap-4">
                <div className="mt-1">
                  {!notification.isRead ? (
                    <div className="relative">
                      <Circle className="h-5 w-5 text-primary fill-primary/20" />
                      <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                    </div>
                  ) : (
                    <Check className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <p className={cn("text-sm", !notification.isRead ? "font-medium text-foreground" : "text-muted-foreground")}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-primary/20 bg-background/50 backdrop-blur-xl text-center py-12">
            <CardContent className="flex flex-col items-center justify-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Bell className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">You&apos;re all caught up!</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  You don&apos;t have any notifications at the moment.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
