import { motion } from 'framer-motion';
import { Sparkles, CheckCircle, Heart } from 'lucide-react';

const traits = [
  {
    icon: Sparkles,
    label: 'Fun & Approachable',
    emoji: '✨',
    description: 'Climate action doesn\'t have to feel heavy or serious.',
    color: '#F9E28C'
  },
  {
    icon: CheckCircle,
    label: 'Actionable',
    emoji: '✓',
    description: 'Every archetype comes with clear, personalized next steps.',
    color: '#87CEEB'
  },
  {
    icon: Heart,
    label: 'Reflective',
    emoji: '❤️',
    description: 'Designed to help you understand yourself, not judge.',
    color: '#E9839D'
  }
];

export default function ToneRelevanceSection() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-24 relative overflow-hidden">
      {/* Soft colored background panel */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #FEFCF9 0%, #FDF7F0 30%, #FBEEDD 50%, #F8E0C4 70%)'
        }}
        aria-hidden
      />

      <div className="max-w-7xl w-full relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-serif text-4xl md:text-5xl font-light text-[#1C1B19] mb-6">
            Tone & Relevance
          </h2>
          <p className="text-lg text-[#1C1B19]/70 max-w-3xl mx-auto leading-relaxed">
            What makes these archetypes feel human and meaningful
          </p>
        </motion.div>

        {/* 3 icon-text units */}
        <div className="grid md:grid-cols-3 gap-8">
          {traits.map((trait, index) => (
            <motion.div
              key={trait.label}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/40 shadow-lg text-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ scale: 1.05, y: -8 }}
            >
              <div className="text-4xl mb-4">{trait.emoji}</div>
              <div
                className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{
                  backgroundColor: `${trait.color}15`,
                  border: `2px solid ${trait.color}30`
                }}
              >
                <trait.icon className="w-8 h-8" style={{ color: trait.color }} />
              </div>
              <h3 className="font-semibold text-xl text-[#1C1B19] mb-4">{trait.label}</h3>
              <p className="text-[#1C1B19]/70 leading-relaxed">{trait.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

