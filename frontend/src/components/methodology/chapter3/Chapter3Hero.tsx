import { motion } from 'framer-motion';
import { Home, Car, UtensilsCrossed, Shirt, Trash2 } from 'lucide-react';

const lifestyleIcons = [
  { Icon: Home, label: 'Home Energy', delay: 0 },
  { Icon: Car, label: 'Transport', delay: 0.2 },
  { Icon: UtensilsCrossed, label: 'Food & Diet', delay: 0.4 },
  { Icon: Shirt, label: 'Clothing', delay: 0.6 },
  { Icon: Trash2, label: 'Waste', delay: 0.8 }
];

export default function Chapter3Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-24 relative overflow-hidden">
      {/* Soft neutral gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #FEFCF9 0%, #FDF7F0 50%, #FBEEDD 100%)'
        }}
        aria-hidden
      />

      <div className="max-w-6xl w-full relative z-10">
        {/* Large serif title */}
        <motion.h1
          className="font-serif text-6xl md:text-7xl lg:text-8xl font-light text-[#1C1B19] mb-6 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        >
          How the Zerrah Dashboard Works
        </motion.h1>

        {/* Clean subtext */}
        <motion.p
          className="text-xl md:text-2xl text-[#1C1B19]/70 text-center max-w-3xl mx-auto leading-relaxed font-light"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Turning your everyday habits into clear, relatable climate insights.
        </motion.p>

        {/* Floating graphic - icons in separate circular orbits */}
        <div className="relative mt-20 mb-20" style={{ height: '600px', width: '100%' }}>
          {/* Central glow */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-gradient-to-br from-[#16626D]/20 to-[#E9839D]/20 blur-2xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          />

          {/* Each icon orbits independently */}
          {lifestyleIcons.map(({ Icon, label, delay }, index) => {
            const baseAngle = (index * 360) / lifestyleIcons.length;
            const radius = 220;
            const duration = 8; // Faster orbit speed

            return (
              <motion.div
                key={label}
                className="absolute"
                style={{
                  left: '50%',
                  top: '50%',
                  width: '140px',
                  height: '140px'
                }}
                animate={{
                  rotate: [0, 360],
                  x: [
                    Math.cos((baseAngle * Math.PI) / 180) * radius - 70,
                    Math.cos(((baseAngle + 360) * Math.PI) / 180) * radius - 70
                  ],
                  y: [
                    Math.sin((baseAngle * Math.PI) / 180) * radius - 70,
                    Math.sin(((baseAngle + 360) * Math.PI) / 180) * radius - 70
                  ]
                }}
                transition={{
                  duration: duration,
                  repeat: Infinity,
                  ease: "linear",
                  delay: delay
                }}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, margin: '-100px' }}
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg flex flex-col items-center gap-3 w-full h-full hover:shadow-xl transition-shadow">
                  <Icon className="w-10 h-10 text-[#16626D]" />
                  <span className="text-sm font-medium text-[#1C1B19]/70 text-center">
                    {label}
                  </span>
                </div>
              </motion.div>
            );
          })}

          {/* Motion lines connecting to center */}
          <svg
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20"
            style={{ width: '600px', height: '600px' }}
            aria-hidden
          >
            {lifestyleIcons.map((_, index) => {
              const angle = (index * 360) / lifestyleIcons.length;
              const radius = 200;
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;

              return (
                <motion.line
                  key={index}
                  x1="50%"
                  y1="50%"
                  x2={`${50 + (x / 4)}%`}
                  y2={`${50 + (y / 4)}%`}
                  stroke="#16626D"
                  strokeWidth="1.5"
                  strokeDasharray="4,4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 0.3 }}
                  viewport={{ once: false, margin: '-200px' }}
                  transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
                />
              );
            })}
          </svg>
        </div>
      </div>
    </section>
  );
}

