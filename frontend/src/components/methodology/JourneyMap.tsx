import { motion } from 'framer-motion';
import { ArrowRight, User, Sparkles, Lightbulb, RefreshCw } from 'lucide-react';

const steps = [
  { icon: User, label: 'Input', color: '#16626D' },
  { icon: Sparkles, label: 'Personality Engine', color: '#E9839D' },
  { icon: Lightbulb, label: 'Recommendation Engine', color: '#87CEEB' },
  { icon: Lightbulb, label: 'Story Engine', color: '#F9E28C' },
  { icon: RefreshCw, label: 'Reflection Loop', color: '#16626D' }
];

export default function JourneyMap() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-24 bg-gradient-to-b from-[#FDF7F0] to-white">
      <div className="max-w-7xl w-full">
        <motion.h2
          className="font-serif text-5xl md:text-6xl font-light text-[#1C1B19] mb-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Your Climate Journey
        </motion.h2>

        <div className="relative">
          {/* Journey path */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
            {steps.map((step, index) => (
              <div key={step.label} className="flex flex-col md:flex-row items-center gap-4 flex-1">
                {/* Step card */}
                <motion.div
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/40 shadow-lg text-center min-w-[180px] relative z-10"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                >
                  <step.icon
                    className="w-10 h-10 mx-auto mb-4"
                    style={{ color: step.color }}
                  />
                  <div className="font-semibold text-[#1C1B19] text-sm">{step.label}</div>
                </motion.div>

                {/* Arrow (hidden on last item) */}
                {index < steps.length - 1 && (
                  <motion.div
                    className="hidden md:block"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
                  >
                    <ArrowRight className="w-8 h-8 text-[#16626D]/40" />
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          {/* Curved connecting lines (SVG overlay) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none hidden md:block"
            aria-hidden
          >
            <defs>
              <linearGradient id="journeyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#16626D" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#E9839D" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#87CEEB" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <motion.path
              d="M 90 200 Q 300 150, 500 200 T 900 200"
              stroke="url(#journeyGradient)"
              strokeWidth="3"
              fill="none"
              strokeDasharray="5,5"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, delay: 0.5 }}
            />
          </svg>
        </div>
      </div>
    </section>
  );
}

