"use strict";
/**
 * Final scoring and MMR (Maximal Marginal Relevance) ranking for diverse selection
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.scoreAction = scoreAction;
exports.rankMMR = rankMMR;
const scoring_1 = require("./scoring");
function scoreAction(user, a, W, shownByCategory, now = Date.now()) {
    const U = (0, scoring_1.utilityYou)(a.metrics, W);
    const E = (0, scoring_1.effortPenalty)(a.effort);
    const F = (0, scoring_1.fitScore)(user, a);
    const N = (0, scoring_1.novelty)(user.shown, a.id);
    // Recency cooldown: combine done + dismissed (both mean "don't show soon")
    const allCompleted = [...user.shown, ...user.done, ...(user.dismissed || [])];
    const RC = (0, scoring_1.recencyCooldown)(allCompleted, a.id, now);
    // Additional penalty if recently dismissed (strong negative signal)
    const recentlyDismissed = (user.dismissed || []).some((e) => e.actionId === a.id && now - e.ts < 30 * 24 * 60 * 60 * 1000 // Last 30 days
    );
    const dismissPenalty = recentlyDismissed ? 0.3 : 0; // Reduce score by 30% if dismissed
    const D = (0, scoring_1.diversityMix)(shownByCategory, a.category);
    const utilityWeight = (W.pkr + W.time + W.co2) / 3;
    const baseScore = utilityWeight * U - W.effort * E + W.fit * F + W.novelty * N + W.recency * RC + W.diversity * D;
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
function jaccard(A, B) {
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
function rankMMR(scored, k = 3, lambda = 0.75) {
    const sel = [];
    const rest = scored.slice().sort((a, b) => b.score - a.score);
    while (sel.length < k && rest.length > 0) {
        let best = -1;
        let bestVal = -1e9;
        for (let i = 0; i < rest.length; i++) {
            const rel = rest[i].score;
            const sim = sel.length > 0
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
        }
        else {
            break; // No improvement possible
        }
    }
    return sel;
}
