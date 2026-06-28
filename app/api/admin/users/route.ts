import type { Role } from "@prisma/client";
import { requireAdminApiSession } from "@/lib/admin-session";
import { getAdminUsers } from "@/lib/admin";
import { errorResponse, successResponse } from "@/lib/api";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";

const validRoles = new Set<string>(["STUDENT", "INSTRUCTOR", "ADMIN"]);

export const GET = async (request: Request) => {
  try {
    const { error, session } = await requireAdminApiSession();

    if (error) {
      return error;
    }

    const rateLimitResponse = await checkRateLimit({
      key: getRateLimitKey(request, "admin:users", session.user.id),
      limit: 60,
      windowMs: 10 * 60 * 1000,
    });

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") ?? undefined;
    const roleParam = searchParams.get("role") ?? undefined;
    const page = searchParams.get("page") ?? undefined;
    const pageSize = searchParams.get("pageSize") ?? undefined;

    const role = roleParam && validRoles.has(roleParam) ? (roleParam as Role) : undefined;

    const { users, total } = await getAdminUsers(query, role, { page, pageSize });

    return successResponse({ users, total });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to fetch users.";
    return errorResponse(message, 500);
  }
};
