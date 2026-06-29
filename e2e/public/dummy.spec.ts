import { test, expect } from "@playwright/test";

test("should load the landing page and check the branding text", async ({ page }) => {
  await page.goto("/");
  // Check if title or page contains "Ministry of Shorthand"
  await expect(page).toHaveTitle(/Ministry of Shorthand/i);
});
