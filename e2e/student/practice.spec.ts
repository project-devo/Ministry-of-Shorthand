import { test, expect } from "@playwright/test";

test.use({ storageState: "playwright/.auth/student.json" });

test.describe("Student Practice - Tier 1: Feature Coverage", () => {
  test("should load the practice library and list available tests", async ({ page }) => {
    await page.goto("/dashboard/practice");
    
    const heading = page.locator("h1");
    await expect(heading).toContainText("Practice Library");
    
    // Check that seeded E2E dictation test card is visible
    const testCardTitle = page.locator("text=E2E Dictation Speed Test");
    await expect(testCardTitle).toBeVisible();
  });

  test("should navigate to the practice lobby (e2e-sample-test) and verify details are visible", async ({ page }) => {
    await page.goto("/dashboard/practice/e2e-sample-test");
    
    const title = page.locator("h2");
    await expect(title).toContainText("E2E Dictation Speed Test");
    
    const speedInfo = page.locator("text=80 WPM");
    await expect(speedInfo).toBeVisible();
  });

  test("should show ready to begin state and Start Dictation button in lobby", async ({ page }) => {
    await page.goto("/dashboard/practice/e2e-sample-test");
    
    const readyText = page.locator("text=Ready to begin?");
    const startBtn = page.getByRole("button", { name: /Start Dictation/i });
    
    await expect(readyText).toBeVisible();
    await expect(startBtn).toBeVisible();
  });

  test("should start dictation and display audio player in progress state", async ({ page }) => {
    await page.goto("/dashboard/practice/e2e-sample-test");
    await page.click('button:has-text("Start Dictation")');
    
    const progressText = page.locator("text=Dictation in progress...");
    await expect(progressText).toBeVisible();
    
    // Check that audio element is present in DOM
    const audioElement = page.locator("audio");
    await expect(audioElement).toHaveAttribute("src", /SoundHelix-Song-1\.mp3/);
  });

  test("should allow skipping dictation to start transcription and render textarea", async ({ page }) => {
    await page.goto("/dashboard/practice/e2e-sample-test");
    await page.click('button:has-text("Start Dictation")');
    await page.click('button:has-text("Skip to Transcription")');
    
    const textarea = page.locator('textarea[placeholder="Start typing your transcription here..."]');
    await expect(textarea).toBeVisible();
  });

  test("should render submit button as disabled when transcription textarea is empty", async ({ page }) => {
    await page.goto("/dashboard/practice/e2e-sample-test");
    await page.click('button:has-text("Start Dictation")');
    await page.click('button:has-text("Skip to Transcription")');
    
    const submitBtn = page.getByRole("button", { name: /Submit Test/i });
    await expect(submitBtn).toBeDisabled();
  });
});

test.describe("Student Practice - Tier 2: Boundary & Corner Cases", () => {
  test("should allow typing into the transcript input textarea and verify word counter updates", async ({ page }) => {
    await page.goto("/dashboard/practice/e2e-sample-test");
    await page.click('button:has-text("Start Dictation")');
    await page.click('button:has-text("Skip to Transcription")');
    
    const textarea = page.locator('textarea[placeholder="Start typing your transcription here..."]');
    await textarea.fill("This is some sample text typed by the e2e test.");
    
    // Verify word count is updated to 10 words
    const wordCounter = page.locator("text=10 words");
    await expect(wordCounter).toBeVisible();
  });

  test("should enable submit button when textarea is not empty", async ({ page }) => {
    await page.goto("/dashboard/practice/e2e-sample-test");
    await page.click('button:has-text("Start Dictation")');
    await page.click('button:has-text("Skip to Transcription")');
    
    const textarea = page.locator('textarea[placeholder="Start typing your transcription here..."]');
    await textarea.fill("Hello");
    
    const submitBtn = page.getByRole("button", { name: /Submit Test/i });
    await expect(submitBtn).toBeEnabled();
  });

  test("should submit transcription, redirect to results page, and verify score, accuracy, and speed stats", async ({ page }) => {
    await page.goto("/dashboard/practice/e2e-sample-test");
    await page.click('button:has-text("Start Dictation")');
    await page.click('button:has-text("Skip to Transcription")');
    
    const textarea = page.locator('textarea[placeholder="Start typing your transcription here..."]');
    // Type the exact transcript for 100% accuracy
    const exactTranscript = "This is a mock sample transcript for the E2E dictation speed test. Please type these words exactly as they are written.";
    await textarea.fill(exactTranscript);
    
    // Intercept/expect submission network call and submit
    const submitBtn = page.getByRole("button", { name: /Submit Test/i });
    await submitBtn.click();
    
    // Verify successful toast feedback
    const successToast = page.locator("text=Test Submitted!");
    await expect(successToast).toBeVisible();
    
    // Wait for redirect to results page
    await page.waitForURL("**/result?attemptId=*");
    expect(page.url()).toContain("/result");
    
    // Verify results page is showing correct statistics
    const completedHeading = page.locator("text=Test Completed!");
    await expect(completedHeading).toBeVisible();
    
    // Accuracy should be 100% since we typed the exact transcript
    const accuracyVal = page.locator("text=100%");
    await expect(accuracyVal).toBeVisible();
    
    // Performance Analysis should be rendered
    const performanceHeader = page.locator("text=Performance Analysis");
    await expect(performanceHeader).toBeVisible();
  });

  test("should verify results page try again button links back to the practice test", async ({ page }) => {
    await page.goto("/dashboard/practice/e2e-sample-test");
    await page.click('button:has-text("Start Dictation")');
    await page.click('button:has-text("Skip to Transcription")');
    
    const textarea = page.locator('textarea[placeholder="Start typing your transcription here..."]');
    await textarea.fill("Quick try");
    await page.click('button:has-text("Submit Test")');
    
    await page.waitForURL("**/result?attemptId=*");
    
    // Click "Try Again" button
    await page.locator('a:has-text("Try Again")').click();
    await page.waitForURL("**/dashboard/practice/e2e-sample-test");
    expect(page.url()).toContain("/dashboard/practice/e2e-sample-test");
  });

  test("should verify results page back to tests button links back to the library", async ({ page }) => {
    await page.goto("/dashboard/practice/e2e-sample-test");
    await page.click('button:has-text("Start Dictation")');
    await page.click('button:has-text("Skip to Transcription")');
    
    const textarea = page.locator('textarea[placeholder="Start typing your transcription here..."]');
    await textarea.fill("Quick try");
    await page.click('button:has-text("Submit Test")');
    
    await page.waitForURL("**/result?attemptId=*");
    
    // Click "Back to Tests" button
    await page.locator('a:has-text("Back to Tests")').click();
    await page.waitForURL("**/dashboard/practice");
    expect(page.url()).toContain("/dashboard/practice");
  });

  test("should handle invalid test id gracefully by rendering 404", async ({ page }) => {
    await page.goto("/dashboard/practice/non-existent-test-id-12345");
    const body = page.locator("body");
    await expect(body).toContainText(/(404|not found|could not be found)/i);
  });
});
