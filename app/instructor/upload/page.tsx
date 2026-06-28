import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getInstructorUploadContext } from "@/lib/instructor";
import { redirect } from "next/navigation";
import { LessonUploadForm } from "./lesson-upload-form";

export const dynamic = "force-dynamic";

export default async function InstructorUploadPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const courses = await getInstructorUploadContext(session.user.id);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lesson Upload</h1>
        <p className="text-muted-foreground mt-2">
          Upload videos and resources directly to your courses.
        </p>
      </div>

      <LessonUploadForm courses={courses} />
    </div>
  );
}
