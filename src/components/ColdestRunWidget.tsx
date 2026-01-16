interface ColdestRunWidgetProps {
  temperature: number;
  date: Date;
  runNumber: number;
}

export function ColdestRunWidget({
  temperature,
  date,
  runNumber,
}: ColdestRunWidgetProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div className="rounded-xl bg-gradient-to-br from-sky-50 to-cyan-50 border border-sky-200/50 p-5 shadow-card hover:shadow-card-hover transition-all duration-200">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-sky-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-gray-900">
          Coldest Run
        </h3>
      </div>
      
      <div className="flex items-baseline gap-1">
        <span className="text-5xl font-black tracking-tight text-nnrc-temp-extreme-cold">
          {temperature}°
        </span>
        <span className="text-xl font-medium text-gray-300">F</span>
      </div>
      
      <div className="mt-3 text-sm text-gray-400">
        Run #{runNumber} • {formattedDate}
      </div>
    </div>
  );
}
