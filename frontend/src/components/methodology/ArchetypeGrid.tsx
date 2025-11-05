import { motion } from 'framer-motion';

export type ArchetypeCell = {
  id: string;
  name: string;
  decision: 'Analyst'|'Intuitive'|'Connector';
  action: 'Planner'|'Experimenter'|'Collaborator';
  tagline: string;
  blurb: string;
};

type Props = {
  cells: ArchetypeCell[]; // flat array of 9
  highlightId?: string;
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: .35, ease: [0.2,0.8,0.2,1] } }
};

export default function ArchetypeGrid({ cells, highlightId }: Props) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4 md:p-6 shadow-[0_40px_120px_-40px_rgba(0,0,0,.35)]">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {cells.map((cell) => {
          const isHighlight = cell.id === highlightId;
          return (
            <motion.button
              key={cell.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className={
                'group text-left rounded-xl border border-black/10 bg-white p-4 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] ' +
                (isHighlight ? 'ring-2 ring-[color:var(--accent)]' : 'hover:bg-[color:var(--muted)]/30')
              }
              aria-label={`${cell.name}. ${cell.tagline}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-wide text-[color:var(--ink)]/60">{cell.decision} × {cell.action}</div>
                  <div className="mt-1 font-semibold text-[color:var(--ink)]">{cell.name}</div>
                </div>
                <span className="text-xs text-[color:var(--ink)]/60">{cell.tagline}</span>
              </div>
              <p className="mt-2 text-sm text-[color:var(--ink)]/70">{cell.blurb}</p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}


