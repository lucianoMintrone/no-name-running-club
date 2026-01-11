"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateUserUnits } from "@/app/actions/user";

interface SettingsModalProps {
  currentUnits: string;
}

export function SettingsModal({ currentUnits }: SettingsModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [units, setUnits] = useState(currentUnits);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggle = () => {
    const newUnits = units === "imperial" ? "metric" : "imperial";
    setUnits(newUnits);
    startTransition(async () => {
      await updateUserUnits(newUnits);
      router.refresh();
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
        aria-label="Settings"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-8 shadow-xl dark:bg-zinc-900">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                Settings
              </h2>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Units
              </span>
              <div className="flex items-center gap-3">
                <span
                  className={`text-sm ${units === "imperial" ? "font-medium text-zinc-900 dark:text-zinc-50" : "text-zinc-400"}`}
                >
                  Imperial
                </span>
                <button
                  onClick={handleToggle}
                  disabled={isPending}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    units === "metric"
                      ? "bg-emerald-500"
                      : "bg-zinc-300 dark:bg-zinc-600"
                  } ${isPending ? "opacity-50" : ""}`}
                  role="switch"
                  aria-checked={units === "metric"}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      units === "metric"
                        ? "translate-x-5 left-0.5"
                        : "translate-x-0 left-0.5"
                    }`}
                  />
                </button>
                <span
                  className={`text-sm ${units === "metric" ? "font-medium text-zinc-900 dark:text-zinc-50" : "text-zinc-400"}`}
                >
                  Metric
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
