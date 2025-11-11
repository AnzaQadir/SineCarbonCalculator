"use strict";
/**
 * Derives weight preferences from persona vector and context
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.weightsFromPersona = weightsFromPersona;
const BASE = {
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
function weightsFromPersona(p, ctx) {
    const w = { ...BASE };
    // Apply persona-based deltas
    Object.keys(ARCH_DELTA).forEach((k) => {
        const alpha = p[k];
        for (const kk in ARCH_DELTA[k]) {
            w[kk] += alpha * ARCH_DELTA[k][kk];
        }
    });
    // Context adjustments
    if (ctx?.sprintWeek)
        w.time += 0.4;
    if (ctx?.monthEnd)
        w.pkr += 0.2;
    return w;
}
