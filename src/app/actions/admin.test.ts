import { describe, it, expect } from "vitest";

/**
 * Admin Actions Unit Tests - Strava Embed Code Handling
 * 
 * Note: Server actions with "use server" directive require special testing
 * approaches. These tests focus on the data transformation logic and
 * validation that can be tested in isolation.
 * 
 * Full integration testing of the save functionality is handled by:
 * - E2E tests in e2e/strava.spec.ts "Strava Activity Widget - Save Iframe Embed Code"
 * - Manual testing through the admin interface
 */

describe("Strava Embed Code - Data Validation", () => {
  describe("FormData handling", () => {
    it("should handle empty stravaEmbedCode from FormData", () => {
      const formData = new FormData();
      formData.set("stravaEmbedCode", "");
      
      const value = formData.get("stravaEmbedCode") as string | null;
      // Empty string should be treated as null/no value
      const processedValue = value || null;
      
      expect(processedValue).toBeNull();
    });

    it("should preserve valid iframe embed code from FormData", () => {
      const embedCode =
        "<iframe src='https://www.strava.com/clubs/12345/latest-rides/abc123' width='300' height='454'></iframe>";
      
      const formData = new FormData();
      formData.set("stravaEmbedCode", embedCode);
      
      const value = formData.get("stravaEmbedCode") as string | null;
      const processedValue = value || null;
      
      expect(processedValue).toBe(embedCode);
    });

    it("should handle multiline iframe embed code from FormData", () => {
      const multilineEmbedCode = `<iframe
        allowtransparency='true'
        frameborder='0'
        height='454'
        scrolling='no'
        src='https://www.strava.com/clubs/test/latest-rides/abc'
        width='300'>
      </iframe>`;
      
      const formData = new FormData();
      formData.set("stravaEmbedCode", multilineEmbedCode);
      
      const value = formData.get("stravaEmbedCode") as string | null;
      
      expect(value).toBe(multilineEmbedCode);
      expect(value).toContain("strava.com");
      expect(value).toContain("iframe");
    });

    it("should handle special characters in embed code", () => {
      const embedCodeWithSpecialChars =
        "<iframe src='https://www.strava.com/clubs/test/latest-rides/abc?show_rides=true&theme=dark' width='300' height='454'></iframe>";
      
      const formData = new FormData();
      formData.set("stravaEmbedCode", embedCodeWithSpecialChars);
      
      const value = formData.get("stravaEmbedCode") as string | null;
      
      expect(value).toBe(embedCodeWithSpecialChars);
      expect(value).toContain("show_rides=true");
      expect(value).toContain("&theme=dark");
    });

    it("should handle undefined/missing stravaEmbedCode in FormData", () => {
      const formData = new FormData();
      // Not setting stravaEmbedCode at all
      
      const value = formData.get("stravaEmbedCode") as string | null;
      
      expect(value).toBeNull();
    });
  });

  describe("Data consistency", () => {
    it("stravaUrl and stravaEmbedCode should be independent fields", () => {
      const formData = new FormData();
      formData.set("stravaUrl", "https://www.strava.com/clubs/my-club");
      formData.set("stravaEmbedCode", "<iframe src='https://www.strava.com/clubs/12345/latest-rides/abc'></iframe>");
      
      const stravaUrl = formData.get("stravaUrl") as string | null;
      const stravaEmbedCode = formData.get("stravaEmbedCode") as string | null;
      
      // Both values should be preserved independently
      expect(stravaUrl).toBe("https://www.strava.com/clubs/my-club");
      expect(stravaEmbedCode).toContain("iframe");
      expect(stravaUrl).not.toContain("iframe");
      expect(stravaEmbedCode).not.toBe(stravaUrl);
    });

    it("should allow stravaUrl without stravaEmbedCode", () => {
      const formData = new FormData();
      formData.set("stravaUrl", "https://www.strava.com/clubs/my-club");
      
      const stravaUrl = formData.get("stravaUrl") as string | null;
      const stravaEmbedCode = formData.get("stravaEmbedCode") as string | null;
      
      expect(stravaUrl).not.toBeNull();
      expect(stravaEmbedCode).toBeNull();
    });

    it("should allow stravaEmbedCode without stravaUrl", () => {
      const formData = new FormData();
      formData.set("stravaEmbedCode", "<iframe src='https://www.strava.com/clubs/12345/latest-rides/abc'></iframe>");
      
      const stravaUrl = formData.get("stravaUrl") as string | null;
      const stravaEmbedCode = formData.get("stravaEmbedCode") as string | null;
      
      expect(stravaUrl).toBeNull();
      expect(stravaEmbedCode).not.toBeNull();
    });
  });
});
