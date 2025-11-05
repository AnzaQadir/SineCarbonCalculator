import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Slide = {
  id: string;
  title?: string;
  subtitle?: string;
  content?: React.ReactNode;
  footerNote?: string;
};

const containerCls = 'rounded-2xl border border-black/10 bg-white shadow-[0_40px_120px_-40px_rgba(0,0,0,.35)]';

const variants = {
  enter: { opacity: 0, y: 16, scale: 0.98 },
  center: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.2,0.8,0.2,1] } },
  exit: { opacity: 0, y: -16, scale: 0.98, transition: { duration: 0.3 } },
};

export default function ChapterTwoDeck() {
  const slides: Slide[] = useMemo(() => [
    {
      id: 's1',
      title: 'How Zerrah tailors climate-action recommendations for you',
      subtitle: 'From a 2-minute quiz to tiny wins that stick.',
      content: (
        <div className="mt-4">
          <div className="h-1 w-28 bg-[color:var(--accent)]/70 rounded-full" />
        </div>
      ),
      footerNote: '“I’ll show how we turn your habits into do-able climate actions.”',
    },
    {
      id: 's2',
      title: 'Why Personalization?',
      subtitle: 'People act when advice fits them.',
      content: (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {['Data-driven','Inspired','Social'].map((t) => (
            <div key={t} className={`${containerCls} p-4 text-center`}>{t}</div>
          ))}
        </div>
      ),
      footerNote: 'Different brains, different hooks—Zerrah adapts.',
    },
    {
      id: 's3',
      title: 'Figure A: The Quiz',
      subtitle: 'Self-reflection, not a test',
      content: (
        <div className="mt-6 flex items-center justify-between gap-3">
          {['You','Questions','Insights','Archetype'].map((n, i) => (
            <div key={n} className={`flex-1 ${containerCls} p-4 text-center relative`}>
              <div className="font-medium">{n}</div>
              {i<3 && <div aria-hidden className="absolute right-[-10px] top-1/2 -translate-y-1/2">→</div>}
            </div>
          ))}
        </div>
      ),
      footerNote: '(Ajzen 1991) self-reporting = reliable baseline.',
    },
    {
      id: 's4',
      title: 'Figure B: Mapping You',
      subtitle: 'Decision × Action (3×3)',
      content: (
        <div className={`mt-6 p-6 ${containerCls}`}>
          <div className="grid grid-cols-3 grid-rows-3 gap-2">
            {[...Array(9)].map((_,i)=>{
              const highlight = i===4; // Explorer example
              return (
                <div key={i} className={`h-16 rounded-lg border ${highlight?'border-[color:var(--accent)] ring-2 ring-[color:var(--accent)]/40':''} flex items-center justify-center text-sm`}>{highlight?'Explorer':'—'}</div>
              );
            })}
          </div>
        </div>
      ),
      footerNote: 'Where styles meet → your Archetype.',
    },
    {
      id: 's5',
      title: '9 Archetypes at a Glance',
      content: (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            ['Strategist','Plans with precision'],
            ['Trailblazer','Experiments with data'],
            ['Coordinator','Leads research groups'],
            ['Visionary','Turns instinct to plans'],
            ['Explorer','Learns by doing'],
            ['Catalyst','Sparks group action'],
            ['Builder','Designs clear projects'],
            ['Networker','Co-creates small tests'],
            ['Steward','Protects what matters'],
          ].map(([n,t]) => (
            <div key={n} className={`${containerCls} p-4`}>
              <div className="font-semibold">{n}</div>
              <div className="text-sm text-[color:var(--ink)]/70">{t}</div>
            </div>
          ))}
        </div>
      ),
      footerNote: 'Not labels—lenses for strengths.',
    },
    {
      id: 's6',
      title: 'Figure C: Nudge Theory',
      subtitle: 'Small shifts, big ease',
      content: (
        <div className="mt-6 grid sm:grid-cols-3 gap-3">
          {[
            ['Default','Try carpooling once this week.'],
            ['Salience','Meat-free lunch ≈ 25 cups of water.'],
            ['Social Proof','Most neighbors try this weekly.'],
          ].map(([h,b]) => (
            <div key={h} className={`${containerCls} p-4`}>
              <div className="font-medium">{h}</div>
              <div className="text-sm text-[color:var(--ink)]/70 mt-1">{b}</div>
            </div>
          ))}
        </div>
      ),
      footerNote: 'We make the good choice the easy one. (Thaler & Sunstein, 2008)',
    },
    {
      id: 's7',
      title: 'Figure D: Fogg B=MAP',
      subtitle: 'Action made doable',
      content: (
        <div className={`mt-6 p-6 ${containerCls}`}>
          <div className="grid md:grid-cols-4 gap-3 text-sm">
            <div><div className="font-medium">Motivation</div><div className="text-[color:var(--ink)]/70">Data-backed impact numbers</div></div>
            <div><div className="font-medium">Ability</div><div className="text-[color:var(--ink)]/70">One LED bulb this week</div></div>
            <div><div className="font-medium">Prompt</div><div className="text-[color:var(--ink)]/70">Next coffee, no straw</div></div>
            <div><div className="font-medium">Positive emotion</div><div className="text-[color:var(--ink)]/70">Bobo cheers 🎉</div></div>
          </div>
        </div>
      ),
      footerNote: 'Joy wires habits faster than pressure. (Fogg, 2009)',
    },
    {
      id: 's8',
      title: 'Figure E: Learning Loop',
      subtitle: 'System that adapts',
      content: (
        <div className={`mt-6 p-6 ${containerCls}`}>
          <div className="flex items-center justify-between text-sm">
            {['Act','Reflect','Adapt','Reward'].map((n,i)=> (
              <div key={n} className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-[color:var(--accent)]/20 flex items-center justify-center">{n[0]}</div>
                <span>{n}</span>
                {i<3 && <span aria-hidden>→</span>}
              </div>
            ))}
          </div>
        </div>
      ),
      footerNote: 'Progress over perfection; the app learns you. (Locke & Latham, 2002)',
    },
    {
      id: 's9',
      title: '60-Second User Journey',
      subtitle: 'Ayesha · Explorer',
      content: (
        <div className="mt-6 grid md:grid-cols-3 gap-3 text-sm">
          {[
            ['Week 1','tries carpool once','+ confetti'],
            ['Week 2','swaps one LED','₹ saved · cups of water'],
            ['Week 3','meat-free Tuesday','nudged by café prompt'],
          ].map(([w,a,m]) => (
            <div key={w} className={`${containerCls} p-4`}>
              <div className="font-medium">{w}</div>
              <div className="text-[color:var(--ink)]/80">{a}</div>
              <div className="text-[color:var(--ink)]/60">{m}</div>
            </div>
          ))}
        </div>
      ),
      footerNote: 'Small wins stacking into habit.',
    },
    {
      id: 's10',
      title: 'What this means',
      subtitle: 'Why it works',
      content: (
        <ul className="mt-4 list-disc pl-6 text-[15px] text-[color:var(--ink)]/80">
          <li>Personalized, not preachy</li>
          <li>Do-able, not daunting</li>
          <li>Adaptive, not one-and-done</li>
        </ul>
      ),
      footerNote: 'CTA: Take the Zerrah Quiz →',
    },
  ], []);

  const [index, setIndex] = useState(0);
  const prev = useCallback(() => setIndex((i)=> Math.max(0, i-1)), []);
  const next = useCallback(() => setIndex((i)=> Math.min(slides.length-1, i+1)), [slides.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'j') next();
      if (e.key === 'ArrowLeft' || e.key === 'k') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  const slide = slides[index];

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between">
        <button onClick={prev} className="px-3 py-2 text-sm rounded-md border border-black/10 bg-white hover:bg-[color:var(--muted)]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]" aria-label="Previous slide">←</button>
        <div className="text-sm text-[color:var(--ink)]/60">Slide {index+1} / {slides.length}</div>
        <button onClick={next} className="px-3 py-2 text-sm rounded-md border border-black/10 bg-white hover:bg-[color:var(--muted)]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]" aria-label="Next slide">→</button>
      </div>

      <div className="mt-4">
        <AnimatePresence mode="wait">
          <motion.div key={slide.id} variants={variants} initial="enter" animate="center" exit="exit" className={`${containerCls} p-6`}>
            {slide.title && (
              <h3 className="font-serif tracking-tight text-[clamp(22px,3vw,34px)] text-[color:var(--ink)]">{slide.title}</h3>
            )}
            {slide.subtitle && (
              <p className="mt-1 text-[15px] text-[color:var(--ink)]/70">{slide.subtitle}</p>
            )}
            {slide.content}
            {slide.footerNote && (
              <p className="mt-6 text-[13px] text-[color:var(--ink)]/60">{slide.footerNote}</p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}


