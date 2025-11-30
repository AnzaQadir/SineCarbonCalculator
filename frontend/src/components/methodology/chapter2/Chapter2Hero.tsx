import { motion } from 'framer-motion';
import { Brain, Sparkles, Users, Compass } from 'lucide-react';

const floatingIcons = [
  { Icon: Brain, label: 'Behavioral Science', delay: 0 },
  { Icon: Sparkles, label: 'Insights', delay: 0.15 },
  { Icon: Users, label: 'Community', delay: 0.3 },
  { Icon: Compass, label: 'Guidance', delay: 0.45 }
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

        {/* Floating icons in horizontal line */}
        <div className="relative mt-16 flex items-center justify-center gap-8 md:gap-12">
          {floatingIcons.map(({ Icon, label, delay }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -50, scale: 0.8 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6, 
                delay: delay,
                ease: [0.2, 0.8, 0.2, 1]
              }}
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 3 + delay,
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay
              }}
            >
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/40 shadow-lg flex flex-col items-center gap-2">
                <Icon className="w-8 h-8 text-[#16626D]" />
                <span className="text-xs text-[#1C1B19]/60">{label}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

