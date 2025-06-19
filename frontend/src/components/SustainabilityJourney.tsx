import React, { useRef, useState, useEffect } from 'react';
import { motion, useAnimationFrame } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Sparkles, Flag, Leaf, Award, Mountain, Sun, Cloud, CheckCircle, TreePine, Sunrise, Globe, Feather, Trophy, Bird } from 'lucide-react';

const milestones = [
  { name: 'Taking Root', icon: <Leaf className="w-7 h-7" stroke="#166534" fill="none" />, detail: 'Planting the first seed' },
  { name: 'Growing Strong', icon: <TreePine className="w-7 h-7" stroke="#166534" fill="none" />, detail: 'Early growth and learning' },
  { name: 'Flowing Forward', icon: <Feather className="w-7 h-7" stroke="#0e7490" fill="none" />, detail: 'Progress is steady and natural' },
  { name: 'Climbing Higher', icon: <Mountain className="w-7 h-7" stroke="#334155" fill="none" />, detail: 'Overcoming challenges' },
  { name: 'Deep Roots', icon: <TreePine className="w-7 h-7" stroke="#166534" fill="none" />, detail: 'Creating lasting impact' },
  { name: 'New Dawn', icon: <Sunrise className="w-7 h-7" stroke="#fbbf24" fill="none" />, detail: 'A new perspective' },
  { name: 'Soaring Above', icon: <Bird className="w-7 h-7" stroke="#0e7490" fill="none" />, detail: 'Leadership and vision' },
  { name: 'Planet Guardian', icon: <Globe className="w-7 h-7" stroke="#166534" fill="none" />, detail: 'Global difference' },
];

const EarthIcon = ({ className = '', glow = false }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="earthGlow" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#34d399" stopOpacity="0.2" />
      </radialGradient>
    </defs>
    {glow && <circle cx="32" cy="32" r="30" fill="url(#earthGlow)" opacity="0.7" />}
    <circle cx="32" cy="32" r="28" fill="#34d399" />
    <circle cx="32" cy="32" r="28" fill="#60a5fa" fillOpacity="0.8" />
    <path d="M18 38 Q22 34 28 36 Q32 38 36 34 Q40 30 46 32 Q50 34 48 40 Q46 46 40 44 Q36 42 32 46 Q28 50 22 48 Q18 46 18 38Z" fill="#a7f3d0" />
    <ellipse cx="32" cy="40" rx="20" ry="8" fill="#059669" opacity="0.2" />
  </svg>
);

const milestoneBgColors = [
  'border-green-200',
  'border-blue-200',
  'border-amber-200',
  'border-cyan-200',
  'border-yellow-200',
  'border-emerald-200',
  'border-sky-200',
  'border-rose-200',
];
const milestoneIconColors = [
  'text-emerald-500',
  'text-sky-400',
  'text-yellow-400',
  'text-cyan-400',
  'text-yellow-500',
  'text-green-500',
  'text-blue-400',
  'text-rose-400',
];

// Color palette from image
const THEME = {
  bg: '#EAF8F0', // main background
  mountain: '#D1F2E2', // mountain shapes
  path: '#A78B6C', // path brown
  progress: '#34D399', // progress green
  progressBg: '#A7F3D0', // progress bar background
  milestoneBg: '#FFFFFF', // milestone circle background
  milestoneBorder: '#34D399', // milestone circle border
  icon: '#166534', // icon stroke
  label: '#166534', // label text
};

