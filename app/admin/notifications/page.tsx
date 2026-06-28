"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";

export default function AdminNotificationsPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [targetRole, setTargetRole] = useState("ALL");

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.error("Please provide a message.");
      return;
    }

    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("message", message);
      formData.append("role", targetRole);

      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        body: formData,
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to send notification");
      }
      
      toast.success(data.message || "Notification sent successfully.");
      setMessage("");
      
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Send Notification</h1>
          <p className="text-muted-foreground mt-2">
            Broadcast messages and alerts to users across the platform.
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <Card className="bg-background/50 backdrop-blur-xl border-primary/10">
          <form onSubmit={handleSend}>
            <CardHeader>
              <CardTitle>New Message</CardTitle>
              <CardDescription>
                This will appear in the target users' notification center.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="target">Target Audience</Label>
                <Select value={targetRole} onValueChange={(val) => { if (val) setTargetRole(val); }}>
                  <SelectTrigger id="target" className="bg-background/50">
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Users</SelectItem>
                    <SelectItem value="STUDENT">Students Only</SelectItem>
                    <SelectItem value="INSTRUCTOR">Instructors Only</SelectItem>
                    <SelectItem value="ADMIN">Admins Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Type your notification message here..." 
                  className="min-h-[120px] bg-background/50"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={500}
                  required
                />
                <div className="text-xs text-muted-foreground text-right">
                  {message.length} / 500
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Broadcast Notification
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
