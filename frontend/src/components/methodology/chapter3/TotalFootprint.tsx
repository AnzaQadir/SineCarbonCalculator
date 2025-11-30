import { motion } from 'framer-motion';
import { Globe, MapPin, User } from 'lucide-react';

const categories = [
  { name: 'Home', value: 25, color: '#16626D' },
  { name: 'Transport', value: 30, color: '#E9839D' },
  { name: 'Food', value: 20, color: '#87CEEB' },
  { name: 'Clothing', value: 15, color: '#F9E28C' },
  { name: 'Waste', value: 10, color: '#A7D58E' }
];

const benchmarks = [
  { icon: Globe, label: 'Global average', value: '4,800 kg', color: '#16626D' },
  { icon: MapPin, label: 'Pakistan average', value: '1,200 kg', color: '#E9839D' },
  { icon: User, label: 'Your lifestyle', value: '3,200 kg', color: '#87CEEB' }
];

export default function TotalFootprint() {
  const total = categories.reduce((sum, cat) => sum + cat.value, 0);

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-24 relative overflow-hidden bg-gradient-to-b from-[#FDF7F0] to-white">
      {/* Light dotted world map pattern behind */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'radial-gradient(circle, #16626D 1px, transparent 1px)',
          backgroundSize: '40px 40px'
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
            Your Total Annual Footprint
          </h2>
          <p className="text-lg text-[#1C1B19]/70 max-w-3xl mx-auto leading-relaxed">
            Your total footprint brings everything together — expressed in kilograms of CO₂ per year. 
            We break it down by category and compare it to global and national averages so you can 
            understand where you stand and where small shifts can create big change.
          </p>
        </motion.div>

        {/* Large central number */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-8xl md:text-9xl font-light text-[#16626D] mb-4">
            {total * 100}
          </div>
          <div className="text-2xl text-[#1C1B19]/70">kg CO₂ per year</div>
        </motion.div>

        {/* Stacked bar chart */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/40 shadow-2xl mb-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h3 className="font-semibold text-[#1C1B19] mb-6 text-center">
            Breakdown by Category
          </h3>
          <div className="space-y-4">
            {categories.map((category, index) => (
              <div key={category.name} className="flex items-center gap-4">
                <div className="w-24 text-sm font-medium text-[#1C1B19]">{category.name}</div>
                <div className="flex-1 relative h-8 bg-[#1C1B19]/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: category.color }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${category.value}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 + index * 0.1, ease: "easeOut" }}
                  />
                </div>
                <div className="w-16 text-right text-sm font-semibold" style={{ color: category.color }}>
                  {category.value}%
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Benchmark comparison chips */}
        <div className="flex flex-wrap justify-center gap-4">
          {benchmarks.map((benchmark, index) => (
            <motion.div
              key={benchmark.label}
              className="bg-white/80 backdrop-blur-sm rounded-full px-6 py-4 border border-white/40 shadow-lg flex items-center gap-3 group hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <benchmark.icon className="w-5 h-5" style={{ color: benchmark.color }} />
              <div>
                <div className="text-xs text-[#1C1B19]/60">{benchmark.label}</div>
                <div className="font-semibold text-sm" style={{ color: benchmark.color }}>
                  {benchmark.value}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

