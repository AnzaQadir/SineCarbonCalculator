export default function NudgeCards() {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 md:p-8 shadow-[0_40px_120px_-40px_rgba(0,0,0,.35)]">
      <h3 className="font-serif tracking-tight text-[clamp(22px,3vw,32px)] text-[color:var(--ink)]">Tailoring with Nudge Theory — Small shifts, big ease</h3>
      <div className="prose prose-neutral max-w-none text-[color:var(--ink)]/80 mt-2">
        <p>Once your archetype is set, Zerrah translates behavioral science into friendly nudges (Thaler & Sunstein 2008). We re-design choices so good options feel obvious — not forced.</p>
        <p className="text-[color:var(--ink)]/70 italic">Figure C – Three Nudge Cards</p>
        <p>Each tip feels like a friend’s suggestion, not a command.</p>
      </div>
      <h4 className="mt-4 font-semibold text-[color:var(--ink)]">Figure C — Three Nudge Cards</h4>
      <div className="mt-4 grid sm:grid-cols-3 gap-3">
        {[
          ['Default','Try carpooling once this week.'],
          ['Salience','Meat-free lunch ≈ 25 cups of water.'],
          ['Social Proof','Most neighbors try this weekly.'],
        ].map(([t, d]) => (
          <div key={t} className="rounded-xl border border-black/10 bg-white p-4 transition hover:shadow-lg hover:border-[color:var(--accent)]/50">
            <div className="font-medium">{t}</div>
            <div className="text-sm text-[color:var(--ink)]/70 mt-1">{d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


