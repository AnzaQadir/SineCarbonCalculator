import React from 'react';

interface EffortMetrics {
  steps?: number;
  avgMinutesToDo?: number;
  requiresPurchase?: boolean;
}

type EffortLevel = 'low' | 'medium' | 'high';

const TOTAL_SEGMENTS = 4;

const levelPalette: Record<EffortLevel, { segment: string; label: string }> = {
  low: { segment: 'bg-emerald-400', label: 'Low effort' },
  medium: { segment: 'bg-amber-400', label: 'Moderate effort' },
  high: { segment: 'bg-rose-400', label: 'High effort' },
};

function computeEffortMeta(effort?: EffortMetrics) {
  const steps = effort?.steps ?? undefined;
  const minutes = effort?.avgMinutesToDo ?? undefined;
  const requiresPurchase = effort?.requiresPurchase ?? false;

  let level: EffortLevel = 'medium';

  if ((steps ?? 0) <= 2 && (minutes ?? 0) <= 10) {
    level = 'low';
  } else if ((steps ?? 0) >= 5 || (minutes ?? 0) >= 30) {
    level = 'high';
  }

  const palette = levelPalette[level];

  const inferredSegments = steps
    ? Math.min(TOTAL_SEGMENTS, Math.max(1, Math.round(steps / 2)))
    : level === 'low'
    ? 1
    : level === 'medium'
    ? 2
    : 4;

  const activeSegments =
    level === 'low'
      ? Math.max(1, inferredSegments)
      : level === 'medium'
      ? Math.max(2, inferredSegments)
      : Math.max(3, inferredSegments);

  const details: string[] = [];
  if (typeof steps === 'number') {
    details.push(`${steps} ${steps === 1 ? 'step' : 'steps'}`);
  }
  if (typeof minutes === 'number' && minutes > 0) {
    details.push(`≈${minutes} min`);
  }
  if (requiresPurchase) {
    details.push('may need a quick buy');
  }

  return {
    level,
    palette,
    activeSegments,
    requiresPurchase,
    detailText: details.join(' • '),
  };
}

interface EffortMeterProps {
  effort?: EffortMetrics;
  className?: string;
}

export const EffortMeter: React.FC<EffortMeterProps> = ({ effort, className }) => {
  const meta = computeEffortMeta(effort);

  return (
    <div className={`flex flex-col items-end text-right gap-1 ${className ?? ''}`}>
      <span className="text-[11px] uppercase tracking-[0.3em] text-slate-400">
        Effort • {meta.palette.label}
      </span>
      <div className="flex items-center gap-1">
        {Array.from({ length: TOTAL_SEGMENTS }).map((_, idx) => (
          <span
            key={idx}
            className={`h-1.5 w-7 rounded-full transition-colors ${
              idx < meta.activeSegments ? meta.palette.segment : 'bg-slate-200'
            }`}
          />
        ))}
      </div>
      {meta.detailText && (
        <span className="text-[11px] text-slate-400">{meta.detailText}</span>
      )}
    </div>
  );
};


