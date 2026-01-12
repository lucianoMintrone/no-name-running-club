"use client";

import { useState, useTransition, useEffect } from "react";
import { saveRun } from "@/app/actions/run";
import { getCurrentTemperature } from "@/app/actions/weather";

interface RunFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  position: number;
  onRunCreated: () => void;
}

export function RunFormModal({
  isOpen,
  onClose,
  position,
  onRunCreated,
}: RunFormModalProps) {
  const [temperature, setTemperature] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetchedWeather, setHasFetchedWeather] = useState(false);

  // Fetch current temperature when modal opens
  useEffect(() => {
    if (isOpen && !hasFetchedWeather) {
      setIsLoadingWeather(true);
      setHasFetchedWeather(true);
      getCurrentTemperature()
        .then((temp) => {
          if (temp !== null) {
            setTemperature(String(temp));
          }
        })
        .catch(() => {
          // Silently fail - user can enter manually
        })
        .finally(() => {
          setIsLoadingWeather(false);
        });
    }
    
    // Reset state when modal closes
    if (!isOpen) {
      setTemperature("");
      setHasFetchedWeather(false);
      setError(null);
    }
  }, [isOpen, hasFetchedWeather]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const temp = parseInt(temperature);
    if (isNaN(temp)) {
      setError("Please enter a valid temperature");
      return;
    }

    startTransition(async () => {
      try {
        await saveRun({
          temperature: temp,
          position,
        });
        onRunCreated();
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save run");
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900">
        <button
          onClick={onClose}
          className="cursor-pointer absolute right-4 top-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
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

        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            Run #{position}
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            What was the temperature?
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-center gap-2">
            {isLoadingWeather ? (
              <div className="w-24 h-14 rounded-lg border border-zinc-300 bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-800 flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : (
              <input
                type="number"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                placeholder="32"
                autoFocus
                className="w-24 rounded-lg border border-zinc-300 bg-white px-4 py-3 text-center text-2xl font-semibold text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
              />
            )}
            <span className="text-xl font-medium text-zinc-500 dark:text-zinc-400">
              °F
            </span>
          </div>

          {error && (
            <p className="text-center text-sm text-red-500 dark:text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending || !temperature}
            className="w-full cursor-pointer rounded-lg bg-emerald-500 px-4 py-3 font-medium text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Log Run"}
          </button>
        </form>
      </div>
    </div>
  );
}
