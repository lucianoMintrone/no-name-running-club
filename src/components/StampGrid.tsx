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
    <div className="grid grid-cols-5 gap-3">
      {stamps.map((number) => {
        const isCompleted = completedPositions.includes(number);
        return (
          <button
            key={number}
            onClick={() => onStampClick?.(number)}
            className={`flex h-14 w-14 cursor-pointer items-center justify-center rounded-full transition-all duration-150 ${
              isCompleted
                ? "bg-nnrc-purple/10 shadow-sm ring-2 ring-nnrc-purple/30"
                : "bg-white shadow-sm text-base font-semibold text-gray-400 hover:shadow-md hover:text-nnrc-purple hover:-translate-y-0.5 active:scale-95"
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
          className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-gray-200 text-xl font-light text-gray-300 transition-all duration-150 hover:border-nnrc-purple hover:text-nnrc-purple hover:bg-nnrc-purple/5"
          aria-label="Add day"
        >
          +
        </button>
      )}
    </div>
  );
}
