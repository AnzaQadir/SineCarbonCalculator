import { motion } from 'framer-motion';
import { useMemo } from 'react';

export default function Chapter1WhyMatters() {
  // Generate stable random values for particles
  const particles = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      size: 2 + (i % 3) * 1.5,
      left: 5 + (i * 6.5),
      top: 10 + (i * 5.5),
      xOffset: (i % 5) * 3 - 6,
      duration: 4 + (i * 0.3),
      delay: i * 0.2,
      color: i % 3 === 0 ? '#16626D' : i % 3 === 1 ? '#E9839D' : '#87CEEB'
    }));
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-24 relative overflow-hidden">
      {/* Full-bleed soft gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #FEFCF9 0%, #FDF7F0 20%, #FBEEDD 40%, #F8E0C4 60%, #F4CCA3 80%, #F0B882 100%)'
        }}
        aria-hidden
      />

      {/* Animated connection lines showing people coming together */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <svg className="w-full h-full opacity-20">
          {[0, 1, 2].map((i) => (
            <motion.path
              key={i}
              d={`M ${20 + i * 30}% ${30 + i * 20}% Q 50% 50% ${80 - i * 30}% ${70 - i * 20}%`}
              fill="none"
              stroke="#16626D"
              strokeWidth="2"
              strokeDasharray="5,5"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.3 }}
              viewport={{ once: true, margin: '-200px' }}
              transition={{ duration: 2, delay: 0.5 + i * 0.3, ease: "easeOut" }}
            />
          ))}
        </svg>
      </div>


      <div className="max-w-5xl w-full relative z-10 text-center">
        <motion.h2
          className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-[#1C1B19] mb-8 leading-tight"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        >
          Why This Matters
        </motion.h2>

        <motion.p
          className="text-xl md:text-2xl text-[#1C1B19]/70 leading-relaxed max-w-3xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Climate action isn't one-size-fits-all.
        </motion.p>

        <motion.p
          className="text-lg md:text-xl text-[#1C1B19]/70 leading-relaxed max-w-3xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          These archetypes help people see themselves in the movement — whether they're planning 
          solutions, experimenting with ideas, or taking action together.
        </motion.p>

        <motion.p
          className="text-xl md:text-2xl font-light text-[#1C1B19] leading-relaxed max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          The result: climate action that feels human, personal, and possible.
        </motion.p>
      </div>
    </section>
  );
}

