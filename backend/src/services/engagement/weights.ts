/**
 * Derives weight preferences from persona vector and context
 */

import type { PersonaVec } from './persona';
import type { WeightPrefs } from './scoring';

const BASE: WeightPrefs = {
  pkr: 1,
  time: 1,
  co2: 1,
  effort: 1,
  novelty: 0.7,
  recency: 0.8,
  diversity: 0.6,
  fit: 1,
};

const ARCH_DELTA = {
  TimeSaver: { time: +0.6, effort: +0.2, recency: +0.1 },
  MoneyMax: { pkr: +0.7, effort: +0.1 },
  EcoGuardian: { co2: +0.8, diversity: +0.1 },
  SocialSharer: { novelty: +0.2, diversity: +0.2 },
};

export function weightsFromPersona(
  p: PersonaVec,
  ctx?: { sprintWeek?: boolean; monthEnd?: boolean }
): WeightPrefs {
  const w: any = { ...BASE };

  // Apply persona-based deltas
  (Object.keys(ARCH_DELTA) as Array<keyof typeof ARCH_DELTA>).forEach((k) => {
    const alpha = p[k] as number;
    for (const kk in ARCH_DELTA[k]) {
      w[kk] += alpha * (ARCH_DELTA[k] as any)[kk];
    }
  });

  // Context adjustments
  if (ctx?.sprintWeek) w.time += 0.4;
  if (ctx?.monthEnd) w.pkr += 0.2;

  return w as WeightPrefs;
}




