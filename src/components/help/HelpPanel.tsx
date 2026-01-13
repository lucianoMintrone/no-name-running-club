"use client";

import { useState, useEffect } from "react";

interface HelpPanelProps {
  title?: string;
  storageKey: string;
  children: React.ReactNode;
}

export function HelpPanel({
  title = "About This Page",
  storageKey,
  children,
}: HelpPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load collapsed state from localStorage
    const stored = localStorage.getItem(`help-panel-${storageKey}`);
    if (stored !== null) {
      setIsCollapsed(stored === "true");
    }
    setIsLoaded(true);
  }, [storageKey]);

  useEffect(() => {
    // Save collapsed state to localStorage
    if (isLoaded) {
      localStorage.setItem(`help-panel-${storageKey}`, String(isCollapsed));
    }
  }, [isCollapsed, storageKey, isLoaded]);

  // Don't render until we've loaded the saved state to prevent flash
  if (!isLoaded) {
    return null;
  }

  return (
    <div className="rounded-xl border border-nnrc-lavender bg-nnrc-lavender-light/50 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-nnrc-lavender-light/70 transition-colors"
        aria-expanded={!isCollapsed}
      >
        <div className="flex items-center gap-2">
          <svg
            className="h-5 w-5 text-nnrc-purple"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          <span className="font-medium text-nnrc-purple-dark">{title}</span>
        </div>
        <svg
          className={`h-5 w-5 text-nnrc-purple-dark transition-transform ${
            isCollapsed ? "" : "rotate-180"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {!isCollapsed && (
        <div className="border-t border-nnrc-lavender px-4 py-4 text-sm text-gray-700">
          {children}
        </div>
      )}
    </div>
  );
}

interface KeyConceptsProps {
  title?: string;
  concepts: string[];
}

export function KeyConcepts({
  title = "Key Concepts",
  concepts,
}: KeyConceptsProps) {
  return (
    <div className="mt-3">
      <p className="font-medium text-nnrc-purple-dark mb-2">{title}:</p>
      <ul className="list-disc list-inside space-y-1 text-gray-600">
        {concepts.map((concept, index) => (
          <li key={index}>{concept}</li>
        ))}
      </ul>
    </div>
  );
}
