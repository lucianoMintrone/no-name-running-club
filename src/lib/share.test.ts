import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  supportsNativeShare,
  isIOSDevice,
  triggerNativeShare,
  buildEmailShareUrl,
  buildSmsShareUrl,
  copyToClipboard,
  getShareUrl,
  DEFAULT_SHARE_DATA,
  type ShareData,
} from "./share";

describe("Share Utilities", () => {
  const originalNavigator = global.navigator;
  const originalWindow = global.window;

  const mockShareData: ShareData = {
    title: "Test Title",
    text: "Test text message",
    url: "https://example.com",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore original globals
    Object.defineProperty(global, "navigator", {
      value: originalNavigator,
      writable: true,
    });
    Object.defineProperty(global, "window", {
      value: originalWindow,
      writable: true,
    });
  });

  describe("DEFAULT_SHARE_DATA", () => {
    it("should have correct default values", () => {
      expect(DEFAULT_SHARE_DATA.title).toBe("No Name Running Club");
      expect(DEFAULT_SHARE_DATA.text).toContain("No Name Running Club");
      expect(DEFAULT_SHARE_DATA.url).toBe("https://nnrc.app");
    });
  });

  describe("supportsNativeShare", () => {
    it("should return true when navigator.share is available", () => {
      Object.defineProperty(global, "navigator", {
        value: { share: vi.fn() },
        writable: true,
      });

      expect(supportsNativeShare()).toBe(true);
    });

    it("should return false when navigator.share is not available", () => {
      Object.defineProperty(global, "navigator", {
        value: {},
        writable: true,
      });

      expect(supportsNativeShare()).toBe(false);
    });

    it("should return false when navigator is undefined", () => {
      Object.defineProperty(global, "navigator", {
        value: undefined,
        writable: true,
      });

      expect(supportsNativeShare()).toBe(false);
    });
  });

  describe("isIOSDevice", () => {
    it("should return true for iPhone user agent", () => {
      Object.defineProperty(global, "navigator", {
        value: { userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)" },
        writable: true,
      });

      expect(isIOSDevice()).toBe(true);
    });

    it("should return true for iPad user agent", () => {
      Object.defineProperty(global, "navigator", {
        value: { userAgent: "Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)" },
        writable: true,
      });

      expect(isIOSDevice()).toBe(true);
    });

    it("should return true for iPod user agent", () => {
      Object.defineProperty(global, "navigator", {
        value: { userAgent: "Mozilla/5.0 (iPod touch; CPU iPhone OS 14_0 like Mac OS X)" },
        writable: true,
      });

      expect(isIOSDevice()).toBe(true);
    });

    it("should return false for Android user agent", () => {
      Object.defineProperty(global, "navigator", {
        value: { userAgent: "Mozilla/5.0 (Linux; Android 10; SM-G975F)" },
        writable: true,
      });

      expect(isIOSDevice()).toBe(false);
    });

    it("should return false when navigator is undefined", () => {
      Object.defineProperty(global, "navigator", {
        value: undefined,
        writable: true,
      });

      expect(isIOSDevice()).toBe(false);
    });
  });

  describe("triggerNativeShare", () => {
    it("should call navigator.share with correct data and return true on success", async () => {
      const mockShare = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(global, "navigator", {
        value: { share: mockShare },
        writable: true,
      });

      const result = await triggerNativeShare(mockShareData);

      expect(mockShare).toHaveBeenCalledWith({
        title: mockShareData.title,
        text: mockShareData.text,
        url: mockShareData.url,
      });
      expect(result).toBe(true);
    });

    it("should return false when share is cancelled by user", async () => {
      const mockShare = vi.fn().mockRejectedValue(new DOMException("Share cancelled", "AbortError"));
      Object.defineProperty(global, "navigator", {
        value: { share: mockShare },
        writable: true,
      });

      const result = await triggerNativeShare(mockShareData);

      expect(result).toBe(false);
    });

    it("should return false when share fails", async () => {
      const mockShare = vi.fn().mockRejectedValue(new Error("Share failed"));
      Object.defineProperty(global, "navigator", {
        value: { share: mockShare },
        writable: true,
      });

      const result = await triggerNativeShare(mockShareData);

      expect(result).toBe(false);
    });

    it("should return false when native share is not supported", async () => {
      Object.defineProperty(global, "navigator", {
        value: {},
        writable: true,
      });

      const result = await triggerNativeShare(mockShareData);

      expect(result).toBe(false);
    });
  });

  describe("buildEmailShareUrl", () => {
    it("should build correct mailto URL with encoded subject and body", () => {
      const url = buildEmailShareUrl(mockShareData);

      expect(url).toContain("mailto:?subject=");
      expect(url).toContain("&body=");
      expect(url).toContain(encodeURIComponent(mockShareData.title));
      expect(url).toContain(encodeURIComponent(mockShareData.text));
      expect(url).toContain(encodeURIComponent(mockShareData.url));
    });

    it("should handle special characters in title and text", () => {
      const dataWithSpecialChars: ShareData = {
        title: "Test & Challenge!",
        text: "Join us! It's great.",
        url: "https://example.com/path?param=value",
      };

      const url = buildEmailShareUrl(dataWithSpecialChars);

      // URL should be properly encoded
      expect(url).toContain(encodeURIComponent("Test & Challenge!"));
      expect(url).toContain(encodeURIComponent("Join us! It's great."));
    });

    it("should include newlines between text and URL in body", () => {
      const url = buildEmailShareUrl(mockShareData);
      const expectedBody = `${mockShareData.text}\n\n${mockShareData.url}`;
      
      expect(url).toContain(encodeURIComponent(expectedBody));
    });
  });

  describe("buildSmsShareUrl", () => {
    it("should build iOS-style SMS URL with & separator", () => {
      Object.defineProperty(global, "navigator", {
        value: { userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)" },
        writable: true,
      });

      const url = buildSmsShareUrl(mockShareData);

      expect(url).toMatch(/^sms:&body=/);
      expect(url).toContain(encodeURIComponent(mockShareData.text));
      expect(url).toContain(encodeURIComponent(mockShareData.url));
    });

    it("should build Android-style SMS URL with ? separator", () => {
      Object.defineProperty(global, "navigator", {
        value: { userAgent: "Mozilla/5.0 (Linux; Android 10; SM-G975F)" },
        writable: true,
      });

      const url = buildSmsShareUrl(mockShareData);

      expect(url).toMatch(/^sms:\?body=/);
      expect(url).toContain(encodeURIComponent(mockShareData.text));
      expect(url).toContain(encodeURIComponent(mockShareData.url));
    });

    it("should combine text and URL with space separator in body", () => {
      Object.defineProperty(global, "navigator", {
        value: { userAgent: "Mozilla/5.0 (Linux; Android 10)" },
        writable: true,
      });

      const url = buildSmsShareUrl(mockShareData);
      const expectedBody = `${mockShareData.text} ${mockShareData.url}`;

      expect(url).toContain(encodeURIComponent(expectedBody));
    });
  });

  describe("copyToClipboard", () => {
    it("should return true when clipboard write succeeds", async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(global, "navigator", {
        value: { clipboard: { writeText: mockWriteText } },
        writable: true,
      });

      const result = await copyToClipboard("https://example.com");

      expect(mockWriteText).toHaveBeenCalledWith("https://example.com");
      expect(result).toBe(true);
    });

    it("should return false when clipboard write fails", async () => {
      const mockWriteText = vi.fn().mockRejectedValue(new Error("Permission denied"));
      Object.defineProperty(global, "navigator", {
        value: { clipboard: { writeText: mockWriteText } },
        writable: true,
      });

      const result = await copyToClipboard("https://example.com");

      expect(result).toBe(false);
    });

    it("should return false when clipboard API is not available", async () => {
      Object.defineProperty(global, "navigator", {
        value: {},
        writable: true,
      });

      const result = await copyToClipboard("https://example.com");

      expect(result).toBe(false);
    });

    it("should return false when navigator is undefined", async () => {
      Object.defineProperty(global, "navigator", {
        value: undefined,
        writable: true,
      });

      const result = await copyToClipboard("https://example.com");

      expect(result).toBe(false);
    });
  });

  describe("getShareUrl", () => {
    it("should return window.location.origin when available", () => {
      Object.defineProperty(global, "window", {
        value: { location: { origin: "https://mysite.com" } },
        writable: true,
      });

      const url = getShareUrl();

      expect(url).toBe("https://mysite.com");
    });

    it("should return default URL when window is undefined", () => {
      Object.defineProperty(global, "window", {
        value: undefined,
        writable: true,
      });

      const url = getShareUrl();

      expect(url).toBe(DEFAULT_SHARE_DATA.url);
    });

    it("should return default URL when location.origin is not available", () => {
      Object.defineProperty(global, "window", {
        value: { location: {} },
        writable: true,
      });

      const url = getShareUrl();

      expect(url).toBe(DEFAULT_SHARE_DATA.url);
    });
  });
});
