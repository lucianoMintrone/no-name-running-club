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

test.describe("Strava Activity Widget - Admin Configuration", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    const admin = await isAdmin(page);
    test.skip(!admin, "User is not admin - skipping admin test");
  });

  test("new challenge form has Strava Embed Code field", async ({ page }) => {
    await page.goto("/admin/challenges/new");

    // Check for Strava Embed Code field
    const embedCodeLabel = page.getByText("Strava Activity Widget Embed Code");
    await expect(embedCodeLabel).toBeVisible();

    // Check for textarea field
    const embedCodeTextarea = page.locator('textarea[name="stravaEmbedCode"]');
    await expect(embedCodeTextarea).toBeVisible();
  });

  test("Strava Embed Code field has placeholder text", async ({ page }) => {
    await page.goto("/admin/challenges/new");

    const embedCodeTextarea = page.locator('textarea[name="stravaEmbedCode"]');
    const placeholder = await embedCodeTextarea.getAttribute("placeholder");
    expect(placeholder).toContain("<iframe");
    expect(placeholder).toContain("strava.com");
  });

  test("Strava Embed Code field has help text", async ({ page }) => {
    await page.goto("/admin/challenges/new");

    const helpText = page.getByText(
      "Optional: Paste the full iframe embed code from Strava"
    );
    await expect(helpText).toBeVisible();
  });

  test("can enter Strava embed code in the new challenge form", async ({
    page,
  }) => {
    await page.goto("/admin/challenges/new");

    const embedCodeTextarea = page.locator('textarea[name="stravaEmbedCode"]');
    const testEmbedCode =
      "<iframe src='https://www.strava.com/clubs/12345/latest-rides/abc' width='300' height='454'></iframe>";
    await embedCodeTextarea.fill(testEmbedCode);

    await expect(embedCodeTextarea).toHaveValue(testEmbedCode);
  });

  test("Strava Embed Code textarea has monospace font", async ({ page }) => {
    await page.goto("/admin/challenges/new");

    const embedCodeTextarea = page.locator('textarea[name="stravaEmbedCode"]');

    // Check that it has the font-mono class
    const hasMonoClass = await embedCodeTextarea.evaluate((el) =>
      el.classList.contains("font-mono")
    );
    expect(hasMonoClass).toBe(true);
  });
});

test.describe("Strava Activity Widget - Edit Challenge", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    const admin = await isAdmin(page);
    test.skip(!admin, "User is not admin - skipping admin test");
  });

  test("edit challenge page has Strava Embed Code field", async ({ page }) => {
    await page.goto("/admin/challenges");

    const editLinks = page.getByRole("link", { name: /edit/i });
    const hasEditLinks = (await editLinks.count()) > 0;
    test.skip(!hasEditLinks, "No challenges to edit");

    await editLinks.first().click();

    // Wait for edit form to load
    await expect(page.getByText("Edit Challenge:")).toBeVisible();

    // Check for Strava Embed Code field
    const embedCodeTextarea = page.locator('textarea[name="stravaEmbedCode"]');
    await expect(embedCodeTextarea).toBeVisible();
  });

  test("Strava Embed Code field is optional", async ({ page }) => {
    await page.goto("/admin/challenges");

    const editLinks = page.getByRole("link", { name: /edit/i });
    const hasEditLinks = (await editLinks.count()) > 0;
    test.skip(!hasEditLinks, "No challenges to edit");

    await editLinks.first().click();

    // Strava Embed Code field should not be required
    const embedCodeTextarea = page.locator('textarea[name="stravaEmbedCode"]');
    const isRequired = await embedCodeTextarea.getAttribute("required");
    expect(isRequired).toBeNull();
  });

  test("Strava Embed Code field preserves existing value", async ({ page }) => {
    await page.goto("/admin/challenges");

    const editLinks = page.getByRole("link", { name: /edit/i });
    const hasEditLinks = (await editLinks.count()) > 0;
    test.skip(!hasEditLinks, "No challenges to edit");

    await editLinks.first().click();

    // The textarea should exist and be editable
    const embedCodeTextarea = page.locator('textarea[name="stravaEmbedCode"]');
    await expect(embedCodeTextarea).toBeVisible();

    // If there's a value, it should be preserved
    const currentValue = await embedCodeTextarea.inputValue();
    if (currentValue) {
      expect(currentValue).toContain("strava.com");
    }
  });
});

