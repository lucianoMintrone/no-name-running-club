export const dashboardHelp = {
  overview:
    "The Admin Dashboard provides a high-level overview of your running club's activity, including total membership, run statistics, and recent activity.",
  keyConcepts: [
    "Active Participants: Users enrolled in the current challenge",
    "Runs: Individual run entries logged by users, each representing one stamp on their challenge card",
    "Current Challenge: The active challenge that new users are automatically enrolled in",
  ],
  fields: {
    totalUsers:
      "The total number of registered accounts in the system. Includes all users regardless of role or activity status.",
    totalRuns:
      "The cumulative count of all runs logged across all challenges and users. Each stamp on a user's challenge card represents one run.",
    challenges:
      "The total number of challenges created, including both active and inactive challenges.",
    activeParticipants:
      "The number of users enrolled in the currently active challenge. A user becomes a participant when they're enrolled in a challenge, either automatically at signup or manually by an admin.",
    currentChallengeRuns:
      "Total runs logged by all participants in the current challenge.",
    recentActivity:
      "The 10 most recently logged runs across all challenges, showing the user, challenge, temperature, and timestamp.",
  },
};
