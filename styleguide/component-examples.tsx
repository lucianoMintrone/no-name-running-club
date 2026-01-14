/**
 * NNRC Component Examples
 * Copy and adapt these components for your application
 */

import React from 'react';
import Image from 'next/image';
import { 
  TrophyIcon, 
  FireIcon, 
  CheckCircleIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

/* ========================================
   BUTTONS
   ======================================== */

export function PrimaryButton({ 
  children, 
  onClick, 
  disabled = false 
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="
        px-6 py-3 
        bg-nnrc-purple 
        text-white 
        rounded-lg 
        font-semibold
        hover:bg-nnrc-purple-dark 
        active:scale-95
        disabled:opacity-50
        disabled:cursor-not-allowed
        transition-all 
        duration-200
        shadow-md
        hover:shadow-lg
      "
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ 
  children, 
  onClick 
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
}) {
  return (
    <button
      onClick={onClick}
      className="
        px-6 py-3 
        bg-nnrc-lavender 
        text-nnrc-purple-dark 
        rounded-lg 
        font-semibold
        hover:bg-nnrc-lavender-dark 
        active:scale-95
        transition-all 
        duration-200
      "
    >
      {children}
    </button>
  );
}

export function GhostButton({ 
  children, 
  onClick 
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
}) {
  return (
    <button
      onClick={onClick}
      className="
        px-6 py-3 
        bg-transparent 
        text-nnrc-purple 
        rounded-lg 
        font-semibold
        border-2 
        border-nnrc-purple
        hover:bg-nnrc-purple 
        hover:text-white
        active:scale-95
        transition-all 
        duration-200
      "
    >
      {children}
    </button>
  );
}

/* ========================================
   CARDS
   ======================================== */

export function ChallengeCard({ 
  title, 
  progress, 
  total, 
  children 
}: { 
  title: string; 
  progress: number; 
  total: number; 
  children: React.ReactNode;
}) {
  const percentage = Math.round((progress / total) * 100);
  
  return (
    <div className="
      bg-white 
      rounded-xl 
      border-2 
      border-nnrc-lavender
      shadow-lg 
      p-6
      hover:shadow-xl
      transition-shadow 
      duration-300
    ">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-nnrc-purple-dark mb-2">
          {title}
        </h3>
        <p className="text-gray-600">
          {progress} of {total} runs ({percentage}%)
        </p>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-6">
        <div 
          className="
            bg-gradient-to-r 
            from-nnrc-purple 
            to-nnrc-lavender
            h-full 
            rounded-full
            transition-all 
            duration-500
            ease-out
          "
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* Content */}
      {children}
    </div>
  );
}

export function WidgetCard({ 
  icon: Icon, 
  title, 
  children 
}: { 
  icon?: React.ElementType;
  title: string; 
  children: React.ReactNode;
}) {
  return (
    <div className="
      bg-gradient-to-br 
      from-nnrc-lavender-light 
      to-white
      rounded-xl 
      border 
      border-nnrc-lavender
      p-5
      shadow-md
      hover:shadow-lg
      transition-shadow
      duration-300
    ">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        {Icon && <Icon className="w-5 h-5 text-nnrc-purple" />}
        <h4 className="text-lg font-semibold text-nnrc-purple-dark">
          {title}
        </h4>
      </div>
      
      {/* Content */}
      {children}
    </div>
  );
}

/* ========================================
   STAMPS
   ======================================== */

export function Stamp({ 
  position, 
  completed, 
  userAvatar, 
  onClick 
}: { 
  position: number;
  completed: boolean;
  userAvatar?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="
        aspect-square 
        rounded-full 
        border-2 
        border-nnrc-lavender
        bg-white
        hover:border-nnrc-purple
        hover:scale-105
        active:scale-95
        transition-all 
        duration-200
        flex 
        items-center 
        justify-center
        relative
        group
        overflow-hidden
      "
    >
      {completed && userAvatar ? (
        <Image
          src={userAvatar}
          alt=""
          fill
          className="object-cover"
        />
      ) : (
        <span className="
          text-nnrc-purple-dark 
          font-bold 
          group-hover:text-nnrc-purple
          text-sm sm:text-base
        ">
          {position}
        </span>
      )}
    </button>
  );
}

export function StampGrid({ 
  totalStamps, 
  completedStamps, 
  userAvatar, 
  onStampClick 
}: { 
  totalStamps: number;
  completedStamps: Set<number>;
  userAvatar?: string;
  onStampClick: (position: number) => void;
}) {
  return (
    <div className="grid grid-cols-6 gap-3">
      {Array.from({ length: totalStamps }).map((_, i) => {
        const isCompleted = completedStamps.has(i + 1);
        return (
          <Stamp
            key={i}
            position={i + 1}
            completed={isCompleted}
            userAvatar={isCompleted ? userAvatar : undefined}
            onClick={() => onStampClick(i + 1)}
          />
        );
      })}
    </div>
  );
}

/* ========================================
   LEADERBOARD
   ======================================== */

interface LeaderboardEntry {
  userId: string;
  userName: string;
  userImage: string;
  temperature: number;
  date: Date;
}

