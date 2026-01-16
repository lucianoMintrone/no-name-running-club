/**
 * E2E Test Global Setup
 * This file contains shared utilities and configurations for E2E tests
 */

import { test as base, expect } from "@playwright/test";

// Custom test with shared fixtures
export const test = base.extend({
  // Add custom fixtures here if needed
});

// Re-export expect for convenience
export { expect };

/**
 * Wait for page to be fully loaded including network idle
 */
export async function waitForPageLoad(page: import("@playwright/test").Page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("networkidle");
}

/**
 * Check if an element exists without throwing
 */
export async function elementExists(
  page: import("@playwright/test").Page,
  selector: string
): Promise<boolean> {
  try {
    return await page.locator(selector).isVisible();
  } catch {
    return false;
  }
}

/**
 * Common test data
 */
export const testData = {
  validZipCode: "10001",
  invalidZipCode: "invalid",
  testTemperature: "32",
};
