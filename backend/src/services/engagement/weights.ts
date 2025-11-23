/**
 * Derives weight preferences from persona vector and context
 * Maps 9D persona dimensions to scoring weights
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

/**
 * Maps persona dimensions to scoring weight adjustments
 * - money -> pkr (money savings importance)
 * - time -> time (time savings importance)
 * - carbon -> co2 (carbon reduction importance)
 * - comfort -> effort (inverse: higher comfort preference = lower effort penalty)
 * - health -> fit (health preference = better fit for health actions)
 * - mastery -> novelty (mastery seekers want new challenges)
 * - social -> diversity (social people want variety)
 * - certainty -> recency (certainty seekers want familiar/recent actions)
 * - streak -> recency + novelty (streak maintainers want consistency and engagement)
 */
export function weightsFromPersona(
  p: PersonaVec,
  ctx?: { sprintWeek?: boolean; monthEnd?: boolean }
): WeightPrefs {
  const w: any = { ...BASE };

  // Direct mappings
  w.pkr += p.money * 0.7;        // Money preference increases PKR weight
  w.time += p.time * 0.6;         // Time preference increases time weight
  w.co2 += p.carbon * 0.8;        // Carbon preference increases CO2 weight

  // Inverse mapping for comfort (higher comfort = lower effort penalty)
  w.effort += (1 - p.comfort) * 0.2; // Lower comfort preference = higher effort penalty

  // Health preference increases fit weight (health actions fit better)
  w.fit += p.health * 0.3;

  // Mastery preference increases novelty (mastery seekers want new challenges)
  w.novelty += p.mastery * 0.3;

  // Social preference increases diversity (social people want variety)
  w.diversity += p.social * 0.3;

  // Certainty preference increases recency (certainty seekers want familiar/recent)
  w.recency += p.certainty * 0.2;

  // Streak preference increases both recency and novelty (consistency + engagement)
  w.recency += p.streak * 0.15;
  w.novelty += p.streak * 0.1;

  // Context adjustments
  if (ctx?.sprintWeek) w.time += 0.4;
  if (ctx?.monthEnd) w.pkr += 0.2;

  return w as WeightPrefs;
}




