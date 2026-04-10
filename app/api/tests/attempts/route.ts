import { errorResponse, successResponse } from "@/lib/api";
import { hasActiveSubscription } from "@/lib/billing";
import { evaluateDictationAttempt } from "@/lib/practice";
import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "@/lib/session";
import { testAttemptSchema } from "@/schemas/dashboard";

export const POST = async (request: Request) => {
  try {
    const session = await getServerAuthSession();

    if (!session?.user?.id) {
      return errorResponse("Unauthorized.", 401);
    }

    const body = await request.json();
    const parsedBody = testAttemptSchema.safeParse(body);

    if (!parsedBody.success) {
      return errorResponse(parsedBody.error.issues[0]?.message ?? "Invalid request body.", 400);
    }

    const test = await prisma.practiceTest.findUnique({
      where: {
        id: parsedBody.data.testId,
      },
      select: {
        id: true,
        transcript: true,
        speedWPM: true,
        isFree: true,
      },
    });

    if (!test) {
      return errorResponse("Practice test not found.", 404);
    }

    if (!test.isFree) {
      const premiumUnlocked = await hasActiveSubscription(session.user.id);

      if (!premiumUnlocked) {
        return errorResponse("Premium practice requires an active plan.", 403);
      }
    }

    const evaluation = evaluateDictationAttempt({
      responseText: parsedBody.data.responseText,
      targetTranscript: test.transcript,
      targetWpm: test.speedWPM,
      timeTaken: parsedBody.data.timeTaken,
    });

    const attempt = await prisma.testAttempt.create({
      data: {
        userId: session.user.id,
        testId: parsedBody.data.testId,
        score: evaluation.score,
        accuracy: evaluation.accuracy,
        actualWpm: evaluation.actualWpm,
        timeTaken: parsedBody.data.timeTaken,
        responseText: evaluation.normalizedResponseText,
        errorAnalysis: evaluation.errorAnalysis,
      },
      select: {
        id: true,
      },
    });

    return successResponse(
      {
        attemptId: attempt.id,
      },
      201,
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to save test attempt.";
    return errorResponse(message, 500);
  }
};
