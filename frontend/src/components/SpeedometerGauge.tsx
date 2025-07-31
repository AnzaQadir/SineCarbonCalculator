import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface SpeedometerGaugeProps {
  value: number; // tons CO2
  max?: number;  // max value for "strong"
}

const getPandaPose = (value: number, max: number) => {
  const percentage = value / max;
  if (percentage < 0.33) return "sitting"; // Sitting pose for beginners
  if (percentage < 0.66) return "walking"; // Walking pose for progress
  return "jumping"; // Jumping pose for impact heroes
};

const getCelebratoryLabel = (value: number, max: number) => {
  const percentage = value / max;
  if (percentage < 0.33) return "🌱 Getting Started";
  if (percentage < 0.66) return "🌿 Making Moves";
  return "🌳 Impact Hero";
};

const getColorForValue = (value: number, max: number) => {
  const percentage = value / max;
  if (percentage < 0.33) return "#F59E0B"; // Amber
  if (percentage < 0.66) return "#10B981"; // Emerald
  return "#059669"; // Green
};

export const SpeedometerGauge: React.FC<SpeedometerGaugeProps> = ({ value, max = 10 }) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [showSparkles, setShowSparkles] = useState(false);

  // Animate value on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value);
      if (value > 0) {
        setShowSparkles(true);
        setTimeout(() => setShowSparkles(false), 3000);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [value]);

  // Clamp value
  const v = Math.max(0, Math.min(animatedValue, max));
  // Angle: -135deg (left) to +135deg (right)
  const angle = -135 + (v / max) * 270;
  const pandaPose = getPandaPose(v, max);

  return (
    <motion.div 
      className="flex flex-col items-center my-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Main Gauge Container with Sky-like Background */}
      <div className="relative bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 rounded-3xl p-10 shadow-2xl border border-sky-200/50 overflow-hidden">
        {/* Floating Clouds Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 left-8 w-16 h-8 bg-white rounded-full blur-sm"></div>
          <div className="absolute top-8 right-12 w-12 h-6 bg-white rounded-full blur-sm"></div>
          <div className="absolute bottom-6 left-16 w-10 h-5 bg-white rounded-full blur-sm"></div>
        </div>
        
        <svg width={500} height={300} viewBox="0 0 500 300" className="relative z-10">
          {/* Background Arc - The Trail */}
          <path
            d="M50 250 A180 180 0 0 1 450 250"
            fill="none"
            stroke="#E0E7FF"
            strokeWidth={45}
            strokeLinecap="round"
            className="drop-shadow-lg"
          />
          
          {/* Trail Segments with Playful Gradients */}
          <defs>
            <linearGradient id="amberTrail" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FEF3C7" />
              <stop offset="50%" stopColor="#FCD34D" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            <linearGradient id="emeraldTrail" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D1FAE5" />
              <stop offset="50%" stopColor="#6EE7B7" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
            <linearGradient id="greenTrail" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#DCFCE7" />
              <stop offset="50%" stopColor="#4ADE80" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            
            {/* Sparkle Effects */}
            <filter id="sparkle">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Getting Started Trail Segment */}
          <path 
            d="M50 250 A180 180 0 0 1 200 80" 
            fill="none" 
            stroke="url(#amberTrail)" 
            strokeWidth={45} 
            strokeLinecap="round"
            className="drop-shadow-md"
          />
          
          {/* Making Moves Trail Segment */}
          <path 
            d="M200 80 A180 180 0 0 1 300 80" 
            fill="none" 
            stroke="url(#emeraldTrail)" 
            strokeWidth={45} 
            strokeLinecap="round"
            className="drop-shadow-md"
          />
          
          {/* Impact Hero Trail Segment */}
          <path 
            d="M300 80 A180 180 0 0 1 450 250" 
            fill="none" 
            stroke="url(#greenTrail)" 
            strokeWidth={45} 
            strokeLinecap="round"
            className="drop-shadow-md"
          />
          
          {/* Trail Markers - Little stepping stones */}
          {Array.from({ length: 11 }, (_, i) => {
            const markerAngle = -135 + (i / 10) * 270;
            const x = 250 + 180 * Math.cos(markerAngle * Math.PI / 180);
            const y = 250 + 180 * Math.sin(markerAngle * Math.PI / 180);
            
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={i % 2 === 0 ? 4 : 2}
                fill={i <= (v / max) * 10 ? "#FFFFFF" : "#E0E7FF"}
                stroke="#FFFFFF"
                strokeWidth={1}
                className="drop-shadow-sm"
              />
            );
          })}
          
          {/* Zone Labels Inside the Trail */}
          <text 
            x={120} 
            y={200} 
            fontSize={14} 
            fontWeight="600"
            fill="#F59E0B" 
            fontFamily="Inter, system-ui, sans-serif" 
            transform="rotate(-45 120 200)"
            className="drop-shadow-sm"
          >
            🌱 Getting Started
          </text>
          <text 
            x={250} 
            y={70} 
            fontSize={15} 
            fontWeight="700"
            fill="#10B981" 
            fontFamily="Inter, system-ui, sans-serif" 
            textAnchor="middle"
            className="drop-shadow-sm"
          >
            🌿 Making Moves
          </text>
          <text 
            x={380} 
            y={200} 
            fontSize={14} 
            fontWeight="600"
            fill="#059669" 
            fontFamily="Inter, system-ui, sans-serif" 
            transform="rotate(45 380 200)"
            className="drop-shadow-sm"
          >
            🌳 Impact Hero
          </text>
          
          {/* Animated Sparkles */}
          {showSparkles && (
            <>
              <motion.circle
                cx={250}
                cy={100}
                r={3}
                fill="#FCD34D"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                filter="url(#sparkle)"
              />
              <motion.circle
                cx={280}
                cy={120}
                r={2}
                fill="#F59E0B"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                filter="url(#sparkle)"
              />
              <motion.circle
                cx={220}
                cy={110}
                r={2.5}
                fill="#10B981"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                filter="url(#sparkle)"
              />
            </>
          )}
          
          {/* Gamified Panda Character */}
          <motion.g 
            transform={`rotate(${angle} 250 250)`}
            initial={{ rotate: -135 }}
            animate={{ rotate: angle }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            {/* Panda Shadow */}
            <ellipse 
              cx={250} 
              cy={252} 
              rx={30} 
              ry={15} 
              fill="rgba(0,0,0,0.1)"
              className="drop-shadow-lg"
            />
            
            {/* Panda Base Platform */}
            <circle 
              cx={250} 
              cy={250} 
              r={30} 
              fill="white"
              stroke="#1E293B"
              strokeWidth={2}
              className="drop-shadow-md"
            />
            
            {/* Panda SVG with Pose-based Animation */}
            <motion.image
              href="/images/panda.svg"
              x={220}
              y={220}
              width={60}
              height={60}
              className="drop-shadow-sm"
              animate={{
                y: pandaPose === "jumping" ? [220, 200, 220] : 220,
                rotate: pandaPose === "walking" ? [0, 5, -5, 0] : 0
              }}
              transition={{
                duration: pandaPose === "jumping" ? 0.8 : 1,
                repeat: pandaPose === "jumping" ? Infinity : 0,
                ease: "easeInOut"
              }}
            />
            
            {/* Center Dot */}
            <circle 
              cx={250} 
              cy={250} 
              r={3} 
              fill="#1E293B"
              className="drop-shadow-sm"
            />
          </motion.g>
          
          {/* Score Display */}
          <motion.text 
            x={250} 
            y={280} 
            fontSize={24} 
            fontWeight="700"
            fill="#1E293B" 
            fontFamily="Inter, system-ui, sans-serif" 
            textAnchor="middle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            {v.toFixed(1)}
          </motion.text>
        </svg>
      </div>
      
      {/* Impact Data with Gamified Messaging */}
      <motion.div 
        className="mt-8 text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        {/* Tree Protection with Playful Language */}
        <div className="space-y-2">
          <motion.div 
            className="text-3xl font-bold text-slate-800 tracking-tight"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.2, duration: 0.3 }}
          >
            Your panda helped protect {Math.round(animatedValue * 45).toLocaleString()} trees 🌲
          </motion.div>
          
          {/* Climate Score with Encouraging Language */}
          <motion.div 
            className="text-lg font-semibold text-slate-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.5 }}
          >
            Climate Score: 💯 out of 10 — Keep walking the green path! 🐾
          </motion.div>
        </div>
        
        {/* Journey Progress Message */}
        <motion.p 
          className="text-slate-600 text-base font-medium max-w-sm mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.5 }}
        >
          {pandaPose === "sitting" && "Your panda is just getting started! 🌱"}
          {pandaPose === "walking" && "Your panda is making great progress! 🌿"}
          {pandaPose === "jumping" && "Your panda is jumping for joy! 🌳"}
        </motion.p>
      </motion.div>
    </motion.div>
  );
}; 