import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getStudentProfile } from "@/lib/dashboard";
import { ProfileForm } from "@/components/profile-form";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const userProfile = await getStudentProfile(session.user.id);

  if (!userProfile) {
    redirect("/login");
  }

  return (
    <div className="space-y-6 max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account details and preferences.
        </p>
      </div>

      <ProfileForm user={{
        id: userProfile.id,
        name: userProfile.name || "",
        email: userProfile.email,
        image: userProfile.image,
        createdAt: userProfile.createdAt,
        // Optional fields from DB (handled in route or schema as needed)
      }} />
    </div>
  );
}
