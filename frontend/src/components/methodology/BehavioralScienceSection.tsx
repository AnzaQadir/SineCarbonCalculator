import { motion } from 'framer-motion';
import { Brain, Heart, Users } from 'lucide-react';

export default function BehavioralScienceSection() {
  const decisionStyles = [
    { icon: Brain, label: 'Analyst', desc: 'Data-driven decisions' },
    { icon: Heart, label: 'Intuitive', desc: 'Gut-feel guidance' },
    { icon: Users, label: 'Connector', desc: 'Community-centered' }
  ];

  const actionStyles = [
    { icon: '📅', label: 'Planner', desc: 'Structure & systems' },
    { icon: '🧪', label: 'Experimenter', desc: 'Try & iterate' },
    { icon: '🤝', label: 'Collaborator', desc: 'Together we act' }
  ];

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-24 bg-gradient-to-b from-[#FDF7F0] to-white">
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
              Rooted in Behavioral Science
            </h2>
            <p className="text-lg text-[#1C1B19]/70 leading-relaxed mb-8">
              Our framework draws from established models and adapts them to climate behavior. 
              We recognize that people vary in how they make decisions and take action.
            </p>
            <div className="space-y-6">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg">
                <h3 className="font-semibold text-[#16626D] mb-3">Decision-Making Style</h3>
                <p className="text-sm text-[#1C1B19]/70">
                  How people decide what matters to them—through analysis, intuition, or connection.
                </p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg">
                <h3 className="font-semibold text-[#E9839D] mb-3">Action-Taking Style</h3>
                <p className="text-sm text-[#1C1B19]/70">
                  How people act on those decisions—through planning, experimentation, or collaboration.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right: Visual icons */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
            className="space-y-8"
          >
            {/* Decision-making styles */}
            <div>
              <h3 className="text-sm font-semibold text-[#1C1B19]/60 uppercase tracking-wider mb-4">
                Decision-Making
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {decisionStyles.map((style, i) => (
                  <motion.div
                    key={style.label}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    whileHover={{ scale: 1.05, y: -4 }}
                  >
                    <style.icon className="w-8 h-8 mx-auto mb-3 text-[#16626D]" />
                    <div className="font-semibold text-sm text-[#1C1B19] mb-1">{style.label}</div>
                    <div className="text-xs text-[#1C1B19]/60">{style.desc}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Action-taking styles */}
            <div>
              <h3 className="text-sm font-semibold text-[#1C1B19]/60 uppercase tracking-wider mb-4">
                Action-Taking
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {actionStyles.map((style, i) => (
                  <motion.div
                    key={style.label}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: (i + 3) * 0.1 }}
                    whileHover={{ scale: 1.05, y: -4 }}
                  >
                    <div className="text-3xl mb-3">{style.icon}</div>
                    <div className="font-semibold text-sm text-[#1C1B19] mb-1">{style.label}</div>
                    <div className="text-xs text-[#1C1B19]/60">{style.desc}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

