interface AllTimeRecordWidgetProps {
  name: string;
  temperature: number;
  image?: string | null;
}

export function AllTimeRecordWidget({ name, temperature, image }: AllTimeRecordWidgetProps) {
  return (
    <div className="rounded-xl bg-gradient-to-br from-nnrc-purple via-nnrc-purple to-nnrc-purple-dark p-5 shadow-purple-lg text-white relative overflow-hidden">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_20%,white_1px,transparent_1px)] bg-[length:20px_20px]" />
      
      <div className="relative">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-white"
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
          </div>
          <h3 className="text-sm font-semibold text-white/90">
            All-Time Club Record
          </h3>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-black tracking-tight">
            {temperature}°
          </span>
          <span className="text-xl font-medium text-white/60">F</span>
        </div>

        <div className="mt-3 flex items-center gap-2 text-sm text-white/80">
          {image && (
            <img
              src={image}
              alt=""
              className="h-6 w-6 rounded-full ring-2 ring-white/30"
            />
          )}
          <span className="font-medium">{name}</span>
        </div>
      </div>
    </div>
  );
}
