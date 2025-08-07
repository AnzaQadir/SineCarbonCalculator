import React from 'react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ClimateRingProps {
  habitProgress: number; // 0-1 scale
  powerProgress: number; // 0-1 scale
  socialProgress: number; // 0-1 scale
  size?: number;
  strokeWidth?: number;
  version?: 'v1' | 'v2' | 'v3' | 'v4'; // Different visual styles
}

interface RingConfig {
  radius: number;
  color: string;
  gradient: string;
  label: string;
  message: string;
  emoji: string;
  maxValue: number;
  actionTriggers: string;
}

const ClimateRing: React.FC<ClimateRingProps> = ({
  habitProgress,
  powerProgress,
  socialProgress,
  size = 200,
  strokeWidth = 20,
  version = 'v1' // Default to Version 1 (Black spacing, dimmed incomplete)
}) => {
  const center = size / 2;
  const radius = center - strokeWidth * 2;

  const rings: RingConfig[] = [
    {
      radius: radius * 0.4, // Inner ring (Light Blue/Cyan)
      color: '#00B4D8',
      gradient: 'from-sky-400 to-cyan-500',
      label: 'Power Moves',
      message: 'You took real action — Panda Power unlocked!',
      emoji: '⚡',
      maxValue: 3,
      actionTriggers: 'Big actions (audit, plan, offset)'
    },
    {
      radius: radius * 0.7, // Middle ring (Yellow/Lime Green)
      color: '#90EE90',
      gradient: 'from-yellow-300 to-lime-400',
      label: 'Daily Habits',
      message: 'You nailed your climate rhythm this week!',
      emoji: '🌱',
      maxValue: 10,
      actionTriggers: 'Daily eco-actions (tote bag, switch off light)'
    },
    {
      radius: radius * 1.0, // Outer ring (Red/Pink)
      color: '#FF6B6B',
      gradient: 'from-pink-400 to-red-500',
      label: 'Social Engagement',
      message: 'You inspired others — your story matters 🌍',
      emoji: '💫',
      maxValue: 20,
      actionTriggers: 'Journaling, inviting friends, sharing story'
    }
  ];

  const progressValues = [powerProgress, habitProgress, socialProgress];

  const createArc = (radius: number, progress: number) => {
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference * (1 - progress);
    
    return {
      circumference,
      strokeDasharray,
      strokeDashoffset
    };
  };

  const getRingMessage = (index: number, progress: number) => {
    if (progress >= 1) {
      return rings[index].message;
    } else if (progress >= 0.7) {
      return `Great progress on ${rings[index].label.toLowerCase()}!`;
    } else if (progress >= 0.4) {
      return `You're building momentum with ${rings[index].label.toLowerCase()}`;
    } else {
      return `Start your ${rings[index].label.toLowerCase()} journey`;
    }
  };

  // Version-specific rendering
  const renderVersion = () => {
    switch (version) {
      case 'v1':
        return renderVersion1();
      case 'v2':
        return renderVersion2();
      case 'v3':
        return renderVersion3();
      case 'v4':
        return renderVersion4();
      default:
        return renderVersion1();
    }
  };

  // Version 1: Original with dimmed incomplete parts
  const renderVersion1 = () => (
    <>
      {/* Background rings with black spacing */}
      {rings.map((ring, index) => (
        <circle
          key={`bg-${index}`}
          cx={center}
          cy={center}
          r={ring.radius}
          stroke="#000000"
          strokeWidth={strokeWidth + 6}
          fill="none"
          className="opacity-100"
        />
      ))}
      
      {/* Progress rings with incomplete parts */}
      {rings.map((ring, index) => {
        const progress = progressValues[index];
        const arc = createArc(ring.radius, progress);
        
        return (
          <React.Fragment key={`ring-${index}`}>
            {/* Incomplete part (dimmed) */}
            <motion.circle
              cx={center}
              cy={center}
              r={ring.radius}
              stroke={`url(#gradient-${index}-dimmed)`}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={arc.strokeDasharray}
              strokeDashoffset={0}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: 0.3 }}
              transition={{ 
                duration: 1, 
                delay: index * 0.3,
                ease: "easeOut"
              }}
            />
            
            {/* Complete part (bright) */}
            <motion.circle
              cx={center}
              cy={center}
              r={ring.radius}
              stroke={`url(#gradient-${index})`}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={arc.strokeDasharray}
              initial={{ strokeDashoffset: arc.circumference }}
              animate={{ strokeDashoffset: arc.strokeDashoffset }}
              transition={{ 
                duration: 2, 
                delay: index * 0.3,
                ease: "easeOut"
              }}
            />
          </React.Fragment>
        );
      })}
    </>
  );

  // Version 2: Gray background rings with bright incomplete parts
  const renderVersion2 = () => (
    <>
      {/* Background rings with gray spacing */}
      {rings.map((ring, index) => (
        <circle
          key={`bg-${index}`}
          cx={center}
          cy={center}
          r={ring.radius}
          stroke="#666666"
          strokeWidth={strokeWidth + 6}
          fill="none"
          className="opacity-100"
        />
      ))}
      
      {/* Progress rings with bright incomplete parts */}
      {rings.map((ring, index) => {
        const progress = progressValues[index];
        const arc = createArc(ring.radius, progress);
        
        return (
          <React.Fragment key={`ring-${index}`}>
            {/* Incomplete part (bright but lighter) */}
            <motion.circle
              cx={center}
              cy={center}
              r={ring.radius}
              stroke={`url(#gradient-${index}-light)`}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={arc.strokeDasharray}
              strokeDashoffset={0}
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 0.6 }}
              transition={{ 
                duration: 1, 
                delay: index * 0.3,
                ease: "easeOut"
              }}
            />
            
            {/* Complete part (bright) */}
            <motion.circle
              cx={center}
              cy={center}
              r={ring.radius}
              stroke={`url(#gradient-${index})`}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={arc.strokeDasharray}
              initial={{ strokeDashoffset: arc.circumference }}
              animate={{ strokeDashoffset: arc.strokeDashoffset }}
              transition={{ 
                duration: 2, 
                delay: index * 0.3,
                ease: "easeOut"
              }}
            />
          </React.Fragment>
        );
      })}
    </>
  );

  // Version 3: No background rings, only progress with subtle incomplete parts
  const renderVersion3 = () => (
    <>
      {/* Progress rings with subtle incomplete parts */}
      {rings.map((ring, index) => {
        const progress = progressValues[index];
        const arc = createArc(ring.radius, progress);
        
        return (
          <React.Fragment key={`ring-${index}`}>
            {/* Incomplete part (very subtle) */}
            <motion.circle
              cx={center}
              cy={center}
              r={ring.radius}
              stroke={`url(#gradient-${index}-subtle)`}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={arc.strokeDasharray}
              strokeDashoffset={0}
              initial={{ opacity: 0.2 }}
              animate={{ opacity: 0.2 }}
              transition={{ 
                duration: 1, 
                delay: index * 0.3,
                ease: "easeOut"
              }}
            />
            
            {/* Complete part (bright) */}
            <motion.circle
              cx={center}
              cy={center}
              r={ring.radius}
              stroke={`url(#gradient-${index})`}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={arc.strokeDasharray}
              initial={{ strokeDashoffset: arc.circumference }}
              animate={{ strokeDashoffset: arc.strokeDashoffset }}
              transition={{ 
                duration: 2, 
                delay: index * 0.3,
                ease: "easeOut"
              }}
            />
          </React.Fragment>
        );
      })}
    </>
  );

  // Version 4: High contrast with white background rings
  const renderVersion4 = () => (
    <>
      {/* Background rings with white spacing */}
      {rings.map((ring, index) => (
        <circle
          key={`bg-${index}`}
          cx={center}
          cy={center}
          r={ring.radius}
          stroke="#FFFFFF"
          strokeWidth={strokeWidth + 6}
          fill="none"
          className="opacity-100"
        />
      ))}
      
      {/* Progress rings with dark incomplete parts */}
      {rings.map((ring, index) => {
        const progress = progressValues[index];
        const arc = createArc(ring.radius, progress);
        
        return (
          <React.Fragment key={`ring-${index}`}>
            {/* Incomplete part (dark) */}
            <motion.circle
              cx={center}
              cy={center}
              r={ring.radius}
              stroke={`url(#gradient-${index}-dark)`}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={arc.strokeDasharray}
              strokeDashoffset={0}
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 0.4 }}
              transition={{ 
                duration: 1, 
                delay: index * 0.3,
                ease: "easeOut"
              }}
            />
            
            {/* Complete part (bright) */}
            <motion.circle
              cx={center}
              cy={center}
              r={ring.radius}
              stroke={`url(#gradient-${index})`}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={arc.strokeDasharray}
              initial={{ strokeDashoffset: arc.circumference }}
              animate={{ strokeDashoffset: arc.strokeDashoffset }}
              transition={{ 
                duration: 2, 
                delay: index * 0.3,
                ease: "easeOut"
              }}
            />
          </React.Fragment>
        );
      })}
    </>
  );

  return (
    <div className="relative flex items-center justify-center bg-black rounded-full" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {renderVersion()}
      </svg>

      {/* Gradients */}
      <svg width="0" height="0">
        <defs>
          {/* Inner ring - Light Blue to Cyan gradient */}
          <linearGradient id="gradient-0" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#87CEEB" />
            <stop offset="100%" stopColor="#00B4D8" />
          </linearGradient>
          
          {/* Inner ring - Dimmed Light Blue to Cyan gradient */}
          <linearGradient id="gradient-0-dimmed" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#87CEEB" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#00B4D8" stopOpacity="0.3" />
          </linearGradient>

          {/* Inner ring - Light Light Blue to Cyan gradient */}
          <linearGradient id="gradient-0-light" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#87CEEB" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#00B4D8" stopOpacity="0.6" />
          </linearGradient>

          {/* Inner ring - Subtle Light Blue to Cyan gradient */}
          <linearGradient id="gradient-0-subtle" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#87CEEB" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#00B4D8" stopOpacity="0.2" />
          </linearGradient>

          {/* Inner ring - Dark Light Blue to Cyan gradient */}
          <linearGradient id="gradient-0-dark" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#87CEEB" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#00B4D8" stopOpacity="0.4" />
          </linearGradient>
          
          {/* Middle ring - Yellow to Lime Green gradient */}
          <linearGradient id="gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFF00" />
            <stop offset="100%" stopColor="#90EE90" />
          </linearGradient>
          
          {/* Middle ring - Dimmed Yellow to Lime Green gradient */}
          <linearGradient id="gradient-1-dimmed" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFF00" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#90EE90" stopOpacity="0.3" />
          </linearGradient>

          {/* Middle ring - Light Yellow to Lime Green gradient */}
          <linearGradient id="gradient-1-light" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFF00" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#90EE90" stopOpacity="0.6" />
          </linearGradient>

          {/* Middle ring - Subtle Yellow to Lime Green gradient */}
          <linearGradient id="gradient-1-subtle" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFF00" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#90EE90" stopOpacity="0.2" />
          </linearGradient>

          {/* Middle ring - Dark Yellow to Lime Green gradient */}
          <linearGradient id="gradient-1-dark" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFF00" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#90EE90" stopOpacity="0.4" />
          </linearGradient>
          
          {/* Outer ring - Pink to Red gradient */}
          <linearGradient id="gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF69B4" />
            <stop offset="100%" stopColor="#FF6B6B" />
          </linearGradient>
          
          {/* Outer ring - Dimmed Pink to Red gradient */}
          <linearGradient id="gradient-2-dimmed" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF69B4" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FF6B6B" stopOpacity="0.3" />
          </linearGradient>

          {/* Outer ring - Light Pink to Red gradient */}
          <linearGradient id="gradient-2-light" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF69B4" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FF6B6B" stopOpacity="0.6" />
          </linearGradient>

          {/* Outer ring - Subtle Pink to Red gradient */}
          <linearGradient id="gradient-2-subtle" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF69B4" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#FF6B6B" stopOpacity="0.2" />
          </linearGradient>

          {/* Outer ring - Dark Pink to Red gradient */}
          <linearGradient id="gradient-2-dark" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF69B4" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FF6B6B" stopOpacity="0.4" />
          </linearGradient>
        </defs>
      </svg>

      {/* Empty center - clean design */}



      {/* Interactive tooltips for each ring */}
      {rings.map((ring, index) => {
        const progress = progressValues[index];
        const arc = createArc(ring.radius, progress);
        const angle = (progress * 2 * Math.PI) - Math.PI / 2;
        const x = center + ring.radius * Math.cos(angle);
        const y = center + ring.radius * Math.sin(angle);
        
        return (
          <Tooltip key={`tooltip-${index}`}>
            <TooltipTrigger asChild>
              <motion.div
                className="absolute cursor-pointer"
                style={{
                  left: x - 8,
                  top: y - 8,
                  width: 16,
                  height: 16
                }}
                whileHover={{ scale: 1.2 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: progress > 0 ? 1 : 0 }}
                transition={{ delay: 2 + index * 0.1 }}
              >
                <div className="w-4 h-4 bg-white rounded-full border-2 border-slate-300 shadow-sm" />
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-center">
                <div className="font-semibold text-slate-800">{ring.label}</div>
                <div className="text-sm text-slate-600">
                  {Math.round(progress * 100)}% Complete
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {getRingMessage(index, progress)}
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default ClimateRing; 