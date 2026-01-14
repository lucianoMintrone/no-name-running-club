"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateUserUnits, updateUserZipCode } from "@/app/actions/user";

interface SettingsModalProps {
  currentUnits: string;
  currentZipCode?: string | null;
}

export function SettingsModal({ currentUnits, currentZipCode }: SettingsModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [units, setUnits] = useState(currentUnits);
  const [zipCode, setZipCode] = useState(currentZipCode || "");
  const [isPending, startTransition] = useTransition();
  const [zipSaved, setZipSaved] = useState(false);
  const router = useRouter();

  const handleToggle = () => {
    const newUnits = units === "imperial" ? "metric" : "imperial";
    setUnits(newUnits);
    startTransition(async () => {
      await updateUserUnits(newUnits);
      router.refresh();
    });
  };

  const handleZipCodeSave = () => {
    startTransition(async () => {
      await updateUserZipCode(zipCode);
      setZipSaved(true);
      setTimeout(() => setZipSaved(false), 2000);
      router.refresh();
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="cursor-pointer rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors duration-150"
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
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-8 shadow-2xl animate-fadeIn">
            <button
              onClick={() => setIsOpen(false)}
              className="cursor-pointer absolute right-4 top-4 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-150"
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
              <h2 className="text-2xl font-bold text-gray-900">
                Settings
              </h2>
            </div>

            {/* Units switch hidden for now
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Units
              </span>
              <div className="flex items-center gap-3">
                <span
                  className={`text-sm ${units === "imperial" ? "font-medium text-nnrc-purple-dark" : "text-gray-400"}`}
                >
                  Imperial
                </span>
                <button
                  onClick={handleToggle}
                  disabled={isPending}
                  className={`relative h-6 w-11 cursor-pointer rounded-full transition-colors ${
                    units === "metric"
                      ? "bg-nnrc-purple"
                      : "bg-gray-300"
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
                  className={`text-sm ${units === "metric" ? "font-medium text-nnrc-purple-dark" : "text-gray-400"}`}
                >
                  Metric
                </span>
              </div>
            </div>
            */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Home Location (for weather)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="Enter zip code"
                  maxLength={10}
                  className="flex-1 rounded-lg bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-nnrc-purple focus:outline-none transition-all duration-150"
                />
                <button
                  onClick={handleZipCodeSave}
                  disabled={isPending}
                  className="cursor-pointer rounded-lg bg-gradient-to-r from-nnrc-purple to-nnrc-purple-light px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-150"
                >
                  {zipSaved ? "Saved!" : "Save"}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Used to auto-fill temperature based on your local weather
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
