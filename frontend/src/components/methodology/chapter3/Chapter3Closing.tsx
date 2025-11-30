import { motion } from 'framer-motion';
import { Heart, Users, Lightbulb } from 'lucide-react';

export default function Chapter3Closing() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-24 relative overflow-hidden">
      {/* Soft gradient background (cream → light coral) */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #FEFCF9 0%, #FDF7F0 30%, #FBEEDD 50%, #F8E0C4 70%, #F4CCA3 100%)'
        }}
        aria-hidden
      />

      <div className="max-w-5xl w-full relative z-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {/* Illustration icons */}
          <div className="flex justify-center gap-8 mb-12">
            {[
              { Icon: Heart, color: '#E9839D' },
              { Icon: Users, color: '#16626D' },
              { Icon: Lightbulb, color: '#87CEEB' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: `${item.color}15`,
                    border: `2px solid ${item.color}30`
                  }}
                >
                  <item.Icon className="w-10 h-10" style={{ color: item.color }} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Center-aligned copy */}
          <motion.h2
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-[#1C1B19] mb-8 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            What This Means for You
          </motion.h2>

          <motion.p
            className="text-xl md:text-2xl text-[#1C1B19]/70 leading-relaxed max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Your dashboard isn't a report. It's a reflection of your choices — the meaningful, 
            imperfect, human decisions you make every day.
          </motion.p>

          <motion.p
            className="text-lg text-[#1C1B19]/60 leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Zerrah helps you see your impact, understand your strengths, and explore small actions 
            that truly matter.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

