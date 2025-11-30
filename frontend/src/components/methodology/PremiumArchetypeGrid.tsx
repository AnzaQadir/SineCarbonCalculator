import { motion } from 'framer-motion';
import { type ArchetypeCell } from './ArchetypeGrid';

type Props = {
  cells: ArchetypeCell[];
};

export default function PremiumArchetypeGrid({ cells }: Props) {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-24 bg-gradient-to-b from-[#FEFCF9] to-white">
      <div className="max-w-7xl w-full">
        <motion.h2
          className="font-serif text-5xl md:text-6xl font-light text-[#1C1B19] mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          The Nine Archetypes
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cells.map((cell, index) => (
            <motion.div
              key={cell.id}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/40 shadow-lg hover:shadow-2xl transition-all duration-300"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.2, 0.8, 0.2, 1] }}
              whileHover={{ y: -8, borderColor: '#16626D' }}
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#16626D]/5 to-[#E9839D]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10">
                {/* Header */}
                <div className="text-xs uppercase tracking-wider text-[#16626D] mb-2 font-semibold">
                  {cell.decision} × {cell.action}
                </div>

                {/* Subtitle */}
                <div className="text-sm text-[#1C1B19]/60 mb-4 italic">
                  {cell.tagline}
                </div>

                {/* Title */}
                <h3 className="font-serif text-3xl font-light text-[#1C1B19] mb-4">
                  {cell.name}
                </h3>

                {/* Description */}
                <p className="text-base text-[#1C1B19]/70 leading-relaxed">
                  {cell.blurb}
                </p>
              </div>

              {/* Decorative corner accent */}
              <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#16626D]/20 group-hover:bg-[#16626D]/40 transition-colors" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

