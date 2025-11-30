import { motion } from 'framer-motion';
import { Car, UtensilsCrossed, Shirt } from 'lucide-react';

const factors = [
  {
    icon: Car,
    category: 'Transport',
    example: 'Driving 1 km',
    emission: '≈ 0.2 kg CO₂',
    color: '#16626D'
  },
  {
    icon: UtensilsCrossed,
    category: 'Food',
    example: 'Beef burger',
    emission: '≈ 2.5–3 kg CO₂',
    color: '#E9839D'
  },
  {
    icon: Shirt,
    category: 'Clothing',
    example: 'Cotton T-shirt',
    emission: '≈ 4–5 kg CO₂',
    color: '#87CEEB'
  }
];

export default function EmissionFactors() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-24 bg-gradient-to-b from-white to-[#FEFCF9]">
      <div className="max-w-7xl w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Text content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <h2 className="font-serif text-5xl md:text-6xl font-light text-[#1C1B19] mb-6">
              The Science Behind It
            </h2>
            <p className="text-lg text-[#1C1B19]/70 leading-relaxed mb-8">
              Each lifestyle area is linked to globally recognized emission factors — 
              scientific estimates of how much CO₂ is released by everyday actions. 
              These factors are based on extensive research and validated by climate scientists worldwide.
            </p>
          </motion.div>

          {/* Right: 3 Mini Cards */}
          <div className="space-y-4">
            {factors.map((factor, index) => (
              <motion.div
                key={factor.category}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg flex items-center gap-6 group hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ x: -4 }}
              >
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: `${factor.color}15`,
                    border: `2px solid ${factor.color}30`
                  }}
                >
                  <factor.icon className="w-8 h-8" style={{ color: factor.color }} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-[#1C1B19] mb-1">{factor.category}</div>
                  <div className="text-sm text-[#1C1B19]/60 mb-2">{factor.example}</div>
                  <div className="text-lg font-semibold" style={{ color: factor.color }}>
                    {factor.emission}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

