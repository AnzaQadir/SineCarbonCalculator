import { motion } from 'framer-motion';
import { Brain, Sparkles, Users, Calendar, FlaskConical, Handshake } from 'lucide-react';
import { ARCHETYPES_3x3, type ArchetypeCell } from '@/data/methodology';
import { useState } from 'react';

const decisionStyles = [
  { icon: Brain, label: 'Analyst', color: '#16626D', bgColor: '#16626D15' },
  { icon: Sparkles, label: 'Intuitive', color: '#E9839D', bgColor: '#E9839D15' },
  { icon: Users, label: 'Connector', color: '#87CEEB', bgColor: '#87CEEB15' }
];

const actionStyles = [
  { icon: Calendar, label: 'Planner', color: '#16626D', bgColor: '#16626D15' },
  { icon: FlaskConical, label: 'Experimenter', color: '#E9839D', bgColor: '#E9839D15' },
  { icon: Handshake, label: 'Collaborator', color: '#87CEEB', bgColor: '#87CEEB15' }
];

// Map archetypes to grid positions (row, col)
const getArchetypePosition = (archetype: ArchetypeCell) => {
  const decisionIndex = decisionStyles.findIndex(d => d.label === archetype.decision);
  const actionIndex = actionStyles.findIndex(a => a.label === archetype.action);
  return { row: decisionIndex, col: actionIndex };
};

export default function CoreDimensionsSection() {
  const [hoveredArchetype, setHoveredArchetype] = useState<string | null>(null);

  // Create 3x3 grid with archetypes
  const grid: (ArchetypeCell | null)[][] = Array(3).fill(null).map(() => Array(3).fill(null));
  ARCHETYPES_3x3.forEach(archetype => {
    const { row, col } = getArchetypePosition(archetype);
    grid[row][col] = archetype;
  });

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-24 bg-gradient-to-b from-[#FDF7F0] to-white">
      <div className="max-w-7xl w-full">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <h2 className="font-serif text-4xl md:text-5xl font-light text-[#1C1B19] mb-8">
              Framing the Core Dimensions
            </h2>

            {/* Block 1 - The idea */}
            <div className="mb-6">
              <p className="text-lg text-[#1C1B19]/70 leading-relaxed mb-6">
                We started by identifying two dimensions that shape how people approach climate action:
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-xl" style={{ backgroundColor: decisionStyles[0].bgColor }}>
                  <div className="flex-shrink-0 mt-1">
                    <Brain className="w-5 h-5" style={{ color: decisionStyles[0].color }} />
                  </div>
                  <div>
                    <span className="font-semibold text-[#16626D] block mb-1">Decision-Making Style</span>
                    <span className="text-[#1C1B19]/70">Analyst, Intuitive, Connector</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl" style={{ backgroundColor: actionStyles[0].bgColor }}>
                  <div className="flex-shrink-0 mt-1">
                    <Calendar className="w-5 h-5" style={{ color: actionStyles[0].color }} />
                  </div>
                  <div>
                    <span className="font-semibold text-[#E9839D] block mb-1">Action-Taking Style</span>
                    <span className="text-[#1C1B19]/70">Planner, Experimenter, Collaborator</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Block 2 - Why it matters */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg">
              <p className="text-lg text-[#1C1B19]/70 leading-relaxed">
                Together, they form a simple <strong className="text-[#16626D]">3×3 matrix</strong> — a clear way to represent nine distinct climate mindsets.
              </p>
            </div>
          </motion.div>

          {/* Right: Enhanced Diagram */}
          <div className="relative">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 md:p-8 border-2 border-white/60 shadow-2xl relative overflow-hidden">
              {/* Subtle background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#16626D]/5 via-transparent to-[#E9839D]/5 pointer-events-none" />

              {/* Decision-Making axis (vertical, left side) */}
              <div className="absolute left-0 top-0 bottom-0 w-20 md:w-24 flex flex-col pl-2" style={{ paddingTop: '48px' }}>
                {decisionStyles.map((style, index) => (
                  <div
                    key={style.label}
                    className="flex items-center justify-center p-2 rounded-xl transition-all"
                    style={{ 
                      backgroundColor: hoveredArchetype ? 'transparent' : style.bgColor,
                      height: 'calc((100% - 48px) / 3)'
                    }}
                  >
                    <span className="text-xs md:text-sm font-semibold text-[#1C1B19] text-center leading-tight">{style.label}</span>
                  </div>
                ))}
              </div>

              {/* Action-Taking axis (horizontal, top) */}
              <div className="absolute top-0 left-20 md:left-24 right-0 h-12 flex items-center gap-2 md:gap-3 pl-2 md:pl-4">
                {actionStyles.map((style) => (
                  <div
                    key={style.label}
                    className="flex items-center justify-center flex-1 p-2 rounded-xl transition-all"
                    style={{ backgroundColor: hoveredArchetype ? 'transparent' : style.bgColor }}
                  >
                    <span className="text-xs font-semibold text-[#1C1B19] text-center leading-tight">{style.label}</span>
                  </div>
                ))}
              </div>

              {/* Grid area with actual archetypes */}
              <div className="ml-20 md:ml-24 mt-12 grid grid-cols-3 gap-2 md:gap-3">
                {grid.flat().map((archetype, index) => {
                  const row = Math.floor(index / 3);
                  const col = index % 3;
                  const decisionStyle = decisionStyles[row];
                  const actionStyle = actionStyles[col];
                  const isHovered = hoveredArchetype === archetype?.id;

                  return (
                    <div
                      key={index}
                      className="aspect-square rounded-xl border-2 shadow-lg flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer transition-all"
                      style={{
                        borderColor: isHovered 
                          ? decisionStyle.color 
                          : archetype 
                          ? `${decisionStyle.color}30` 
                          : '#E5E5E5',
                        background: archetype 
                          ? `linear-gradient(135deg, ${decisionStyle.bgColor}, ${actionStyle.bgColor})`
                          : 'linear-gradient(135deg, #FEFCF9, #FDF7F0)'
                      }}
                      onMouseEnter={() => archetype && setHoveredArchetype(archetype.id)}
                      onMouseLeave={() => setHoveredArchetype(null)}
                    >
                      {/* Gradient overlay */}
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: `linear-gradient(135deg, ${decisionStyle.color}15, ${actionStyle.color}15)`
                        }}
                      />
                      
                      {archetype ? (
                        <>
                          {/* Archetype name */}
                          <div className="relative z-10 text-center px-2">
                            <div className="text-xs md:text-sm font-bold text-[#1C1B19] mb-1 leading-tight">
                              {archetype.name}
                            </div>
                            <div className="text-[10px] md:text-xs text-[#1C1B19]/60 font-medium leading-tight">
                              {archetype.tagline}
                            </div>
                          </div>

                          {/* Hover tooltip */}
                          {isHovered && (
                            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-[#1C1B19] text-white text-[10px] px-3 py-2 rounded-lg shadow-xl z-20 whitespace-nowrap">
                              {archetype.blurb}
                              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1C1B19] rotate-45" />
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-[10px] text-[#1C1B19]/30 font-light">—</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

