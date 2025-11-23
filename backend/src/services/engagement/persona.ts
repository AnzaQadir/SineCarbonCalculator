/**
 * Maps archetypes to a 9D persona vector
 * Dimensions: money, time, comfort, health, carbon, mastery, social, certainty, streak
 */

export type PersonaVec = {
  money: number;
  time: number;
  comfort: number;
  health: number;
  carbon: number;
  mastery: number;
  social: number;
  certainty: number;
  streak: number;
};

/**
 * Bridge matrix: Maps each archetype to 9-dimensional weights
 * Values sum to 1 per archetype
 */
const BRIDGE: Record<string, [number, number, number, number, number, number, number, number, number]> = {
  Catalyst: [0.10, 0.18, 0.04, 0.03, 0.10, 0.18, 0.12, 0.05, 0.20],
  Navigator: [0.15, 0.35, 0.07, 0.05, 0.10, 0.05, 0.03, 0.15, 0.05],
  Guardian: [0.10, 0.07, 0.28, 0.18, 0.12, 0.03, 0.12, 0.06, 0.04],
  Architect: [0.06, 0.08, 0.05, 0.05, 0.38, 0.14, 0.04, 0.14, 0.06],
  Ambassador: [0.10, 0.10, 0.04, 0.06, 0.12, 0.16, 0.34, 0.04, 0.04],
  Explorer: [0.08, 0.12, 0.06, 0.05, 0.14, 0.24, 0.18, 0.05, 0.08],
  Visionary: [0.08, 0.08, 0.04, 0.06, 0.30, 0.08, 0.14, 0.08, 0.14],
  Steward: [0.28, 0.24, 0.10, 0.06, 0.10, 0.03, 0.03, 0.14, 0.02],
};

/**
 * Converts archetype scores to a 9D persona vector
 * @param archetypeScores - Record mapping archetype names to scores (e.g., {"Catalyst": 0.6, "Navigator": 0.3})
 * @returns Normalized persona vector
 */
export function archetypesToPersona(archetypeScores: Record<string, number>): PersonaVec {
  let [money, time, comfort, health, carbon, mastery, social, certainty, streak] = [0, 0, 0, 0, 0, 0, 0, 0, 0];

  for (const [name, score] of Object.entries(archetypeScores)) {
    const v = BRIDGE[name];
    if (!v) continue;

    money += v[0] * score;
    time += v[1] * score;
    comfort += v[2] * score;
    health += v[3] * score;
    carbon += v[4] * score;
    mastery += v[5] * score;
    social += v[6] * score;
    certainty += v[7] * score;
    streak += v[8] * score;
  }

  // Normalize to ensure sum ≈ 1
  const sum = Math.max(1e-6, money + time + comfort + health + carbon + mastery + social + certainty + streak);
  return {
    money: money / sum,
    time: time / sum,
    comfort: comfort / sum,
    health: health / sum,
    carbon: carbon / sum,
    mastery: mastery / sum,
    social: social / sum,
    certainty: certainty / sum,
    streak: streak / sum,
  };
}




