import { test, expect } from "@playwright/test";

/**
 * Public Pages - Tests for pages accessible without authentication
 */
test.describe("Public Pages Accessibility", () => {
  test("home page loads successfully", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/No Name Running Club|NNRC/i);
    
    // Check that the main header is visible
    await expect(page.locator("text=NNRC")).toBeVisible();
    
    // Check that the page has main content
    await expect(page.locator("main")).toBeVisible();
  });

  test("home page displays sign-in button for unauthenticated users", async ({ page }) => {
    await page.goto("/");
    
    // Sign in button should be visible
    const signInButton = page.getByRole("button", { name: /sign in/i });
    await expect(signInButton).toBeVisible();
  });

  test("home page displays challenge information for public view", async ({ page }) => {
    await page.goto("/");
    
    // Either the challenge grid or the "Currently Running" section should be visible
    const currentlyRunning = page.locator("text=Currently Running");
    const clubRecords = page.locator("text=Club Records");
    
    // For unauthenticated users, we should see the public landing page
    const isPublicView = await currentlyRunning.isVisible() || await clubRecords.isVisible();
    expect(isPublicView).toBe(true);
  });
});

test.describe("Navigation Elements", () => {
  test("navigation bar is present and functional", async ({ page }) => {
    await page.goto("/");
    
    // Navigation should be sticky and visible
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();
    
    // NNRC logo/text should be in nav
    await expect(nav.locator("text=NNRC")).toBeVisible();
  });
});
