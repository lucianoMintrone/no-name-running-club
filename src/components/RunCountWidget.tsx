import { Avatar } from "@/components/Avatar";

interface ParticipantRunCount {
  firstName: string;
  runCount: number;
  image?: string | null;
}

interface RunCountWidgetProps {
  entries: ParticipantRunCount[];
}

export function RunCountWidget({ entries }: RunCountWidgetProps) {
  if (entries.length === 0) {
    return null;
  }

  const totalRuns = entries.reduce((sum, entry) => sum + entry.runCount, 0);

  return (
    <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 p-5 shadow-card hover:shadow-card-hover transition-all duration-200">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            Club Activity
          </h3>
          <p className="text-xs text-gray-500">{totalRuns} total runs</p>
        </div>
      </div>

      <div className="space-y-2">
        {entries.slice(0, 5).map((entry, index) => (
          <div
            key={index}
            className={`flex items-center justify-between gap-2 p-2 rounded-lg transition-colors duration-150 ${
              index === 0 ? "bg-blue-500/5" : "hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className={`text-xs font-bold w-5 h-5 flex-shrink-0 flex items-center justify-center rounded-full ${
                index === 0 
                  ? "bg-blue-500 text-white" 
                  : index === 1 
                    ? "bg-gray-200 text-gray-600"
                    : index === 2
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-400"
              }`}>
                {index + 1}
              </span>
              {entry.image && (
                <Avatar
                  src={entry.image}
                  alt=""
                  size={24}
                  className="h-6 w-6 flex-shrink-0 ring-2 ring-white shadow-sm"
                  fallbackText={entry.firstName || "?"}
                />
              )}
              <span className={`text-sm truncate ${index === 0 ? "font-semibold text-gray-900" : "text-gray-600"}`}>
                {entry.firstName}
              </span>
            </div>
            <span className={`text-sm tabular-nums whitespace-nowrap flex-shrink-0 ${index === 0 ? "font-bold text-blue-600" : "font-medium text-gray-500"}`}>
              {entry.runCount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