export function LeaderboardItem({ 
  rank, 
  entry 
}: { 
  rank: number; 
  entry: LeaderboardEntry;
}) {
  return (
    <div className="
      flex 
      items-center 
      gap-4 
      p-4 
      rounded-xl
      bg-gradient-to-r 
      from-white 
      to-nnrc-lavender-light
      border 
      border-nnrc-lavender
      hover:shadow-md
      transition-shadow
    ">
      {/* Rank Badge */}
      <div className="
        flex-shrink-0 
        w-8 
        h-8 
        rounded-full 
        bg-nnrc-purple
        text-white 
        font-bold 
        flex 
        items-center 
        justify-center
        text-sm
      ">
        {rank}
      </div>
      
      {/* Avatar */}
      <div className="relative w-10 h-10 flex-shrink-0">
        <Image
          src={entry.userImage}
          alt={entry.userName}
          fill
          className="rounded-full border-2 border-nnrc-lavender object-cover"
        />
      </div>
      
      {/* Name */}
      <span className="flex-1 font-semibold text-gray-800 truncate">
        {entry.userName}
      </span>
      
      {/* Temperature */}
      <span className="
        font-bold 
        text-lg 
        text-nnrc-temp-extreme-cold
        flex-shrink-0
      ">
        {entry.temperature}°F
      </span>
    </div>
  );
}

export function Leaderboard({ 
  entries 
}: { 
  entries: LeaderboardEntry[];
}) {
  return (
    <div className="space-y-2">
      {entries.map((entry, index) => (
        <LeaderboardItem
          key={entry.userId}
          rank={index + 1}
          entry={entry}
        />
      ))}
    </div>
  );
}

/* ========================================
   TEMPERATURE BADGE
   ======================================== */

export function TemperatureBadge({ 
  temperature 
}: { 
  temperature: number;
}) {
  // Determine color based on temperature
  let colorClass = 'bg-nnrc-temp-mild';
  if (temperature < 0) colorClass = 'bg-nnrc-temp-extreme-cold';
  else if (temperature < 15) colorClass = 'bg-nnrc-temp-very-cold';
  else if (temperature < 30) colorClass = 'bg-nnrc-temp-cold';
  else if (temperature < 40) colorClass = 'bg-nnrc-temp-cool';
  
  // Determine emoji
  let emoji = '🌡️';
  if (temperature < 0) emoji = '🥶';
  else if (temperature < 15) emoji = '❄️';
  else if (temperature < 30) emoji = '🧊';
  else if (temperature < 40) emoji = '☃️';
  
  return (
    <span className={`
      inline-flex 
      items-center 
      gap-1
      px-3 
      py-1 
      rounded-full 
      text-sm 
      font-semibold
      text-white
      ${colorClass}
    `}>
      <span>{emoji}</span>
      <span>{temperature}°F</span>
    </span>
  );
}

/* ========================================
   MODAL
   ======================================== */

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children 
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;
  
  return (
    <div 
      className="
        fixed 
        inset-0 
        bg-black/50 
        backdrop-blur-sm
        flex 
        items-center 
        justify-center 
        z-50
        animate-fadeIn
        p-4
      "
      onClick={onClose}
    >
      <div 
        className="
          bg-white 
          rounded-xl 
          shadow-2xl 
          max-w-md 
          w-full
          p-6
          animate-slideUp
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-gray-900">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="
              p-2
              rounded-lg
              hover:bg-gray-100
              active:scale-95
              transition-all
            "
          >
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        
        {/* Content */}
        {children}
      </div>
    </div>
  );
}

/* ========================================
   INPUT FIELD
   ======================================== */

export function InputField({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange,
  error 
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value: string | number;
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="
        block 
        text-sm 
        font-semibold 
        text-gray-700
      ">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`
          w-full 
          px-4 
          py-3 
          rounded-lg 
          border-2 
          ${error ? 'border-red-500' : 'border-gray-200'}
          focus:border-nnrc-purple 
          focus:ring-2 
          focus:ring-nnrc-lavender
          outline-none
          transition-colors
          text-gray-900
          font-medium
        `}
      />
      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

/* ========================================
   LOADING STATES
   ======================================== */

export function LoadingSkeleton({ 
  className 
}: { 
  className?: string;
}) {
  return (
    <div className={`
      animate-pulse 
      bg-nnrc-lavender-light 
      rounded-lg 
      ${className}
    `} />
  );
}

export function LoadingSpinner({ 
  size = 'md' 
}: { 
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };
  
  return (
    <div className={`
      ${sizeClasses[size]}
      border-nnrc-lavender
      border-t-nnrc-purple
      rounded-full
      animate-spin
    `} />
  );
}

/* ========================================
   TOAST NOTIFICATION
   ======================================== */

export function Toast({ 
  message, 
  type = 'success', 
  onClose 
}: {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}) {
  const icons = {
    success: <CheckCircleIcon className="w-6 h-6 text-green-500" />,
    error: <XMarkIcon className="w-6 h-6 text-red-500" />,
    info: <FireIcon className="w-6 h-6 text-blue-500" />,
  };
  
  return (
    <div className="
      fixed 
      bottom-8 
      right-8 
      z-50
      animate-slideUp
    ">
      <div className="
        bg-white 
        rounded-xl 
        shadow-2xl 
        border 
        border-gray-200
        p-4
        flex 
        items-center 
        gap-3
        min-w-[300px]
      ">
        {icons[type]}
        <p className="flex-1 font-medium text-gray-900">
          {message}
        </p>
        <button
          onClick={onClose}
          className="
            p-1
            rounded-lg
            hover:bg-gray-100
            transition-colors
          "
        >
          <XMarkIcon className="w-5 h-5 text-gray-500" />
        </button>
      </div>
    </div>
  );
}
