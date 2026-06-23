# 1k Concurrent Users Readiness

This project can target 1,000 simultaneous users on Vercel + PostgreSQL after the code hardening in this branch is deployed with the right production infrastructure.

## Required Production Settings

- Use a pooled PostgreSQL connection string for `DATABASE_URL`.
- Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` so rate limits work across all Vercel instances.
- Apply Prisma migrations before the traffic test: `node_modules/.bin/prisma.cmd migrate deploy` on Windows, or `pnpm prisma migrate deploy` in CI.
- Store media in Cloudinary; keep large video/audio/PDF traffic off the Next.js server.
- Keep `NEXTAUTH_SECRET`, Razorpay secrets, Cloudinary credentials, and Resend credentials set in production.
- Configure Vercel function/concurrency limits according to the database pool capacity.

## What Was Hardened

- Added database indexes for high-volume auth, course, progress, test, payment, notification, and admin queries.
- Added bounded pagination/limits for growing dashboard, admin, billing, notification, instructor, and test history reads.
- Added rate limiting to auth, inquiry, progress, test attempt, payment, notification, password, upload, and announcement routes. It uses Upstash Redis in production when configured, with an in-memory fallback for local/dev.
- Made Razorpay client verification and webhook settlement share one idempotent transaction path.
- Added upload size limits before buffering files for Cloudinary.
- Cached public course/selection reads with five-minute revalidation.
- Added a public-read load smoke script: `pnpm load:public`.

## Load Smoke Test

Run against a deployed preview or production URL:

```bash
LOAD_TEST_URL="https://your-domain.example" LOAD_TEST_CONCURRENCY=1000 LOAD_TEST_REQUESTS=10000 pnpm load:public
```

Passing this smoke test is not the same as full certification. It proves public read behavior under burst load. Follow with authenticated tests for dashboard, progress updates, test submissions, and payment verification.

## Acceptance Targets

- No database connection exhaustion.
- p95 latency remains acceptable for public pages and core dashboard APIs.
- Error rate stays below 1% under the expected peak mix.
- Duplicate Razorpay webhook/client retries do not create duplicate enrollments or active subscriptions.
- Admin broadcasts and list pages do not load unbounded user/test/payment/notification data.
