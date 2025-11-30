import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Compass, ArrowRight } from 'lucide-react';

export default function Chapter2Closing() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-24 relative overflow-hidden">
      {/* Soft gradient block */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #FEFCF9 0%, #FDF7F0 30%, #FBEEDD 50%, #F8E0C4 70%, #F4CCA3 100%)'
        }}
        aria-hidden
      />

      <div className="max-w-5xl w-full relative z-10 text-center">
        {/* Bobo/spotlight icon */}
        <motion.div
          className="mb-12 flex justify-center"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#16626D]/20 to-[#E9839D]/20 blur-xl" />
            <Compass className="w-12 h-12 text-[#16626D] absolute inset-0 m-auto" />
          </div>
        </motion.div>

        {/* Center aligned text */}
        <motion.h2
          className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-[#1C1B19] mb-8 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Your Personality. Your Path.
        </motion.h2>

        <motion.p
          className="text-xl md:text-2xl text-[#1C1B19]/70 leading-relaxed max-w-3xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Your archetype isn't a label — it's a compass.
        </motion.p>

        <motion.p
          className="text-lg text-[#1C1B19]/60 leading-relaxed max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Zerrah helps you understand yourself, start small, and stay consistent. 
          The goal isn't perfection. It's progress that sticks.
        </motion.p>

        {/* CTA button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Link
            to="/quiz"
            className="inline-flex items-center gap-3 bg-[#16626D] text-white px-8 py-4 rounded-full text-lg font-medium shadow-lg hover:shadow-xl hover:bg-[#1a7a88] transition-all duration-300 group"
          >
            Explore Your Archetype
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

