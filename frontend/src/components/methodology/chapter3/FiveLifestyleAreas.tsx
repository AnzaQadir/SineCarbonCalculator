import { motion } from 'framer-motion';
import { Home, Car, UtensilsCrossed, Shirt, Trash2 } from 'lucide-react';

const categories = [
  {
    icon: Home,
    title: 'Home Energy',
    description: 'Heating, cooling, electricity usage',
    color: '#16626D'
  },
  {
    icon: Car,
    title: 'Transport',
    description: 'Commuting, travel, vehicle choices',
    color: '#E9839D'
  },
  {
    icon: UtensilsCrossed,
    title: 'Food & Diet',
    description: 'What you eat, where it comes from',
    color: '#87CEEB'
  },
  {
    icon: Shirt,
    title: 'Clothing',
    description: 'Shopping habits, garment choices',
    color: '#F9E28C'
  },
  {
    icon: Trash2,
    title: 'Waste',
    description: 'Recycling, disposal, consumption',
    color: '#A7D58E'
  }
];

export default function FiveLifestyleAreas() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-24 bg-gradient-to-b from-[#FDF7F0] to-white">
      <div className="max-w-7xl w-full">
        {/* Explainer text */}
        <motion.div
          className="max-w-3xl mx-auto mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-serif text-4xl md:text-5xl font-light text-[#1C1B19] mb-6">
            The Five Lifestyle Areas
          </h2>
          <p className="text-lg text-[#1C1B19]/70 leading-relaxed">
            The dashboard organizes your lifestyle into five easy-to-understand areas. 
            Together, they cover nearly everything that influences your carbon footprint.
          </p>
        </motion.div>

        {/* 5-card grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/40 shadow-lg text-center group hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{
                  backgroundColor: `${category.color}15`,
                  border: `2px solid ${category.color}30`
                }}
              >
                <category.icon
                  className="w-8 h-8"
                  style={{ color: category.color }}
                />
              </div>
              <h3 className="font-semibold text-[#1C1B19] mb-2">{category.title}</h3>
              <p className="text-sm text-[#1C1B19]/60">{category.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

