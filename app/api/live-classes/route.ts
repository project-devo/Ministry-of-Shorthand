import { errorResponse, successResponse } from "@/lib/api";
import { getUpcomingLiveClasses } from "@/lib/dashboard";
import { getServerAuthSession } from "@/lib/session";

export const GET = async () => {
  try {
    const session = await getServerAuthSession();

    if (!session?.user?.id) {
      return errorResponse("Unauthorized.", 401);
    }

    const liveClasses = await getUpcomingLiveClasses();

    return successResponse(liveClasses);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to fetch live classes.";
    return errorResponse(message, 500);
  }
};
