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
    <div className="rounded-2xl bg-gradient-to-br from-nnrc-lavender-light to-white border border-nnrc-lavender p-6 shadow-md">
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
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
        <h3 className="text-sm font-medium text-nnrc-purple-dark">
          Coldest Run
        </h3>
      </div>
      
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-bold text-nnrc-temp-cold">
          {temperature}°
        </span>
        <span className="text-lg text-gray-400">F</span>
      </div>
      
      <div className="mt-2 text-sm text-gray-500">
        Run #{runNumber} • {formattedDate}
      </div>
    </div>
  );
}