test.describe("Strava Activity Widget - User Display", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    const authenticated = await isAuthenticated(page);
    test.skip(!authenticated, "User not authenticated - skipping test");
  });

  test("Strava Activity Widget displays when challenge has stravaEmbedCode", async ({
    page,
  }) => {
    await page.goto("/");

    // Check if Activity Widget is visible (only shows if challenge has stravaEmbedCode)
    const activityWidget = page.getByText("Club Activity");

    // This widget is conditionally rendered
    const isVisible = await activityWidget.isVisible().catch(() => false);

    if (isVisible) {
      // If widget is visible, verify its structure
      await expect(
        page.getByText("Recent runs from our club")
      ).toBeVisible();
      await expect(
        page.getByTitle("Strava Club Activity Feed")
      ).toBeVisible();
    }
  });

  test("Strava Activity Widget contains iframe", async ({ page }) => {
    await page.goto("/");

    // Check if Activity Widget is visible
    const activityWidget = page.getByText("Club Activity");
    const isVisible = await activityWidget.isVisible().catch(() => false);

    if (isVisible) {
      // Check for the iframe
      const iframe = page.getByTitle("Strava Club Activity Feed");
      await expect(iframe).toBeVisible();

      // Verify iframe src is from Strava
      const src = await iframe.getAttribute("src");
      expect(src).toContain("strava.com");
    }
  });

  test("Strava Activity Widget iframe has proper attributes", async ({
    page,
  }) => {
    await page.goto("/");

    const activityWidget = page.getByText("Club Activity");
    const isVisible = await activityWidget.isVisible().catch(() => false);

    if (isVisible) {
      const iframe = page.getByTitle("Strava Club Activity Feed");

      // Check for proper width and height attributes
      const width = await iframe.getAttribute("width");
      const height = await iframe.getAttribute("height");
      expect(parseInt(width || "0")).toBeGreaterThan(0);
      expect(parseInt(height || "0")).toBeGreaterThan(0);
    }
  });
});

test.describe("Strava Activity Widget - Accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    const authenticated = await isAuthenticated(page);
    test.skip(!authenticated, "User not authenticated - skipping test");
  });

  test("Strava Activity Widget iframe has accessible title", async ({
    page,
  }) => {
    await page.goto("/");

    const activityWidget = page.getByText("Club Activity");
    const isVisible = await activityWidget.isVisible().catch(() => false);

    if (isVisible) {
      // The iframe should have a title for accessibility
      const iframe = page.getByTitle("Strava Club Activity Feed");
      await expect(iframe).toBeVisible();
    }
  });
});

