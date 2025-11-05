import { motion } from 'framer-motion';

export default function PersonalityMatrix() {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 md:p-8 shadow-[0_40px_120px_-40px_rgba(0,0,0,.35)]">
      <h3 className="font-serif tracking-tight text-[clamp(22px,3vw,32px)] text-[color:var(--ink)]">Mapping Your Personality — The 3 × 3 Matrix</h3>
      <div className="prose prose-neutral max-w-none text-[color:var(--ink)]/80 mt-2">
        <p>Zerrah plots your answers across two axes:</p>
        <ul>
          <li>Decision Style (Analyst · Intuitive · Connector)</li>
          <li>Action Style (Planner · Experimenter · Collaborator)</li>
        </ul>
        <p>Where those lines meet sits your Zerrah Archetype — one of nine unique blends that show why you act, not just how. It’s a gentle invitation to use your natural strengths — whether you plan, explore, or rally others.</p>
        <p className="text-[color:var(--ink)]/70 italic">Figure B – Decision × Action Grid. Each cell = a distinct archetype (e.g., Analyst + Planner = Strategist; Intuitive + Experimenter = Explorer).</p>
        <p>In short: You see yourself not as a typecast person, but as a pattern of strengths ready to grow.</p>
      </div>
      <div className="mt-4 grid grid-cols-3 grid-rows-3 gap-2">
        {[...Array(9)].map((_,i)=> (
          <motion.div
            key={i}
            className={`h-16 rounded-lg border ${i===4? 'border-[color:var(--accent)] ring-2 ring-[color:var(--accent)]/40 bg-[color:var(--accent)]/5':''} flex items-center justify-center text-sm transition hover:shadow-sm`}
            initial={{ opacity: 0, scale: .96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: .2 }}
          >
            {i===4? 'Explorer' : '—'}
          </motion.div>
        ))}
      </div>
    </div>
  );
}


