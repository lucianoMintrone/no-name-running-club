export const analyticsHelp = {
  overview:
    "Gain insights into user engagement and challenge participation. Use these metrics to understand how members are using the app and identify trends.",
  keyConcepts: [
    "Active Users: Users who logged at least one run in the specified time period.",
    "Completion Rate: Percentage of participants who logged all required runs.",
    "Engagement: Measured by run frequency and user activity patterns.",
  ],
  overviewStats: {
    totalUsers: "Total registered users in the system.",
    totalRuns: "Total runs logged across all time and all challenges.",
    challenges: "Total number of challenges created.",
    avgRunsPerUser:
      "Average number of runs per registered user (Total Runs ÷ Total Users). Indicates overall engagement.",
    newUsersMonth: "Users who created accounts in the last 30 days.",
    runsMonth: "Runs logged in the last 30 days.",
  },
  engagement: {
    activeUsers7Days:
      "Users who logged at least one run in the past 7 days. Indicates current engagement.",
    activeUsers30Days:
      "Users who logged at least one run in the past 30 days. A broader engagement metric.",
    newUsers7Days: "Users who signed up in the past 7 days.",
    newUsers30Days: "Users who signed up in the past 30 days.",
    runs7Days: "Total runs logged in the past 7 days.",
    runs30Days: "Total runs logged in the past 30 days.",
  },
  currentChallenge: {
    participants: "Number of users enrolled in the current challenge.",
    totalRuns: "Number of runs logged in the current challenge.",
    completionRate:
      "Percentage of participants who have logged all required runs (e.g., 30 out of 30).",
    coldestRun:
      "The lowest temperature logged by any participant in this challenge.",
    avgTemperature:
      "The average temperature across all runs in this challenge.",
  },
  charts: {
    runsPerDay:
      "A bar chart showing daily run activity over the last 30 days. Helps identify patterns (e.g., more runs on weekends) and engagement trends.",
    temperatureDistribution:
      "A histogram showing how run temperatures are distributed across ranges. Helps understand the typical conditions runners are experiencing.",
  },
};
