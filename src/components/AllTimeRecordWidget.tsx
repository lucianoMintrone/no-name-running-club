interface AllTimeRecordWidgetProps {
  name: string;
  temperature: number;
  image?: string | null;
}

export function AllTimeRecordWidget({ name, temperature, image }: AllTimeRecordWidgetProps) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-nnrc-purple to-nnrc-purple-dark p-6 shadow-lg text-white">
      <div className="mb-3 flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-nnrc-lavender-light"
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
        <h3 className="text-sm font-medium text-nnrc-lavender-light">
          All-Time Club Record
        </h3>
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-bold">
          {temperature}°
        </span>
        <span className="text-lg text-nnrc-lavender-light">F</span>
      </div>

      <div className="mt-2 flex items-center gap-2 text-sm text-nnrc-lavender-light">
        {image && (
          <img
            src={image}
            alt=""
            className="h-6 w-6 rounded-full border border-nnrc-lavender-light"
          />
        )}
        <span>{name}</span>
      </div>
    </div>
  );
}