export const SustainabilityJourney = ({
  currentMilestone = 0,
  score = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(1200);
  const [containerHeight, setContainerHeight] = useState(480);
  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
      setContainerHeight(containerRef.current.offsetHeight);
    }
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
        setContainerHeight(containerRef.current.offsetHeight);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Path and peak calculations
  const numPeaks = milestones.length;
  const marginX = 80;
  const marginY = 40;
  const usableWidth = containerWidth - 2 * marginX;
  const usableHeight = containerHeight - 2 * marginY;
  const peakX = Array.from({ length: numPeaks }, (_, i) => marginX + (usableWidth / (numPeaks - 1)) * i);
  const peakY = Array.from({ length: numPeaks }, (_, i) => marginY + usableHeight - (usableHeight / (numPeaks - 1)) * i * 0.9);
  // Path string
  const pathString = `M${peakX[0]},${peakY[0]} ` + peakX.slice(1).map((x, i) => `L${x},${peakY[i + 1]}`).join(' ');

  // Earth icon position (interpolated along path)
  const [earthProgress, setEarthProgress] = useState(currentMilestone / (numPeaks - 1));
  useEffect(() => {
    setEarthProgress(currentMilestone / (numPeaks - 1));
  }, [currentMilestone, numPeaks]);

  // Find Earth position along the path
  const svgRef = useRef<SVGPathElement>(null);
  const [earthPos, setEarthPos] = useState({ x: peakX[0], y: peakY[0] });
  useEffect(() => {
    if (svgRef.current) {
      const path = svgRef.current;
      const totalLength = path.getTotalLength();
      const point = path.getPointAtLength(earthProgress * totalLength);
      setEarthPos({ x: point.x, y: point.y });
    }
  }, [earthProgress, containerWidth, containerHeight]);

  // Progress bar
  const progressPercent = Math.round((currentMilestone / (numPeaks - 1)) * 100);
  const nextMilestone = milestones[Math.min(currentMilestone + 1, numPeaks - 1)].name;

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="relative w-full rounded-3xl shadow-2xl overflow-visible px-12 pt-6 pb-2"
        style={{ aspectRatio: '3/1', minHeight: 540, background: THEME.bg }}
      >
        <svg
          viewBox={`0 0 ${containerWidth} ${containerHeight}`}
          width={containerWidth}
          height={containerHeight}
          className="w-full h-full absolute left-0 top-0"
          style={{ borderRadius: '1.5rem', top: '-32px', position: 'absolute' }}
        >
          {/* Background */}
          <defs>
            <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={THEME.mountain} />
              <stop offset="100%" stopColor={THEME.bg} />
            </linearGradient>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={THEME.progress} />
              <stop offset="100%" stopColor={THEME.progressBg} />
            </linearGradient>
          </defs>
          {/* Sun and clouds */}
          <circle cx={marginX + 60} cy={marginY - 30} r={36} fill="#F0FDF4" opacity={0.7} />
          <ellipse cx={marginX + 200} cy={marginY + 10} rx={40} ry={16} fill="#F0FDF4" opacity={0.3} />
          <ellipse cx={containerWidth - marginX - 120} cy={marginY + 30} rx={60} ry={20} fill="#F0FDF4" opacity={0.2} />
          {/* Main mountain range */}
          <path
            d={`M${peakX[0]},${containerHeight} ` + peakX.map((x, i) => `L${x},${peakY[i]}`).join(' ') + ` L${peakX[numPeaks - 1]},${containerHeight} Z`}
            fill="url(#mountainGradient)"
            opacity={0.97}
          />
          {/* Snow caps for last 3 peaks */}
          {peakX.slice(-3).map((x, i) => (
            <path
              key={x}
              d={`M${x - 30},${peakY[numPeaks - 3 + i] + 30} Q${x},${peakY[numPeaks - 3 + i] - 20} ${x + 30},${peakY[numPeaks - 3 + i] + 30}`}
              fill="#e0f2fe"
              opacity={0.9}
            />
          ))}
          {/* Path (background, full length) */}
          <path
            ref={svgRef}
            d={pathString}
            fill="none"
            stroke={THEME.path}
            strokeWidth={18}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.7}
          />
          {/* Progress path (green, up to current milestone) */}
          <path
            d={pathString}
            fill="none"
            stroke={THEME.progress}
            strokeWidth={18}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              filter: 'drop-shadow(0 0 8px #34D399)',
              strokeDasharray: svgRef.current ? svgRef.current.getTotalLength() : 1000,
              strokeDashoffset: svgRef.current ? svgRef.current.getTotalLength() - (currentMilestone / (numPeaks - 1)) * (svgRef.current.getTotalLength()) : 1000,
              transition: 'stroke-dashoffset 0.7s cubic-bezier(.4,1,.4,1)'
            }}
          />
          {/* Milestone icons and labels */}
          {milestones.map((m, i) => (
            <g key={m.name}>
              {/* Completed, current, upcoming states */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <circle
                    cx={peakX[i]}
                    cy={peakY[i]}
                    r={28}
                    fill={THEME.milestoneBg}
                    stroke={THEME.milestoneBorder}
                    strokeWidth={i === currentMilestone ? 6 : 2}
                    opacity={i <= currentMilestone ? 1 : 0.92}
                    style={{ filter: i === currentMilestone ? 'drop-shadow(0 0 16px #34D399)' : 'drop-shadow(0 2px 8px #A7F3D0)' }}
                  />
                </TooltipTrigger>
                <TooltipContent side="top" align="center">
                  <div className="text-base font-semibold mb-1">{m.name}</div>
                  <div className="text-sm text-gray-600">{m.detail}</div>
                </TooltipContent>
              </Tooltip>
              {/* Icon with colored circular border and pastel shadow */}
              <g transform={`translate(${peakX[i] - 16},${peakY[i] - 16})`}>
                <circle
                  cx={16}
                  cy={16}
                  r={16}
                  className={``}
                  fill={THEME.milestoneBg}
                  stroke={THEME.milestoneBorder}
                  strokeWidth={i === currentMilestone ? 3 : 1}
                  opacity={i <= currentMilestone ? 1 : 0.92}
                  style={{ filter: i === currentMilestone ? 'drop-shadow(0 0 8px #34D399)' : 'drop-shadow(0 2px 8px #A7F3D0)' }}
                />
                <g style={{ filter: 'drop-shadow(0 1px 2px rgba(255, 255, 255, 0.5))' }}>
                  {i < currentMilestone ? (
                    <g transform="translate(4,4)">
                      <CheckCircle width={24} height={24} stroke={THEME.icon} fill="none" />
                    </g>
                  ) : (
                    <g transform="translate(4,4)">
                      {React.cloneElement(m.icon, { width: 24, height: 24, fill: 'none', stroke: THEME.icon, style: { background: 'transparent' } })}
                    </g>
                  )}
                </g>
              </g>
              <foreignObject
                x={peakX[i] - 80}
                y={peakY[i] + 36}
                width={160}
                height={48}
                style={{ overflow: 'visible' }}
              >
                <div
                  className={`text-center text-base font-medium rounded-2xl px-3 py-1 mx-auto mt-2 shadow-lg border whitespace-nowrap ${
                    i === currentMilestone
                      ? 'ring-2 ring-emerald-300'
                      : ''
                  }`}
                  style={{ width: 110, color: THEME.label, background: THEME.milestoneBg, borderColor: THEME.milestoneBorder, letterSpacing: 0.2, boxShadow: '0 2px 12px 0 #EAF8F0', overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  {m.name}
                </div>
              </foreignObject>
            </g>
          ))}
          {/* Earth icon at current progress (animated) */}
          <g style={{ pointerEvents: 'none' }}>
            <motion.g
              animate={{
                x: earthPos.x,
                y: earthPos.y,
                filter: currentMilestone === numPeaks - 1 ? 'drop-shadow(0 0 32px #fbbf24)' : 'none'
              }}
              transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            >
              <EarthIcon className="w-16 h-16" glow={currentMilestone === numPeaks - 1} />
              {/* You are here badge - classy, elegant style */}
              <text
                x={0}
                y={-36}
                dy={-4}
                textAnchor="middle"
                className="font-serif font-medium"
                fontSize={16}
                fill="#5A8376"
                letterSpacing="0.5px"
                style={{ filter: 'drop-shadow(0 1px 2px #EAF8F0)' }}
              >
                You are here
              </text>
            </motion.g>
          </g>
          {/* Summit celebration */}
          {currentMilestone === numPeaks - 1 && (
            <g>
              <text
                x={peakX[numPeaks - 1]}
                y={peakY[numPeaks - 1] - 60}
                textAnchor="middle"
                className="font-bold text-green-700"
                fontSize={22}
              >
                Thank you for helping the planet!
              </text>
              <Sparkles x={peakX[numPeaks - 1] - 30} y={peakY[numPeaks - 1] - 80} className="text-yellow-400" />
              <Sparkles x={peakX[numPeaks - 1] + 30} y={peakY[numPeaks - 1] - 80} className="text-blue-400" />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}; 