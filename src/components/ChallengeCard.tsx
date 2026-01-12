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
}

export function ChallengeCard({
  title,
  daysCount,
  units,
  completedPositions,
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
    <div className="mx-auto max-w-md rounded-2xl bg-white border-2 border-nnrc-lavender p-6 shadow-lg">
      <div className="mb-4 text-center">
        <h2 className="mb-1 text-xl font-bold text-nnrc-purple-dark">
          {title}
        </h2>
        <p className="text-sm text-gray-600">
          {completedCount} of {daysCount} runs ({progress}%)
        </p>
      </div>
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-5">
        <div 
          className="bg-gradient-to-r from-nnrc-purple to-nnrc-lavender h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-center">
        <StampGrid
          totalStamps={totalStamps}
          completedPositions={completedPositions}
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
