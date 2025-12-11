import { motion } from 'framer-motion';
import { ARCHETYPES_3x3, type ArchetypeCell } from '@/data/methodology';

export default function NineArchetypesSection() {
  // Organize archetypes into 3x3 grid
  const grid: (ArchetypeCell | null)[][] = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ];

  ARCHETYPES_3x3.forEach(archetype => {
    const decisionIndex = archetype.decision === 'Analyst' ? 0 : archetype.decision === 'Intuitive' ? 1 : 2;
    const actionIndex = archetype.action === 'Planner' ? 0 : archetype.action === 'Experimenter' ? 1 : 2;
    grid[decisionIndex][actionIndex] = archetype;
  });

  const rowLabels = ['Analyst', 'Intuitive', 'Connector'];
  const colLabels = ['Planner', 'Experimenter', 'Collaborator'];

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-24 bg-gradient-to-b from-white to-[#FEFCF9]">
      <div className="max-w-7xl w-full">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-serif text-4xl md:text-5xl font-light text-[#1C1B19] mb-6">
            Building the 9 Archetypes
          </h2>
          <p className="text-lg text-[#1C1B19]/70 max-w-3xl mx-auto leading-relaxed">
            Each unique combination became one of the nine Zerrah archetypes.
          </p>
        </motion.div>

        {/* Large centered grid */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/40 shadow-2xl">
          <div className="relative">
            {/* Column labels at top */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div /> {/* Empty corner */}
              {colLabels.map((label, index) => (
                <motion.div
                  key={label}
                  className="text-center"
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="text-sm font-semibold text-[#16626D]">{label}</div>
                </motion.div>
              ))}
            </div>

            {/* Grid with row labels */}
            <div className="grid grid-cols-4 gap-4">
              {grid.map((row, rowIndex) => (
                <div key={rowIndex} className="contents">
                  {/* Row label */}
                  <motion.div
                    className="flex items-center justify-end pr-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: rowIndex * 0.1 }}
                  >
                    <div className="text-sm font-semibold text-[#E9839D]">{rowLabels[rowIndex]}</div>
                  </motion.div>

                  {/* Grid cells */}
                  {row.map((archetype, colIndex) => (
                    <motion.div
                      key={`${rowIndex}-${colIndex}`}
                      className="bg-gradient-to-br from-white to-[#FEFCF9] rounded-xl border-2 border-[#16626D]/20 shadow-lg p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group min-h-[140px]"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 + (rowIndex * 3 + colIndex) * 0.05 }}
                      whileHover={{ scale: 1.05, borderColor: '#16626D', y: -4 }}
                      style={{
                        backgroundColor: rowIndex === 0 
                          ? '#16626D08' 
                          : rowIndex === 1 
                          ? '#E9839D08' 
                          : '#87CEEB08'
                      }}
                    >
                      {/* Subtle color coding per row */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      {archetype ? (
                        <>
                          <h3 className="font-serif text-xl font-light text-[#1C1B19] mb-2">
                            {archetype.name}
                          </h3>
                          <p className="text-xs text-[#1C1B19]/60 leading-tight">
                            {archetype.blurb}
                          </p>
                        </>
                      ) : (
                        <div className="text-xs text-[#1C1B19]/40 font-light">Archetype</div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}




