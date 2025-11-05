import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const fadeItem = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.2, 0.8, 0.2, 1] } },
};

const stagger = { show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } };

export default function ZerrahDesignPrinciples() {
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgOpacity = useTransform(scrollYProgress, [0, 1], [0.12, 0.28]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  return (
    <motion.section
      id="principles"
      ref={sectionRef as any}
      aria-labelledby="principles-heading"
      className="relative overflow-hidden bg-[color:var(--canvas)]"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={stagger}
    >
      {/* Background texture / radial */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ opacity: prefersReduced ? 0.18 : bgOpacity as any }}
      >
        <div className="absolute -top-24 -left-24 h-[60vh] w-[60vh] rounded-full bg-gradient-to-br from-[color:var(--muted)]/60 to-transparent blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-[60vh] w-[60vh] rounded-full bg-gradient-to-tl from-[color:var(--accent)]/30 to-transparent blur-3xl" />
      </motion.div>

      <div className="grid md:grid-cols-2 items-center gap-12 px-6 lg:px-16 py-24">
        {/* Left column: text */}
        <div>
          <motion.div variants={fadeItem}>
            <h2 id="principles-heading" className="font-serif tracking-tight text-[clamp(28px,4vw,48px)] text-[color:var(--ink)]">
              Our Design Principles
            </h2>
            <p className="mt-3 text-[17px] leading-relaxed text-[color:var(--ink)]/80">
              How we turn science into something you can feel.
            </p>
          </motion.div>

          <div className="mt-8 space-y-4">
            {/* Principle 1 */}
            <motion.div
              variants={fadeItem}
              className="group rounded-2xl border border-black/10 bg-white p-5 shadow-[0_40px_120px_-40px_rgba(0,0,0,.35)] transition"
            >
              <div className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--muted)] text-[color:var(--ink)]/80">💛</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-[color:var(--ink)] group-hover:underline decoration-[color:var(--accent)] underline-offset-4">
                    Human Before Habit
                  </h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-[color:var(--ink)]/80">
                    We design for people, not perfection. Every interaction begins with empathy, not metrics —
                    because real change starts from feeling seen, not measured.
                  </p>
                </div>
              </div>
              {!prefersReduced && (
                <motion.div
                  aria-hidden
                  className="mt-4 h-1 w-16 rounded-full bg-[color:var(--accent)]/40"
                  animate={{ opacity: [0.4, 0.9, 0.4] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
            </motion.div>

            {/* Principle 2 */}
            <motion.div
              variants={fadeItem}
              className="group rounded-2xl border border-black/10 bg-white p-5 shadow-[0_40px_120px_-40px_rgba(0,0,0,.35)] transition"
            >
              <div className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--muted)] text-[color:var(--ink)]/80">🔬</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-[color:var(--ink)] group-hover:underline decoration-[color:var(--accent)] underline-offset-4">
                    Science in Story
                  </h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-[color:var(--ink)]/80">
                    Every nudge, archetype, and dashboard insight is grounded in behavioral and climate science —
                    from Ajzen’s Theory of Planned Behavior to Fogg’s Tiny Habits.
                  </p>
                </div>
              </div>
              {!prefersReduced && (
                <motion.div
                  aria-hidden
                  className="mt-4 h-[56px] w-full rounded-md border border-black/10"
                  initial={{ backgroundPosition: '0% 50%' }}
                  animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ backgroundImage: 'linear-gradient(90deg, rgba(0,0,0,0.05) 0%, transparent 50%, rgba(0,0,0,0.05) 100%)' }}
                />
              )}
            </motion.div>

            {/* Principle 3 */}
            <motion.div
              variants={fadeItem}
              className="group rounded-2xl border border-black/10 bg-white p-5 shadow-[0_40px_120px_-40px_rgba(0,0,0,.35)] transition"
            >
              <div className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--muted)] text-[color:var(--ink)]/80">📈</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-[color:var(--ink)] group-hover:underline decoration-[color:var(--accent)] underline-offset-4">
                    Delight in Progress
                  </h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-[color:var(--ink)]/80">
                    Zerrah celebrates small wins over big goals. Each tap, reflection, or act of care sparks momentum.
                  </p>
                </div>
              </div>
              {!prefersReduced && (
                <motion.div
                  aria-hidden
                  className="mt-4 h-16 w-16 rounded-full border border-[color:var(--accent)]/50"
                  animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
            </motion.div>

            {/* Optional quote */}
            <motion.blockquote
              variants={fadeItem}
              className="mt-6 border-l-2 border-[color:var(--accent)]/70 pl-4 italic text-[color:var(--ink)]/80"
            >
              “We don’t gamify behavior; we humanize it.”
            </motion.blockquote>
          </div>
        </div>

        {/* Right column: animated visual */}
        <div className="relative">
          <motion.div
            aria-hidden
            className="relative h-[260px] md:h-[360px] rounded-2xl border border-black/10 bg-white shadow-[0_40px_120px_-40px_rgba(0,0,0,.35)]"
          >
            <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full">
              {/* center dot */}
              <circle cx="100" cy="100" r="2" fill="currentColor" opacity="0.6" />
              {/* ripples */}
              {[26, 48, 74].map((r, i) => (
                <motion.circle
                  key={r}
                  cx="100"
                  cy="100"
                  r={r}
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity={0.35 - i * 0.08}
                  strokeWidth="1.2"
                  initial={false}
                  animate={prefersReduced ? {} : { scale: [0.98, 1.02, 0.98] }}
                  transition={{ duration: 5 + i * 0.6, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-[color:var(--accent)]"
                />
              ))}
            </svg>
            {/* orbiting dots */}
            {!prefersReduced && (
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
              >
                {[0, 120, 240].map((deg) => (
                  <div key={deg} className="absolute left-1/2 top-1/2 h-0 w-0" style={{ transform: `rotate(${deg}deg)` }}>
                    <div className="-translate-x-1/2 -translate-y-[90px]">
                      <div className="h-2 w-2 rounded-full bg-[color:var(--ink)]/60" />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div aria-hidden className="pb-6 text-center text-sm text-[color:var(--ink)]/60" style={{ opacity: prefersReduced ? 1 : hintOpacity as any }}>
        Scroll Down ↓
      </motion.div>
    </motion.section>
  );
}


