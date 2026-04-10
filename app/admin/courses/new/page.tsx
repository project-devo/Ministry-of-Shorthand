import { CourseForm } from "@/components/admin/CourseForm";
import { getInstructors } from "@/lib/admin";

const NewCoursePage = async () => {
  const instructors = await getInstructors();

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Courses</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">Create a new course</h1>
      </div>
      <CourseForm mode="create" instructors={instructors} />
    </div>
  );
};

export default NewCoursePage;
