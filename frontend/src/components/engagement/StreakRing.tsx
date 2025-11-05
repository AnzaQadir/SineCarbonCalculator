import React from 'react';
import { motion } from 'framer-motion';

interface StreakRingProps {
  currentStreak: number;
  longestStreak: number;
  size?: number;
  strokeWidth?: number;
}

export const StreakRing: React.FC<StreakRingProps> = ({
  currentStreak,
  longestStreak,
  size = 80,
  strokeWidth = 8,
}) => {
  // Calculate streak for 7-day window
  const streakInWindow = Math.min(currentStreak, 7);
  const progress = streakInWindow / 7;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-200"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="text-brand-teal"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-slate-800">{currentStreak}</span>
        <span className="text-xs text-slate-500">days</span>
      </div>
      {/* Tooltip on hover */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
        <div className="bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          Day {currentStreak} • Longest {longestStreak}
        </div>
      </div>
    </div>
  );
};

