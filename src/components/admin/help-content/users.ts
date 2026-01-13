export const usersHelp = {
  overview:
    "View and manage all registered users. You can change roles, enroll users in challenges, and view their activity history.",
  keyConcepts: [
    "Admin: Can access the admin dashboard and manage all data.",
    "Member: Regular user who can only manage their own runs and settings.",
    "Enrollment: Users must be enrolled in a challenge to log runs for it.",
  ],
  fields: {
    user:
      "The user's display name and email address. Profile photo shown if available (from Google account).",
    role:
      "Admin: Can access the admin dashboard and manage all data. Member: Regular user who can only manage their own runs and settings.",
    challenges:
      "The number of challenges this user is enrolled in, including past and current challenges.",
    totalRuns:
      "The total number of runs this user has logged across all challenges they're enrolled in.",
    joined:
      "The date the user first signed up (created their account via Google sign-in).",
    units:
      "The user's preferred temperature unit: Imperial (°F) or Metric (°C). Used for display and when logging runs.",
    zipCode:
      "The user's zip code, used for weather lookups when logging runs. Optional.",
  },
  actions: {
    promoteToAdmin:
      "Grants admin privileges to this user. They will be able to access /admin and all admin features. Changes take effect after they sign out and back in.",
    demoteToMember:
      "Removes admin privileges. The user will no longer be able to access admin pages.",
    enrollInChallenge:
      "Adds this user as a participant in a challenge they're not currently enrolled in.",
    deleteUser:
      "Permanently removes the user and all their data, including runs and challenge enrollments. This action cannot be undone.",
  },
};
