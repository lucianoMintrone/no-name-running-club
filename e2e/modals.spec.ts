import { test, expect } from "@playwright/test";

/**
 * Modal Buttons - Tests for Sign In modal functionality
 */
test.describe("Sign In Modal", () => {
  test("clicking sign in button opens modal", async ({ page }) => {
    await page.goto("/");
    
    // Find and click the sign in button
    const signInButton = page.getByRole("button", { name: /sign in/i });
    await expect(signInButton).toBeVisible();
    await signInButton.click();
    
    // Modal should appear with sign-in heading
    const modalHeading = page.getByRole("heading", { name: /sign in/i });
    await expect(modalHeading).toBeVisible();
  });

  test("sign in modal can be closed by clicking backdrop", async ({ page }) => {
    await page.goto("/");
    
    // Open modal
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
    
    // Click on the backdrop area (bottom portion of the screen, outside modal)
    // The modal is centered, so clicking at bottom-left should hit the backdrop
    const viewport = page.viewportSize();
    if (viewport) {
      await page.mouse.click(50, viewport.height - 50);
    }
    
    // Modal should close
    await expect(page.getByRole("heading", { name: /sign in/i })).not.toBeVisible();
  });

  test("sign in modal can be closed by clicking X button", async ({ page }) => {
    await page.goto("/");
    
    // Open modal
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
    
    // Click close button (the X button - first button after sign in button in the modal area)
    // The close button is inside the modal with an SVG X icon
    const closeButton = page.locator("button").filter({ has: page.locator("svg") }).nth(1);
    await closeButton.click();
    
    // Modal should close
    await expect(page.getByRole("heading", { name: /sign in/i })).not.toBeVisible();
  });

  test("sign in modal displays Google sign-in option", async ({ page }) => {
    await page.goto("/");
    
    // Open modal
    await page.getByRole("button", { name: /sign in/i }).click();
    
    // Google sign-in button should be present
    const googleButton = page.getByRole("button", { name: /continue with google/i });
    await expect(googleButton).toBeVisible();
  });
});

/**
 * Share Widget - Tests for share button functionality
 */
test.describe("Share Widget", () => {
  test("share widget is visible on homepage", async ({ page }) => {
    await page.goto("/");
    
    // Share widget should be visible for unauthenticated users
    const shareSection = page.getByRole("heading", { name: /spread the word/i });
    await expect(shareSection).toBeVisible();
    
    // Share button should be present (accessible name is "Copy link")
    const shareButton = page.getByRole("button", { name: /copy link/i });
    await expect(shareButton).toBeVisible();
  });

  test("share button triggers copy action on desktop", async ({ page }) => {
    await page.goto("/");
    
    const shareButton = page.getByRole("button", { name: /copy link/i });
    await expect(shareButton).toBeVisible();
    
    // Click the share button
    await shareButton.click();
    
    // Button text should change to "Copied!" after clicking
    await expect(page.getByText("Copied!")).toBeVisible({ timeout: 3000 });
  });
});
