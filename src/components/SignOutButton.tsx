"use client";

import { signOutUser } from "@/app/actions/auth";
import posthog from "posthog-js";

export function SignOutButton() {
  const handleSignOut = async () => {
    // Capture sign out event before resetting
    posthog.capture("user_signed_out");
    // Reset PostHog to unlink future events from this user
    posthog.reset();
    // Perform the sign out
    await signOutUser();
  };

  return (
    <form action={handleSignOut}>
      <button
        type="submit"
        className="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-150"
      >
        Sign out
      </button>
    </form>
  );
}
