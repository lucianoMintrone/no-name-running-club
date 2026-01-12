interface LeaderboardEntry {
  firstName: string;
  temperature: number;
  image?: string | null;
}

interface LeaderboardWidgetProps {
  entries: LeaderboardEntry[];
}

export function LeaderboardWidget({ entries }: LeaderboardWidgetProps) {
  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl bg-white border border-nnrc-lavender p-6 shadow-md">
      <div className="mb-3 flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-nnrc-purple"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
          />
        </svg>
        <h3 className="text-sm font-medium text-nnrc-purple-dark">
          Challenge Leaders
        </h3>
      </div>

      <div className="space-y-3">
        {entries.slice(0, 5).map((entry, index) => (
          <div
            key={index}
            className={`flex items-center justify-between ${
              index === 0 ? "text-nnrc-purple-dark" : "text-gray-600"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium w-5 ${index === 0 ? "text-nnrc-purple" : "text-gray-400"}`}>
                {index + 1}.
              </span>
              {entry.image && (
                <img
                  src={entry.image}
                  alt=""
                  className="h-6 w-6 rounded-full"
                />
              )}
              <span className={`text-sm ${index === 0 ? "font-semibold" : ""}`}>
                {entry.firstName}
              </span>
            </div>
            <span className={`text-sm font-medium ${index === 0 ? "font-bold" : ""}`}>
              {entry.temperature}°F
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
