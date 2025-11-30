import { motion } from 'framer-motion';
import { Shirt, UtensilsCrossed, TreePine, TrendingUp } from 'lucide-react';

const wins = [
  {
    icon: Shirt,
    label: 'T-Shirts Saved',
    count: '50',
    color: '#16626D'
  },
  {
    icon: UtensilsCrossed,
    label: 'Burgers Avoided',
    count: '30',
    color: '#E9839D'
  },
  {
    icon: TreePine,
    label: 'Tree-Years Gained',
    count: '12',
    color: '#87CEEB'
  }
];

export default function ImpactAvoided() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-24 bg-gradient-to-b from-white to-[#FEFCF9]">
      <div className="max-w-6xl w-full">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-serif text-4xl md:text-5xl font-light text-[#1C1B19] mb-6">
            Impact Avoided
          </h2>
          <p className="text-lg text-[#1C1B19]/70 max-w-3xl mx-auto leading-relaxed">
            When you make a sustainable choice, Zerrah subtracts the emissions you saved and 
            reframes it as a personal win. Every avoided burger, saved T-shirt, or tree-year 
            gained is a meaningful step forward.
          </p>
        </motion.div>

        {/* Big bold positive number card */}
        <motion.div
          className="bg-gradient-to-br from-[#16626D]/10 via-[#E9839D]/10 to-[#87CEEB]/10 rounded-3xl p-12 md:p-16 border border-white/40 shadow-2xl mb-12"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center">
            <motion.div
              className="text-7xl md:text-8xl font-light text-[#16626D] mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              2,450
            </motion.div>
            <motion.div
              className="text-2xl text-[#1C1B19]/70 mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              kg CO₂ avoided this year
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <TrendingUp className="w-16 h-16 mx-auto text-[#16626D]" />
            </motion.div>
          </div>
        </motion.div>

        {/* Win icons grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {wins.map((win, index) => (
            <motion.div
              key={win.label}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/40 shadow-lg text-center group hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{
                  backgroundColor: `${win.color}15`,
                  border: `2px solid ${win.color}30`
                }}
              >
                <win.icon className="w-8 h-8" style={{ color: win.color }} />
              </div>
              <div className="text-4xl font-light mb-2" style={{ color: win.color }}>
                {win.count}
              </div>
              <div className="text-sm font-medium text-[#1C1B19]">{win.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

