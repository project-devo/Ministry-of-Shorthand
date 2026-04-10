import Link from "next/link";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { getAdminCourses } from "@/lib/admin";

const AdminCoursesPage = async () => {
  const courses = await getAdminCourses();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Courses</p>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">Manage courses</h1>
        </div>
        <Link href="/admin/courses/new" className="text-sm font-semibold text-primary hover:underline">
          Create course
        </Link>
      </div>

      <div className="overflow-x-auto rounded-[1.5rem] border border-border/70 bg-card/90 p-6 shadow-lg shadow-black/5">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border text-muted-foreground">
            <tr>
              <th className="pb-3 pr-4">Title</th>
              <th className="pb-3 pr-4">Instructor</th>
              <th className="pb-3 pr-4">Price</th>
              <th className="pb-3 pr-4">Published</th>
              <th className="pb-3 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="border-b border-border/50">
                <td className="py-4 pr-4">
                  <p className="font-medium text-foreground">{course.title}</p>
                  <p className="text-xs text-muted-foreground">{course.slug}</p>
                </td>
                <td className="py-4 pr-4 text-muted-foreground">{course.instructor.name}</td>
                <td className="py-4 pr-4 text-muted-foreground">INR {course.price.toNumber()}</td>
                <td className="py-4 pr-4 text-muted-foreground">
                  {course.isPublished ? "Published" : "Draft"}
                </td>
                <td className="py-4 pr-4">
                  <div className="flex gap-3">
                    <Link href={`/admin/courses/${course.id}`} className="text-primary hover:underline">
                      Edit
                    </Link>
                    <DeleteButton endpoint={`/api/admin/courses/${course.id}`} label="Course" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCoursesPage;
