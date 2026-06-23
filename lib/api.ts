import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

const getRequestId = () => crypto.randomUUID();

export const successResponse = <T>(data: T, status = 200) => {
  const requestId = getRequestId();

  return NextResponse.json(
    { success: true, data },
    {
      status,
      headers: {
        "X-Request-Id": requestId,
      },
    },
  );
};

export const errorResponse = (error: string, status = 400) => {
  const requestId = getRequestId();
  const isServerError = status >= 500;

  if (isServerError) {
    Sentry.withScope((scope) => {
      scope.setTag("request_id", requestId);
      scope.setLevel("error");
      Sentry.captureMessage(error);
    });

    console.error(
      JSON.stringify({
        level: "error",
        requestId,
        message: error,
      }),
    );
  }

  return NextResponse.json(
    {
      success: false,
      error:
        isServerError && process.env.NODE_ENV === "production"
          ? "An unexpected server error occurred."
          : error,
      requestId,
    },
    {
      status,
      headers: {
        "X-Request-Id": requestId,
        "Cache-Control": "no-store",
      },
    },
  );
};
