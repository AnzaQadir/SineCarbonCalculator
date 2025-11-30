import { motion } from 'framer-motion';

type Props = {
  decisionAxis: string[];
  actionAxis: string[];
};

export default function PremiumGridDiagram({ decisionAxis, actionAxis }: Props) {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-24 bg-gradient-to-b from-white to-[#FEFCF9]">
      <div className="max-w-6xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl p-12 md:p-16 shadow-2xl border border-white/40"
        >
          <h2 className="font-serif text-4xl md:text-5xl font-light text-[#1C1B19] mb-12 text-center">
            Decision × Action Grid
          </h2>

          {/* 3x3 Matrix */}
          <div className="relative">
            {/* Grid container */}
            <div className="grid grid-cols-4 gap-4">
              {/* Empty top-left corner */}
              <div />

              {/* Decision axis headers */}
              {decisionAxis.map((label, i) => (
                <motion.div
                  key={label}
                  className="text-center"
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="text-sm font-semibold text-[#16626D] mb-2">{label}</div>
                </motion.div>
              ))}

              {/* Action axis labels + grid cells */}
              {actionAxis.map((actionLabel, row) => (
                <div key={actionLabel} className="contents">
                  {/* Action label */}
                  <motion.div
                    className="flex items-center justify-end pr-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: row * 0.1 }}
                  >
                    <div className="text-sm font-semibold text-[#E9839D]">{actionLabel}</div>
                  </motion.div>

                  {/* Grid cells */}
                  {decisionAxis.map((_, col) => (
                    <motion.div
                      key={`${row}-${col}`}
                      className="aspect-square bg-gradient-to-br from-white to-[#FEFCF9] rounded-xl border-2 border-[#16626D]/20 shadow-lg flex items-center justify-center relative overflow-hidden group"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: (row * 3 + col) * 0.05 }}
                      whileHover={{ scale: 1.05, borderColor: '#16626D' }}
                    >
                      {/* Glossy overlay effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      {/* Placeholder for archetype */}
                      <div className="text-xs text-[#1C1B19]/40 font-light">Archetype</div>
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>

            {/* Decorative lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
              <motion.line
                x1="25%"
                y1="0"
                x2="25%"
                y2="100%"
                stroke="#16626D"
                strokeWidth="1"
                strokeOpacity="0.2"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
              />
              <motion.line
                x1="50%"
                y1="0"
                x2="50%"
                y2="100%"
                stroke="#16626D"
                strokeWidth="1"
                strokeOpacity="0.2"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.6 }}
              />
              <motion.line
                x1="75%"
                y1="0"
                x2="75%"
                y2="100%"
                stroke="#16626D"
                strokeWidth="1"
                strokeOpacity="0.2"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.7 }}
              />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

