import { motion } from 'framer-motion';
import { Brain, Sparkles, Users, Compass } from 'lucide-react';

const floatingIcons = [
  { Icon: Brain, label: 'Behavioral Science', delay: 0, x: -100, y: -80 },
  { Icon: Sparkles, label: 'Insights', delay: 0.2, x: 100, y: -60 },
  { Icon: Users, label: 'Community', delay: 0.4, x: -80, y: 60 },
  { Icon: Compass, label: 'Guidance', delay: 0.6, x: 80, y: 80 }
];

export default function Chapter2Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-24 relative overflow-hidden">
      {/* Soft cream background with light pastel gradients */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #FEFCF9 0%, #FDF7F0 30%, #FBEEDD 60%, #F8E0C4 100%)'
        }}
        aria-hidden
      />

      <div className="max-w-6xl w-full relative z-10">
        {/* Wide hero card */}
        <motion.div
          className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 md:p-16 shadow-2xl border border-white/40"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {/* Serif title */}
          <motion.h1
            className="font-serif text-6xl md:text-7xl lg:text-8xl font-light text-[#1C1B19] mb-6 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            The Zerrah Quiz
          </motion.h1>

          {/* Clean subtitle */}
          <motion.p
            className="text-2xl md:text-3xl text-[#1C1B19]/70 text-center mb-8 leading-relaxed font-light"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            How Zerrah tailors climate action recommendations for you.
          </motion.p>

          {/* Intro sentence */}
          <motion.p
            className="text-lg md:text-xl text-[#1C1B19]/60 text-center max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            A short, science-backed quiz that reveals the mindset behind your everyday choices — 
            the foundation of your personalized climate journey.
          </motion.p>
        </motion.div>

        {/* Floating icons */}
        <div className="relative mt-16 h-64">
          {floatingIcons.map(({ Icon, label, delay, x, y }) => (
            <motion.div
              key={label}
              className="absolute"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`
              }}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: delay }}
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 3 + delay,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/40 shadow-lg flex flex-col items-center gap-2">
                <Icon className="w-8 h-8 text-[#16626D]" />
                <span className="text-xs text-[#1C1B19]/60">{label}</span>
              </div>
            </motion.div>
          ))}

          {/* Subtle curved lines indicating personality mapping */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
            aria-hidden
          >
            <motion.path
              d="M 50% 50% Q 30% 30%, 20% 20%"
              stroke="#16626D"
              strokeWidth="2"
              fill="none"
              strokeDasharray="4,4"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.3 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.8 }}
            />
            <motion.path
              d="M 50% 50% Q 70% 30%, 80% 20%"
              stroke="#E9839D"
              strokeWidth="2"
              fill="none"
              strokeDasharray="4,4"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.3 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 1 }}
            />
          </svg>
        </div>
      </div>
    </section>
  );
}

