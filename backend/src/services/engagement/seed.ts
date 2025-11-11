/**
 * Seed data for testing the enhanced engagement system
 */

import { RecommendationCatalog, UserPersonalityExtended } from '../../models';

/**
 * Seed recommendation catalog with dummy data
 */
export async function seedRecommendationCatalog(): Promise<void> {
  const items = [
    {
      id: 'transport.tyre_pressure.monthly',
      category: 'transport',
      title: 'Check tyre pressure this weekend',
      subtitle: '3-min save at nearest pump',
      metrics: { pkrMonth: 300, minutes: 3, kgco2eMonth: 4 },
      effort: { steps: 2, requiresPurchase: false, avgMinutesToDo: 3 },
      tags: ['transport', 'fuel', 'quick'],
      regions: ['PK'],
      active: true,
    },
    {
      id: 'food.freeze_before_spoil_basics',
      category: 'food',
      title: 'Freeze bread/rice before it spoils',
      subtitle: 'Prevent waste, save money',
      metrics: { pkrMonth: 600, minutes: 10, kgco2eMonth: 3 },
      effort: { steps: 2, requiresPurchase: false, avgMinutesToDo: 10 },
      tags: ['food', 'freeze', 'waste'],
      regions: ['PK'],
      active: true,
    },
    {
      id: 'home.laundry_cold',
      category: 'home',
      title: 'Switch laundry to cold wash',
      subtitle: 'Same clean, less energy',
      metrics: { pkrMonth: 250, minutes: 1, kgco2eMonth: 2 },
      effort: { steps: 1, requiresPurchase: false, avgMinutesToDo: 1 },
      tags: ['home', 'laundry', 'quick'],
      regions: ['PK'],
      active: true,
    },
    {
      id: 'transport.walk_short_trips',
      category: 'transport',
      title: 'Walk for trips under 2km',
      subtitle: 'Build fitness, save fuel',
      metrics: { pkrMonth: 800, minutes: 15, kgco2eMonth: 12 },
      effort: { steps: 3, requiresPurchase: false, avgMinutesToDo: 15 },
      tags: ['transport', 'walking', 'fitness'],
      regions: ['PK'],
      active: true,
    },
    {
      id: 'food.meal_plan_weekly',
      category: 'food',
      title: 'Plan meals for the week',
      subtitle: 'Reduce waste and grocery trips',
      metrics: { pkrMonth: 1200, minutes: 30, kgco2eMonth: 8 },
      effort: { steps: 4, requiresPurchase: false, avgMinutesToDo: 30 },
      tags: ['food', 'planning', 'waste'],
      regions: ['PK'],
      active: true,
    },
    {
      id: 'home.led_bulbs_replace',
      category: 'home',
      title: 'Replace incandescent bulbs with LED',
      subtitle: 'Long-term savings',
      metrics: { pkrMonth: 400, minutes: 20, kgco2eMonth: 6 },
      effort: { steps: 3, requiresPurchase: true, avgMinutesToDo: 20 },
      tags: ['home', 'energy', 'purchase'],
      regions: ['PK'],
      active: true,
    },
  ];

  for (const item of items) {
    await RecommendationCatalog.upsert({
      ...item,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  console.log(`Seeded ${items.length} recommendation catalog items`);
}

/**
 * Seed user personality extended data
 */
export async function seedUserPersonalityExtended(userId: string): Promise<void> {
  await UserPersonalityExtended.upsert({
    userId,
    archetypeScores: { Strategist: 0.6, Builder: 0.3, Trailblazer: 0.1 },
    personaVector: { TimeSaver: 0.6, MoneyMax: 0.3, EcoGuardian: 0.1, SocialSharer: 0.0 },
    weightPrefs: {
      pkr: 1.0,
      time: 1.6,
      co2: 1.0,
      effort: 1.0,
      novelty: 0.7,
      recency: 0.8,
      diversity: 0.6,
      fit: 1.0,
    },
    updatedAt: new Date(),
  });

  console.log(`Seeded personality extended data for user ${userId}`);
}

/**
 * Run all seed functions
 */
export async function seedAll(): Promise<void> {
  try {
    await seedRecommendationCatalog();
    console.log('Seed data created successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  }
}

/**
 * Seed full catalog from comprehensive JSON data
 */
export async function seedFullCatalogFromJSON(): Promise<void> {
  const { seedFullCatalog } = await import('./seedCatalog');
  await seedFullCatalog();
}

