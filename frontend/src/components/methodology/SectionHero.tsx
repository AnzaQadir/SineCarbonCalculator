import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

type Props = {
  title: string;
  lead?: string;
};

export default function SectionHero({ title, lead }: Props) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.15, 0]);

  return (
    <header id="hero" aria-labelledby="hero-heading" ref={ref} className="relative min-h-[70vh] md:min-h-[80vh] flex items-end pt-24">
      <div className="absolute inset-0 -z-10" aria-hidden>
        <div className="h-full w-full bg-[color:var(--canvas)]" />
        {!prefersReduced && (
          <motion.div
            style={{ opacity: overlayOpacity }}
            className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"
          />
        )}
      </div>
      <div className="container mx-auto max-w-5xl px-6">
        <div className="rounded-2xl border border-black/10 bg-white shadow-[0_40px_120px_-40px_rgba(0,0,0,.35)] p-8 md:p-14">
          <motion.h1
            id="hero-heading"
            className="font-serif tracking-tight text-[clamp(40px,6vw,72px)] text-[color:var(--ink)]"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {title}
          </motion.h1>
          <div className="mt-3 h-1 w-24 rounded-full bg-[color:var(--accent)]/80" aria-hidden />
          {lead && (
            <motion.p
              className="mt-4 text-[17px] leading-relaxed text-[color:var(--ink)]/80 max-w-3xl"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1], delay: 0.06 }}
            >
              {lead}
            </motion.p>
          )}
          <div className="mt-10" aria-hidden>
            <motion.div
              animate={prefersReduced ? {} : { y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-5 h-8 rounded-full border border-black/20 mx-auto flex items-start justify-center p-1"
            >
              <div className="w-1 h-2 rounded-full bg-[color:var(--ink)]/60" />
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  );
}


