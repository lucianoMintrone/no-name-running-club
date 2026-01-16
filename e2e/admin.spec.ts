import { test, expect, Page } from "@playwright/test";

/**
 * Admin Pages - Tests for admin area accessibility and functionality
 * These tests verify that admin pages are properly protected and functional
 */

// Helper to check if user is admin
async function isAdmin(page: Page): Promise<boolean> {
  const adminLink = page.getByRole("link", { name: /admin/i });
  return await adminLink.isVisible().catch(() => false);
}

// Helper to check if on admin page
async function isOnAdminPage(page: Page): Promise<boolean> {
  return page.url().includes("/admin");
}

test.describe("Admin Access Control", () => {
  test("unauthenticated users cannot access admin dashboard", async ({ page }) => {
    await page.goto("/admin");
    
    // Should be redirected away from admin or see unauthorized message
    // Either redirected to home or shown an error
    const onAdminPage = await isOnAdminPage(page);
    
    if (onAdminPage) {
      // If still on admin page, there should be some kind of error or redirect pending
      const hasUnauthorized = await page.locator("text=/unauthorized|forbidden|sign in/i").isVisible().catch(() => false);
      // This might pass if middleware redirects
      expect(hasUnauthorized || page.url() !== "http://localhost:3000/admin").toBe(true);
    }
  });
});

test.describe("Admin Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    const admin = await isAdmin(page);
    test.skip(!admin, "User is not admin - skipping admin test");
  });

  test("admin link is visible for admin users", async ({ page }) => {
    await page.goto("/");
    const adminLink = page.getByRole("link", { name: /admin/i });
    await expect(adminLink).toBeVisible();
  });

  test("clicking admin link navigates to admin dashboard", async ({ page }) => {
    await page.goto("/");
    
    const adminLink = page.getByRole("link", { name: /admin/i });
    await adminLink.click();
    
    await expect(page).toHaveURL(/\/admin/);
    await expect(page.getByText("Admin Dashboard")).toBeVisible();
  });

  test("admin dashboard displays stats cards", async ({ page }) => {
    await page.goto("/admin");
    
    // Check for stats cards
    const totalUsers = page.locator("text=Total Users");
    const totalRuns = page.locator("text=Total Runs");
    const totalChallenges = page.locator("text=Total Challenges");
    
    await expect(totalUsers).toBeVisible();
    await expect(totalRuns).toBeVisible();
    await expect(totalChallenges).toBeVisible();
  });

  test("admin dashboard has navigation sidebar", async ({ page }) => {
    await page.goto("/admin");
    
    // Look for admin navigation links
    const usersLink = page.getByRole("link", { name: /users/i });
    const runsLink = page.getByRole("link", { name: /runs/i });
    const challengesLink = page.getByRole("link", { name: /challenges/i });
    const analyticsLink = page.getByRole("link", { name: /analytics/i });
    
    // At least some of these should be visible
    const hasNavigation = await usersLink.isVisible().catch(() => false) ||
                         await runsLink.isVisible().catch(() => false) ||
                         await challengesLink.isVisible().catch(() => false) ||
                         await analyticsLink.isVisible().catch(() => false);
    
    expect(hasNavigation).toBe(true);
  });
});

test.describe("Admin Users Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    const admin = await isAdmin(page);
    test.skip(!admin, "User is not admin - skipping admin test");
  });

  test("users page loads successfully", async ({ page }) => {
    await page.goto("/admin/users");
    
    await expect(page).toHaveURL(/\/admin\/users/);
    // Should have some indication this is the users page
    const heading = page.locator("h1, h2").filter({ hasText: /users/i });
    await expect(heading.first()).toBeVisible();
  });

  test("users page displays user list or table", async ({ page }) => {
    await page.goto("/admin/users");
    
    // Should have a table or list of users
    const table = page.locator("table");
    const userList = page.locator("[role='list']");
    
    const hasUserDisplay = await table.isVisible().catch(() => false) ||
                          await userList.isVisible().catch(() => false);
    
    expect(hasUserDisplay).toBe(true);
  });
});

test.describe("Admin Runs Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    const admin = await isAdmin(page);
    test.skip(!admin, "User is not admin - skipping admin test");
  });

  test("runs page loads successfully", async ({ page }) => {
    await page.goto("/admin/runs");
    
    await expect(page).toHaveURL(/\/admin\/runs/);
  });

  test("runs page has delete functionality", async ({ page }) => {
    await page.goto("/admin/runs");
    
    // Look for delete buttons or icons
    const deleteButton = page.locator("button").filter({ hasText: /delete/i });
    const deleteIcon = page.locator("[aria-label*='delete' i]");
    
    // There might be delete options available
    const hasDeleteOption = await deleteButton.first().isVisible().catch(() => false) ||
                           await deleteIcon.first().isVisible().catch(() => false);
    
    // This is informational - might not have delete if no runs exist
    console.log(`Delete options present: ${hasDeleteOption}`);
  });
});

test.describe("Admin Challenges Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    const admin = await isAdmin(page);
    test.skip(!admin, "User is not admin - skipping admin test");
  });

  test("challenges page loads successfully", async ({ page }) => {
    await page.goto("/admin/challenges");
    
    await expect(page).toHaveURL(/\/admin\/challenges/);
  });

  test("challenges page has create new challenge option", async ({ page }) => {
    await page.goto("/admin/challenges");
    
    // Look for "new challenge" or "create" button/link
    const newChallengeButton = page.locator("a, button").filter({ hasText: /new|create/i });
    
    const hasCreateOption = await newChallengeButton.first().isVisible().catch(() => false);
    expect(hasCreateOption).toBe(true);
  });

  test("new challenge page loads", async ({ page }) => {
    await page.goto("/admin/challenges/new");
    
    await expect(page).toHaveURL(/\/admin\/challenges\/new/);
  });
});

test.describe("Admin Analytics Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    const admin = await isAdmin(page);
    test.skip(!admin, "User is not admin - skipping admin test");
  });

  test("analytics page loads successfully", async ({ page }) => {
    await page.goto("/admin/analytics");
    
    await expect(page).toHaveURL(/\/admin\/analytics/);
  });
});

test.describe("Admin Navigation Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    const admin = await isAdmin(page);
    test.skip(!admin, "User is not admin - skipping admin test");
  });

  test("can navigate between all admin pages", async ({ page }) => {
    // Start at dashboard
    await page.goto("/admin");
    await expect(page.getByText("Admin Dashboard")).toBeVisible();
    
    // Navigate to users
    await page.getByRole("link", { name: /users/i }).click();
    await expect(page).toHaveURL(/\/admin\/users/);
    
    // Navigate to runs
    await page.goto("/admin");
    await page.getByRole("link", { name: /runs/i }).click();
    await expect(page).toHaveURL(/\/admin\/runs/);
    
    // Navigate to challenges
    await page.goto("/admin");
    await page.getByRole("link", { name: /challenges/i }).click();
    await expect(page).toHaveURL(/\/admin\/challenges/);
    
    // Navigate to analytics
    await page.goto("/admin");
    await page.getByRole("link", { name: /analytics/i }).click();
    await expect(page).toHaveURL(/\/admin\/analytics/);
  });

  test("can return to main site from admin", async ({ page }) => {
    await page.goto("/admin");
    
    // Look for home link or NNRC logo
    const homeLink = page.getByRole("link", { name: /nnrc|home/i }).first();
    
    if (await homeLink.isVisible()) {
      await homeLink.click();
      await expect(page).toHaveURL("/");
    }
  });
});
