import { motion } from 'framer-motion';
import { TrendingUp, Target, Bell, Heart } from 'lucide-react';

const foggElements = [
  {
    icon: TrendingUp,
    label: 'Motivation',
    description: 'Matching tips to what drives you',
    examples: ['Data', 'Community', 'Emotion'],
    color: '#16626D'
  },
  {
    icon: Target,
    label: 'Ability',
    description: 'Breaking actions into tiny, doable steps',
    examples: ['Small steps', 'Tiny tasks'],
    color: '#E9839D'
  },
  {
    icon: Bell,
    label: 'Prompt',
    description: 'Tying them to your real routines',
    examples: ['Routine triggers'],
    color: '#87CEEB'
  }
];

export default function FoggModelSection() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-24 bg-gradient-to-b from-[#FDF7F0] to-white">
      <div className="max-w-7xl w-full">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-serif text-4xl md:text-5xl font-light text-[#1C1B19] mb-6">
            From Intention to Action
          </h2>
          <p className="text-lg text-[#1C1B19]/70 max-w-3xl mx-auto leading-relaxed mb-4">
            The Fogg Behavior Model (B=MAP) tells us that action happens when Motivation, Ability, 
            and Prompt come together.
          </p>
          <p className="text-lg text-[#1C1B19]/70 max-w-3xl mx-auto leading-relaxed">
            <strong>Emotion — not willpower — is what wires new habits.</strong>
          </p>
        </motion.div>

        {/* Flow diagram: Motivation → Ability → Prompt */}
        <div className="relative mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {foggElements.map((element, index) => (
              <div key={element.label} className="flex flex-col md:flex-row items-center gap-4 flex-1">
                {/* Element card */}
                <motion.div
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/40 shadow-lg text-center min-w-[200px]"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                >
                  <div
                    className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                    style={{
                      backgroundColor: `${element.color}15`,
                      border: `2px solid ${element.color}30`
                    }}
                  >
                    <element.icon className="w-8 h-8" style={{ color: element.color }} />
                  </div>
                  <h3 className="font-semibold text-xl text-[#1C1B19] mb-2">{element.label}</h3>
                  <p className="text-sm text-[#1C1B19]/70 mb-3">{element.description}</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {element.examples.map((ex, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: `${element.color}15`,
                          color: element.color
                        }}
                      >
                        {ex}
                      </span>
                    ))}
                  </div>
                </motion.div>

                {/* Arrow (hidden on last item) */}
                {index < foggElements.length - 1 && (
                  <motion.div
                    className="hidden md:block"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                  >
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <path
                        d="M10 20 L30 20 M25 15 L30 20 L25 25"
                        stroke="#16626D"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          {/* Soft curved arrows connecting elements */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none hidden md:block"
            style={{ height: '200px' }}
            aria-hidden
          >
            <motion.path
              d="M 150 100 Q 300 50, 450 100"
              stroke="#16626D"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,5"
              strokeOpacity="0.3"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, delay: 0.5 }}
            />
          </svg>
        </div>

        {/* Tiny Habits micro card examples */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {['Take the stairs', 'Use a reusable cup', 'Walk 5 minutes'].map((habit, index) => (
            <motion.div
              key={habit}
              className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/40 shadow-md text-center"
              whileHover={{ scale: 1.05 }}
            >
              <Heart className="w-5 h-5 mx-auto mb-2 text-[#E9839D]" />
              <div className="text-sm font-medium text-[#1C1B19]">{habit}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

