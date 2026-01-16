"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createChallenge } from "@/app/actions/admin";
import { FieldLabel, InfoTooltip } from "@/components/help";
import { challengesHelp } from "@/components/admin/help-content";
import posthog from "posthog-js";

export default function NewChallengePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError(null);

    try {
      await createChallenge(formData);
      // Track admin challenge created event
      posthog.capture("admin_challenge_created", {
        season: formData.get("season"),
        year: formData.get("year"),
        days_count: formData.get("daysCount"),
        is_current: formData.get("current") === "on",
        enroll_all: formData.get("enrollAll") === "on",
      });
      router.push("/admin/challenges");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create challenge";
      setError(errorMessage);
      setIsSubmitting(false);
      // Track error for error tracking
      posthog.captureException(err instanceof Error ? err : new Error(errorMessage));
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/challenges"
          className="text-nnrc-purple hover:text-nnrc-purple-dark"
        >
          ← Back
        </Link>
        <h1 className="text-2xl font-bold text-nnrc-purple-dark">
          Create New Challenge
        </h1>
      </div>

      <form
        action={handleSubmit}
        className="rounded-xl bg-white border border-nnrc-lavender p-6 shadow-md space-y-4"
      >
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        <div>
          <FieldLabel htmlFor="season" helpText={challengesHelp.formFields.season} required>
            Season
          </FieldLabel>
          <select
            id="season"
            name="season"
            required
            className="w-full rounded-lg border border-nnrc-lavender px-4 py-2 focus:border-nnrc-purple focus:outline-none focus:ring-1 focus:ring-nnrc-purple"
          >
            <option value="winter">Winter</option>
            <option value="summer">Summer</option>
          </select>
        </div>

        <div>
          <FieldLabel htmlFor="year" helpText={challengesHelp.formFields.year} required>
            Year
          </FieldLabel>
          <input
            type="text"
            id="year"
            name="year"
            required
            placeholder="e.g., 2025/2026"
            className="w-full rounded-lg border border-nnrc-lavender px-4 py-2 focus:border-nnrc-purple focus:outline-none focus:ring-1 focus:ring-nnrc-purple"
          />
          <p className="mt-1 text-xs text-gray-500">
            For winter challenges spanning two years, use format like &quot;2025/2026&quot;
          </p>
        </div>

        <div>
          <FieldLabel htmlFor="daysCount" helpText={challengesHelp.formFields.daysCount} required>
            Number of Days
          </FieldLabel>
          <input
            type="number"
            id="daysCount"
            name="daysCount"
            required
            min="1"
            max="365"
            defaultValue="30"
            className="w-full rounded-lg border border-nnrc-lavender px-4 py-2 focus:border-nnrc-purple focus:outline-none focus:ring-1 focus:ring-nnrc-purple"
          />
        </div>

        <div>
          <FieldLabel htmlFor="stravaUrl" helpText={challengesHelp.formFields.stravaUrl}>
            Strava Challenge URL
          </FieldLabel>
          <input
            type="url"
            id="stravaUrl"
            name="stravaUrl"
            placeholder="e.g., https://www.strava.com/clubs/..."
            className="w-full rounded-lg border border-nnrc-lavender px-4 py-2 focus:border-nnrc-purple focus:outline-none focus:ring-1 focus:ring-nnrc-purple"
          />
          <p className="mt-1 text-xs text-gray-500">
            Optional: Link to a Strava club or challenge for this event
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="current"
            name="current"
            className="h-4 w-4 rounded border-nnrc-lavender text-nnrc-purple focus:ring-nnrc-purple"
          />
          <label
            htmlFor="current"
            className="text-sm font-medium text-nnrc-purple-dark inline-flex items-center"
          >
            Set as current (active) challenge
            <InfoTooltip content={challengesHelp.formFields.current} />
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="enrollAll"
            name="enrollAll"
            className="h-4 w-4 rounded border-nnrc-lavender text-nnrc-purple focus:ring-nnrc-purple"
          />
          <label
            htmlFor="enrollAll"
            className="text-sm font-medium text-nnrc-purple-dark inline-flex items-center"
          >
            Automatically enroll all existing users
            <InfoTooltip content={challengesHelp.formFields.enrollAll} />
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-nnrc-purple px-6 py-2 text-white hover:bg-nnrc-purple-dark disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create Challenge"}
          </button>
          <Link
            href="/admin/challenges"
            className="rounded-lg border border-nnrc-lavender px-6 py-2 text-nnrc-purple-dark hover:bg-nnrc-lavender-light"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
