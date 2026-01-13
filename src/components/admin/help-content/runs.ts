export const runsHelp = {
  overview:
    "Review and moderate all logged runs. Identify suspicious entries (highlighted in red) and remove invalid data if necessary.",
  keyConcepts: [
    "Run #: The position/day number within the challenge (1-30 for a 30-day challenge).",
    "Suspicious Runs: Runs with temperatures below -20°F are highlighted for review.",
    "Temperature: The key metric used for leaderboard rankings.",
  ],
  fields: {
    user: "The user who logged this run.",
    challenge: "The challenge this run was logged for.",
    runNumber:
      'The position/day number within the challenge (1-30 for a 30-day challenge). Also called "position" in the database.',
    temperature:
      "The temperature recorded when the user went running, in Fahrenheit. This is the key metric for leaderboards.",
    date:
      "When the run was logged (the date the user recorded it, not necessarily when they ran).",
  },
  indicators: {
    redHighlight:
      "Runs with temperatures below -20°F are highlighted as potentially suspicious and may warrant review. This helps identify data entry errors.",
  },
  actions: {
    delete:
      "Permanently removes this run entry. The user's stamp for this position will be removed. This action cannot be undone.",
  },
};
