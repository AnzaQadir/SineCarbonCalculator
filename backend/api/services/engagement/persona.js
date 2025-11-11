"use strict";
/**
 * Maps 10 archetypes to a 4D persona vector (TimeSaver, MoneyMax, EcoGuardian, SocialSharer)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.archetypesToPersona = archetypesToPersona;
/**
 * Bridge matrix: Maps each archetype to [TimeSaver, MoneyMax, EcoGuardian, SocialSharer] weights
 * Values sum approximately to 1 per archetype
 */
const BRIDGE = {
    Strategist: [0.45, 0.35, 0.15, 0.05],
    Trailblazer: [0.4, 0.25, 0.25, 0.1],
    Coordinator: [0.25, 0.2, 0.2, 0.35],
    Visionary: [0.2, 0.15, 0.55, 0.1],
    Explorer: [0.3, 0.15, 0.35, 0.2],
    Catalyst: [0.25, 0.1, 0.25, 0.4],
    Builder: [0.35, 0.3, 0.25, 0.1],
    Networker: [0.2, 0.2, 0.2, 0.4],
    Steward: [0.1, 0.1, 0.75, 0.05],
    Guardian: [0.25, 0.25, 0.4, 0.1], // Added Guardian as it's in the original spec
};
/**
 * Converts archetype scores to a 4D persona vector
 * @param archetypeScores - Record mapping archetype names to scores (e.g., {"Strategist": 0.6, "Builder": 0.3})
 * @returns Normalized persona vector
 */
function archetypesToPersona(archetypeScores) {
    let [t, m, e, s] = [0, 0, 0, 0];
    for (const [name, score] of Object.entries(archetypeScores)) {
        const v = BRIDGE[name];
        if (!v)
            continue;
        t += v[0] * score;
        m += v[1] * score;
        e += v[2] * score;
        s += v[3] * score;
    }
    // Normalize to ensure sum ≈ 1
    const sum = Math.max(1e-6, t + m + e + s);
    return {
        TimeSaver: t / sum,
        MoneyMax: m / sum,
        EcoGuardian: e / sum,
        SocialSharer: s / sum,
    };
}
