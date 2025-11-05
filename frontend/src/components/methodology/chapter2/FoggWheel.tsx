import { motion } from 'framer-motion';

export default function FoggWheel() {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 md:p-8 shadow-[0_40px_120px_-40px_rgba(0,0,0,.35)]">
      <h3 className="font-serif tracking-tight text-[clamp(22px,3vw,32px)] text-[color:var(--ink)]">Tiny Habits with Fogg Behavior Design — Action made doable</h3>
      <div className="prose prose-neutral max-w-none text-[color:var(--ink)]/80 mt-2">
        <p>Real change happens when Motivation, Ability, and a Prompt meet (B = MAP; Fogg 2009). Zerrah adds a fourth ingredient: Positive emotion — because joy wires habits faster than pressure.</p>
      </div>
      <h4 className="mt-3 font-semibold text-[color:var(--ink)]">Figure D — Fogg B=MAP</h4>
      <p className="text-[14px] text-[color:var(--ink)]/70">Motivation • Ability • Prompt → Action (+ Positive emotion)</p>
      <div className="mt-4 grid md:grid-cols-4 gap-3 text-sm">
        <div><div className="font-medium">Motivation</div><div className="text-[color:var(--ink)]/70">Data-backed impact numbers</div></div>
        <div><div className="font-medium">Ability</div><div className="text-[color:var(--ink)]/70">One LED bulb this week</div></div>
        <div><div className="font-medium">Prompt</div><div className="text-[color:var(--ink)]/70">Next coffee, no straw</div></div>
        <div><div className="font-medium">Positive emotion</div><div className="text-[color:var(--ink)]/70">Bobo cheers 🎉</div></div>
      </div>
      <div className="mt-6 flex items-center justify-center">
        <motion.div className="h-24 w-24 rounded-full border border-[color:var(--accent)]/60" animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }} />
      </div>
    </div>
  );
}


