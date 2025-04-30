import React from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface EcoAvatarProps {
  outfit?: string;
  accessory?: string;
  background?: string;
  personality?: string;
  role?: 'visionary' | 'guardian' | 'catalyst' | 'sage';
  mood?: 'determined' | 'peaceful' | 'energetic' | 'wise';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
  className?: string;
}

// Sophisticated color palettes inspired by nature and luxury design
const roleColors = {
  visionary: {
    primary: '#00897B',    // Rich teal
    secondary: '#4DB6AC',  // Soft jade
    accent: '#004D40',     // Deep forest
    highlight: '#B2DFDB'   // Ethereal mint
  },
  guardian: {
    primary: '#5C6BC0',    // Royal blue
    secondary: '#7986CB',  // Lavender blue
    accent: '#283593',     // Deep indigo
    highlight: '#C5CAE9'   // Misty purple
  },
  catalyst: {
    primary: '#8E24AA',    // Rich purple
    secondary: '#AB47BC',  // Bright orchid
    accent: '#4A148C',     // Deep violet
    highlight: '#E1BEE7'   // Soft lilac
  },
  sage: {
    primary: '#C0CA33',    // Olive gold
    secondary: '#DCE775',  // Spring lime
    accent: '#827717',     // Ancient olive
    highlight: '#F0F4C3'   // Morning light
  }
};

// Enhanced background patterns
const backgrounds = {
  'forest': (colors: typeof roleColors.visionary) => (
    <g>
      <defs>
        <pattern id="leaf-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M10,2 Q15,7 10,12 T10,2" fill={colors.secondary} opacity="0.1" />
          <path d="M5,10 Q10,15 15,10 T5,10" fill={colors.highlight} opacity="0.1" />
        </pattern>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <rect width="100%" height="100%" fill={`url(#gradient-${colors.primary})`} />
      <rect width="100%" height="100%" fill="url(#leaf-pattern)" />
      
      {/* Layered Forest Silhouette */}
      <motion.path
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.8 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        d="M0 70 Q 20 60, 40 65 T 80 55 T 100 60"
        fill={colors.accent}
        filter="url(#glow)"
      />
      <motion.path
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.9 }}
        transition={{ duration: 1.8, ease: "easeInOut" }}
        d="M0 80 Q 30 70, 50 75 T 100 70"
        fill={colors.primary}
        filter="url(#glow)"
      />

      {/* Animated Trees */}
      {[20, 40, 60, 80].map((x, i) => (
        <motion.g
          key={i}
          initial={{ scale: 0, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ delay: i * 0.2, duration: 0.5, type: 'spring' }}
          transform={`translate(${x}, ${45 + (i % 2) * 5})`}
        >
          <path
            d={`M-8,15 L0,-5 L8,15 Z`}
            fill={colors.secondary}
            filter="url(#glow)"
          />
          <rect
            x="-1.5"
            y="15"
            width="3"
            height="6"
            fill={colors.accent}
          />
        </motion.g>
      ))}
    </g>
  ),

  'mountain': (colors: typeof roleColors.visionary) => (
    <g>
      <defs>
        <pattern id="mountain-texture" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M15,5 L20,25 L10,25 Z" fill={colors.secondary} opacity="0.1" />
          <circle cx="25" cy="5" r="1" fill={colors.highlight} opacity="0.2" />
        </pattern>
        <filter id="mountain-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.3"/>
        </filter>
      </defs>

      <rect width="100%" height="100%" fill={`url(#gradient-${colors.primary})`} />
      <rect width="100%" height="100%" fill="url(#mountain-texture)" />

      {/* Layered Mountains with Snow Caps */}
      <motion.g filter="url(#mountain-shadow)">
        {[
          { d: "M0 100 L30 30 L60 70 L100 20 L100 100 Z", delay: 0 },
          { d: "M-20 100 L20 40 L50 80 L80 30 L100 60 L120 100 Z", delay: 0.2 },
          { d: "M-10 100 L40 50 L70 90 L90 40 L110 70 L130 100 Z", delay: 0.4 }
        ].map((mountain, i) => (
          <motion.path
            key={i}
            d={mountain.d}
            fill={colors.accent}
            opacity={0.8 - i * 0.2}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.8 - i * 0.2 }}
            transition={{ delay: mountain.delay, duration: 1.5, ease: "easeInOut" }}
          />
        ))}
        
        {/* Snow Caps */}
        <motion.path
          d="M30 30 L35 25 L40 30 M60 70 L65 65 L70 70"
          stroke={colors.highlight}
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        />
      </motion.g>
    </g>
  ),

  'ocean': (colors: typeof roleColors.visionary) => (
    <g>
      <defs>
        <pattern id="wave-texture" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path
            d="M0 20 Q 10 15, 20 20 T 40 20"
            fill="none"
            stroke={colors.highlight}
            strokeWidth="0.5"
            opacity="0.3"
          />
        </pattern>
        <filter id="water-blur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
        </filter>
      </defs>

      <rect width="100%" height="100%" fill={`url(#gradient-${colors.primary})`} />
      <rect width="100%" height="100%" fill="url(#wave-texture)" />

      {/* Animated Ocean Waves */}
      {[0, 1, 2].map((i) => (
        <motion.g key={i} filter="url(#water-blur)">
          <motion.path
            d={`M-20 ${65 + i * 10} Q 0 ${60 + i * 10}, 20 ${65 + i * 10} T 60 ${65 + i * 10} T 100 ${65 + i * 10} T 140 ${65 + i * 10}`}
            fill="none"
            stroke={colors.secondary}
            strokeWidth="3"
            opacity={0.3}
            initial={{ x: 0 }}
            animate={{ x: -40 }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
              delay: i * 0.5
            }}
          />
        </motion.g>
      ))}

      {/* Shimmering Effect */}
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.circle
          key={i}
          cx={20 + i * 10}
          cy={40 + (i % 3) * 10}
          r="1"
          fill={colors.highlight}
          initial={{ opacity: 0.2 }}
          animate={{ opacity: 0.8 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
            delay: i * 0.2
          }}
        />
      ))}
    </g>
  )
};

