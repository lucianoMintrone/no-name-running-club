"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StampGrid } from "./StampGrid";
import { RunFormModal } from "./RunFormModal";

interface ChallengeCardProps {
  title: string;
  daysCount: number;
  units: string;
  completedPositions: number[];
  userAvatar?: string;
}

export function ChallengeCard({
  title,
  daysCount,
  units,
  completedPositions,
  userAvatar,
}: ChallengeCardProps) {
  const [totalStamps, setTotalStamps] = useState(daysCount);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(1);
  const router = useRouter();
  const completedCount = completedPositions.length;
  const progress = Math.round((completedCount / daysCount) * 100);

  const handleAddDay = () => {
    setTotalStamps(totalStamps + 1);
  };

  const handleStampClick = (position: number) => {
    setSelectedPosition(position);
    setIsModalOpen(true);
  };

  const handleRunCreated = () => {
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900">
      <div className="mb-5 text-center">
        <h2 className="mb-1 text-xl font-bold text-zinc-900 dark:text-zinc-50">
          {title}
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {completedCount} of {daysCount} runs ({progress}%)
        </p>
      </div>
      <div className="flex justify-center">
        <StampGrid
          totalStamps={totalStamps}
          completedPositions={completedPositions}
          userAvatar={userAvatar}
          onAddDay={handleAddDay}
          onStampClick={handleStampClick}
        />
      </div>
      <RunFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        position={selectedPosition}
        onRunCreated={handleRunCreated}
      />
    </div>
  );
}
