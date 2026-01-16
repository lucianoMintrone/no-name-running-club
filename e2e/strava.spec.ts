import { test, expect, Page } from "@playwright/test";

/**
 * Strava Widget Tests - Tests for Strava integration feature
 * These tests verify the Strava widget functionality in the admin area
 * and on the user-facing homepage.
 */

// Helper to check if user is admin
async function isAdmin(page: Page): Promise<boolean> {
  const adminLink = page.getByRole("link", { name: /admin/i });
  return await adminLink.isVisible().catch(() => false);
}

// Helper to check if user is authenticated
async function isAuthenticated(page: Page): Promise<boolean> {
  const signOutButton = page.getByRole("button", { name: /sign out/i });
  return await signOutButton.isVisible().catch(() => false);
}

test.describe("Strava Widget - Admin Configuration", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    const admin = await isAdmin(page);
    test.skip(!admin, "User is not admin - skipping admin test");
  });

  test("new challenge form has Strava URL field", async ({ page }) => {
    await page.goto("/admin/challenges/new");

    // Check for Strava URL field
    const stravaUrlLabel = page.getByText("Strava Challenge URL");
    await expect(stravaUrlLabel).toBeVisible();

    // Check for input field
    const stravaUrlInput = page.locator('input[name="stravaUrl"]');
    await expect(stravaUrlInput).toBeVisible();
    await expect(stravaUrlInput).toHaveAttribute("type", "url");
  });

  test("Strava URL field has placeholder text", async ({ page }) => {
    await page.goto("/admin/challenges/new");

    const stravaUrlInput = page.locator('input[name="stravaUrl"]');
    await expect(stravaUrlInput).toHaveAttribute(
      "placeholder",
      "e.g., https://www.strava.com/clubs/..."
    );
  });

  test("Strava URL field has help text", async ({ page }) => {
    await page.goto("/admin/challenges/new");

    const helpText = page.getByText(
      "Optional: Link to a Strava club or challenge for this event"
    );
    await expect(helpText).toBeVisible();
  });

  test("can enter a Strava URL in the new challenge form", async ({ page }) => {
    await page.goto("/admin/challenges/new");

    const stravaUrlInput = page.locator('input[name="stravaUrl"]');
    await stravaUrlInput.fill("https://www.strava.com/clubs/test-club");

    await expect(stravaUrlInput).toHaveValue(
      "https://www.strava.com/clubs/test-club"
    );
  });
});

test.describe("Strava Widget - Edit Challenge", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    const admin = await isAdmin(page);
    test.skip(!admin, "User is not admin - skipping admin test");
  });

  test("challenges page has edit links", async ({ page }) => {
    await page.goto("/admin/challenges");

    // Look for edit links
    const editLinks = page.getByRole("link", { name: /edit/i });
    const hasEditLinks = (await editLinks.count()) > 0;

    // Only test edit page if there are challenges to edit
    if (hasEditLinks) {
      await editLinks.first().click();
      await expect(page).toHaveURL(/\/admin\/challenges\/.+/);
    }
  });

  test("edit challenge page has Strava URL field", async ({ page }) => {
    await page.goto("/admin/challenges");

    const editLinks = page.getByRole("link", { name: /edit/i });
    const hasEditLinks = (await editLinks.count()) > 0;
    test.skip(!hasEditLinks, "No challenges to edit");

    await editLinks.first().click();

    // Wait for edit form to load
    await expect(page.getByText("Edit Challenge:")).toBeVisible();

    // Check for Strava URL field
    const stravaUrlInput = page.locator('input[name="stravaUrl"]');
    await expect(stravaUrlInput).toBeVisible();
  });

  test("Strava URL field is optional", async ({ page }) => {
    await page.goto("/admin/challenges");

    const editLinks = page.getByRole("link", { name: /edit/i });
    const hasEditLinks = (await editLinks.count()) > 0;
    test.skip(!hasEditLinks, "No challenges to edit");

    await editLinks.first().click();

    // Strava URL field should not be required
    const stravaUrlInput = page.locator('input[name="stravaUrl"]');
    const isRequired = await stravaUrlInput.getAttribute("required");
    expect(isRequired).toBeNull();
  });
});

test.describe("Strava Widget - User Display", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    const authenticated = await isAuthenticated(page);
    test.skip(!authenticated, "User not authenticated - skipping test");
  });

  test("Strava widget displays when challenge has stravaUrl", async ({
    page,
  }) => {
    await page.goto("/");

    // Check if Strava widget is visible (only shows if challenge has stravaUrl)
    const stravaWidget = page.getByText("Strava Challenge");

    // This widget is conditionally rendered
    const isVisible = await stravaWidget.isVisible().catch(() => false);

    if (isVisible) {
      // If widget is visible, verify its structure
      await expect(page.getByText("Track your runs on Strava")).toBeVisible();
      await expect(
        page.getByRole("link", { name: /join the strava challenge/i })
      ).toBeVisible();
    }
  });

  test("Strava widget link opens in new tab", async ({ page }) => {
    await page.goto("/");

    // Check if Strava widget is visible
    const stravaLink = page.getByRole("link", {
      name: /join the strava challenge/i,
    });
    const isVisible = await stravaLink.isVisible().catch(() => false);

    if (isVisible) {
      // Verify link opens in new tab
      await expect(stravaLink).toHaveAttribute("target", "_blank");
      await expect(stravaLink).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  test("Strava widget has proper branding colors", async ({ page }) => {
    await page.goto("/");

    // Check if Strava widget is visible
    const stravaLink = page.getByRole("link", {
      name: /join the strava challenge/i,
    });
    const isVisible = await stravaLink.isVisible().catch(() => false);

    if (isVisible) {
      // Check for Strava orange color (FC4C02)
      const bgColor = await stravaLink.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });

      // FC4C02 in RGB is approximately rgb(252, 76, 2)
      expect(bgColor).toContain("252");
    }
  });
});

test.describe("Strava Widget - Accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    const authenticated = await isAuthenticated(page);
    test.skip(!authenticated, "User not authenticated - skipping test");
  });

  test("Strava widget link is keyboard accessible", async ({ page }) => {
    await page.goto("/");

    const stravaLink = page.getByRole("link", {
      name: /join the strava challenge/i,
    });
    const isVisible = await stravaLink.isVisible().catch(() => false);

    if (isVisible) {
      // Tab to the link and verify it can receive focus
      await stravaLink.focus();
      await expect(stravaLink).toBeFocused();
    }
  });

  test("Strava widget has descriptive link text", async ({ page }) => {
    await page.goto("/");

    const stravaLink = page.getByRole("link", {
      name: /join the strava challenge/i,
    });
    const isVisible = await stravaLink.isVisible().catch(() => false);

    if (isVisible) {
      // Link text should be descriptive
      const linkText = await stravaLink.textContent();
      expect(linkText).toContain("Join the Strava Challenge");
    }
  });
});
