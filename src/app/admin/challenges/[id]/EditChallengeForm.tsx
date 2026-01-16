"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateChallenge, deleteChallenge } from "@/app/actions/admin";
import { FieldLabel, InfoTooltip } from "@/components/help";
import { challengesHelp } from "@/components/admin/help-content";

interface EditChallengeFormProps {
  challenge: {
    id: string;
    season: string;
    year: string;
    daysCount: number;
    current: boolean;
    stravaUrl: string | null;
  };
}

export function EditChallengeForm({ challenge }: EditChallengeFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError(null);

    try {
      await updateChallenge(challenge.id, formData);
      router.push("/admin/challenges");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update challenge");
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    setError(null);

    try {
      await deleteChallenge(challenge.id);
      router.push("/admin/challenges");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete challenge");
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  }

  return (
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
          defaultValue={challenge.season}
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
          defaultValue={challenge.year}
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
          defaultValue={challenge.daysCount}
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
          defaultValue={challenge.stravaUrl || ""}
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
          defaultChecked={challenge.current}
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

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-nnrc-purple px-6 py-2 text-white hover:bg-nnrc-purple-dark disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
        <a
          href="/admin/challenges"
          className="rounded-lg border border-nnrc-lavender px-6 py-2 text-nnrc-purple-dark hover:bg-nnrc-lavender-light"
        >
          Cancel
        </a>
        <div className="flex-1" />
        {!showDeleteConfirm ? (
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="rounded-lg border border-red-200 px-4 py-2 text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm text-red-600">Are you sure?</span>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Yes, Delete"}
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </form>
  );
}
