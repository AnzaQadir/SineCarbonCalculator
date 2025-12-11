import { motion } from 'framer-motion';
import { FileSearch, Compass, Shield } from 'lucide-react';

const sampleArchetypes = [
  {
    icon: FileSearch,
    name: 'Strategist',
    description: 'Gathers facts and maps every step for precise action.',
    color: '#16626D'
  },
  {
    icon: Compass,
    name: 'Explorer',
    description: 'Learns by trying — jumps in headfirst and adapts as they go.',
    color: '#E9839D'
  },
  {
    icon: Shield,
    name: 'Steward',
    description: 'Protects what matters with others — joins forces for shared care.',
    color: '#87CEEB'
  }
];

export default function SampleArchetypeCards() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-24 bg-gradient-to-b from-[#FDF7F0] to-white">
      <div className="max-w-7xl w-full">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-serif text-4xl md:text-5xl font-light text-[#1C1B19] mb-4 text-center">
            For Example
          </h2>
          <p className="text-lg text-[#1C1B19]/70 text-center max-w-2xl mx-auto">
            Each archetype represents a unique approach to climate action
          </p>
        </motion.div>

        {/* 3 horizontal story cards */}
        <div className="space-y-6">
          {sampleArchetypes.map((archetype, index) => (
            <motion.div
              key={archetype.name}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/40 shadow-lg flex items-center gap-8 group hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ scale: 1.02, x: 8 }}
            >
              {/* Left: Archetype name */}
              <div className="flex-shrink-0">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: `${archetype.color}15`,
                    border: `2px solid ${archetype.color}30`
                  }}
                >
                  <archetype.icon className="w-10 h-10" style={{ color: archetype.color }} />
                </div>
              </div>

              {/* Middle: Content */}
              <div className="flex-1">
                <h3 className="font-serif text-3xl font-light text-[#1C1B19] mb-2">
                  {archetype.name}
                </h3>
                <p className="text-lg text-[#1C1B19]/70 leading-relaxed">
                  {archetype.description}
                </p>
              </div>

              {/* Right: Mini illustration / soft glow */}
              <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <div
                  className="w-16 h-16 rounded-full blur-xl"
                  style={{ backgroundColor: `${archetype.color}30` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}




