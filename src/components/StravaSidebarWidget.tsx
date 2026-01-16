"use client";
import { useState } from "react";
import { StravaWidget } from "./StravaWidget";
import { StravaActivityWidget } from "./StravaActivityWidget";

interface StravaSidebarWidgetProps {
  stravaUrl: string | null;
  stravaEmbedCode: string | null;
}

export function StravaSidebarWidget({ stravaUrl, stravaEmbedCode }: StravaSidebarWidgetProps) {
  const [open, setOpen] = useState(false);

  // Only show the sidebar if at least one Strava prop is present
  if (!stravaUrl && !stravaEmbedCode) return null;

  return (
    <>
      {/* Floating Strava button */}
      {!open && (
        <button
          aria-label="Open Strava sidebar"
          className="fixed bottom-8 right-8 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#FC4C02] shadow-lg hover:bg-[#e04a00] transition-colors"
          onClick={() => setOpen(true)}
        >
          {/* Strava logo SVG */}
          <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-white" aria-hidden="true">
            <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" fill="currentColor" />
          </svg>
        </button>
      )}

      {/* Sidebar overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
            onClick={() => setOpen(false)}
            aria-label="Close Strava sidebar"
          />
          {/* Sidebar */}
          <aside className="relative ml-auto h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
            {/* Close button */}
            <button
              aria-label="Close sidebar"
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors"
              onClick={() => setOpen(false)}
            >
              <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5" aria-hidden="true">
                <path d="M6 6l8 8M6 14L14 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <div className="p-6 pt-12 flex flex-col gap-6 flex-1 overflow-y-auto">
              {/* Join Challenge button at top */}
              {stravaUrl && (
                <StravaWidget stravaUrl={stravaUrl} />
              )}
              {/* Activity feed below */}
              {stravaEmbedCode && (
                <StravaActivityWidget embedCode={stravaEmbedCode} />
              )}
            </div>
          </aside>
        </div>
      )}
      <style jsx global>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </>
  );
}
