"use client";

import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FormField } from "@/components/auth/FormField";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { profilePasswordSchema, profileSchema } from "@/schemas/profile";

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof profilePasswordSchema>;

export const ProfileSettingsForm = ({
  profile,
}: {
  profile: {
    name: string;
    email: string;
    image: string | null;
  };
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageUrl, setImageUrl] = useState(profile.image);
  const [isUploading, setIsUploading] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile.name,
      image: profile.image ?? "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(profilePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/profile/upload-photo", {
        method: "POST",
        body: formData,
      });

      const result = (await response.json()) as {
        success: boolean;
        data?: {
          imageUrl: string;
        };
        error?: string;
      };

      if (!response.ok || !result.success || !result.data) {
        toast.error(result.error ?? "Unable to upload image.");
        return;
      }

      setImageUrl(result.data.imageUrl);
      profileForm.setValue("image", result.data.imageUrl, {
        shouldValidate: true,
        shouldDirty: true,
      });
      toast.success("Photo uploaded successfully.");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unable to upload image.";
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  const saveProfile = async (values: ProfileFormValues) => {
    try {
      setIsSavingProfile(true);
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = (await response.json()) as {
        success: boolean;
        error?: string;
      };

      if (!response.ok || !result.success) {
        toast.error(result.error ?? "Unable to update profile.");
        return;
      }

      toast.success("Profile updated.");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unable to update profile.";
      toast.error(message);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const savePassword = async (values: PasswordFormValues) => {
    try {
      setIsSavingPassword(true);
      const response = await fetch("/api/profile/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = (await response.json()) as {
        success: boolean;
        error?: string;
      };

      if (!response.ok || !result.success) {
        toast.error(result.error ?? "Unable to update password.");
        return;
      }

      toast.success("Password changed successfully.");
      passwordForm.reset();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unable to update password.";
      toast.error(message);
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Profile details</CardTitle>
          <CardDescription>Keep your student profile updated and professional.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex size-20 items-center justify-center overflow-hidden rounded-full border border-border bg-secondary">
              {imageUrl ? (
                <div className="relative size-full">
                  <Image src={imageUrl} alt="Profile" fill className="object-cover" sizes="80px" />
                </div>
              ) : (
                <span className="text-lg font-semibold text-secondary-foreground">
                  {profile.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0];

                  if (file) {
                    void handleFileUpload(file);
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? <LoaderCircle className="size-4 animate-spin" /> : <UploadCloud className="size-4" />}
                {isUploading ? "Uploading..." : "Upload photo"}
              </Button>
              <p className="text-sm text-muted-foreground">Supported image files upload to Cloudinary.</p>
            </div>
          </div>
          <form className="space-y-4" onSubmit={profileForm.handleSubmit(saveProfile)}>
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Email</p>
              <p className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
                {profile.email}
              </p>
            </div>
            <FormField
              id="profile-name"
              type="text"
              label="Full name"
              placeholder="Your full name"
              error={profileForm.formState.errors.name?.message}
              {...profileForm.register("name")}
            />
            <FormField
              id="profile-image"
              type="url"
              label="Profile image URL"
              placeholder="https://..."
              error={profileForm.formState.errors.image?.message}
              {...profileForm.register("image")}
            />
            <Button type="submit" disabled={isSavingProfile}>
              {isSavingProfile ? <LoaderCircle className="size-4 animate-spin" /> : null}
              Save profile
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change password</CardTitle>
          <CardDescription>Update your password without leaving the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={passwordForm.handleSubmit(savePassword)}>
            <FormField
              id="current-password"
              type="password"
              label="Current password"
              placeholder="Enter your current password"
              error={passwordForm.formState.errors.currentPassword?.message}
              {...passwordForm.register("currentPassword")}
            />
            <FormField
              id="new-password"
              type="password"
              label="New password"
              placeholder="Create a new password"
              error={passwordForm.formState.errors.newPassword?.message}
              {...passwordForm.register("newPassword")}
            />
            <FormField
              id="confirm-new-password"
              type="password"
              label="Confirm new password"
              placeholder="Re-enter the new password"
              error={passwordForm.formState.errors.confirmPassword?.message}
              {...passwordForm.register("confirmPassword")}
            />
            <Button type="submit" disabled={isSavingPassword}>
              {isSavingPassword ? <LoaderCircle className="size-4 animate-spin" /> : null}
              Update password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
