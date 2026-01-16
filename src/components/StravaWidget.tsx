"use client";

interface StravaWidgetProps {
  stravaUrl: string;
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
 * A branded widget that links users to a Strava challenge or club.
 * Uses Strava's official orange color (#FC4C02) for brand compliance.
 */
export function StravaWidget({ stravaUrl }: StravaWidgetProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-card">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FC4C02]">
          <StravaLogo className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Strava Challenge
          </h2>
          <p className="text-xs text-gray-500">
            Track your runs on Strava
          </p>
        </div>
      </div>
      
      <a
        href={stravaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#FC4C02] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#E34402] hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
      >
        <StravaLogo className="h-4 w-4" />
        Join the Strava Challenge
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </a>
    </div>
  );
}
