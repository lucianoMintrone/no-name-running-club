interface StampGridProps {
  totalStamps?: number;
  completedPositions?: number[];
  userAvatar?: string;
  onAddDay?: () => void;
  onStampClick?: (position: number) => void;
}

export function StampGrid({
  totalStamps = 30,
  completedPositions = [],
  userAvatar,
  onAddDay,
  onStampClick,
}: StampGridProps) {
  const stamps = Array.from({ length: totalStamps }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-5 gap-4">
      {stamps.map((number) => {
        const isCompleted = completedPositions.includes(number);
        return (
          <button
            key={number}
            onClick={() => onStampClick?.(number)}
            className={`flex h-14 w-14 items-center justify-center rounded-full border-2 transition-colors ${
              isCompleted
                ? "border-emerald-500 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-950"
                : "border-zinc-300 bg-white text-base font-semibold text-zinc-400 hover:border-emerald-500 hover:text-emerald-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-500 dark:hover:border-emerald-500 dark:hover:text-emerald-500"
            }`}
          >
            {isCompleted && userAvatar ? (
              <img
                src={userAvatar}
                alt=""
                className="h-12 w-12 rounded-full"
              />
            ) : (
              number
            )}
          </button>
        );
      })}
      {onAddDay && (
        <button
          onClick={onAddDay}
          className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-zinc-300 text-xl font-light text-zinc-400 transition-colors hover:border-emerald-500 hover:text-emerald-500 dark:border-zinc-600 dark:text-zinc-500 dark:hover:border-emerald-500 dark:hover:text-emerald-500"
          aria-label="Add day"
        >
          +
        </button>
      )}
    </div>
  );
}
