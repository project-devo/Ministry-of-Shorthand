import { ProfileSettingsForm } from "@/components/dashboard/ProfileSettingsForm";
import { getStudentProfile } from "@/lib/dashboard";
import { getRequiredStudentSession } from "@/lib/session";

const ProfilePage = async () => {
  const session = await getRequiredStudentSession();
  const profile = await getStudentProfile(session.user.id);

  if (!profile) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-border bg-card/60 p-8 text-sm text-muted-foreground">
        Profile data could not be loaded.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Profile</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">Manage your student profile</h1>
      </div>
      <ProfileSettingsForm profile={profile} />
    </div>
  );
};

export default ProfilePage;
