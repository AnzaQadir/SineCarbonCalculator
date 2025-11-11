/**
 * Final scoring and MMR (Maximal Marginal Relevance) ranking for diverse selection
 */

import { utilityYou, effortPenalty, fitScore, novelty, recencyCooldown, diversityMix } from './scoring';
import type { WeightPrefs } from './scoring';

export type CatalogItem = {
  id: string;
  category: string;
  metrics: any;
  effort: any;
  tags: string[];
  regions?: string[];
  title: string;
  subtitle?: string;
};

export type ScoredItem = {
  item: CatalogItem;
  score: number;
  comps: {
    U: number; // Utility
    E: number; // Effort (penalty)
    F: number; // Fit
    N: number; // Novelty
    RC: number; // Recency cooldown
    D: number; // Diversity
  };
};

export function scoreAction(
  user: {
    locale?: string;
    claims?: Record<string, any>;
    shown: { actionId: string; ts: number }[];
    done: { actionId: string; ts: number }[];
    dismissed?: { actionId: string; ts: number }[];
    snoozed?: { actionId: string; ts: number }[];
  },
  a: CatalogItem,
  W: WeightPrefs,
  shownByCategory: { actionId: string; category: string }[],
  now = Date.now()
): ScoredItem {
  const U = utilityYou(a.metrics, W);
  const E = effortPenalty(a.effort);
  const F = fitScore(user, a);
  const N = novelty(user.shown, a.id);
  
  // Recency cooldown: combine done + dismissed (both mean "don't show soon")
  const allCompleted = [...user.shown, ...user.done, ...(user.dismissed || [])];
  const RC = recencyCooldown(allCompleted, a.id, now);
  
  // Additional penalty if recently dismissed (strong negative signal)
  const recentlyDismissed = (user.dismissed || []).some(
    (e) => e.actionId === a.id && now - e.ts < 30 * 24 * 60 * 60 * 1000 // Last 30 days
  );
  const dismissPenalty = recentlyDismissed ? 0.3 : 0; // Reduce score by 30% if dismissed
  
  const D = diversityMix(shownByCategory, a.category);

  const utilityWeight = (W.pkr + W.time + W.co2) / 3;
  const baseScore =
    utilityWeight * U - W.effort * E + W.fit * F + W.novelty * N + W.recency * RC + W.diversity * D;
  
  // Apply dismiss penalty (reduces score for recently dismissed items)
  const score = baseScore * (1 - dismissPenalty);

  return {
    item: a,
    score,
    comps: { U, E, F, N, RC, D },
  };
}

/**
 * Jaccard similarity between two tag arrays
 */
function jaccard(A: string[], B: string[]): number {
  const a = new Set(A);
  const b = new Set(B);
  const inter = [...a].filter((x) => b.has(x)).length;
  const union = new Set([...A, ...B]).size;
  return union > 0 ? inter / union : 0;
}

/**
 * MMR (Maximal Marginal Relevance) selection for diverse results
 * @param scored - Array of scored items, sorted by score descending
 * @param k - Number of items to select
 * @param lambda - Balance between relevance (1.0 = pure relevance) and diversity (0.0 = pure diversity)
 */
export function rankMMR(scored: ScoredItem[], k = 3, lambda = 0.75): ScoredItem[] {
  const sel: ScoredItem[] = [];
  const rest = scored.slice().sort((a, b) => b.score - a.score);

  while (sel.length < k && rest.length > 0) {
    let best = -1;
    let bestVal = -1e9;

    for (let i = 0; i < rest.length; i++) {
      const rel = rest[i].score;
      const sim =
        sel.length > 0
          ? Math.max(...sel.map((s) => jaccard(rest[i].item.tags, s.item.tags)))
          : 0;
      const mmr = lambda * rel - (1 - lambda) * sim;

      if (mmr > bestVal) {
        bestVal = mmr;
        best = i;
      }
    }

    if (best >= 0) {
      sel.push(rest.splice(best, 1)[0]);
    } else {
      break; // No improvement possible
    }
  }

  return sel;
}

