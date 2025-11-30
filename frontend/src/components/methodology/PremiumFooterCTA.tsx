import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function PremiumFooterCTA() {
  return (
    <section className="min-h-[60vh] flex items-center justify-center px-6 py-24 bg-gradient-to-b from-white to-[#FEFCF9]">
      <motion.div
        className="max-w-4xl w-full"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 md:p-16 shadow-2xl border border-white/40 relative overflow-hidden">
          {/* Subtle neon teal glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#16626D]/10 via-transparent to-[#E9839D]/10 opacity-0 hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative z-10 text-center">
            <motion.h2
              className="font-serif text-4xl md:text-5xl font-light text-[#1C1B19] mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Explore Your Zerrah Type
            </motion.h2>

            <motion.p
              className="text-xl text-[#1C1B19]/70 mb-10 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Discover which archetype resonates with your approach to climate action
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link
                to="/quiz"
                className="inline-flex items-center gap-3 bg-[#16626D] text-white px-8 py-4 rounded-full text-lg font-medium shadow-lg hover:shadow-xl hover:bg-[#1a7a88] transition-all duration-300 group"
              >
                Take the Quiz
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

