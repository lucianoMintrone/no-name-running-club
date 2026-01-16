"use client";

interface StravaActivityWidgetProps {
  embedCode: string;
}

/**
 * Strava logo icon component - official Strava "S" mark
 */
function StravaLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
    </svg>
  );
}

/**
 * Extracts the src URL from a Strava iframe embed code.
 * This is used for secure rendering instead of using dangerouslySetInnerHTML.
 */
function extractIframeSrc(embedCode: string): string | null {
  // Match src attribute from iframe, handling both single and double quotes
  const srcMatch = embedCode.match(/src=["']([^"']+)["']/);
  if (!srcMatch) return null;
  
  const src = srcMatch[1];
  
  // Validate that the URL is from Strava
  try {
    const url = new URL(src);
    if (url.hostname === 'www.strava.com' || url.hostname === 'strava.com') {
      return src;
    }
  } catch {
    // Invalid URL
    return null;
  }
  
  return null;
}

/**
 * Extracts dimensions from a Strava iframe embed code.
 * Uses minimum width of 320px to ensure button text is not truncated.
 */
function extractIframeDimensions(embedCode: string): { width: number; height: number } {
  const widthMatch = embedCode.match(/width=["']?(\d+)["']?/);
  const heightMatch = embedCode.match(/height=["']?(\d+)["']?/);
  
  // Use at least 320px width to ensure Strava button text is not truncated
  const extractedWidth = widthMatch ? parseInt(widthMatch[1], 10) : 300;
  const minWidth = 320;
  
  return {
    width: Math.max(extractedWidth, minWidth),
    height: heightMatch ? parseInt(heightMatch[1], 10) : 454,
  };
}

/**
 * A widget that displays a Strava activity feed using their official embed widget.
 * Safely extracts and renders only validated Strava iframe sources.
 */
export function StravaActivityWidget({ embedCode }: StravaActivityWidgetProps) {
  const iframeSrc = extractIframeSrc(embedCode);
  const { width, height } = extractIframeDimensions(embedCode);
  
  // Don't render if we couldn't extract a valid Strava URL
  if (!iframeSrc) {
    return null;
  }

  return (
    <div className="rounded-xl bg-white p-4 shadow-card">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FC4C02]">
          <StravaLogo className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-900">
            Club Activity
          </h2>
          <p className="text-xs text-gray-500">
            Recent runs from our club
          </p>
        </div>
      </div>
      
      <div className="overflow-hidden rounded-lg">
        <iframe
          src={iframeSrc}
          width={width}
          height={height}
          frameBorder="0"
          scrolling="no"
          allowTransparency
          title="Strava Club Activity Feed"
          className="w-full"
          style={{ maxWidth: '100%' }}
        />
      </div>
    </div>
  );
}

// Export the helper functions for testing
export { extractIframeSrc, extractIframeDimensions };
