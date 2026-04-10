"use client";

import { LoaderCircle, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const uploadTargets = {
  image: {
    accept: "image/*",
    resourceType: "image",
  },
  video: {
    accept: "video/*",
    resourceType: "video",
  },
  audio: {
    accept: "audio/*",
    resourceType: "video",
  },
  raw: {
    accept: ".pdf,application/pdf",
    resourceType: "raw",
  },
} as const;

type UploadTarget = keyof typeof uploadTargets;

export const MediaUploadField = ({
  buttonLabel,
  description,
  endpoint = "/api/admin/uploads",
  folder,
  onUploaded,
  target,
}: {
  buttonLabel: string;
  description: string;
  endpoint?: string;
  folder: string;
  onUploaded: (url: string) => void;
  target: UploadTarget;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      formData.append("resourceType", uploadTargets[target].resourceType);

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const result = (await response.json()) as {
        success: boolean;
        error?: string;
        data?: {
          url: string;
        };
      };

      if (!response.ok || !result.success || !result.data?.url) {
        toast.error(result.error ?? "Unable to upload file.");
        return;
      }

      onUploaded(result.data.url);
      toast.success("Upload complete.");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unable to upload file.";
      toast.error(message);
    } finally {
      if (inputRef.current) {
        inputRef.current.value = "";
      }

      setIsUploading(false);
    }
  };

  return (
    <div className="rounded-xl border border-dashed border-border/70 bg-background/40 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">{buttonLabel}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div>
          <input
            ref={inputRef}
            className="hidden"
            type="file"
            accept={uploadTargets[target].accept}
            onChange={handleFileChange}
          />
          <Button
            type="button"
            variant="outline"
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
          >
            {isUploading ? <LoaderCircle className="size-4 animate-spin" /> : <UploadCloud className="size-4" />}
            {isUploading ? "Uploading..." : buttonLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
