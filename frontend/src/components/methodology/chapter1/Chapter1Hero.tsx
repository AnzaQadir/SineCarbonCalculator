import { motion } from 'framer-motion';

export default function Chapter1Hero() {

  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-12 pb-24 relative overflow-hidden">
      {/* Soft cream/neutral background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #FEFCF9 0%, #FDF7F0 50%, #FBEEDD 100%)'
        }}
        aria-hidden
      />

      {/* Light dotted grid (Zerrah signature) */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle, #16626D 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
        aria-hidden
      />


      <div className="max-w-6xl w-full relative z-10">
        {/* Title + subtitle centered */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <motion.h1
            className="font-serif text-6xl md:text-7xl lg:text-8xl font-light text-[#1C1B19] mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            How we designed the Zerrah personality types
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-[#1C1B19]/70 max-w-3xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            A simple, science-backed way to understand how people think, act, and take climate action.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

