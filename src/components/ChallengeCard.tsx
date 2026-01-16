"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StampGrid } from "./StampGrid";
import { RunFormModal } from "./RunFormModal";

interface ChallengeCardProps {
  title: string;
  daysCount: number;
  completedPositions: number[];
}

export function ChallengeCard({
  title,
  daysCount,
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
    <div className="mx-auto max-w-md rounded-xl bg-white p-6 shadow-card hover:shadow-card-hover transition-all duration-200">
      <div className="mb-4 text-center">
        <h2 className="mb-1 text-xl font-bold text-gray-900">
          {title}
        </h2>
        <p className="text-sm text-gray-500">
          {completedCount} of {daysCount} runs ({progress}%)
        </p>
      </div>
      {/* Progress Bar */}
      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden mb-5">
        <div 
          className="bg-gradient-to-r from-nnrc-purple to-nnrc-purple-light h-full rounded-full transition-all duration-500 ease-out"
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
