import { motion } from 'framer-motion';
import { ArrowRight, FileText, Calculator, BarChart3 } from 'lucide-react';

const steps = [
  {
    icon: FileText,
    label: 'Quiz Responses',
    description: 'Your real habits',
    color: '#16626D'
  },
  {
    icon: Calculator,
    label: 'Emission Factors',
    description: 'Scientific data',
    color: '#E9839D'
  },
  {
    icon: BarChart3,
    label: 'Personalized Footprint',
    description: 'Your impact',
    color: '#87CEEB'
  }
];

export default function CalculationFlow() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-24 relative overflow-hidden bg-gradient-to-b from-[#FEFCF9] to-[#FDF7F0]">
      {/* Subtle dotted line pattern background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle, #16626D 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
        aria-hidden
      />

      <div className="max-w-6xl w-full relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-serif text-4xl md:text-5xl font-light text-[#1C1B19] mb-6">
            Turning Your Responses Into Numbers
          </h2>
          <p className="text-lg text-[#1C1B19]/70 max-w-3xl mx-auto leading-relaxed">
            Zerrah multiplies your real habits — how you drive, eat, shop, and live — 
            with scientifically validated emission factors to calculate your personal footprint.
          </p>
        </motion.div>

        {/* Flow diagram */}
        <div className="relative">
          {/* Curved connecting lines (SVG) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none hidden md:block"
            style={{ height: '200px' }}
            aria-hidden
          >
            <defs>
              <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#16626D" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#E9839D" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#87CEEB" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <motion.path
              d="M 100 100 Q 400 50, 700 100 T 1300 100"
              stroke="url(#flowGradient)"
              strokeWidth="3"
              fill="none"
              strokeDasharray="5,5"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, delay: 0.5 }}
            />
          </svg>

          {/* Steps */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
            {steps.map((step, index) => (
              <div key={step.label} className="flex flex-col md:flex-row items-center gap-4 flex-1">
                {/* Step card */}
                <motion.div
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/40 shadow-lg text-center min-w-[200px] relative z-10"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                >
                  <div
                    className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                    style={{
                      backgroundColor: `${step.color}15`,
                      border: `2px solid ${step.color}30`
                    }}
                  >
                    <step.icon className="w-8 h-8" style={{ color: step.color }} />
                  </div>
                  <h3 className="font-semibold text-[#1C1B19] mb-2">{step.label}</h3>
                  <p className="text-sm text-[#1C1B19]/60">{step.description}</p>
                </motion.div>

                {/* Arrow (hidden on last item) */}
                {index < steps.length - 1 && (
                  <motion.div
                    className="hidden md:block"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                  >
                    <ArrowRight className="w-8 h-8 text-[#16626D]/40" />
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

