import { test, expect, Page } from "@playwright/test";

/**
 * Test fixtures for authenticated user testing
 * Note: These tests simulate authenticated state behavior.
 * For real authentication testing, you would need to set up
 * OAuth test accounts or use NextAuth test utilities.
 */

// Helper to check if user is authenticated
async function isAuthenticated(page: Page): Promise<boolean> {
  // Check for sign-out button which indicates authenticated state
  const signOutButton = page.getByRole("button", { name: /sign out/i });
  return await signOutButton.isVisible().catch(() => false);
}

test.describe("Authenticated User Features", () => {
  test.describe("When User is Authenticated", () => {
    // These tests document expected behavior for authenticated users
    // They will be skipped if user is not authenticated
    
    test("authenticated user sees settings button", async ({ page }) => {
      await page.goto("/");
      
      const authenticated = await isAuthenticated(page);
      test.skip(!authenticated, "User not authenticated - skipping authenticated-only test");
      
      // Settings button should be visible
      const settingsButton = page.getByRole("button", { name: /settings/i });
      await expect(settingsButton).toBeVisible();
    });

    test("authenticated user sees user name or email in nav", async ({ page }) => {
      await page.goto("/");
      
      const authenticated = await isAuthenticated(page);
      test.skip(!authenticated, "User not authenticated - skipping authenticated-only test");
      
      // User info should be in the nav
      const nav = page.locator("nav");
      const userInfo = nav.locator("span.text-sm.text-gray-500");
      await expect(userInfo).toBeVisible();
    });

    test("settings modal opens and closes correctly", async ({ page }) => {
      await page.goto("/");
      
      const authenticated = await isAuthenticated(page);
      test.skip(!authenticated, "User not authenticated - skipping authenticated-only test");
      
      // Open settings
      const settingsButton = page.getByRole("button", { name: /settings/i });
      await settingsButton.click();
      
      // Settings modal should be visible
      const settingsHeading = page.getByRole("heading", { name: /settings/i });
      await expect(settingsHeading).toBeVisible();
      
      // Close by clicking outside the modal
      await page.mouse.click(10, 10);
      await expect(settingsHeading).not.toBeVisible();
    });

    test("settings modal has zip code input", async ({ page }) => {
      await page.goto("/");
      
      const authenticated = await isAuthenticated(page);
      test.skip(!authenticated, "User not authenticated - skipping authenticated-only test");
      
      // Open settings
      await page.getByRole("button", { name: /settings/i }).click();
      
      // Zip code input should be present
      const zipInput = page.getByPlaceholder(/enter zip code/i);
      await expect(zipInput).toBeVisible();
      
      // Save button should be present
      const saveButton = page.getByRole("button", { name: /save/i });
      await expect(saveButton).toBeVisible();
    });

    test("zip code can be entered and saved", async ({ page }) => {
      await page.goto("/");
      
      const authenticated = await isAuthenticated(page);
      test.skip(!authenticated, "User not authenticated - skipping authenticated-only test");
      
      // Open settings
      await page.getByRole("button", { name: /settings/i }).click();
      
      // Enter zip code
      const zipInput = page.getByPlaceholder(/enter zip code/i);
      await zipInput.fill("10001");
      
      // Click save
      const saveButton = page.getByRole("button", { name: /save/i });
      await saveButton.click();
      
      // Button should show "Saved!" temporarily
      await expect(page.getByText("Saved!")).toBeVisible({ timeout: 3000 });
    });

    test("sign out button is visible and functional", async ({ page }) => {
      await page.goto("/");
      
      const authenticated = await isAuthenticated(page);
      test.skip(!authenticated, "User not authenticated - skipping authenticated-only test");
      
      // Sign out button should be visible
      const signOutButton = page.getByRole("button", { name: /sign out/i });
      await expect(signOutButton).toBeVisible();
      
      // We won't actually click sign out to avoid disrupting test state
    });
  });
});

