import { spawn } from "node:child_process";
import { createRequire } from "node:module";
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

    const value = match[2].replace(/^(['"])(.*)\1$/, "$2");
    process.env[match[1]] = value;
  }
};

loadEnvFile(".env.local");
loadEnvFile(".env");

const directUrl = process.env.DIRECT_URL;

if (!directUrl) {
  console.error("DIRECT_URL is required for Prisma migration commands.");
  process.exit(1);
}

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error("Provide a Prisma command, for example: migrate deploy");
  process.exit(1);
}

const require = createRequire(import.meta.url);
const prismaCli = require.resolve("prisma/build/index.js");
const child = spawn(process.execPath, [prismaCli, ...args], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    DATABASE_URL: directUrl,
  },
  stdio: "inherit",
});

child.on("exit", (code) => {
  process.exit(code ?? 1);
});
