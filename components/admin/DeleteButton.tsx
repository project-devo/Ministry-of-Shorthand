"use client";

import { LoaderCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export const DeleteButton = ({
  endpoint,
  label,
}: {
  endpoint: string;
  label: string;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(endpoint, {
        method: "DELETE",
      });

      const result = (await response.json()) as { success: boolean; error?: string };

      if (!response.ok || !result.success) {
        toast.error(result.error ?? `Unable to delete ${label.toLowerCase()}.`);
        return;
      }

      toast.success(`${label} deleted.`);
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : `Unable to delete ${label.toLowerCase()}.`;
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button type="button" variant="ghost" onClick={handleDelete} disabled={isLoading}>
      {isLoading ? <LoaderCircle className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
      Delete
    </Button>
  );
};
