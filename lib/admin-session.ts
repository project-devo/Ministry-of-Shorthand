import { errorResponse } from "@/lib/api";
import { getServerAuthSession } from "@/lib/session";

export const requireAdminApiSession = async () => {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return { error: errorResponse("Unauthorized.", 401), session: null };
  }

  if (session.user.role !== "ADMIN") {
    return { error: errorResponse("Forbidden.", 403), session: null };
  }

  return { error: null, session };
};
