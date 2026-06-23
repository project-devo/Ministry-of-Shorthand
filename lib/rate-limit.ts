import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { errorResponse } from "@/lib/api";
import { hasEnv } from "@/lib/env";

type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, RateLimitEntry>();
const distributedLimiters = new Map<string, Ratelimit>();

const getDistributedLimiter = (limit: number, windowMs: number) => {
  if (!hasEnv("UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN")) {
    return null;
  }

  const key = `${limit}:${windowMs}`;
  const existingLimiter = distributedLimiters.get(key);

  if (existingLimiter) {
    return existingLimiter;
  }

  const limiter = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(limit, `${windowMs} ms`),
    analytics: true,
    prefix: "ministry-of-shorthand:rate-limit",
  });

  distributedLimiters.set(key, limiter);
  return limiter;
};

const getClientIp = (request: Request) => {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? "unknown";
  }

  return request.headers.get("x-real-ip") ?? "unknown";
};

export const getRateLimitKey = (request: Request, scope: string, userId?: string) => {
  return `${scope}:${userId ?? getClientIp(request)}`;
};

const checkRedisRateLimit = async ({ key, limit, windowMs }: RateLimitOptions) => {
  const limiter = getDistributedLimiter(limit, windowMs);

  if (!limiter) {
    return null;
  }

  try {
    const result = await limiter.limit(key);

    if (!result.success) {
      const retryAfter = Math.max(1, Math.ceil((result.reset - Date.now()) / 1000));
      return errorResponse(`Too many requests. Please try again in ${retryAfter} seconds.`, 429);
    }

    return null;
  } catch (error) {
    console.warn("Distributed rate limiting unavailable; using local fallback.", {
      error: error instanceof Error ? error.message : "Unknown Redis error",
    });
    return null;
  }
};

const checkMemoryRateLimit = ({ key, limit, windowMs }: RateLimitOptions) => {
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || entry.resetAt <= now) {
    buckets.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return null;
  }

  if (entry.count >= limit) {
    const retryAfter = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));

    return errorResponse(`Too many requests. Please try again in ${retryAfter} seconds.`, 429);
  }

  entry.count += 1;
  buckets.set(key, entry);

  return null;
};

export const checkRateLimit = async (options: RateLimitOptions) => {
  return (await checkRedisRateLimit(options)) ?? checkMemoryRateLimit(options);
};
