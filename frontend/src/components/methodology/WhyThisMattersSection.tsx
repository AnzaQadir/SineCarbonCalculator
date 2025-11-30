import { motion } from 'framer-motion';
import { Users, BarChart3, Lightbulb } from 'lucide-react';

export default function WhyThisMattersSection() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-24 relative overflow-hidden">
      {/* Calm gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #FEFCF9 0%, #FDF7F0 30%, #FBEEDD 60%, #F8E0C4 100%)'
        }}
        aria-hidden
      />

      <div className="max-w-6xl w-full relative z-10">
        {/* Wide pull-quote */}
        <motion.div
          className="bg-white/60 backdrop-blur-xl rounded-3xl p-12 md:p-20 shadow-2xl border border-white/40"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <motion.blockquote
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-[#1C1B19] leading-tight text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            "Instead of treating climate action as one-size-fits-all, Zerrah personalizes the journey. 
            These archetypes give users a way to see themselves in the movement."
          </motion.blockquote>

          <motion.p
            className="text-xl text-[#1C1B19]/70 text-center max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            The result is a tool that makes climate action feel human, personal, and possible.
          </motion.p>
        </motion.div>

        {/* Illustration: people interacting, data + community + ideas merging */}
        <motion.div
          className="grid md:grid-cols-3 gap-8 mt-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {[
            { icon: Users, label: 'Community', color: '#16626D' },
            { icon: BarChart3, label: 'Data', color: '#E9839D' },
            { icon: Lightbulb, label: 'Ideas', color: '#87CEEB' }
          ].map((item, i) => (
            <motion.div
              key={item.label}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/40 shadow-lg"
              whileHover={{ scale: 1.05, y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <item.icon className="w-12 h-12 mx-auto mb-4" style={{ color: item.color }} />
              <div className="font-semibold text-[#1C1B19]">{item.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

