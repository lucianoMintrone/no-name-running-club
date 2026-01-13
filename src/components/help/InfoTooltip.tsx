"use client";

import { useState, useRef, useEffect } from "react";

interface InfoTooltipProps {
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  maxWidth?: number;
}

export function InfoTooltip({
  content,
  position = "top",
  maxWidth = 250,
}: InfoTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Detect mobile/touch devices
    setIsMobile("ontouchstart" in window);
  }, []);

  useEffect(() => {
    // Close tooltip when clicking outside (for mobile)
    function handleClickOutside(event: MouseEvent) {
      if (
        tooltipRef.current &&
        buttonRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    }

    if (isVisible && isMobile) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isVisible, isMobile]);

  useEffect(() => {
    // Close on Escape key
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsVisible(false);
        buttonRef.current?.focus();
      }
    }

    if (isVisible) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isVisible]);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowClasses = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-gray-900 border-x-transparent border-b-transparent",
    bottom:
      "bottom-full left-1/2 -translate-x-1/2 border-b-gray-900 border-x-transparent border-t-transparent",
    left: "left-full top-1/2 -translate-y-1/2 border-l-gray-900 border-y-transparent border-r-transparent",
    right:
      "right-full top-1/2 -translate-y-1/2 border-r-gray-900 border-y-transparent border-l-transparent",
  };

  return (
    <span className="relative inline-flex items-center">
      <button
        ref={buttonRef}
        type="button"
        className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-nnrc-purple-light hover:text-nnrc-purple focus:outline-none focus:ring-2 focus:ring-nnrc-purple focus:ring-offset-1"
        aria-label="More information"
        aria-expanded={isVisible}
        onClick={() => isMobile && setIsVisible(!isVisible)}
        onMouseEnter={() => !isMobile && setIsVisible(true)}
        onMouseLeave={() => !isMobile && setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => !isMobile && setIsVisible(false)}
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
      </button>

      {isVisible && (
        <div
          ref={tooltipRef}
          role="tooltip"
          className={`absolute z-50 ${positionClasses[position]}`}
          style={{ maxWidth: `${maxWidth}px` }}
        >
          <div className="rounded-lg bg-gray-900 px-3 py-2 text-sm text-white shadow-lg">
            {content}
          </div>
          {/* Arrow */}
          <div
            className={`absolute h-0 w-0 border-4 ${arrowClasses[position]}`}
          />
        </div>
      )}
    </span>
  );
}
