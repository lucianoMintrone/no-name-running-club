interface AllTimeRecordWidgetProps {
  name: string;
  temperature: number;
}

export function AllTimeRecordWidget({ name, temperature }: AllTimeRecordWidgetProps) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-6 shadow-sm text-white">
      <div className="mb-3 flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-blue-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
        <h3 className="text-sm font-medium text-blue-200">
          All-Time Club Record
        </h3>
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-bold">
          {temperature}°
        </span>
        <span className="text-lg text-blue-200">F</span>
      </div>

      <div className="mt-2 text-sm text-blue-200">
        {name}
      </div>
    </div>
  );
}
