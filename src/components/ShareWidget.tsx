"use client";

import { useState, useEffect } from "react";
import {
  triggerNativeShare,
  copyToClipboard,
  getShareUrl,
  supportsNativeShare,
  DEFAULT_SHARE_DATA,
} from "@/lib/share";

export function ShareWidget() {
  const [copied, setCopied] = useState(false);
  const [hasNativeShare, setHasNativeShare] = useState(false);
  const [shareUrl, setShareUrl] = useState(DEFAULT_SHARE_DATA.url);

  // Check for native share support and get URL on client side
  useEffect(() => {
    setHasNativeShare(supportsNativeShare());
    setShareUrl(getShareUrl());
  }, []);

  const handleShare = async () => {
    const shareData = {
      ...DEFAULT_SHARE_DATA,
      url: shareUrl,
    };

    // On mobile/supported devices, use native share
    if (hasNativeShare) {
      await triggerNativeShare(shareData);
    } else {
      // On desktop, copy to clipboard
      const success = await copyToClipboard(shareUrl);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  return (
    <div className="rounded-2xl bg-white border-2 border-nnrc-lavender p-6 shadow-md text-center">
      <h2 className="mb-3 text-xl font-semibold text-nnrc-purple-dark">
        Spread the Word
      </h2>
      <p className="mb-4 text-sm text-gray-600">
        Know someone who&apos;d love to run with us?
      </p>

      <button
        onClick={handleShare}
        className="inline-flex items-center gap-2 rounded-lg bg-nnrc-purple px-5 py-2.5 text-sm font-medium text-white hover:bg-nnrc-purple-dark transition-colors duration-200"
        aria-label={copied ? "Link copied!" : hasNativeShare ? "Share the club" : "Copy link"}
      >
        {copied ? (
          <>
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Copied!
          </>
        ) : (
          <>
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            Share the Club
          </>
        )}
      </button>
    </div>
  );
}
