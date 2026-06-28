"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload as UploadIcon, FileIcon, Copy, Loader2, Check } from "lucide-react";

export default function AdminUploadsPage() {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setUploadedUrl(null);
    setCopied(false);

    try {
      const formData = new FormData();
      formData.append("file", file);
      
      let resourceType = "image";
      if (file.type.startsWith("video/") || file.type.startsWith("audio/")) {
        resourceType = "video";
      } else if (!file.type.startsWith("image/")) {
        resourceType = "raw";
      }
      formData.append("resourceType", resourceType);

      const res = await fetch("/api/admin/uploads", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to upload file");
      }

      setUploadedUrl(data.url);
      toast.success("File uploaded successfully");
      setFile(null);
      // Reset file input
      const fileInput = document.getElementById("file-upload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "An error occurred during upload");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (uploadedUrl) {
      navigator.clipboard.writeText(uploadedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("URL copied to clipboard");
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Upload Tools</h1>
          <p className="text-muted-foreground mt-2">
            Upload media files to Cloudinary and generate URLs for use in content.
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <Card className="bg-background/50 backdrop-blur-xl border-primary/10">
          <form onSubmit={handleUpload}>
            <CardHeader>
              <CardTitle>Direct Media Upload</CardTitle>
              <CardDescription>
                Upload images, PDFs, or audio files to get a public URL.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="file-upload">Select File</Label>
                <div className="flex items-center gap-4">
                  <Input 
                    id="file-upload" 
                    type="file" 
                    className="bg-background/50 cursor-pointer flex-1"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    disabled={loading}
                    required
                  />
                  <Button type="submit" disabled={!file || loading}>
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <UploadIcon className="h-4 w-4" />
                    )}
                    <span className="sr-only sm:not-sr-only sm:ml-2">Upload</span>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Supported formats: Images (JPG, PNG, WebP), PDFs, Audio (MP3). Max size: 10MB.
                </p>
              </div>

              {uploadedUrl && (
                <div className="p-4 bg-muted/50 rounded-lg border border-primary/20 space-y-3 mt-6">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium text-sm">
                    <Check className="h-4 w-4" /> Upload Complete
                  </div>
                  <div className="flex items-center justify-between gap-2 p-2 bg-background rounded border">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm truncate text-muted-foreground">{uploadedUrl}</span>
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleCopy}
                      className="flex-shrink-0"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      <span className="sr-only sm:not-sr-only sm:ml-2">{copied ? "Copied" : "Copy"}</span>
                    </Button>
                  </div>
                  
                  {/* Image Preview if it's an image */}
                  {uploadedUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i) && (
                    <div className="mt-4 rounded-md overflow-hidden border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={uploadedUrl} alt="Preview" className="max-h-64 object-contain mx-auto" />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
}
