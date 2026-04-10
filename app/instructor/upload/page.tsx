import { LessonUploadForm } from "@/components/instructor/LessonUploadForm";
import { getInstructorUploadContext } from "@/lib/instructor";
import { getRequiredInstructorSession } from "@/lib/session";

const InstructorUploadPage = async () => {
  const session = await getRequiredInstructorSession();
  const courses = await getInstructorUploadContext(session.user.id);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Upload Lesson</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">Add a new lesson</h1>
        <p className="text-base text-muted-foreground">
          Choose one of your sections, upload the media, and attach the supporting PDF.
        </p>
      </div>

      <div className="rounded-[1.5rem] border border-border/70 bg-card/90 p-6 shadow-lg shadow-black/5">
        {courses.some((course) => course.sections.length > 0) ? (
          <LessonUploadForm courses={courses} />
        ) : (
          <p className="text-sm text-muted-foreground">
            You need at least one course section before uploading lessons. Use the admin panel to create sections first.
          </p>
        )}
      </div>
    </div>
  );
};

export default InstructorUploadPage;
