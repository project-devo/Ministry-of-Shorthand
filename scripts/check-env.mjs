import { existsSync, readFileSync } from "node:fs";

const loadEnvFile = (path) => {
  if (!existsSync(path)) {
    return;
  }

  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);

    if (!match || process.env[match[1]]) {
      continue;
    }

    process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, "$2");
  }
};

loadEnvFile(".env.local");
loadEnvFile(".env");

const isSet = (name) => Boolean(process.env[name]?.trim());
const serviceChecks = [
  { name: "Neon runtime", required: ["DATABASE_URL"] },
  { name: "Neon migrations", required: ["DIRECT_URL"] },
  { name: "NextAuth", required: ["NEXTAUTH_URL", "NEXTAUTH_SECRET"] },
  { name: "Google OAuth", required: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"] },
  {
    name: "Admin bootstrap",
    required: ["ADMIN_NAME", "ADMIN_EMAIL", "ADMIN_PASSWORD"],
    optional: true,
  },
  { name: "Upstash Redis", required: ["UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"] },
  {
    name: "Cloudinary",
    alternatives: [
      ["CLOUDINARY_URL"],
      ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"],
    ],
  },
  { name: "Resend", required: ["RESEND_API_KEY", "RESEND_FROM_EMAIL"] },
  { name: "Sentry runtime", required: ["SENTRY_DSN"] },
  { name: "Sentry source maps", required: ["SENTRY_AUTH_TOKEN", "SENTRY_ORG", "SENTRY_PROJECT"] },
  {
    name: "Razorpay (deferred)",
    required: ["RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET", "RAZORPAY_WEBHOOK_SECRET"],
    optional: true,
  },
];

let missingRequired = false;

for (const service of serviceChecks) {
  const ready = service.alternatives
    ? service.alternatives.some((group) => group.every(isSet))
    : service.required.every(isSet);

  if (!ready && !service.optional) {
    missingRequired = true;
  }

  console.log(`${ready ? "READY" : service.optional ? "DEFERRED" : "MISSING"}  ${service.name}`);
}

process.exitCode = missingRequired ? 1 : 0;
