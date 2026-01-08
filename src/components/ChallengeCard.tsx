"use client";

import { useState } from "react";
import { StampGrid } from "./StampGrid";

interface ChallengeCardProps {
  title: string;
  initialTotalStamps?: number;
}

export function ChallengeCard({
  title,
  initialTotalStamps = 30,
}: ChallengeCardProps) {
  const [totalStamps, setTotalStamps] = useState(initialTotalStamps);
  const progress = Math.round((totalStamps / 30) * 100);

  const handleAddDay = () => {
    setTotalStamps(totalStamps + 1);
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900">
      <div className="mb-5 text-center">
        <h2 className="mb-1 text-xl font-bold text-zinc-900 dark:text-zinc-50">
          {title}
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {totalStamps} of 30 runs ({progress}%)
        </p>
      </div>
      <div className="flex justify-center">
        <StampGrid totalStamps={totalStamps} onAddDay={handleAddDay} />
      </div>
    </div>
  );
}
