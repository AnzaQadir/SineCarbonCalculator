import { motion } from 'framer-motion';

type Props = {
  leftTitle: string;
  leftPoints: string[];
  rightTitle: string;
  rightPoints: string[];
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: .4, ease: [0.2,0.8,0.2,1] } }
};

export default function ResearchSplit({ leftTitle, leftPoints, rightTitle, rightPoints }: Props) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 md:p-8 shadow-[0_40px_120px_-40px_rgba(0,0,0,.35)]">
      <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-start">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--muted)] text-[color:var(--ink)]/80">🧠</span>
            <h4 className="font-semibold text-[color:var(--ink)]">{leftTitle}</h4>
          </div>
          <ul className="mt-3 list-disc pl-6 text-[15px] text-[color:var(--ink)]/80">
            {leftPoints.map((p) => <li key={p} className="mb-1">{p}</li>)}
          </ul>
        </motion.div>
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--muted)] text-[color:var(--ink)]/80">💬</span>
            <h4 className="font-semibold text-[color:var(--ink)]">{rightTitle}</h4>
          </div>
          <ul className="mt-3 list-disc pl-6 text-[15px] text-[color:var(--ink)]/80">
            {rightPoints.map((p) => <li key={p} className="mb-1">{p}</li>)}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}


