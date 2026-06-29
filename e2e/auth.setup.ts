import { test as setup, expect } from "@playwright/test";
import { STORAGE_STATE_STUDENT, STORAGE_STATE_ADMIN, STORAGE_STATE_INSTRUCTOR } from "../playwright.config";

setup("authenticate as student", async ({ page }) => {
  await page.goto("/login?callbackUrl=/dashboard");
  await page.fill('input[id="email"]', "student@test.com");
  await page.fill('input[id="password"]', "Password123!");
  await page.click('button[type="submit"]');

  // Verify successful authentication and redirection to dashboard
  await page.waitForURL(url => url.pathname === "/dashboard", { timeout: 60000 });
  await expect(page.getByText(/Courses Enrolled|Dashboard/i)).toBeVisible();

  // Cache storage state
  await page.context().storageState({ path: STORAGE_STATE_STUDENT });
});

setup("authenticate as admin", async ({ page }) => {
  await page.goto("/login?callbackUrl=/admin");
  await page.fill('input[id="email"]', "admin@test.com");
  await page.fill('input[id="password"]', "Password123!");
  await page.click('button[type="submit"]');

  // Verify redirection to admin dashboard
  await page.waitForURL(url => url.pathname === "/admin", { timeout: 60000 });
  await expect(page.getByText(/Admin Dashboard/i)).toBeVisible();

  // Cache storage state
  await page.context().storageState({ path: STORAGE_STATE_ADMIN });
});

setup("authenticate as instructor", async ({ page }) => {
  await page.goto("/login?callbackUrl=/instructor");
  await page.fill('input[id="email"]', "instructor@test.com");
  await page.fill('input[id="password"]', "Password123!");
  await page.click('button[type="submit"]');

  // Verify redirection to instructor dashboard
  await page.waitForURL(url => url.pathname === "/instructor", { timeout: 60000 });
  await expect(page.getByText(/Instructor Dashboard/i)).toBeVisible();

  // Cache storage state
  await page.context().storageState({ path: STORAGE_STATE_INSTRUCTOR });
});
