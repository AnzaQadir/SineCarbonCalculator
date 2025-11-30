import { motion } from 'framer-motion';
import { Brain, Sparkles, Users, Calendar, FlaskConical, Handshake } from 'lucide-react';

const decisionStyles = [
  { icon: Brain, label: 'Analyst', emoji: '🧠' },
  { icon: Sparkles, label: 'Intuitive', emoji: '✨' },
  { icon: Users, label: 'Connector', emoji: '🤝' }
];

const actionStyles = [
  { icon: Calendar, label: 'Planner', emoji: '🗂️' },
  { icon: FlaskConical, label: 'Experimenter', emoji: '🧪' },
  { icon: Handshake, label: 'Collaborator', emoji: '👐' }
];

export default function PersonalityMappingSection() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-24 bg-gradient-to-b from-white to-[#FEFCF9]">
      <div className="max-w-7xl w-full">
        {/* Title + Summary */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-serif text-4xl md:text-5xl font-light text-[#1C1B19] mb-6">
            Mapping Your Personality
          </h2>
          <p className="text-lg text-[#1C1B19]/70 max-w-3xl mx-auto leading-relaxed">
            Zerrah maps your quiz responses across two dimensions: how you decide and how you act. 
            Combine them, and you get one of nine Zerrah Archetypes.
          </p>
        </motion.div>

        {/* The Two Dimensions - 2x3 cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Decision Making Styles */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-xl font-semibold text-[#16626D] mb-6 text-center">
              Decision Making Styles
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {decisionStyles.map((style, index) => (
                <motion.div
                  key={style.label}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                >
                  <div className="text-3xl mb-3">{style.emoji}</div>
                  <style.icon className="w-6 h-6 mx-auto mb-2 text-[#16626D]" />
                  <div className="font-semibold text-sm text-[#1C1B19]">{style.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Action Taking Styles */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold text-[#E9839D] mb-6 text-center">
              Action Taking Styles
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {actionStyles.map((style, index) => (
                <motion.div
                  key={style.label}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                >
                  <div className="text-3xl mb-3">{style.emoji}</div>
                  <style.icon className="w-6 h-6 mx-auto mb-2 text-[#E9839D]" />
                  <div className="font-semibold text-sm text-[#1C1B19]">{style.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* The 3x3 Archetype Matrix */}
        <motion.div
          className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/40 shadow-2xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h3 className="text-2xl font-semibold text-[#1C1B19] mb-8 text-center">
            The Nine Archetypes
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {[...Array(9)].map((_, index) => (
              <motion.div
                key={index}
                className="aspect-square bg-gradient-to-br from-white to-[#FEFCF9] rounded-xl border-2 border-[#16626D]/20 shadow-lg flex items-center justify-center relative overflow-hidden group"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.05 }}
                whileHover={{ scale: 1.05, borderColor: '#16626D' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-xs text-[#1C1B19]/40 font-light">Archetype</div>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-[#1C1B19]/60 mt-8 text-sm">
            This matters because change sticks when it feels natural and aligned with you.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

