import { Catalog } from '../types/recommendationCatalog';

export const foodCatalog: Catalog = {
  catalogVersion: 'v1.0',
  domains: ['transport', 'food', 'home', 'clothing', 'waste'],
  cards: [
    {
      id: 'food_plus_two_plant_meals',
      domain: 'food',
      action: 'Add two simple plant-based meals to your week.',
      levels: {
        start: 'Swap one lunch to a plant-forward bowl this week.',
        levelUp: 'Make it two lunches per week; save simple base recipes.',
        stretch: 'Aim for 4–5 plant-forward meals weekly.'
      },
      enabler: '3 base recipes (lentil dal, veg stir-fry, bean tacos) + pantry list',
      why: 'Shifting just two meals/week to plant protein can avoid ~150 kg CO₂/year.',
      chips: ['Short (10–20m)', 'No-spend'],
      accessTags: ['kitchen_access'],
      prerequisites: ['has_kitchen'],
      estImpactKgPerYear: 150,
      equivalents: ['≈750 km not driven', '≈7 tree-years'],
      fitWeights: { Strategist: 1, Trailblazer: 1, Coordinator: 1, Visionary: 1, Explorer: 2, Catalyst: 1, Builder: 1, Networker: 1, Steward: 1, Seed: 2 },
      behaviorDistance: 'small',
      priority: 5,
      personaOverlays: {
        Strategist: { tone: 'plan + track', nudge: 'Sun 5pm: pick two recipes; add to your list.' },
        Trailblazer: { tone: 'quick trial', nudge: 'Try a plant bowl for lunch today—see how it feels.' },
        Coordinator: { tone: 'togetherness', nudge: 'Invite a friend to swap one lunch this week.' },
        Visionary: { tone: 'values & future', nudge: 'Choose a meal that fits your ideals—enjoy it slowly.' },
        Explorer: { tone: 'learn by doing', nudge: 'Test one recipe; jot a 1-line note for next time.' },
        Catalyst: { tone: 'energize others', nudge: 'Post a pic of your plant lunch—spark someone else ✨.' },
        Builder: { tone: 'stepwise setup', nudge: 'Prep one base (beans/lentils) to reuse twice.' },
        Networker: { tone: 'share resources', nudge: 'Share your go-to budget plant protein brand.' },
        Steward: { tone: 'quiet consistency', nudge: 'Keep two gentle plant meals each week.' },
        Seed: { tone: 'safe micro-start', nudge: 'Add one plant lunch this week. That’s plenty 🌱.' }
      }
    },
    {
      id: 'food_cook_once_eat_twice',
      domain: 'food',
      action: 'Cook a bigger batch so one meal becomes two.',
      levels: {
        start: 'Double tonight’s recipe; freeze one portion.',
        levelUp: 'Pick two bases/week (grain + stew) for quick repeat meals.',
        stretch: 'Create a 4-recipe rotation you repeat monthly.'
      },
      enabler: 'Meal prep containers + freezer labels',
      why: 'Batching reduces food waste and cuts energy/emissions from extra cooking and takeout.',
      chips: ['Weekend (1–3h)', 'Low'],
      accessTags: ['kitchen_access|freezer_access'],
      prerequisites: ['has_kitchen'],
      estImpactKgPerYear: 90,
      equivalents: ['≈450 km not driven', '≈4 tree-years'],
      fitWeights: { Strategist: 2, Trailblazer: 1, Coordinator: 0, Visionary: 1, Explorer: 1, Catalyst: 0, Builder: 2, Networker: 1, Steward: 1, Seed: 1 },
      behaviorDistance: 'medium',
      priority: 4,
      personaOverlays: {
        Strategist: { tone: 'plan + track', nudge: 'Block 60–90 min on Sunday; label 4 portions.' },
        Trailblazer: { tone: 'quick trial', nudge: 'Double one dish tonight—freeze the extra.' },
        Coordinator: { tone: 'togetherness', nudge: 'Swap one frozen portion with a neighbor.' },
        Visionary: { tone: 'values & future', nudge: 'A calmer week with less waste—batch your favorite.' },
        Explorer: { tone: 'learn by doing', nudge: 'Try one base; note what reheats best.' },
        Catalyst: { tone: 'energize others', nudge: 'Share your 15-min prep reel to inspire ✨.' },
        Builder: { tone: 'stepwise setup', nudge: 'Make a base template: grain + protein + veg.' },
        Networker: { tone: 'share resources', nudge: 'Post a reliable freezer-safe container rec.' },
        Steward: { tone: 'quiet consistency', nudge: 'Keep one doubled recipe each week.' },
        Seed: { tone: 'safe micro-start', nudge: 'Freeze one leftover tonight 🌱.' }
      }
    },
    {
      id: 'food_pantry_first_list',
      domain: 'food',
      action: 'Look in your pantry before you write your shopping list.',
      levels: {
        start: 'Before shopping, list 3 items you already have to use first.',
        levelUp: 'Build your list around pantry items; add only gaps.',
        stretch: 'Make this your default: pantry → list → shop.'
      },
      enabler: 'Pantry inventory note + grocery list template',
      why: 'Using what you have first cuts waste and avoids extra trips/emissions.',
      chips: ['Short (10–20m)', 'No-spend'],
      accessTags: ['kitchen_access'],
      prerequisites: ['has_kitchen'],
      estImpactKgPerYear: 60,
      equivalents: ['≈300 km not driven', '≈3 tree-years'],
      fitWeights: { Strategist: 2, Trailblazer: 1, Coordinator: 0, Visionary: 1, Explorer: 1, Catalyst: 0, Builder: 2, Networker: 1, Steward: 2, Seed: 2 },
      behaviorDistance: 'small',
      priority: 4,
      personaOverlays: {
        Strategist: { tone: 'plan + track', nudge: 'Open pantry; list 3 ‘use-first’ items now.' },
        Trailblazer: { tone: 'quick trial', nudge: 'Make a 2-item mini list from what’s on hand.' },
        Coordinator: { tone: 'togetherness', nudge: 'Share the list in your household chat.' },
        Visionary: { tone: 'values & future', nudge: 'Less waste, more intention—start with one shelf.' },
        Explorer: { tone: 'learn by doing', nudge: 'Cook one ‘pantry-first’ meal and note the result.' },
        Catalyst: { tone: 'energize others', nudge: 'Post a ‘pantry win’ photo to encourage friends ✨.' },
        Builder: { tone: 'stepwise setup', nudge: 'Pin a simple template: Have → Need → Later.' },
        Networker: { tone: 'share resources', nudge: 'Recommend a lightweight list app you love.' },
        Steward: { tone: 'quiet consistency', nudge: 'Do a 2-minute shelf check before each shop.' },
        Seed: { tone: 'safe micro-start', nudge: 'Use one pantry item today 🌱.' }
      }
    },
    {
      id: 'food_freeze_before_waste',
      domain: 'food',
      action: 'Freeze food that\'s about to go off instead of throwing it away.',
      levels: {
        start: 'Create a ‘freeze by’ box; move near-expiring items in.',
        levelUp: 'Set a weekly freezer night to use what you saved.',
        stretch: 'Label portions and keep a tiny freezer inventory.'
      },
      enabler: 'Freezer-safe containers + label tape',
      why: 'Stopping food from spoiling avoids methane from landfill and saves money.',
      chips: ['Micro (≤5m)', 'Low'],
      accessTags: ['freezer_access'],
      prerequisites: ['has_freezer'],
      estImpactKgPerYear: 80,
      equivalents: ['≈400 km not driven', '≈4 tree-years'],
      fitWeights: { Strategist: 1, Trailblazer: 1, Coordinator: 0, Visionary: 1, Explorer: 1, Catalyst: 0, Builder: 1, Networker: 1, Steward: 2, Seed: 2 },
      behaviorDistance: 'small',
      priority: 4,
      personaOverlays: {
        Strategist: { tone: 'plan + track', nudge: 'Put a dated label on two leftovers tonight.' },
        Trailblazer: { tone: 'quick trial', nudge: 'Freeze one ripe item now—save it for later.' },
        Coordinator: { tone: 'togetherness', nudge: 'Share a ‘freezer night’ idea with your house.' },
        Visionary: { tone: 'values & future', nudge: 'Rescue good food—small ritual, real impact.' },
        Explorer: { tone: 'learn by doing', nudge: 'Test frozen herbs or broth; note the result.' },
        Catalyst: { tone: 'energize others', nudge: 'Post a ‘freezer save’ tip—help a friend ✨.' },
        Builder: { tone: 'stepwise setup', nudge: 'Create a labeled ‘Use Me’ freezer bin.' },
        Networker: { tone: 'share resources', nudge: 'Share your label method or container rec.' },
        Steward: { tone: 'quiet consistency', nudge: 'Move expiring items each night—gentle habit.' },
        Seed: { tone: 'safe micro-start', nudge: 'Freeze one portion today 🌱.' }
      }
    },
    {
      id: 'food_meat_light_weekdays',
      domain: 'food',
      action: 'Pick a few weekday dinners to be lighter on meat.',
      levels: {
        start: 'Choose two meat-light dinners this week.',
        levelUp: 'Make Mon–Thu mostly plant-forward; keep weekend flexible.',
        stretch: 'Keep a rotating set of favorite meat-light meals.'
      },
      enabler: 'Quick plant protein guide + spice blends',
      why: 'Reducing meat 4 days/week can avoid ~350 kg CO₂/year for many diets.',
      chips: ['Short (10–20m)', 'Low'],
      accessTags: ['kitchen_access'],
      prerequisites: ['open_to_diet_shift'],
      estImpactKgPerYear: 350,
      equivalents: ['≈1750 km not driven', '≈17 tree-years'],
      fitWeights: { Strategist: 2, Trailblazer: 1, Coordinator: 1, Visionary: 2, Explorer: 1, Catalyst: 1, Builder: 2, Networker: 0, Steward: 1, Seed: 0 },
      behaviorDistance: 'medium',
      priority: 5,
      personaOverlays: {
        Strategist: { tone: 'plan + track', nudge: 'Add two meat-light meals to this week’s plan.' },
        Trailblazer: { tone: 'quick trial', nudge: 'Try a meat-light dinner tonight—see how it lands.' },
        Coordinator: { tone: 'togetherness', nudge: 'Cook with a friend; split ingredients.' },
        Visionary: { tone: 'values & future', nudge: 'Eat to match your values—choose gentle protein.' },
        Explorer: { tone: 'learn by doing', nudge: 'Test one new plant protein; note your favorite.' },
        Catalyst: { tone: 'energize others', nudge: 'Start a ‘weekdays light’ group challenge ✨.' },
        Builder: { tone: 'stepwise setup', nudge: 'Create a 5-meal template; reuse weekly.' },
        Networker: { tone: 'share resources', nudge: 'Share a budget plant protein price hack.' },
        Steward: { tone: 'quiet consistency', nudge: 'Keep the weekday rhythm—calm and steady.' },
        Seed: { tone: 'safe micro-start', nudge: 'Pick one meat-light night this week 🌱.' }
      }
    },
    {
      id: 'food_seasonal_local_weekly',
      domain: 'food',
      action: 'Cook one meal each week using seasonal or local produce.',
      levels: {
        start: 'Choose one seasonal produce item to cook this week.',
        levelUp: 'Make a weekly seasonal dish your default.',
        stretch: 'Build a seasonal rotation per month or season.'
      },
      enabler: 'Simple seasonal chart + farmers’ market finder',
      why: 'Seasonal/local choices often carry lower footprints and reduce cold-chain losses.',
      chips: ['Short (10–20m)', 'Low'],
      accessTags: ['farmers_market|seasonal_produce'],
      prerequisites: ['market_or_grocery_option'],
      estImpactKgPerYear: 40,
      equivalents: ['≈200 km not driven', '≈2 tree-years'],
      fitWeights: { Strategist: 1, Trailblazer: 1, Coordinator: 0, Visionary: 2, Explorer: 2, Catalyst: 1, Builder: 1, Networker: 1, Steward: 1, Seed: 1 },
      behaviorDistance: 'small',
      priority: 3,
      personaOverlays: {
        Strategist: { tone: 'plan + track', nudge: 'Pick one seasonal item before your shop.' },
        Trailblazer: { tone: 'quick trial', nudge: 'Grab the ripest local pick today—have fun with it.' },
        Coordinator: { tone: 'togetherness', nudge: 'Plan a tiny seasonal potluck with friends.' },
        Visionary: { tone: 'values & future', nudge: 'Eat with the season—notice taste and mood.' },
        Explorer: { tone: 'learn by doing', nudge: 'Try a new fruit/veg; leave a 1-line note.' },
        Catalyst: { tone: 'energize others', nudge: 'Share a market find photo—invite others ✨.' },
        Builder: { tone: 'stepwise setup', nudge: 'Save a monthly seasonal list in your notes.' },
        Networker: { tone: 'share resources', nudge: 'Post the best local market hours.' },
        Steward: { tone: 'quiet consistency', nudge: 'Keep one seasonal dish a week.' },
        Seed: { tone: 'safe micro-start', nudge: 'Buy one seasonal item today 🌱.' }
      }
    },
    {
      id: 'food_low_waste_lunchkit',
      domain: 'food',
      action: 'Pack a simple reusable lunch kit for days you eat away from home.',
      levels: {
        start: 'Assemble a container + utensil + napkin set.',
        levelUp: 'Use it twice this week for lunch or takeaway.',
        stretch: 'Make it your default for weekday lunches.'
      },
      enabler: 'Reusable container + spork + cloth napkin (use what you have)',
      why: 'Avoids single-use packaging and food waste from impulse buys.',
      chips: ['Micro (≤5m)', 'Low'],
      accessTags: ['work_site|school|commute'],
      prerequisites: ['eats_on_the_go'],
      estImpactKgPerYear: 30,
      equivalents: ['≈150 km not driven', '≈1 tree-year'],
      fitWeights: { Strategist: 1, Trailblazer: 1, Coordinator: 1, Visionary: 0, Explorer: 1, Catalyst: 1, Builder: 1, Networker: 2, Steward: 2, Seed: 2 },
      behaviorDistance: 'small',
      priority: 3,
      personaOverlays: {
        Strategist: { tone: 'plan + track', nudge: 'Pack the kit tonight; leave it by the door.' },
        Trailblazer: { tone: 'quick trial', nudge: 'Bring a container today—see if it’s handy.' },
        Coordinator: { tone: 'togetherness', nudge: 'Invite a coworker to do a lunch-kit day.' },
        Visionary: { tone: 'values & future', nudge: 'Choose reuse—quietly aligned with your care.' },
        Explorer: { tone: 'learn by doing', nudge: 'Try your kit once; note what to improve.' },
        Catalyst: { tone: 'energize others', nudge: 'Share your kit pic; nudge your group ✨.' },
        Builder: { tone: 'stepwise setup', nudge: 'Make a grab-and-go shelf for your kit.' },
        Networker: { tone: 'share resources', nudge: 'List a few sturdy, affordable kit items.' },
        Steward: { tone: 'quiet consistency', nudge: 'Keep the kit in your bag—steady habit.' },
        Seed: { tone: 'safe micro-start', nudge: 'Add one container to your bag today 🌱.' }
      }
    }
  ],
  meta: {
    equivalences: { carKgPerKm: 0.20, treeKgPerYear: 21, coffeeKgPerCup: 0.28, burgerKgPerBurger: 3.0 }
  }
};


