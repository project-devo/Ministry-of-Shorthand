const baseUrl = process.env.LOAD_TEST_URL ?? "http://localhost:3000";
const concurrency = Number(process.env.LOAD_TEST_CONCURRENCY ?? 100);
const requests = Number(process.env.LOAD_TEST_REQUESTS ?? 1000);
const paths = [
  "/",
  "/",
  "/api/auth/providers",
  "/api/auth/providers",
  "/api/health",
  "/robots.txt",
];

if (!Number.isInteger(concurrency) || concurrency < 1) {
  throw new Error("LOAD_TEST_CONCURRENCY must be a positive integer.");
}

if (!Number.isInteger(requests) || requests < 1) {
  throw new Error("LOAD_TEST_REQUESTS must be a positive integer.");
}

const results = [];
let nextRequest = 0;

const runRequest = async (index) => {
  const path = paths[index % paths.length];
  const startedAt = performance.now();

  try {
    const response = await fetch(new URL(path, baseUrl));
    await response.arrayBuffer();

    results.push({
      ok: response.ok,
      status: response.status,
      durationMs: performance.now() - startedAt,
    });
  } catch {
    results.push({
      ok: false,
      status: 0,
      durationMs: performance.now() - startedAt,
    });
  }
};

const worker = async () => {
  while (nextRequest < requests) {
    const index = nextRequest;
    nextRequest += 1;
    await runRequest(index);
  }
};

await Promise.all(Array.from({ length: Math.min(concurrency, requests) }, worker));

const sortedDurations = results.map((result) => result.durationMs).sort((a, b) => a - b);
const percentile = (value) => {
  const index = Math.min(sortedDurations.length - 1, Math.ceil(sortedDurations.length * value) - 1);
  return Math.round(sortedDurations[index] ?? 0);
};
const failures = results.filter((result) => !result.ok).length;
const byStatus = results.reduce((counts, result) => {
  counts[result.status] = (counts[result.status] ?? 0) + 1;
  return counts;
}, {});

console.log(
  JSON.stringify(
    {
      baseUrl,
      concurrency,
      requests,
      failures,
      failureRate: failures / results.length,
      p50Ms: percentile(0.5),
      p95Ms: percentile(0.95),
      p99Ms: percentile(0.99),
      byStatus,
    },
    null,
    2,
  ),
);
