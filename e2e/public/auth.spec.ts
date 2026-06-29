import { test, expect } from "@playwright/test";

test.describe("Auth - Tier 1: Feature Coverage", () => {
  test("should redirect guest trying to access /dashboard to /login", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL("**/login**");
    expect(page.url()).toContain("/login");
  });

  test("should redirect guest trying to access /dashboard/profile to /login", async ({ page }) => {
    await page.goto("/dashboard/profile");
    await page.waitForURL("**/login**");
    expect(page.url()).toContain("/login");
  });

  test("should redirect guest trying to access /dashboard/billing to /login", async ({ page }) => {
    await page.goto("/dashboard/billing");
    await page.waitForURL("**/login**");
    expect(page.url()).toContain("/login");
  });

  test("should render login form with email, password, and sign in button", async ({ page }) => {
    await page.goto("/login");
    
    const emailInput = page.locator('input[id="email"]');
    const passwordInput = page.locator('input[id="password"]');
    const submitBtn = page.locator('button[type="submit"]');

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toContainText("Sign In");
  });

  test("should render signup form with name, email, password, confirmPassword, and create account button", async ({ page }) => {
    await page.goto("/signup");

    const nameInput = page.locator('input[id="name"]');
    const emailInput = page.locator('input[id="email"]');
    const passwordInput = page.locator('input[id="password"]');
    const confirmPasswordInput = page.locator('input[id="confirmPassword"]');
    const submitBtn = page.locator('button[type="submit"]');

    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(confirmPasswordInput).toBeVisible();
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toContainText("Create Account");
  });

  test("should allow navigation between login and signup pages via links", async ({ page }) => {
    await page.goto("/login");
    
    // Click sign up link
    await page.click('a[href="/signup"]');
    await page.waitForURL("**/signup");
    expect(page.url()).toContain("/signup");

    // Click sign in link
    await page.click('a[href="/login"]');
    await page.waitForURL("**/login");
    expect(page.url()).toContain("/login");
  });
});

test.describe("Auth - Tier 2: Boundary & Corner Cases", () => {
  test("should prevent login form submission when email or password is empty", async ({ page }) => {
    await page.goto("/login");
    
    // Try to click Sign In immediately
    await page.click('button[type="submit"]');
    
    // Page should remain /login, no redirection
    expect(page.url()).toContain("/login");
  });

  test("should show validation error message when signing up with empty name", async ({ page }) => {
    await page.goto("/signup");
    
    await page.fill('input[id="email"]', "test@example.com");
    await page.fill('input[id="password"]', "Password123!");
    await page.fill('input[id="confirmPassword"]', "Password123!");
    
    await page.click('button[type="submit"]');
    
    const nameError = page.locator("text=Name is required");
    await expect(nameError).toBeVisible();
  });

  test("should show validation error message when signing up with empty email", async ({ page }) => {
    await page.goto("/signup");
    
    await page.fill('input[id="name"]', "Test User");
    await page.fill('input[id="password"]', "Password123!");
    await page.fill('input[id="confirmPassword"]', "Password123!");
    
    await page.click('button[type="submit"]');
    
    const emailError = page.locator("text=Email is required");
    await expect(emailError).toBeVisible();
  });

  test("should show validation error message when signing up with invalid email format", async ({ page }) => {
    await page.goto("/signup");
    
    await page.fill('input[id="name"]', "Test User");
    await page.fill('input[id="email"]', "invalid@email");
    await page.fill('input[id="password"]', "Password123!");
    await page.fill('input[id="confirmPassword"]', "Password123!");
    
    await page.click('button[type="submit"]');
    
    const emailError = page.locator("text=Invalid email address");
    await expect(emailError).toBeVisible();
  });

  test("should show validation error message when signing up with empty password", async ({ page }) => {
    await page.goto("/signup");
    
    await page.fill('input[id="name"]', "Test User");
    await page.fill('input[id="email"]', "test@example.com");
    await page.fill('input[id="confirmPassword"]', "Password123!");
    
    await page.click('button[type="submit"]');
    
    const passwordError = page.locator("text=Password is required");
    await expect(passwordError).toBeVisible();
  });

  test("should show validation error message when signing up with mismatched passwords", async ({ page }) => {
    await page.goto("/signup");
    
    await page.fill('input[id="name"]', "Test User");
    await page.fill('input[id="email"]', "test@example.com");
    await page.fill('input[id="password"]', "Password123!");
    await page.fill('input[id="confirmPassword"]', "MismatchedPassword123!");
    
    await page.click('button[type="submit"]');
    
    const confirmPasswordError = page.locator("text=Passwords do not match");
    await expect(confirmPasswordError).toBeVisible();
  });

  test("should display login failed error toast when logging in with invalid credentials", async ({ page }) => {
    await page.goto("/login");
    
    await page.fill('input[id="email"]', "invalid-user@test.com");
    await page.fill('input[id="password"]', "WrongPassword123!");
    await page.click('button[type="submit"]');
    
    // Check that toast/banner error is shown
    const errorToast = page.locator("text=Login Failed");
    await expect(errorToast).toBeVisible();
    
    const errorDesc = page.locator("text=Invalid email or password. Please try again.");
    await expect(errorDesc).toBeVisible();
  });
});
