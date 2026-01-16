export const challengesHelp = {
  overview:
    "Manage running challenges here. Create new seasonal challenges, set the active challenge, and view participation statistics.",
  keyConcepts: [
    "Active Challenge: Only one challenge can be active at a time. New users are automatically enrolled.",
    "Days Count: The number of runs required to complete the challenge (stamps on the card).",
    "Participants: Users enrolled in a challenge can log runs toward completing it.",
  ],
  fields: {
    challenge:
      'The challenge name, formatted as "[Season] [Year] Challenge" (e.g., "Winter 2025/2026 Challenge").',
    status:
      "Active: This is the current challenge; new users are auto-enrolled. Inactive: Past or future challenge; not displayed to users on homepage.",
    days:
      "The number of runs required to complete the challenge. Users see this as the number of stamps on their challenge card.",
    participants:
      "Number of users enrolled in this challenge. Users can be enrolled in multiple challenges simultaneously.",
    runs: "Total runs logged by all participants in this challenge.",
  },
  formFields: {
    season:
      "The seasonal theme for the challenge. Winter challenges emphasize cold-weather running; Summer challenges emphasize hot-weather running.",
    year:
      'The year(s) for the challenge. For winter challenges spanning two years, use format "2025/2026". For summer challenges, use a single year "2026".',
    daysCount:
      "How many runs are required to complete the challenge (default: 30). This determines the number of stamps on each participant's card.",
    stravaUrl:
      "Optional URL to a Strava club or challenge. When provided, a Strava widget will appear on the homepage allowing users to join the associated Strava challenge.",
    current:
      "When checked, this challenge becomes the active challenge. The previous active challenge will be automatically deactivated. Only one challenge can be active at a time.",
    enrollAll:
      "When checked, all existing users will be automatically enrolled in this new challenge. Useful when starting a new season to ensure everyone can participate.",
  },
};
