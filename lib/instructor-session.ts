import { errorResponse } from "@/lib/api";
import { getServerAuthSession } from "@/lib/session";

export const requireInstructorApiSession = async () => {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return {
      error: errorResponse("Unauthorized.", 401),
    };
  }

  if (!["INSTRUCTOR", "ADMIN"].includes(session.user.role)) {
    return {
      error: errorResponse("Forbidden.", 403),
    };
  }

  return {
    session,
  };
};
