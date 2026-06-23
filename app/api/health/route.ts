import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";
import { hasEnv } from "@/lib/env";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const withTimeout = async <T>(promise: Promise<T>, timeoutMs: number) => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Health check timed out.")), timeoutMs);
    }),
  ]);
};

export const GET = async () => {
  let database: "up" | "down" = "down";
  let redis: "up" | "down" | "not_configured" = "not_configured";

  try {
    await withTimeout(prisma.$queryRaw`SELECT 1`, 3_000);
    database = "up";
  } catch {
    database = "down";
  }

  if (hasEnv("UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN")) {
    try {
      await withTimeout(Redis.fromEnv().ping(), 3_000);
      redis = "up";
    } catch {
      redis = "down";
    }
  }

  const healthy = database === "up";

  return NextResponse.json(
    {
      status: healthy ? (redis === "down" ? "degraded" : "healthy") : "unhealthy",
      dependencies: {
        database,
        redis,
      },
      timestamp: new Date().toISOString(),
    },
    {
      status: healthy ? 200 : 503,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
};
