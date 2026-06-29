import { test, expect } from "@playwright/test";

test.describe("Landing Page - Tier 1: Feature Coverage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should render the sub-badge with correct text", async ({ page }) => {
    // Find the badge containing the text specifically
    const badge = page.locator('span:has-text("The #1 Platform for Shorthand Practice")').first();
    await expect(badge).toBeVisible();
  });

  test("should render the main hero title", async ({ page }) => {
    const title = page.locator("h1");
    await expect(title).toBeVisible();
    await expect(title).toContainText("Master Exam-Ready Stenography with Real-Time Feedback");
  });

  test("should render the hero description text", async ({ page }) => {
    const description = page.locator("p").first();
    await expect(description).toBeVisible();
    await expect(description).toContainText("Listen to dictations, type your transcription");
  });

  test("should render the landing page call-to-action buttons", async ({ page }) => {
    const getStartedBtn = page.getByRole("link", { name: /Get Started for Free/i }).first();
    const exploreCoursesBtn = page.getByRole("link", { name: /Explore Courses/i }).first();
    
    await expect(getStartedBtn).toBeVisible();
    await expect(getStartedBtn).toHaveAttribute("href", "/signup");
    
    await expect(exploreCoursesBtn).toBeVisible();
    await expect(exploreCoursesBtn).toHaveAttribute("href", "/courses");
  });

  test("should render features cards under the bento grid", async ({ page }) => {
    const cardTitles = ["Audio Dictations", "Real-Time Scoring", "Progress Tracking", "Live Classes"];
    for (const title of cardTitles) {
      const heading = page.locator(`h3:has-text("${title}")`).first();
      await expect(heading).toBeVisible();
    }
  });

  test("should render the how it works steps correctly", async ({ page }) => {
    const steps = ["1. Listen & Write", "2. Transcribe", "3. Analyze"];
    for (const step of steps) {
      const heading = page.locator(`h3:has-text("${step}")`).first();
      await expect(heading).toBeVisible();
    }
  });

  test("should successfully navigate to /about page and verify its load", async ({ page }) => {
    await page.goto("/about");
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
    await expect(heading).toContainText("Modernizing Stenography Education for the Digital Age");
  });

  test("should successfully navigate to /courses page and verify its load", async ({ page }) => {
    await page.goto("/courses");
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
    await expect(heading).toContainText("Course Catalog");
  });

  test("should successfully navigate to /pricing page and verify its load", async ({ page }) => {
    await page.goto("/pricing");
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
    await expect(heading).toContainText("Invest in Your Stenography Career");
  });

  test("should successfully navigate to /selections page and verify its load", async ({ page }) => {
    await page.goto("/selections");
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
    await expect(heading).toContainText("Successful Selections");
  });
});

test.describe("Landing Page - Tier 2: Boundary & Corner Cases", () => {
  test("should handle invalid routes by rendering a 404 page", async ({ page }) => {
    await page.goto("/some-completely-invalid-url-path-here");
    const body = page.locator("body");
    await expect(body).toContainText(/(404|not found|could not be found)/i);
  });

  test("should handle invalid course slug gracefully showing 404", async ({ page }) => {
    await page.goto("/courses/non-existent-course-slug-12345");
    const body = page.locator("body");
    await expect(body).toContainText(/(404|not found|could not be found)/i);
  });

  test("should display valid currency rates on the pricing page", async ({ page }) => {
    await page.goto("/pricing");
    const body = page.locator("body");
    await expect(body).toContainText("₹499");
    await expect(body).toContainText("₹4,790");
    await expect(body).toContainText(/₹/);
  });
});

test.describe("Landing Page - Styling & Usability", () => {
  test("should verify presence of responsive layout containers and margins", async ({ page }) => {
    await page.goto("/");
    const heroSection = page.locator("section").first();
    const container = heroSection.locator(".container");
    await expect(container).toBeVisible();
    await expect(heroSection).toHaveClass(/py-24/);
  });

  test("should verify presence of background and blur classes", async ({ page }) => {
    await page.goto("/");
    const badge = page.locator('span:has-text("The #1 Platform for Shorthand Practice")').first();
    await expect(badge).toHaveClass(/backdrop-blur-md/);
  });

  test("should verify responsive grid layout columns on feature and steps grids", async ({ page }) => {
    await page.goto("/");
    
    // Select features grid container using section identifier
    const featuresGrid = page.locator('section:has-text("Everything you need to clear the skill test")').locator('.grid.grid-cols-1').first();
    await expect(featuresGrid).toHaveClass(/grid-cols-1/);
    await expect(featuresGrid).toHaveClass(/md:grid-cols-3/);

    // Select steps grid container using section identifier
    const stepsGrid = page.locator('section:has-text("How it works")').locator('.grid.grid-cols-1').first();
    await expect(stepsGrid).toHaveClass(/grid-cols-1/);
    await expect(stepsGrid).toHaveClass(/md:grid-cols-3/);
  });
});
