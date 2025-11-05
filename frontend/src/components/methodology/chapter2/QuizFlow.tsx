import { motion } from 'framer-motion';

export default function QuizFlow() {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 md:p-8 shadow-[0_40px_120px_-40px_rgba(0,0,0,.35)]">
      <h3 className="font-serif tracking-tight text-[clamp(22px,3vw,32px)] text-[color:var(--ink)]">The Zerrah Quiz — Self-reflection, not a test</h3>
      <div className="prose prose-neutral max-w-none text-[color:var(--ink)]/80 mt-2">
        <p>Your journey begins with a short quiz that feels more like a mirror than a survey.</p>
        <p>A few simple questions reveal how you decide, act, and adapt to change. Behavioral researchers call this self-reporting — a proven way to surface everyday habits and motivations (Ajzen 1991).</p>
        <p className="text-[color:var(--ink)]/70 italic">Figure A – Quiz Flow: You → Questions → Insights → Archetype</p>
        <p><strong>Try this today:</strong> Notice one small decision you repeat daily — what drives it: logic, instinct, or people?</p>
      </div>
      <p className="mt-4 text-[14px] text-[color:var(--ink)]/70">You → Questions → Insights → Archetype</p>
      <div className="mt-4 flex items-center justify-between gap-3">
        {['You','Questions','Insights','Archetype'].map((n,i)=> (
          <motion.div
            key={n}
            className="flex-1 rounded-xl border border-black/10 bg-white p-4 text-center transition hover:shadow-md hover:border-[color:var(--accent)]/40"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: .35, delay: i*.05 }}
          >
            <div className="font-medium">{n}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}


