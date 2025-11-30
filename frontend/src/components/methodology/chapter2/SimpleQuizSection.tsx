import { motion } from 'framer-motion';
import { FileText, Lightbulb } from 'lucide-react';

export default function SimpleQuizSection() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-24 bg-gradient-to-b from-[#FDF7F0] to-white">
      <div className="max-w-7xl w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Explanatory text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <h2 className="font-serif text-4xl md:text-5xl font-light text-[#1C1B19] mb-8">
              A Simple Quiz With Real Science Behind It
            </h2>

            {/* Block 1 - Friendly opening */}
            <div className="mb-6">
              <p className="text-lg text-[#1C1B19]/70 leading-relaxed mb-4">
                Your journey with Zerrah starts with a short personality quiz. You'll answer a few 
                simple questions about your routines, how you make decisions, and how you approach change.
              </p>
            </div>

            {/* Block 2 - Science grounding */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg">
              <p className="text-lg text-[#1C1B19]/70 leading-relaxed">
                These questions may feel light, but they're rooted in behavioral science. Researchers 
                have used self-reporting for decades to uncover the motivations that drive our daily 
                actions (Ajzen, 1991; Theory of Planned Behavior).
              </p>
              <p className="text-lg text-[#1C1B19]/70 leading-relaxed mt-4">
                This helps Zerrah connect: <strong>what you think → what you do → where meaningful shifts can begin.</strong>
              </p>
            </div>
          </motion.div>

          {/* Right: Illustration of person interacting with quiz cards */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="space-y-4">
              {/* Quiz card stack illustration */}
              {[
                { icon: FileText, title: 'Question 1', desc: 'How do you typically make decisions?' },
                { icon: Lightbulb, title: 'Question 2', desc: 'What motivates your actions?' },
                { icon: Lightbulb, title: 'Question 3', desc: 'How do you approach change?' }
              ].map((card, index) => (
                <motion.div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  style={{
                    transform: `translateX(${index * 20}px) translateY(${index * -10}px)`,
                    zIndex: 3 - index
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#16626D]/10 flex items-center justify-center flex-shrink-0">
                      <card.icon className="w-6 h-6 text-[#16626D]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[#1C1B19] mb-1 text-sm">{card.title}</div>
                      <div className="text-xs text-[#1C1B19]/60">{card.desc}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