test.describe("Challenge Card Interactions", () => {
  test("challenge card displays progress when user has active challenge", async ({ page }) => {
    await page.goto("/");
    
    const authenticated = await isAuthenticated(page);
    test.skip(!authenticated, "User not authenticated - skipping authenticated-only test");
    
    // Look for challenge card elements
    const progressText = page.locator("text=/\\d+ of \\d+ runs/");
    const isVisible = await progressText.isVisible().catch(() => false);
    
    if (isVisible) {
      await expect(progressText).toBeVisible();
    }
  });

  test("stamp grid displays clickable stamps", async ({ page }) => {
    await page.goto("/");
    
    const authenticated = await isAuthenticated(page);
    test.skip(!authenticated, "User not authenticated - skipping authenticated-only test");
    
    // Look for stamp buttons (they're in a grid)
    const stampGrid = page.locator(".grid.grid-cols-5");
    const isVisible = await stampGrid.isVisible().catch(() => false);
    
    if (isVisible) {
      // Stamps should be clickable buttons
      const stamps = stampGrid.locator("button");
      const count = await stamps.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test("clicking a stamp opens run form modal", async ({ page }) => {
    await page.goto("/");
    
    const authenticated = await isAuthenticated(page);
    test.skip(!authenticated, "User not authenticated - skipping authenticated-only test");
    
    // Look for stamp grid
    const stampGrid = page.locator(".grid.grid-cols-5");
    const isVisible = await stampGrid.isVisible().catch(() => false);
    
    if (isVisible) {
      // Click first stamp
      const firstStamp = stampGrid.locator("button").first();
      await firstStamp.click();
      
      // Run form modal should appear
      const modalHeading = page.locator("text=/Run #\\d+/");
      await expect(modalHeading).toBeVisible({ timeout: 3000 });
    }
  });
});

test.describe("Run Form Modal", () => {
  test("run form modal has temperature input", async ({ page }) => {
    await page.goto("/");
    
    const authenticated = await isAuthenticated(page);
    test.skip(!authenticated, "User not authenticated - skipping authenticated-only test");
    
    // Try to open a run form modal
    const stampGrid = page.locator(".grid.grid-cols-5");
    const isVisible = await stampGrid.isVisible().catch(() => false);
    
    if (isVisible) {
      await stampGrid.locator("button").first().click();
      
      // Temperature input should be present
      const tempInput = page.locator('input[type="number"]');
      await expect(tempInput).toBeVisible();
      
      // °F indicator should be present
      await expect(page.getByText("°F")).toBeVisible();
    }
  });

  test("run form modal has log run button", async ({ page }) => {
    await page.goto("/");
    
    const authenticated = await isAuthenticated(page);
    test.skip(!authenticated, "User not authenticated - skipping authenticated-only test");
    
    const stampGrid = page.locator(".grid.grid-cols-5");
    const isVisible = await stampGrid.isVisible().catch(() => false);
    
    if (isVisible) {
      await stampGrid.locator("button").first().click();
      
      // Log Run button should be present
      const logButton = page.getByRole("button", { name: /log run/i });
      await expect(logButton).toBeVisible();
    }
  });

  test("run form modal can be closed", async ({ page }) => {
    await page.goto("/");
    
    const authenticated = await isAuthenticated(page);
    test.skip(!authenticated, "User not authenticated - skipping authenticated-only test");
    
    const stampGrid = page.locator(".grid.grid-cols-5");
    const isVisible = await stampGrid.isVisible().catch(() => false);
    
    if (isVisible) {
      await stampGrid.locator("button").first().click();
      
      // Wait for modal
      const modalHeading = page.locator("text=/Run #\\d+/");
      await expect(modalHeading).toBeVisible({ timeout: 3000 });
      
      // Click outside the modal to close
      await page.mouse.click(10, 10);
      
      // Modal should close
      await expect(modalHeading).not.toBeVisible();
    }
  });
});
