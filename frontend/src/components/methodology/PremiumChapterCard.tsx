import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

type Props = {
  chapterNumber: number;
  title: string;
  summary: string;
  id: string;
};

export default function PremiumChapterCard({ chapterNumber, title, summary, id }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.section
      id={id}
      ref={ref}
      className="min-h-screen flex items-center justify-center px-6 py-24"
      style={{
        background: 'linear-gradient(180deg, #FEFCF9 0%, #FDF7F0 100%)'
      }}
    >
      <motion.div
        className="max-w-5xl w-full"
        initial={{ opacity: 0, y: 60 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
        transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 md:p-16 shadow-2xl border border-white/40">
          {/* Chapter number */}
          <motion.div
            className="text-sm font-semibold tracking-widest text-[#16626D] uppercase mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Chapter {chapterNumber}
          </motion.div>

          {/* Title */}
          <motion.h2
            className="font-serif text-5xl md:text-6xl lg:text-7xl font-light text-[#1C1B19] mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {title}
          </motion.h2>

          {/* Soft line divider */}
          <motion.div
            className="h-px bg-gradient-to-r from-transparent via-[#16626D]/30 to-transparent mb-8"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />

          {/* Summary */}
          <motion.p
            className="text-xl md:text-2xl text-[#1C1B19]/70 leading-relaxed font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {summary}
          </motion.p>
        </div>
      </motion.div>
    </motion.section>
  );
}

