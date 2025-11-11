/**
 * Scoring components for recommendation ranking
 * All components normalized to [0..1]
 */

export type WeightPrefs = {
  pkr: number;
  time: number;
  co2: number;
  effort: number;
  novelty: number;
  recency: number;
  diversity: number;
  fit: number;
};

const CAPS = { PKR: 2000, MIN: 120, CO2: 20 };

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const nPKR = (x = 0) => clamp01(x / CAPS.PKR);
const nMIN = (x = 0) => clamp01(x / CAPS.MIN);
const nCO2 = (x = 0) => clamp01(x / CAPS.CO2);

/**
 * Utility score based on user's preference for PKR, time, and CO2 savings
 */
export function utilityYou(
  metrics: { pkrMonth?: number; minutes?: number; kgco2eMonth?: number },
  W: WeightPrefs
): number {
  const u =
    W.pkr * nPKR(metrics.pkrMonth) +
    W.time * nMIN(metrics.minutes) +
    W.co2 * nCO2(metrics.kgco2eMonth);

  const denom = W.pkr + W.time + W.co2 || 1;
  return clamp01(u / denom);
}

/**
 * Effort penalty: higher effort = lower score
 */
export function effortPenalty(eff: {
  steps?: number;
  requiresPurchase?: boolean;
  avgMinutesToDo?: number;
}): number {
  const es = clamp01((eff.steps || 1) / 6);
  const em = clamp01((eff.avgMinutesToDo || 3) / 60);
  const p = eff.requiresPurchase ? 0.1 : 0;
  return 0.85 * (0.6 * es + 0.3 * em + p); // 0..1, higher = more effort
}

/**
 * Fit score: how well the action matches user's context (locale, tags, channel preferences)
 */
export function fitScore(
  user: { locale?: string; claims?: Record<string, any> },
  a: { regions?: string[]; tags: string[]; whatsapp?: boolean }
): number {
  // Region check
  if (a.regions && a.regions.length > 0 && user.locale && !a.regions.includes(user.locale)) {
    return 0;
  }

  // Tag overlap (from user claims/preferences)
  const userTags = new Set<string>(
    Object.values(user.claims || {}).flatMap((v) => (Array.isArray(v) ? v : []))
  );
  const overlap = a.tags.filter((t) => userTags.has(t)).length;
  const soft = clamp01(overlap / Math.max(3, a.tags.length));

  // WhatsApp preference bias
  const waBias = user.claims?.['channel.whatsapp'] ? 0.1 : 0;

  return clamp01(soft + waBias);
}

/**
 * Novelty: penalizes actions shown too frequently recently
 */
export function novelty(
  recentShown: { actionId: string; ts: number }[],
  actionId: string,
  N = 30
): number {
  const r = recentShown.slice(-N);
  const freq = r.filter((x) => x.actionId === actionId).length / Math.max(1, r.length);
  const last7Seen = recentShown.slice(-7).some((x) => x.actionId === actionId) ? 1 : 0;
  return clamp01(1 - freq - 0.15 * last7Seen);
}

/**
 * Recency cooldown: actions done recently should have lower priority
 */
export function recencyCooldown(
  all: { actionId: string; ts: number }[],
  actionId: string,
  now = Date.now()
): number {
  const last = all.filter((x) => x.actionId === actionId).sort((a, b) => b.ts - a.ts)[0];
  if (!last) return 1;

  const days = (now - last.ts) / (1000 * 60 * 60 * 24);
  const tau = 7; // half-life-ish (days)
  return clamp01(1 - Math.exp(-days / tau));
}

/**
 * Diversity mix: encourages showing different categories
 */
export function diversityMix(
  recentShown: { actionId: string; category: string }[],
  category: string,
  K = 20
): number {
  const r = recentShown.slice(-K);
  const counts = r.reduce(
    (m, c) => {
      m.set(c.category, (m.get(c.category) || 0) + 1);
      return m;
    },
    new Map<string, number>()
  );

  const maxCount = Math.max(1, ...counts.values());
  const c = counts.get(category) || 0;
  return clamp01(1 - c / maxCount);
}




