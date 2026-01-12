"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  updateUserRole,
  deleteUser,
  enrollUserInChallenge,
} from "@/app/actions/admin";

interface Challenge {
  id: string;
  season: string;
  year: string;
}

interface UserActionsProps {
  userId: string;
  currentRole: string;
  availableChallenges: Challenge[];
}

export function UserActions({
  userId,
  currentRole,
  availableChallenges,
}: UserActionsProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  async function handleRoleChange(newRole: "member" | "admin") {
    setIsUpdating(true);
    try {
      await updateUserRole(userId, newRole);
      router.refresh();
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDelete() {
    setIsUpdating(true);
    try {
      await deleteUser(userId);
      router.push("/admin/users");
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleEnroll(challengeId: string) {
    setIsUpdating(true);
    try {
      await enrollUserInChallenge(userId, challengeId);
      router.refresh();
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="mt-6 border-t border-nnrc-lavender pt-6">
      <h4 className="text-sm font-medium text-nnrc-purple-dark mb-3">Actions</h4>
      <div className="flex flex-wrap gap-3">
        {/* Role Toggle */}
        {currentRole === "member" ? (
          <button
            onClick={() => handleRoleChange("admin")}
            disabled={isUpdating}
            className="rounded-lg border border-purple-300 bg-purple-50 px-4 py-2 text-sm text-purple-700 hover:bg-purple-100 disabled:opacity-50"
          >
            Promote to Admin
          </button>
        ) : (
          <button
            onClick={() => handleRoleChange("member")}
            disabled={isUpdating}
            className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Demote to Member
          </button>
        )}

        {/* Enroll in Challenge */}
        {availableChallenges.length > 0 && (
          <div className="relative">
            <select
              onChange={(e) => {
                if (e.target.value) {
                  handleEnroll(e.target.value);
                  e.target.value = "";
                }
              }}
              disabled={isUpdating}
              className="rounded-lg border border-nnrc-lavender bg-white px-4 py-2 text-sm text-nnrc-purple-dark disabled:opacity-50"
            >
              <option value="">Enroll in challenge...</option>
              {availableChallenges.map((challenge) => (
                <option key={challenge.id} value={challenge.id}>
                  {challenge.season.charAt(0).toUpperCase() +
                    challenge.season.slice(1)}{" "}
                  {challenge.year}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Delete User */}
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700 hover:bg-red-100"
          >
            Delete User
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm text-red-600">Are you sure?</span>
            <button
              onClick={handleDelete}
              disabled={isUpdating}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