// Enhanced character features
const characterFeatures = {
  determined: {
    eyes: "M-7,-2 L-3,2 M3,-2 L7,2",
    expression: "M-10,8 Q0,12 10,8"
  },
  peaceful: {
    eyes: "M-7,0 Q-5,-4 -3,0 M3,0 Q5,-4 7,0",
    expression: "M-10,8 Q0,10 10,8"
  },
  energetic: {
    eyes: "M-7,-2 L-3,2 M-7,2 L-3,-2 M3,-2 L7,2 M3,2 L7,-2",
    expression: "M-10,6 Q0,12 10,6"
  },
  wise: {
    eyes: "M-7,0 Q-5,2 -3,0 M3,0 Q5,2 7,0",
    expression: "M-10,8 Q0,6 10,8"
  }
};

const outfits = {
  'recycled-denim': (colors: typeof roleColors.visionary) => (
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
  'eco-warrior': (colors: typeof roleColors.visionary) => (
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
  'solar-powered': (colors: typeof roleColors.visionary) => (
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
  'solar-crown': (colors: typeof roleColors.visionary) => (
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
  'leaf-halo': (colors: typeof roleColors.visionary) => (
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
  'eco-badge': (colors: typeof roleColors.visionary) => (
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
  role = 'visionary',
  mood = 'determined',
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
  const features = characterFeatures[mood];

  return (
    <div className={cn(sizeClasses[size], className)}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
      >
        {/* Enhanced gradients and filters */}
        <defs>
          {Object.entries(roleColors).map(([roleName, colors]) => (
            <React.Fragment key={roleName}>
              <linearGradient
                id={`gradient-${colors.primary}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={colors.primary} stopOpacity="0.2" />
                <stop offset="100%" stopColor={colors.secondary} stopOpacity="0.1" />
              </linearGradient>
              <filter id={`glow-${roleName}`}>
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </React.Fragment>
          ))}
        </defs>

        {/* Animated Background */}
        <AnimatePresence>
          <motion.g
            initial={animate ? { opacity: 0 } : undefined}
            animate={animate ? { opacity: 1 } : undefined}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {backgrounds[background as keyof typeof backgrounds](colors)}
          </motion.g>
        </AnimatePresence>

        {/* Enhanced Character Base */}
        <motion.g
          initial={animate ? { scale: 0 } : undefined}
          animate={animate ? { scale: 1 } : undefined}
          transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
        >
          {/* Head with subtle gradient */}
          <defs>
            <radialGradient id="skin-gradient">
              <stop offset="0%" stopColor="#feebc8" />
              <stop offset="100%" stopColor="#f6e0b3" />
            </radialGradient>
          </defs>
          <circle
            cx="50"
            cy="50"
            r="20"
            fill="url(#skin-gradient)"
            filter="url(#glow)"
          />

          {/* Expressive Features */}
          <motion.g
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            {/* Dynamic Eyes */}
            <motion.path
              d={features.eyes}
              transform="translate(50 45)"
              stroke="#2d3748"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
            
            {/* Dynamic Expression */}
            <motion.path
              d={features.expression}
              transform="translate(50 45)"
              fill="none"
              stroke="#2d3748"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            />
          </motion.g>
        </motion.g>

        {/* Outfit with enhanced details */}
        {outfits[outfit as keyof typeof outfits](colors)}

        {/* Accessory with glow effects */}
        {accessory && accessories[accessory as keyof typeof accessories](colors)}
      </svg>
    </div>
  );
};

export default EcoAvatar; 