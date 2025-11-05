import { motion, useReducedMotion } from 'framer-motion';

type GridCell = { r: number; c: number; label: string };

type Props = {
  decisionAxis: [string, string, string];
  actionAxis: [string, string, string];
  cells?: GridCell[]; // optional interactive labels
  onCellFocus?: (r: number, c: number) => void;
};

export default function GridDiagram({ decisionAxis, actionAxis, cells = [], onCellFocus }: Props) {
  const prefersReduced = useReducedMotion();

  const vLines = [1, 2].map((i) => 10 + (80 / 3) * i);
  const hLines = [1, 2].map((i) => 10 + (80 / 3) * i);

  return (
    <figure className="w-full">
      <div className="rounded-2xl border border-black/10 bg-white p-6 md:p-8 shadow-[0_40px_120px_-40px_rgba(0,0,0,.35)]">
        <div className="relative md:ml-auto md:w-[min(520px,100%)]">
          <motion.svg viewBox="0 0 100 100" className="w-full h-[260px] md:h-[360px] text-[color:var(--ink)]/50">
              {/* axes */}
              <motion.line x1="10" y1="90" x2="90" y2="90" stroke="currentColor" strokeWidth="0.6"
                initial={prefersReduced ? undefined : { pathLength: 0 }} whileInView={prefersReduced ? undefined : { pathLength: 1 }}
                transition={{ duration: .6 }} />
              <motion.line x1="10" y1="10" x2="10" y2="90" stroke="currentColor" strokeWidth="0.6"
                initial={prefersReduced ? undefined : { pathLength: 0 }} whileInView={prefersReduced ? undefined : { pathLength: 1 }}
                transition={{ duration: .6, delay: .1 }} />
              {/* grid lines */}
              {vLines.map((x, i) => (
                <motion.line key={'v'+x} x1={x} y1="10" x2={x} y2="90" stroke="currentColor" strokeWidth="0.4"
                  initial={prefersReduced ? undefined : { pathLength: 0 }} whileInView={prefersReduced ? undefined : { pathLength: 1 }}
                  transition={{ duration: .45, delay: .2 + i * .06 }} />
              ))}
              {hLines.map((y, i) => (
                <motion.line key={'h'+y} x1="10" y1={y} x2="90" y2={y} stroke="currentColor" strokeWidth="0.4"
                  initial={prefersReduced ? undefined : { pathLength: 0 }} whileInView={prefersReduced ? undefined : { pathLength: 1 }}
                  transition={{ duration: .45, delay: .26 + i * .06 }} />
              ))}
              {/* Axis titles */}
              <g aria-hidden="true" className="pointer-events-none">
                <text x="50" y="97" textAnchor="middle" fontSize="3" fill="currentColor" opacity="0.7">
                  Action-Taking Style
                </text>
                <text x="4" y="50" textAnchor="middle" fontSize="3" fill="currentColor" opacity="0.7" transform="rotate(-90 4 50)">
                  Decision-Making Style
                </text>
              </g>
              {/* Category labels */}
              <g aria-hidden="true" className="pointer-events-none" fill="currentColor" opacity="0.85" fontSize="3">
                {/* X labels under columns */}
                <text x={10 + (80/6)} y="93" textAnchor="middle">{actionAxis[0]}</text>
                <text x={10 + (80/2)} y="93" textAnchor="middle">{actionAxis[1]}</text>
                <text x={90 - (80/6)} y="93" textAnchor="middle">{actionAxis[2]}</text>
                {/* Y labels beside rows */}
                <text x="7" y={10 + (80/6)} textAnchor="end">{decisionAxis[0]}</text>
                <text x="7" y={10 + (80/2)} textAnchor="end">{decisionAxis[1]}</text>
                <text x="7" y={90 - (80/6)} textAnchor="end">{decisionAxis[2]}</text>
              </g>
          </motion.svg>
          {/* Interactive 3x3 overlay */}
          {cells.length === 9 && (
            <div className="absolute inset-[6%] grid grid-cols-3 grid-rows-3 select-none">
              {cells.map((cell) => (
                <button
                  key={`${cell.r}-${cell.c}`}
                  onFocus={() => onCellFocus && onCellFocus(cell.r, cell.c)}
                  className="relative m-[1px] rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] transition"
                  aria-label={`${decisionAxis[cell.r]} by ${actionAxis[cell.c]}: ${cell.label}`}
                  title={cell.label}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <figcaption className="sr-only">A 3 by 3 grid mapping Decision-Making Style (Analyst to Intuitive to Connector) by Action-Taking Style (Planner to Experimenter to Collaborator).</figcaption>
    </figure>
  );
}


