import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function PremiumHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 50]);

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #FEFCF9 0%, #FDF7F0 50%, #FBEEDD 100%)'
      }}
    >
      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 3 === 0 ? '#16626D' : i % 3 === 1 ? '#E9839D' : '#87CEEB',
              opacity: 0.15
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Soft curve lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20" aria-hidden>
        <motion.path
          d="M0,200 Q400,100 800,200 T1600,200"
          stroke="#16626D"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.3 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <motion.path
          d="M0,400 Q600,300 1200,400 T2400,400"
          stroke="#E9839D"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.2 }}
          transition={{ duration: 2.5, ease: "easeInOut", delay: 0.3 }}
        />
      </svg>

      {/* Main content */}
      <motion.div
        style={{ opacity, y }}
        className="relative z-10 max-w-6xl mx-auto px-6 text-center"
      >
        {/* 9-square matrix icon */}
        <motion.div
          className="mb-12 flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className="relative">
            <div className="grid grid-cols-3 gap-2 p-6 bg-white/60 backdrop-blur-md rounded-3xl shadow-xl border border-white/40">
              {[...Array(9)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#16626D]/20 to-[#E9839D]/20 border border-[#16626D]/30"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.05, duration: 0.4 }}
                />
              ))}
            </div>
            {/* Soft glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#16626D]/20 via-[#E9839D]/10 to-transparent rounded-3xl blur-2xl -z-10" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="font-serif text-7xl md:text-8xl lg:text-9xl font-light tracking-tight text-[#1C1B19] mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
        >
          Zerrah Methodology
        </motion.h1>

        {/* Subline */}
        <motion.p
          className="text-xl md:text-2xl text-[#1C1B19]/70 max-w-4xl mx-auto leading-relaxed font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        >
          How we blend behavioral science, climate psychology, and thousands of real-world habits to personalize your climate journey
        </motion.p>

        {/* Abstract flowing shapes */}
        <div className="absolute top-20 right-10 w-64 h-64 opacity-30" aria-hidden>
          <motion.div
            className="absolute w-full h-full rounded-full bg-gradient-to-br from-[#16626D]/30 to-[#E9839D]/20 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 20, 0],
              y: [0, -20, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <div className="absolute bottom-20 left-10 w-48 h-48 opacity-25" aria-hidden>
          <motion.div
            className="absolute w-full h-full rounded-full bg-gradient-to-br from-[#87CEEB]/30 to-[#F9E28C]/20 blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -15, 0],
              y: [0, 15, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-[#16626D]/40 flex items-start justify-center p-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-[#16626D]/60"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
        <span className="text-xs text-[#16626D]/60 font-light tracking-wider">SCROLL</span>
      </motion.div>
    </section>
  );
}

