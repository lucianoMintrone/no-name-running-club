import { Avatar } from "@/components/Avatar";

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
    <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/50 p-5 shadow-card hover:shadow-card-hover transition-all duration-200">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-amber-600"
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
        </div>
        <h3 className="text-sm font-semibold text-gray-900">
          Challenge Leaders
        </h3>
      </div>

      <div className="space-y-2">
        {entries.slice(0, 5).map((entry, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-2 rounded-lg transition-colors duration-150 ${
              index === 0 ? "bg-nnrc-purple/5" : "hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className={`text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full ${
                index === 0 
                  ? "bg-nnrc-purple text-white" 
                  : index === 1 
                    ? "bg-gray-200 text-gray-600"
                    : index === 2
                      ? "bg-amber-100 text-amber-700"
                      : "text-gray-400"
              }`}>
                {index + 1}
              </span>
              {entry.image && (
                <Avatar
                  src={entry.image}
                  alt=""
                  size={24}
                  className="h-6 w-6 ring-2 ring-white shadow-sm"
                  fallbackText={entry.firstName || "?"}
                />
              )}
              <span className={`text-sm ${index === 0 ? "font-semibold text-gray-900" : "text-gray-600"}`}>
                {entry.firstName}
              </span>
            </div>
            <span className={`text-sm tabular-nums ${index === 0 ? "font-bold text-nnrc-purple" : "font-medium text-gray-500"}`}>
              {entry.temperature}°F
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
