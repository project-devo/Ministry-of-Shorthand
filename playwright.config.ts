import { defineConfig, devices } from "@playwright/test";
import path from "path";

// Define path mappings for authentication states
export const STORAGE_STATE_STUDENT = path.join(__dirname, "playwright/.auth/student.json");
export const STORAGE_STATE_ADMIN = path.join(__dirname, "playwright/.auth/admin.json");
export const STORAGE_STATE_INSTRUCTOR = path.join(__dirname, "playwright/.auth/instructor.json");

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html"], ["list"]],
  
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    // Setup Project: handles user authentication and session caching
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
    },
    // Public (Guest) User Journeys - runs anonymously
    {
      name: "public-tests",
      testMatch: /public\/.*\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    // Student User Journeys - pre-loaded with student session state
    {
      name: "student-tests",
      testMatch: /student\/.*\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        storageState: STORAGE_STATE_STUDENT,
      },
      dependencies: ["setup"],
    },
    // Admin User Journeys - pre-loaded with admin session state
    {
      name: "admin-tests",
      testMatch: /admin\/.*\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        storageState: STORAGE_STATE_ADMIN,
      },
      dependencies: ["setup"],
    },
    // Instructor User Journeys - pre-loaded with instructor session state
    {
      name: "instructor-tests",
      testMatch: /instructor\/.*\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        storageState: STORAGE_STATE_INSTRUCTOR,
      },
      dependencies: ["setup"],
    },
    // Scenarios (workload / combinations) - can run on public or multiple authenticated flows
    {
      name: "scenarios-tests",
      testMatch: /scenarios\/.*\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
      dependencies: ["setup"],
    },
  ],

  // Automatically start the application server before testing
  webServer: {
    command: process.env.CI ? "pnpm start" : "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    env: {
      NODE_ENV: "test",
      PORT: "3000",
      UPSTASH_REDIS_REST_URL: "",
      UPSTASH_REDIS_REST_TOKEN: "",
    },
  },
});
