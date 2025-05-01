import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface EcoAvatarProps {
  outfit?: string;
  accessory?: string;
  background?: string;
  personality?: string;
  role?: 'pioneer' | 'guardian' | 'innovator' | 'advocate';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
  className?: string;
}

// Role-based color schemes
const roleColors = {
  pioneer: {
    primary: '#4ade80',
    secondary: '#22c55e',
    accent: '#15803d'
  },
  guardian: {
    primary: '#60a5fa',
    secondary: '#3b82f6',
    accent: '#1d4ed8'
  },
  innovator: {
    primary: '#f472b6',
    secondary: '#ec4899',
    accent: '#be185d'
  },
  advocate: {
    primary: '#facc15',
    secondary: '#eab308',
    accent: '#ca8a04'
  }
};

const backgrounds = {
  'forest': (colors: typeof roleColors.pioneer) => (
    <g>
      <defs>
        <pattern id="leaf-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M10,2 Q15,7 10,12 T10,2" fill={colors.secondary} opacity="0.1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#gradient-${colors.primary})`} />
      <rect width="100%" height="100%" fill="url(#leaf-pattern)" />
      <path d="M0 80 Q 25 60, 50 80 T 100 80" fill={colors.secondary} opacity="0.8" />
      <path d="M0 85 Q 25 65, 50 85 T 100 85" fill={colors.accent} opacity="0.9" />
      {/* Enhanced Trees */}
      <g transform="translate(10, 40)" className="tree-group">
        <motion.g
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <path d="M0,20 L10,0 L20,20 Z" fill={colors.secondary} />
          <rect x="8" y="20" width="4" height="8" fill={colors.accent} />
        </motion.g>
      </g>
      <g transform="translate(70, 30)" className="tree-group">
        <motion.g
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <path d="M0,25 L15,0 L30,25 Z" fill={colors.secondary} />
          <rect x="12" y="25" width="6" height="10" fill={colors.accent} />
        </motion.g>
      </g>
    </g>
  ),
  'mountain': (colors: typeof roleColors.pioneer) => (
    <g>
      <defs>
        <pattern id="mountain-pattern" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M15,5 L20,25 L10,25 Z" fill={colors.secondary} opacity="0.1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#gradient-${colors.primary})`} />
      <rect width="100%" height="100%" fill="url(#mountain-pattern)" />
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        d="M0 100 L30 30 L60 70 L100 20 L100 100 Z"
        fill={colors.secondary}
        opacity="0.8"
      />
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }}
        d="M0 100 L40 40 L70 80 L100 30 L100 100 Z"
        fill={colors.accent}
        opacity="0.9"
      />
    </g>
  ),
  'ocean': (colors: typeof roleColors.pioneer) => (
    <g>
      <defs>
        <pattern id="wave-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M0 20 Q 10 15, 20 20 T 40 20" fill={colors.secondary} opacity="0.1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#gradient-${colors.primary})`} />
      <rect width="100%" height="100%" fill="url(#wave-pattern)" />
      <motion.path
        initial={{ y: 5 }}
        animate={{ y: -5 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        d="M0 70 Q 25 60, 50 70 T 100 70"
        fill={colors.secondary}
        opacity="0.8"
      />
      <motion.path
        initial={{ y: -5 }}
        animate={{ y: 5 }}
        transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        d="M0 75 Q 25 65, 50 75 T 100 75"
        fill={colors.accent}
        opacity="0.9"
      />
    </g>
  )
};

const outfits = {
  'recycled-denim': (colors: typeof roleColors.pioneer) => (
    <g>
      <defs>
        <pattern id="denim-pattern" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <path d="M0 0 L4 4 M-1 3 L1 5 M3 -1 L5 1" strokeWidth="0.5" stroke={colors.accent} opacity="0.3" />
        </pattern>
      </defs>
      <motion.path
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        d="M30 50 Q 50 30, 70 50 Q 50 70, 30 50"
        fill={colors.primary}
      />
      <motion.path
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        d="M35 50 Q 50 35, 65 50 Q 50 65, 35 50"
        fill={colors.secondary}
      />
      <rect x="35" y="35" width="30" height="30" fill="url(#denim-pattern)" />
      {/* Recycled symbol */}
      <motion.g
        initial={{ rotate: -180, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        transform="translate(45, 45) scale(0.15)"
      >
        <path d="M20,10 A10,10 0 1,1 10,20" stroke="#fff" strokeWidth="4" fill="none" />
        <path d="M15,15 L20,10 L25,15" fill="#fff" />
      </motion.g>
    </g>
  ),
  'eco-warrior': (colors: typeof roleColors.pioneer) => (
    <g>
      <defs>
        <pattern id="warrior-pattern" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="1" fill={colors.accent} opacity="0.3" />
        </pattern>
      </defs>
      <motion.path
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        d="M30 50 Q 50 30, 70 50 Q 50 70, 30 50"
        fill={colors.primary}
      />
      <motion.path
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        d="M35 50 Q 50 35, 65 50 Q 50 65, 35 50"
        fill={colors.secondary}
      />
      <rect x="35" y="35" width="30" height="30" fill="url(#warrior-pattern)" />
      {/* Enhanced leaf symbol */}
      <motion.g
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <path d="M45,45 Q55,35 55,45 T45,45" fill="#fff" />
        <path d="M45,45 Q55,55 55,45 T45,45" fill="#fff" opacity="0.7" />
      </motion.g>
    </g>
  ),
  'solar-powered': (colors: typeof roleColors.pioneer) => (
    <g>
      <defs>
        <pattern id="solar-pattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="5" height="5" fill={colors.accent} opacity="0.2" />
        </pattern>
      </defs>
      <motion.path
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        d="M30 50 Q 50 30, 70 50 Q 50 70, 30 50"
        fill={colors.primary}
      />
      <motion.path
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        d="M35 50 Q 50 35, 65 50 Q 50 65, 35 50"
        fill={colors.secondary}
      />
      <rect x="35" y="35" width="30" height="30" fill="url(#solar-pattern)" />
      {/* Enhanced solar panel */}
      <motion.g
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        transform="translate(45, 45) scale(0.2)"
      >
        <rect x="-15" y="-15" width="30" height="30" fill={colors.accent} />
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <line x1="-15" y1="-5" x2="15" y2="-5" stroke="#fff" strokeWidth="1" />
          <line x1="-15" y1="5" x2="15" y2="5" stroke="#fff" strokeWidth="1" />
          <line x1="-5" y1="-15" x2="-5" y2="15" stroke="#fff" strokeWidth="1" />
          <line x1="5" y1="-15" x2="5" y2="15" stroke="#fff" strokeWidth="1" />
        </motion.g>
      </motion.g>
    </g>
  )
};

const accessories = {
  'solar-crown': (colors: typeof roleColors.pioneer) => (
    <motion.g
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      transform="translate(50, 25)"
    >
      <path
        d="M-15,0 L-10,-10 L-5,0 L0,-10 L5,0 L10,-10 L15,0"
        fill={colors.primary}
        stroke={colors.accent}
        strokeWidth="1"
      />
      <motion.g
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        transform="scale(0.15)"
      >
        <rect x="-15" y="-15" width="30" height="30" fill={colors.accent} />
        <line x1="-15" y1="-5" x2="15" y2="-5" stroke="#fff" strokeWidth="1" />
        <line x1="-15" y1="5" x2="15" y2="5" stroke="#fff" strokeWidth="1" />
      </motion.g>
    </motion.g>
  ),
  'leaf-halo': (colors: typeof roleColors.pioneer) => (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      transform="translate(50, 25)"
    >
      <motion.circle
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1 }}
        cx="0"
        cy="0"
        r="12"
        fill="none"
        stroke={colors.primary}
        strokeWidth="2"
      />
      <motion.g
        initial={{ rotate: -180 }}
        animate={{ rotate: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <path d="M-5,-5 Q0,-10 5,-5 T-5,-5" fill={colors.primary} />
        <path d="M-5,5 Q0,10 5,5 T-5,5" fill={colors.primary} />
        <path d="M-5,0 Q0,-5 5,0 T-5,0" fill={colors.primary} />
      </motion.g>
    </motion.g>
  ),
  'eco-badge': (colors: typeof roleColors.pioneer) => (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      transform="translate(70, 40)"
    >
      <circle cx="0" cy="0" r="8" fill={colors.primary} />
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        d="M-4,-4 L4,4 M-4,4 L4,-4"
        stroke="#fff"
        strokeWidth="2"
      />
    </motion.g>
  )
};

export const EcoAvatar: React.FC<EcoAvatarProps> = ({
  outfit = 'recycled-denim',
  accessory,
  background = 'forest',
  role = 'pioneer',
  size = 'md',
  animate = true,
  className
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
    xl: 'w-64 h-64'
  };

  const colors = roleColors[role];

  return (
    <div className={cn(sizeClasses[size], className)}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
      >
        {/* Gradients */}
        <defs>
          {Object.entries(roleColors).map(([roleName, colors]) => (
            <linearGradient
              key={roleName}
              id={`gradient-${colors.primary}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={colors.primary} stopOpacity="0.2" />
              <stop offset="100%" stopColor={colors.secondary} stopOpacity="0.1" />
            </linearGradient>
          ))}
        </defs>

        {/* Background */}
        <motion.g
          initial={animate ? { opacity: 0 } : undefined}
          animate={animate ? { opacity: 1 } : undefined}
          transition={{ duration: 0.5 }}
        >
          {backgrounds[background as keyof typeof backgrounds](colors)}
        </motion.g>

        {/* Character Base */}
        <motion.g
          initial={animate ? { scale: 0 } : undefined}
          animate={animate ? { scale: 1 } : undefined}
          transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
        >
          {/* Head */}
          <circle cx="50" cy="50" r="20" fill="#feebc8" />
          {/* Eyes */}
          <motion.g
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <circle cx="43" cy="45" r="2" fill="#2d3748" />
            <circle cx="57" cy="45" r="2" fill="#2d3748" />
          </motion.g>
          {/* Smile */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            d="M43,55 Q50,60 57,55"
            fill="none"
            stroke="#2d3748"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </motion.g>

        {/* Outfit */}
        {outfits[outfit as keyof typeof outfits](colors)}

        {/* Accessory */}
        {accessory && accessories[accessory as keyof typeof accessories](colors)}
      </svg>
    </div>
  );
};

export default EcoAvatar; 