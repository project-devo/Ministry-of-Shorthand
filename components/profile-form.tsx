"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Upload, Save, Lock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ProfileData = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  createdAt: Date;
  shorthandLevel?: string;
  examTarget?: string;
  preferredSpeed?: number;
};

export function ProfileForm({ user }: { user: ProfileData }) {
  const router = useRouter();
  
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isUploading] = useState(false);

  const [name, setName] = useState(user.name || "");
  const [level, setLevel] = useState(user.shorthandLevel || "BEGINNER");
  const [speed, setSpeed] = useState(user.preferredSpeed?.toString() || "80");
  const [target, setTarget] = useState(user.examTarget || "SSC Stenographer");

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword } = useForm();

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          shorthandLevel: level,
          preferredSpeed: parseInt(speed),
          examTarget: target,
        }),
      });

      if (!res.ok) throw new Error("Failed to save profile");
      
      toast.success("Profile updated successfully");
      router.refresh();
    } catch (_error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSavePassword = async (data: Record<string, string>) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSavingPassword(true);
    try {
      const res = await fetch("/api/profile/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });

      if (!res.ok) throw new Error("Failed to change password");
      
      toast.success("Password changed successfully");
      resetPassword();
    } catch (_error) {
      toast.error("Failed to change password. Please check your current password.");
    } finally {
      setIsSavingPassword(false);
    }
  };

  // Mock upload for now until Cloudinary signature flow is verified
  const handleUploadPhoto = () => {
    toast.info("Photo upload will be available soon.");
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-6">
        <Card className="border-primary/20 bg-background/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Public Profile</CardTitle>
            <CardDescription>Update your photo and personal details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 border">
                <AvatarImage src={user.image || ""} />
                <AvatarFallback className="text-2xl">{user.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Button variant="outline" size="sm" onClick={handleUploadPhoto} disabled={isUploading}>
                  {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                  Change Photo
                </Button>
                <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max size 2MB.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" value={user.email} disabled className="bg-muted/50" />
                <p className="text-xs text-muted-foreground">Your email address cannot be changed.</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveProfile} disabled={isSavingProfile}>
              {isSavingProfile ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Changes
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-primary/20 bg-background/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Shorthand Preferences</CardTitle>
            <CardDescription>Tailor your practice experience.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Shorthand Level</Label>
                <Select value={level} onValueChange={(value) => setLevel(value ?? level)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BEGINNER">Beginner (0-60 WPM)</SelectItem>
                    <SelectItem value="INTERMEDIATE">Intermediate (60-100 WPM)</SelectItem>
                    <SelectItem value="ADVANCED">Advanced (100+ WPM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
             <div className="grid gap-2">
               <Label>Target Speed (WPM)</Label>
               <Select value={speed} onValueChange={(value) => setSpeed(value ?? speed)}>
                 <SelectTrigger>
                   <SelectValue />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="60">60 WPM</SelectItem>
                   <SelectItem value="80">80 WPM</SelectItem>
                   <SelectItem value="100">100 WPM</SelectItem>
                   <SelectItem value="120">120 WPM</SelectItem>
                   <SelectItem value="140">140 WPM</SelectItem>
                   <SelectItem value="160">160 WPM</SelectItem>
                 </SelectContent>
               </Select>
             </div>
            <div className="grid gap-2">
              <Label>Target Exam</Label>
              <Input value={target} onChange={(e) => setTarget(e.target.value)} placeholder="e.g. SSC Stenographer" />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveProfile} disabled={isSavingProfile}>
              {isSavingProfile ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Preferences
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="border-primary/20 bg-background/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Manage your password.</CardDescription>
          </CardHeader>
          <form onSubmit={handlePasswordSubmit(handleSavePassword)}>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" {...registerPassword("currentPassword", { required: true })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" {...registerPassword("newPassword", { required: true, minLength: 8 })} />
                <p className="text-xs text-muted-foreground">Minimum 8 characters.</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" {...registerPassword("confirmPassword", { required: true })} />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isSavingPassword}>
                {isSavingPassword ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lock className="mr-2 h-4 w-4" />}
                Change Password
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
