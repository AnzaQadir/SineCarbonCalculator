import { motion } from 'framer-motion';
import { Brain, Heart, Users } from 'lucide-react';

const influences = [
  {
    icon: Brain,
    title: 'Behavioral Science',
    description: 'Structure, improvisation, community — understanding how people naturally approach change.',
    color: '#16626D'
  },
  {
    icon: Heart,
    title: 'Climate Psychology',
    description: 'Data, inspiration, belonging — recognizing what motivates different people to act.',
    color: '#E9839D'
  },
  {
    icon: Users,
    title: 'Practical Observation',
    description: 'Workshops, conversations, patterns — learning from real-world climate behaviors.',
    color: '#87CEEB'
  }
];

export default function Chapter1BehavioralScienceSection() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-24 relative overflow-hidden">
      {/* Soft off-white background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #FEFCF9 0%, #FDF7F0 100%)'
        }}
        aria-hidden
      />

      {/* Side vertical accent line (brand color: teal) */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#16626D] to-[#E9839D]"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
        aria-hidden
      />

      <div className="max-w-7xl w-full relative z-10 pl-12">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-serif text-4xl md:text-5xl font-light text-[#1C1B19] mb-6">
            Rooted in Behavioral Science & Practical Observation
          </h2>
        </motion.div>

        {/* Three icon-text blocks */}
        <div className="grid md:grid-cols-3 gap-8">
          {influences.map((influence, index) => (
            <motion.div
              key={influence.title}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/40 shadow-lg"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ scale: 1.05, y: -8 }}
            >
              <div
                className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{
                  backgroundColor: `${influence.color}15`,
                  border: `2px solid ${influence.color}30`
                }}
              >
                <influence.icon className="w-8 h-8" style={{ color: influence.color }} />
              </div>
              <h3 className="font-serif text-2xl font-light text-[#1C1B19] mb-4 text-center">
                {influence.title}
              </h3>
              <p className="text-[#1C1B19]/70 leading-relaxed text-center">
                {influence.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

