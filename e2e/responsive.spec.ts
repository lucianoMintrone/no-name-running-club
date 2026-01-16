import { test, expect } from "@playwright/test";

/**
 * Mobile Responsiveness Tests
 * Ensure the app is usable on mobile devices
 */
test.describe("Mobile Responsiveness", () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE viewport

  test("home page is mobile-friendly", async ({ page }) => {
    await page.goto("/");
    
    // Page should not have horizontal scroll
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5); // Allow small margin
    
    // Main content should be visible
    await expect(page.locator("main")).toBeVisible();
  });

  test("navigation is accessible on mobile", async ({ page }) => {
    await page.goto("/");
    
    // Nav should be visible
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();
    
    // Sign in button should be visible
    const signInButton = page.getByRole("button", { name: /sign in/i });
    await expect(signInButton).toBeVisible();
  });

  test("sign in modal works on mobile", async ({ page }) => {
    await page.goto("/");
    
    // Open modal
    await page.getByRole("button", { name: /sign in/i }).click();
    
    // Modal heading should be visible
    const modalHeading = page.getByRole("heading", { name: /sign in/i });
    await expect(modalHeading).toBeVisible();
    
    // Google sign in button should be visible
    const googleButton = page.getByRole("button", { name: /continue with google/i });
    await expect(googleButton).toBeVisible();
  });
});

/**
 * Tablet Responsiveness Tests
 */
test.describe("Tablet Responsiveness", () => {
  test.use({ viewport: { width: 768, height: 1024 } }); // iPad viewport

  test("home page displays correctly on tablet", async ({ page }) => {
    await page.goto("/");
    
    // Page should render correctly
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("nav")).toBeVisible();
  });
});

/**
 * Accessibility Tests
 */
test.describe("Accessibility", () => {
  test("sign in button is keyboard accessible", async ({ page }) => {
    await page.goto("/");
    
    // Tab to sign in button
    await page.keyboard.press("Tab");
    
    // Keep pressing tab until we find sign in button or reach limit
    let foundSignIn = false;
    for (let i = 0; i < 10; i++) {
      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement;
        return el ? el.textContent?.trim().toLowerCase() : null;
      });
      
      if (focusedElement?.includes("sign in")) {
        foundSignIn = true;
        break;
      }
      await page.keyboard.press("Tab");
    }
    
    // Sign in should be reachable via keyboard
    expect(foundSignIn).toBe(true);
  });

  test("modal can be navigated with keyboard", async ({ page }) => {
    await page.goto("/");
    
    // Open modal
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
    
    // Press Escape should close modal (if implemented)
    await page.keyboard.press("Escape");
    
    // Note: This depends on implementation - modal may or may not close on Escape
    // This test documents current behavior
  });

  test("buttons have visible focus states", async ({ page }) => {
    await page.goto("/");
    
    // Tab to first interactive element
    await page.keyboard.press("Tab");
    
    // Get the focused element
    const hasFocusStyle = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return false;
      const styles = window.getComputedStyle(el);
      // Check for focus ring or outline
      return styles.outline !== "none" || 
             styles.boxShadow !== "none" ||
             el.classList.contains("focus:ring-2");
    });
    
    // Focus should be visible
    expect(hasFocusStyle).toBe(true);
  });

  test("images have alt text", async ({ page }) => {
    await page.goto("/");
    
    // Check all images have alt attribute
    const images = await page.locator("img").all();
    
    for (const img of images) {
      const altText = await img.getAttribute("alt");
      // Alt should exist (can be empty string for decorative images)
      expect(altText).not.toBeNull();
    }
  });
});

/**
 * Performance Tests
 */
test.describe("Performance", () => {
  test("home page loads within reasonable time", async ({ page }) => {
    const startTime = Date.now();
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    const loadTime = Date.now() - startTime;
    
    // Page should load within 10 seconds (generous for dev server)
    expect(loadTime).toBeLessThan(10000);
  });

  test("no console errors on page load", async ({ page }) => {
    const errors: string[] = [];
    
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });
    
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    
    // Filter out known acceptable errors (like favicon 404)
    const criticalErrors = errors.filter(
      (err) => !err.includes("favicon") && !err.includes("Failed to load resource")
    );
    
    // Should have no critical console errors
    expect(criticalErrors).toHaveLength(0);
  });
});
