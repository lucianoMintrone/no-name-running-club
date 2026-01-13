/**
 * Share utilities for the ShareWidget component.
 * Extracted for easier testing and reuse.
 */

export interface ShareData {
  title: string;
  text: string;
  url: string;
}

export const DEFAULT_SHARE_DATA: ShareData = {
  title: "No Name Running Club",
  text: "Join me at No Name Running Club - Run together. No name needed.",
  url: "https://nnrc.app",
};

/**
 * Check if the Web Share API is supported in the current browser.
 */
export function supportsNativeShare(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}

/**
 * Check if we're running on an iOS device.
 */
export function isIOSDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

/**
 * Trigger native share dialog (Web Share API).
 * Returns true if share was successful, false if cancelled or failed.
 */
export async function triggerNativeShare(data: ShareData): Promise<boolean> {
  if (!supportsNativeShare()) {
    return false;
  }

  try {
    await navigator.share({
      title: data.title,
      text: data.text,
      url: data.url,
    });
    return true;
  } catch (err) {
    // AbortError means user cancelled - not an error
    // Other errors mean share failed
    console.log("Share cancelled or failed:", err);
    return false;
  }
}

/**
 * Build a mailto: URL for email sharing.
 */
export function buildEmailShareUrl(data: ShareData): string {
  const subject = encodeURIComponent(data.title);
  const body = encodeURIComponent(`${data.text}\n\n${data.url}`);
  return `mailto:?subject=${subject}&body=${body}`;
}

/**
 * Build an SMS URL for text message sharing.
 * Uses different URL formats for iOS vs Android.
 */
export function buildSmsShareUrl(data: ShareData): string {
  const body = encodeURIComponent(`${data.text} ${data.url}`);
  // iOS uses sms:&body= while Android uses sms:?body=
  return isIOSDevice() ? `sms:&body=${body}` : `sms:?body=${body}`;
}

/**
 * Copy text to clipboard.
 * Returns true if successful, false if failed.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.clipboard) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Failed to copy to clipboard:", err);
    return false;
  }
}

/**
 * Get the current page URL for sharing.
 */
export function getShareUrl(): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return DEFAULT_SHARE_DATA.url;
}
