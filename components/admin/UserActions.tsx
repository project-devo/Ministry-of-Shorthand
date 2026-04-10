"use client";

import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export const UserActions = ({
  isBanned,
  role,
  userId,
}: {
  isBanned: boolean;
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
  userId: string;
}) => {
  const router = useRouter();
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  const [isUpdatingBan, setIsUpdatingBan] = useState(false);

  const updateRole = async (nextRole: "STUDENT" | "INSTRUCTOR" | "ADMIN") => {
    try {
      setIsUpdatingRole(true);
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          role: nextRole,
        }),
      });

      const result = (await response.json()) as { success: boolean; error?: string };

      if (!response.ok || !result.success) {
        toast.error(result.error ?? "Unable to update role.");
        return;
      }

      toast.success("Role updated.");
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unable to update role.";
      toast.error(message);
    } finally {
      setIsUpdatingRole(false);
    }
  };

  const updateBanStatus = async () => {
    try {
      setIsUpdatingBan(true);
      const response = await fetch(`/api/admin/users/${userId}/ban`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          isBanned: !isBanned,
        }),
      });

      const result = (await response.json()) as { success: boolean; error?: string };

      if (!response.ok || !result.success) {
        toast.error(result.error ?? "Unable to update ban status.");
        return;
      }

      toast.success(isBanned ? "User unbanned." : "User banned.");
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unable to update user status.";
      toast.error(message);
    } finally {
      setIsUpdatingBan(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <select
        className="h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground"
        defaultValue={role}
        onChange={(event) => void updateRole(event.target.value as "STUDENT" | "INSTRUCTOR" | "ADMIN")}
        disabled={isUpdatingRole}
      >
        <option value="STUDENT">Student</option>
        <option value="INSTRUCTOR">Instructor</option>
        <option value="ADMIN">Admin</option>
      </select>
      <Button type="button" variant="outline" onClick={() => void updateBanStatus()} disabled={isUpdatingBan}>
        {isUpdatingBan ? <LoaderCircle className="size-4 animate-spin" /> : null}
        {isBanned ? "Unban" : "Ban"}
      </Button>
    </div>
  );
};
