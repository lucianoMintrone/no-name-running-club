"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteRun } from "@/app/actions/admin";

interface RunActionsProps {
  runId: string;
}

export function RunActions({ runId }: RunActionsProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteRun(runId);
      router.refresh();
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  }

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-xs text-red-600 hover:text-red-800 disabled:opacity-50"
        >
          {isDeleting ? "Deleting..." : "Confirm"}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="text-sm text-red-600 hover:text-red-800"
    >
      Delete
    </button>
  );
}
