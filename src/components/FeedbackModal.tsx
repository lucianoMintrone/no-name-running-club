"use client";

import { useMemo, useState, useTransition } from "react";
import { usePathname } from "next/navigation";
import { submitFeedback } from "@/app/actions/feedback";
import posthog from "posthog-js";

type FeedbackModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const pathname = usePathname();
  const [category, setCategory] = useState<"bug" | "idea" | "question">("idea");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<null | { type: "ok" | "err"; text: string }>(null);
  const [isPending, startTransition] = useTransition();

  const canSubmit = useMemo(() => message.trim().length > 0 && !isPending, [message, isPending]);

  if (!isOpen) return null;

  const onSubmit = () => {
    setStatus(null);
    startTransition(async () => {
      try {
        const res = await submitFeedback({
          category,
          message,
          pagePath: pathname ?? undefined,
          userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
        });

        // Track feedback submission
        posthog.capture("feedback_submitted", {
          category,
          message_length: message.length,
          page_path: pathname,
          linear_status: res.linearStatus,
        });

        if (res.linearStatus === "created") {
          setStatus({ type: "ok", text: "Sent! Thanks — we created a Linear ticket." });
        } else {
          setStatus({
            type: "ok",
            text: "Sent! Thanks — we saved your feedback.",
          });
        }

        setMessage("");
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to send feedback";
        setStatus({ type: "err", text: msg });
        // Track error for error tracking
        posthog.captureException(e instanceof Error ? e : new Error(msg));
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => !isPending && onClose()}
      />
      <div className="relative z-10 w-full max-w-lg rounded-xl bg-white p-8 shadow-2xl animate-fadeIn">
        <button
          onClick={() => onClose()}
          disabled={isPending}
          className="cursor-pointer absolute right-4 top-4 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-150"
          aria-label="Close feedback modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Leave feedback</h2>
          <p className="mt-1 text-sm text-gray-600">
            Tell us what’s working, what’s confusing, or what you want next.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as typeof category)}
              disabled={isPending}
              className="w-full rounded-lg bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-nnrc-purple focus:outline-none transition-all duration-150 disabled:opacity-50"
            >
              <option value="idea">Idea</option>
              <option value="bug">Bug</option>
              <option value="question">Question</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isPending}
              rows={5}
              placeholder="What should we improve? What happened? What did you expect?"
              className="w-full resize-none rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-nnrc-purple focus:outline-none transition-all duration-150 disabled:opacity-50"
            />
            <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
              <span>We’ll attach the current page for context.</span>
              <span>{message.length}/5000</span>
            </div>
          </div>

          {status && (
            <div
              className={
                status.type === "ok"
                  ? "rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800"
                  : "rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800"
              }
            >
              {status.text}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={onClose}
              disabled={isPending}
              className="cursor-pointer rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-150"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={!canSubmit}
              className="cursor-pointer rounded-lg bg-gradient-to-r from-nnrc-purple to-nnrc-purple-light px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-150"
            >
              {isPending ? "Sending…" : "Send feedback"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

