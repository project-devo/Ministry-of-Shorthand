import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const getServerAuthSession = async () => {
  return getServerSession(authOptions);
};

export const getRequiredSession = async () => {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return session;
};

export const getRequiredStudentSession = async () => {
  const session = await getRequiredSession();

  if (session.user.role !== "STUDENT") {
    redirect("/login");
  }

  return session;
};

export const getRequiredAdminSession = async () => {
  const session = await getRequiredSession();

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  return session;
};

export const getRequiredInstructorSession = async () => {
  const session = await getRequiredSession();

  if (!["INSTRUCTOR", "ADMIN"].includes(session.user.role)) {
    redirect("/");
  }

  return session;
};
