import { motion } from 'framer-motion';
import { Settings, Eye, Users } from 'lucide-react';

const nudgeTypes = [
  {
    icon: Settings,
    title: 'Default Nudges',
    description: 'Simplest starting point; reduce friction.',
    color: '#16626D'
  },
  {
    icon: Eye,
    title: 'Salience Nudges',
    description: 'Make impact visible through everyday equivalents.',
    color: '#E9839D'
  },
  {
    icon: Users,
    title: 'Social Proof Nudges',
    description: 'Show what people like you are doing.',
    color: '#87CEEB'
  }
];

export default function NudgeTheorySection() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-24 relative overflow-hidden">
      {/* Soft colored section break (light blush) */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #FEFCF9 0%, #FDF7F0 30%, #FBEEDD 50%, #F8E0C4 70%, #F4CCA3 100%)'
        }}
        aria-hidden
      />

      <div className="max-w-7xl w-full relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-serif text-4xl md:text-5xl font-light text-[#1C1B19] mb-6">
            Tailoring Recommendations Using Nudge Theory
          </h2>
          <p className="text-lg text-[#1C1B19]/70 max-w-3xl mx-auto leading-relaxed">
            Zerrah uses insights from Nudge Theory to make your next steps feel easy, not overwhelming. 
            Small tweaks in how choices appear — what psychologists call choice architecture — gently 
            guide you toward better habits while keeping your freedom intact.
          </p>
        </motion.div>

        {/* Three vertical cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {nudgeTypes.map((nudge, index) => (
            <motion.div
              key={nudge.title}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/40 shadow-lg text-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ scale: 1.05, y: -8 }}
            >
              <div
                className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{
                  backgroundColor: `${nudge.color}15`,
                  border: `2px solid ${nudge.color}30`
                }}
              >
                <nudge.icon className="w-8 h-8" style={{ color: nudge.color }} />
              </div>
              <h3 className="font-semibold text-xl text-[#1C1B19] mb-4">{nudge.title}</h3>
              <p className="text-[#1C1B19]/70 leading-relaxed">{nudge.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Side illustration - gentle guiding hand metaphor */}
        <motion.div
          className="absolute right-10 top-1/2 -translate-y-1/2 opacity-10 hidden lg:block"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 0.1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          aria-hidden
        >
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
            <path
              d="M100 50 Q120 80, 140 100 Q120 120, 100 150"
              stroke="#16626D"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="100" cy="50" r="8" fill="#16626D" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}

