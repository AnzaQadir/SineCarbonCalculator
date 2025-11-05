export default function LearningLoop() {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 md:p-8 shadow-[0_40px_120px_-40px_rgba(0,0,0,.35)]">
      <h3 className="font-serif tracking-tight text-[clamp(22px,3vw,32px)] text-[color:var(--ink)]">Continuous Personalization — A system that learns with you</h3>
      <div className="prose prose-neutral max-w-none text-[color:var(--ink)]/80 mt-2">
        <p>As you reflect, log, or celebrate wins, Zerrah adapts. Its feedback loop re-weights future suggestions so each nudge fits your current life stage. The goal is not perfection — but progress you can feel.</p>
        <p className="text-[color:var(--ink)]/70 italic">Figure E – Learning Loop: Act → Reflect → Adapt → Reward</p>
        <p><strong>Why it works:</strong> Celebrating small wins sustains engagement longer than reminding people what they missed (Locke & Latham 2002).</p>
      </div>
      <h4 className="mt-3 font-semibold text-[color:var(--ink)]">Figure E — Learning Loop</h4>
      <p className="text-[14px] text-[color:var(--ink)]/70">Act → Reflect → Adapt → Reward</p>
      <div className="mt-4 flex items-center justify-between text-sm">
        {['Act','Reflect','Adapt','Reward'].map((n,i)=> (
          <div key={n} className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-[color:var(--accent)]/20 flex items-center justify-center">{n[0]}</div>
            <span>{n}</span>
            {i<3 && <span aria-hidden>→</span>}
          </div>
        ))}
      </div>
    </div>
  );
}


