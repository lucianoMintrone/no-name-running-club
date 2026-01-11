"use client";

import { useState, useTransition } from "react";
import { createRun } from "@/app/actions/run";

interface RunFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  position: number;
  units: string;
  isEditing?: boolean;
  onRunCreated: () => void;
}

export function RunFormModal({
  isOpen,
  onClose,
  position,
  units,
  isEditing = false,
  onRunCreated,
}: RunFormModalProps) {
  // Use local date to avoid timezone issues
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const [date, setDate] = useState(today);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(30);
  const [distance, setDistance] = useState("");
  const [runUnits, setRunUnits] = useState(units);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const distanceUnit = runUnits === "metric" ? "kms" : "miles";
  const paceUnit = runUnits === "metric" ? "min/km" : "min/mile";
  const totalMinutes = hours * 60 + minutes;

  // Calculate pace
  const distanceValue = parseFloat(distance) || 0;
  const pace =
    distanceValue > 0 ? totalMinutes / distanceValue : 0;
  const paceMinutes = Math.floor(pace);
  const paceSeconds = Math.round((pace - paceMinutes) * 60);
  const paceFormatted =
    distanceValue > 0
      ? `${paceMinutes}'${paceSeconds.toString().padStart(2, "0")}"`
      : "--";

  const handleUnitsToggle = () => {
    setRunUnits(runUnits === "imperial" ? "metric" : "imperial");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (totalMinutes < 30) {
      setError("Duration must be at least 30 minutes");
      return;
    }

    if (distanceValue <= 0) {
      setError("Distance must be greater than 0");
      return;
    }

    startTransition(async () => {
      try {
        await createRun({
          date,
          durationInMinutes: totalMinutes,
          distance: distanceValue,
          units: runUnits as "imperial" | "metric",
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
      <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-8 shadow-xl dark:bg-zinc-900">
        <button
          onClick={onClose}
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

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {isEditing ? "Edit" : "Add"} Run #{position}
          </h2>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs ${runUnits === "imperial" ? "font-medium text-zinc-900 dark:text-zinc-50" : "text-zinc-400"}`}
            >
              mi
            </span>
            <button
              type="button"
              onClick={handleUnitsToggle}
              className={`relative h-5 w-9 rounded-full transition-colors ${
                runUnits === "metric"
                  ? "bg-emerald-500"
                  : "bg-zinc-300 dark:bg-zinc-600"
              }`}
              role="switch"
              aria-checked={runUnits === "metric"}
            >
              <span
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                  runUnits === "metric"
                    ? "translate-x-4 left-0.5"
                    : "translate-x-0 left-0.5"
                }`}
              />
            </button>
            <span
              className={`text-xs ${runUnits === "metric" ? "font-medium text-zinc-900 dark:text-zinc-50" : "text-zinc-400"}`}
            >
              km
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={today}
              required
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 dark:[color-scheme:dark]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Duration (minimum 30 minutes)
            </label>
            <div className="flex gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={hours}
                    onChange={(e) =>
                      setHours(Math.max(0, parseInt(e.target.value) || 0))
                    }
                    min={0}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
                  />
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    hrs
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={minutes}
                    onChange={(e) =>
                      setMinutes(
                        Math.max(0, Math.min(59, parseInt(e.target.value) || 0))
                      )
                    }
                    min={0}
                    max={59}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
                  />
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    min
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Distance
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                step="0.01"
                min="0.01"
                required
                placeholder="0.00"
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
              />
              <span className="w-10 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                {distanceUnit}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 rounded-lg bg-zinc-100 py-3 dark:bg-zinc-800">
            <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {paceFormatted}
            </span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {paceUnit}
            </span>
          </div>

          {error && (
            <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-emerald-500 px-4 py-2.5 font-medium text-white hover:bg-emerald-600 disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save Run"}
          </button>
        </form>
      </div>
    </div>
  );
}
