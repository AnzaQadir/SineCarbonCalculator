import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakRingProps {
  streak: number;
  longestStreak?: number;
  profileImage?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StreakRing: React.FC<StreakRingProps> = ({ 
  streak, 
  longestStreak,
  profileImage,
  size = 'md',
  className 
}) => {
  const sizeClasses = {
    sm: { ring: 'w-12 h-12', avatar: 'w-10 h-10', icon: 'h-4 w-4' },
    md: { ring: 'w-16 h-16', avatar: 'w-14 h-14', icon: 'h-5 w-5' },
    lg: { ring: 'w-20 h-20', avatar: 'w-18 h-18', icon: 'h-6 w-6' }
  };

  const sizes = sizeClasses[size];
  
  // Calculate circle circumference and progress
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(streak / 7, 1); // Fills at 7 days
  const strokeDashoffset = circumference * (1 - progress);

  const getStreakColor = () => {
    if (streak >= 7) return 'stroke-orange-500';
    if (streak >= 3) return 'stroke-amber-500';
    return 'stroke-yellow-500';
  };

  return (
    <div 
      className={cn(
        "relative inline-flex items-center justify-center",
        className
      )}
      title={`${streak}-day streak${longestStreak ? ` • Longest: ${longestStreak}` : ''}`}
    >
      {/* SVG Circle Ring */}
      <svg
        className={cn(
          sizes.ring,
          "transform -rotate-90"
        )}
        viewBox="0 0 64 64"
      >
        {/* Background Circle */}
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-gray-200"
        />
        
        {/* Progress Circle */}
        <motion.circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          className={getStreakColor()}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>

      {/* Avatar */}
      <div className={cn(
        "absolute rounded-full overflow-hidden",
        sizes.avatar,
        "border-2 border-white shadow-md"
      )}>
        {profileImage ? (
          <img 
            src={profileImage} 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
            <Flame className={cn(sizes.icon, "text-white")} />
          </div>
        )}
      </div>

      {/* Streak Badge (Top Right) */}
      {streak > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg border-2 border-white"
        >
          {streak}
        </motion.div>
      )}

      {/* Trophy for Longest Streak */}
      {longestStreak && longestStreak > streak && (
        <div className="absolute -bottom-1 right-0 bg-yellow-400 rounded-full p-1 border-2 border-white shadow-md">
          <Trophy className="h-3 w-3 text-yellow-800" />
        </div>
      )}
    </div>
  );
};