test.describe("Strava Activity Widget - Save Iframe Embed Code", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    const admin = await isAdmin(page);
    test.skip(!admin, "User is not admin - skipping admin test");
  });

  test("can save Strava embed code in edit challenge form", async ({
    page,
  }) => {
    await page.goto("/admin/challenges");

    // Find and click an edit link
    const editLinks = page.getByRole("link", { name: /edit/i });
    const hasEditLinks = (await editLinks.count()) > 0;
    test.skip(!hasEditLinks, "No challenges to edit");

    await editLinks.first().click();

    // Wait for edit form to load
    await expect(page.getByText("Edit Challenge:")).toBeVisible();

    // Find the Strava Embed Code textarea
    const embedCodeTextarea = page.locator('textarea[name="stravaEmbedCode"]');
    await expect(embedCodeTextarea).toBeVisible();

    // Enter a valid Strava iframe embed code
    const testEmbedCode =
      "<iframe allowtransparency='true' frameborder='0' height='454' scrolling='no' src='https://www.strava.com/clubs/1234/latest-rides/abc123def456' width='300'></iframe>";
    await embedCodeTextarea.fill(testEmbedCode);

    // Submit the form
    const saveButton = page.getByRole("button", { name: /save|update/i });
    await saveButton.click();

    // Wait for redirect to challenges list (indicates success)
    await expect(page).toHaveURL("/admin/challenges", { timeout: 10000 });
  });

  test("saved embed code persists after page reload", async ({ page }) => {
    await page.goto("/admin/challenges");

    // Find and click the first edit link
    const editLinks = page.getByRole("link", { name: /edit/i });
    const hasEditLinks = (await editLinks.count()) > 0;
    test.skip(!hasEditLinks, "No challenges to edit");

    await editLinks.first().click();
    await expect(page.getByText("Edit Challenge:")).toBeVisible();

    const embedCodeTextarea = page.locator('textarea[name="stravaEmbedCode"]');
    
    // Clear any existing value and enter new embed code
    const testEmbedCode =
      "<iframe src='https://www.strava.com/clubs/test-persist/latest-rides/persist123' width='300' height='454'></iframe>";
    await embedCodeTextarea.fill(testEmbedCode);

    // Submit the form
    const saveButton = page.getByRole("button", { name: /save|update/i });
    await saveButton.click();

    // Wait for redirect
    await expect(page).toHaveURL("/admin/challenges", { timeout: 10000 });

    // Go back to edit the same challenge
    await editLinks.first().click();
    await expect(page.getByText("Edit Challenge:")).toBeVisible();

    // Verify the embed code was saved
    const savedTextarea = page.locator('textarea[name="stravaEmbedCode"]');
    await expect(savedTextarea).toHaveValue(testEmbedCode);
  });

  test("can clear Strava embed code", async ({ page }) => {
    await page.goto("/admin/challenges");

    const editLinks = page.getByRole("link", { name: /edit/i });
    const hasEditLinks = (await editLinks.count()) > 0;
    test.skip(!hasEditLinks, "No challenges to edit");

    await editLinks.first().click();
    await expect(page.getByText("Edit Challenge:")).toBeVisible();

    const embedCodeTextarea = page.locator('textarea[name="stravaEmbedCode"]');

    // First set a value
    const testEmbedCode =
      "<iframe src='https://www.strava.com/clubs/clear-test/latest-rides/clear123' width='300' height='454'></iframe>";
    await embedCodeTextarea.fill(testEmbedCode);

    const saveButton = page.getByRole("button", { name: /save|update/i });
    await saveButton.click();
    await expect(page).toHaveURL("/admin/challenges", { timeout: 10000 });

    // Edit again and clear the value
    await editLinks.first().click();
    await expect(page.getByText("Edit Challenge:")).toBeVisible();

    const savedTextarea = page.locator('textarea[name="stravaEmbedCode"]');
    await savedTextarea.clear();
    await saveButton.click();
    await expect(page).toHaveURL("/admin/challenges", { timeout: 10000 });

    // Verify it was cleared
    await editLinks.first().click();
    await expect(page.getByText("Edit Challenge:")).toBeVisible();
    const clearedTextarea = page.locator('textarea[name="stravaEmbedCode"]');
    await expect(clearedTextarea).toHaveValue("");
  });

  test("form submission works with multiline iframe code", async ({
    page,
  }) => {
    await page.goto("/admin/challenges");

    const editLinks = page.getByRole("link", { name: /edit/i });
    const hasEditLinks = (await editLinks.count()) > 0;
    test.skip(!hasEditLinks, "No challenges to edit");

    await editLinks.first().click();
    await expect(page.getByText("Edit Challenge:")).toBeVisible();

    const embedCodeTextarea = page.locator('textarea[name="stravaEmbedCode"]');

    // Test with multiline iframe (as Strava sometimes provides)
    const multilineEmbedCode = `<iframe
      allowtransparency='true'
      frameborder='0'
      height='454'
      scrolling='no'
      src='https://www.strava.com/clubs/multiline-test/latest-rides/multi123'
      width='300'>
    </iframe>`;
    await embedCodeTextarea.fill(multilineEmbedCode);

    const saveButton = page.getByRole("button", { name: /save|update/i });
    await saveButton.click();

    // Form should submit successfully
    await expect(page).toHaveURL("/admin/challenges", { timeout: 10000 });
  });
});
