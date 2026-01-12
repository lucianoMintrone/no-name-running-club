interface StampGridProps {
  totalStamps?: number;
  completedPositions?: number[];
  onAddDay?: () => void;
  onStampClick?: (position: number) => void;
}

export function StampGrid({
  totalStamps = 30,
  completedPositions = [],
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
            className={`flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-2 transition-all duration-200 ${
              isCompleted
                ? "border-nnrc-purple bg-nnrc-lavender-light shadow-purple-sm"
                : "border-nnrc-lavender bg-white text-base font-semibold text-gray-500 hover:border-nnrc-purple hover:text-nnrc-purple hover:shadow-purple-sm"
            }`}
          >
            {isCompleted ? (
              <img
                src="/logos/nnrc-stamp.svg"
                alt="Completed"
                className="h-10 w-10"
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
          className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-nnrc-lavender text-xl font-light text-gray-400 transition-all duration-200 hover:border-nnrc-purple hover:text-nnrc-purple"
          aria-label="Add day"
        >
          +
        </button>
      )}
    </div>
  );
}
