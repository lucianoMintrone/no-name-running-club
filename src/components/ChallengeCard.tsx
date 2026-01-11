"use client";

import { useState } from "react";
import { StampGrid } from "./StampGrid";
import { RunFormModal } from "./RunFormModal";

interface ChallengeCardProps {
  title: string;
  daysCount: number;
  units: string;
}

export function ChallengeCard({ title, daysCount, units }: ChallengeCardProps) {
  const [totalStamps, setTotalStamps] = useState(daysCount);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(1);
  const progress = Math.round((totalStamps / daysCount) * 100);

  const handleAddDay = () => {
    setTotalStamps(totalStamps + 1);
  };

  const handleStampClick = (position: number) => {
    setSelectedPosition(position);
    setIsModalOpen(true);
  };

  const handleRunCreated = () => {
    // For now, just close the modal
    // Later we can refresh the data or update the UI
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900">
      <div className="mb-5 text-center">
        <h2 className="mb-1 text-xl font-bold text-zinc-900 dark:text-zinc-50">
          {title}
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {totalStamps} of {daysCount} runs ({progress}%)
        </p>
      </div>
      <div className="flex justify-center">
        <StampGrid
          totalStamps={totalStamps}
          onAddDay={handleAddDay}
          onStampClick={handleStampClick}
        />
      </div>
      <RunFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        position={selectedPosition}
        units={units}
        onRunCreated={handleRunCreated}
      />
    </div>
  );
}
