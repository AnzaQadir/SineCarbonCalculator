import { motion } from 'framer-motion';
import { Car, UtensilsCrossed, Coffee, Shirt } from 'lucide-react';

const equivalences = [
  {
    icon: Car,
    title: 'Kilometers Driven',
    example: 'Like driving 5,000 km',
    description: 'Your transport footprint visualized as distance',
    color: '#16626D',
    visual: '🚗'
  },
  {
    icon: UtensilsCrossed,
    title: 'Burgers Eaten',
    example: 'Like eating 200 burgers',
    description: 'Your food impact in familiar terms',
    color: '#E9839D',
    visual: '🍔'
  },
  {
    icon: Coffee,
    title: 'Coffee Cups',
    example: 'Like 1,500 cups of coffee',
    description: 'Daily habits made tangible',
    color: '#87CEEB',
    visual: '☕'
  },
  {
    icon: Shirt,
    title: 'T-Shirts',
    example: 'Like 100 cotton T-shirts',
    description: 'Your clothing footprint visualized',
    color: '#F9E28C',
    visual: '👕'
  }
];

export default function HumanEquivalences() {
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
            Making Numbers Feel Human
          </h2>
          <p className="text-lg text-[#1C1B19]/70 max-w-3xl mx-auto leading-relaxed">
            Numbers can feel distant. Zerrah translates your footprint into things you see every day — 
            kilometers driven, burgers eaten, or coffee cups used — making your impact easier to imagine.
          </p>
        </motion.div>

        {/* 4 equivalence cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {equivalences.map((item, index) => (
            <motion.div
              key={item.title}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/40 shadow-lg group hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              {/* Playful visual icon */}
              <div className="text-6xl mb-4 text-center">{item.visual}</div>

              {/* Icon */}
              <div
                className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{
                  backgroundColor: `${item.color}15`,
                  border: `2px solid ${item.color}30`
                }}
              >
                <item.icon className="w-6 h-6" style={{ color: item.color }} />
              </div>

              <h3 className="font-semibold text-[#1C1B19] mb-2 text-center">{item.title}</h3>
              <p className="text-sm font-medium text-center mb-3" style={{ color: item.color }}>
                {item.example}
              </p>
              <p className="text-xs text-[#1C1B19]/60 text-center">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

