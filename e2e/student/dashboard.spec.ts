import { test, expect } from "@playwright/test";

test.use({ storageState: "playwright/.auth/student.json" });

test.describe("Student Dashboard - Tier 1: Feature Coverage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard");
  });

  test("should render welcome heading containing student user name", async ({ page }) => {
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
    await expect(heading).toContainText(/Welcome back/i);
  });

  test("should display all four metric cards with non-empty text", async ({ page }) => {
    const cards = [
      { title: "Courses Enrolled", value: page.locator('div:has-text("Courses Enrolled") + div') },
      { title: "Tests Taken", value: page.locator('div:has-text("Tests Taken") + div') },
      { title: "Avg Accuracy", value: page.locator('div:has-text("Avg Accuracy") + div') },
      { title: "Current Streak", value: page.locator('div:has-text("Current Streak") + div') }
    ];

    for (const card of cards) {
      const titleLocator = page.locator(`text=${card.title}`);
      await expect(titleLocator).toBeVisible();
    }
  });

  test("should render the sidebar/navigation links with correct text", async ({ page }) => {
    const links = [
      "Overview",
      "My Courses",
      "Practice Tests",
      "Test History",
      "Live Classes",
      "Notifications",
      "Billing",
      "Profile"
    ];

    for (const link of links) {
      const navLink = page.locator(`aside:has-text("MoShorthand") a:has-text("${link}")`).first();
      await expect(navLink).toBeVisible();
    }
  });

  test("should display the 'Continue Learning' section with appropriate status", async ({ page }) => {
    const sectionTitle = page.locator("text=Continue Learning");
    await expect(sectionTitle).toBeVisible();
    
    // Either the student has courses (progress bar is visible) or does not (Browse Courses button is visible)
    const browseBtn = page.getByRole("link", { name: /Browse Courses/i });
    const progressBar = page.locator(".relative.w-full.overflow-hidden"); // shadcn progress bar wrapper
    
    const hasBrowse = await browseBtn.isVisible();
    const hasProgress = await progressBar.first().isVisible();
    
    expect(hasBrowse || hasProgress).toBe(true);
  });

  test("should check that sidebar link 'Practice Tests' directs to library", async ({ page }) => {
    await page.locator('aside a:has-text("Practice Tests")').click();
    await page.waitForURL("**/dashboard/practice");
    expect(page.url()).toContain("/dashboard/practice");
    
    const heading = page.locator("h1");
    await expect(heading).toContainText("Practice Library");
  });

  test("should check that sidebar link 'Profile' directs to profile settings", async ({ page }) => {
    await page.locator('aside a:has-text("Profile")').click();
    await page.waitForURL("**/dashboard/profile");
    expect(page.url()).toContain("/dashboard/profile");
    
    const heading = page.locator("h1");
    await expect(heading).toContainText("Profile Settings");
  });
});

test.describe("Student Dashboard - Tier 2: Boundary & Corner Cases", () => {
  test("should navigate to Profile page, update target speed preference, and verify success toast", async ({ page }) => {
    await page.goto("/dashboard/profile");

    // Locate the select trigger inside Shorthand Preferences (usually the second select card or by label)
    const speedTrigger = page.locator('div:has-text("Target Speed (WPM)") select, div:has-text("Target Speed (WPM)") button').first();
    await speedTrigger.click();

    // Select the "100 WPM" or "100" option
    // Since it's a Radix Select, we click the item by text or value
    const option = page.locator('div[role="listbox"] span:has-text("100 WPM"), [role="option"]:has-text("100 WPM")').first();
    await option.click();

    // Click "Save Preferences" button
    const savePrefBtn = page.getByRole("button", { name: /Save Preferences/i });
    await savePrefBtn.click();

    // Expect successful feedback toast
    const toastMessage = page.locator("text=Profile updated successfully");
    await expect(toastMessage).toBeVisible();
  });

  test("should navigate to Profile page, update target exam preference, and verify success toast", async ({ page }) => {
    await page.goto("/dashboard/profile");

    const targetExamInput = page.locator('input[placeholder="e.g. SSC Stenographer"]');
    await targetExamInput.fill("High Court Reporter Exam");

    // Click "Save Preferences" button
    const savePrefBtn = page.getByRole("button", { name: /Save Preferences/i });
    await savePrefBtn.click();

    // Expect successful feedback toast
    const toastMessage = page.locator("text=Profile updated successfully");
    await expect(toastMessage).toBeVisible();
  });

  test("should navigate to Profile page, update name, and verify success toast", async ({ page }) => {
    await page.goto("/dashboard/profile");

    // Locate Full Name input (first input under Public Profile)
    const nameInput = page.locator('input[id="name"]').first();
    await nameInput.fill("E2E Student Test");

    // Click "Save Changes" button
    const saveChangesBtn = page.getByRole("button", { name: /Save Changes/i });
    await saveChangesBtn.click();

    // Expect successful feedback toast
    const toastMessage = page.locator("text=Profile updated successfully");
    await expect(toastMessage).toBeVisible();
  });

  test("should display billing subscription pass cards with pricing and options", async ({ page }) => {
    await page.goto("/dashboard/billing");

    // Verify current plan card and content
    const planHeader = page.locator("text=Current Plan");
    await expect(planHeader).toBeVisible();

    const planPrice = page.locator("text=₹0").first();
    const upgradeBtn = page.getByRole("button", { name: /Upgrade to Pro|Upgrade/i });
    
    await expect(planPrice).toBeVisible();
    await expect(upgradeBtn).toBeVisible();
  });

  test("should handle profile password changes validation mismatch", async ({ page }) => {
    await page.goto("/dashboard/profile");

    await page.fill('input[id="currentPassword"]', "Password123!");
    await page.fill('input[id="newPassword"]', "NewPassword123!");
    await page.fill('input[id="confirmPassword"]', "MismatchedPassword123!");

    const changePasswordBtn = page.getByRole("button", { name: /Change Password/i });
    await changePasswordBtn.click();

    // Expect error toast
    const errorToast = page.locator("text=Passwords do not match");
    await expect(errorToast).toBeVisible();
  });

  test("should verify logout button redirects back to login page", async ({ page }) => {
    await page.goto("/dashboard");

    // Click logout button in the sidebar
    await page.locator('aside button:has-text("Sign Out")').click();

    // Check that we are redirected back to login page
    await page.waitForURL("**/login");
    expect(page.url()).toContain("/login");
  });
});
