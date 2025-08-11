import { Catalog } from '../types/recommendationCatalog';

export const wasteCatalog: Catalog = {
  catalogVersion: 'v1.0',
  domains: ['transport', 'food', 'home', 'clothing', 'waste'],
  cards: [
    {
      id: 'waste_reusable_kit_basics',
      domain: 'waste',
      action: 'Carry a tiny reusable kit (tote, bottle, cup)',
      levels: {
        start: 'Pack one item you’ll use most (e.g., bottle).',
        levelUp: 'Add two more (tote + cup) to your bag/desk.',
        stretch: 'Make reusables your default for daily errands.'
      },
      enabler: 'Use what you already own; stash backups at work/car',
      why: 'Cuts single-use items—small daily wins add up across the year.',
      chips: ['Micro (≤5m)', 'No-spend'],
      accessTags: ['commute|coffee_shop_nearby'],
      prerequisites: ['buys_takeaway_or_drinks_coffee'],
      estImpactKgPerYear: 25,
      equivalents: ['≈125 km not driven', '≈1 tree-year'],
      fitWeights: { Strategist: 1, Trailblazer: 1, Coordinator: 1, Visionary: 0, Explorer: 1, Catalyst: 2, Builder: 1, Networker: 2, Steward: 2, Seed: 2 },
      behaviorDistance: 'small',
      priority: 4,
      personaOverlays: {
        Strategist: { tone: 'plan + track', nudge: 'Place your kit by the door each night.' },
        Trailblazer: { tone: 'quick trial', nudge: 'Bring a bottle today—see how often you use it.' },
        Coordinator: { tone: 'togetherness', nudge: 'Organize a mini swap of spare totes at work.' },
        Visionary: { tone: 'values & future', nudge: 'Choose reuse—quiet care in motion.' },
        Explorer: { tone: 'learn by doing', nudge: 'Try one outing with your kit; note what helped.' },
        Catalyst: { tone: 'energize others', nudge: 'Start a ‘bring your cup’ selfie chain ✨.' },
        Builder: { tone: 'stepwise setup', nudge: 'Set a home/work stash for backups.' },
        Networker: { tone: 'share resources', nudge: 'Share a map of cafes that accept reusables.' },
        Steward: { tone: 'quiet consistency', nudge: 'Keep the kit in your bag—steady and simple.' },
        Seed: { tone: 'safe micro-start', nudge: 'Add one tote to your bag today 🌱.' }
      }
    },
    {
      id: 'waste_bulk_refill_staples',
      domain: 'waste',
      action: 'Refill or buy staples in bulk to cut packaging',
      levels: {
        start: 'Refill one staple (rice/beans/oats) this month.',
        levelUp: 'Shift 3 staples to bulk/refill and bring jars/bags.',
        stretch: 'Make bulk/refill your default for pantry basics.'
      },
      enabler: 'Refill store finder + jar/bag checklist',
      why: 'Lower packaging and transport overhead—less waste, often cheaper per kg.',
      chips: ['Short (10–20m)', 'Low'],
      accessTags: ['refill_store_nearby'],
      prerequisites: ['has_refill_store'],
      estImpactKgPerYear: 40,
      equivalents: ['≈200 km not driven', '≈2 tree-years'],
      fitWeights: { Strategist: 1, Trailblazer: 1, Coordinator: 1, Visionary: 1, Explorer: 1, Catalyst: 0, Builder: 1, Networker: 2, Steward: 2, Seed: 1 },
      behaviorDistance: 'medium',
      priority: 3,
      personaOverlays: {
        Strategist: { tone: 'plan + track', nudge: 'List 3 staples to refill; add to this week’s trip.' },
        Trailblazer: { tone: 'quick trial', nudge: 'Try one refill today; see how it goes.' },
        Coordinator: { tone: 'togetherness', nudge: 'Do a shared refill run with a friend.' },
        Visionary: { tone: 'values & future', nudge: 'Stock simply—less packaging, more intention.' },
        Explorer: { tone: 'learn by doing', nudge: 'Test refill vs packaged; note price and ease.' },
        Catalyst: { tone: 'energize others', nudge: 'Share your refill spot and bring a buddy ✨.' },
        Builder: { tone: 'stepwise setup', nudge: 'Set aside 4 jars and a scoop; keep them ready.' },
        Networker: { tone: 'share resources', nudge: 'Post your best refill store and hours.' },
        Steward: { tone: 'quiet consistency', nudge: 'Refill one item monthly—gentle rhythm.' },
        Seed: { tone: 'safe micro-start', nudge: 'Bring one jar on your next shop 🌱.' }
      }
    },
    {
      id: 'waste_compost_setup',
      domain: 'waste',
      action: 'Set up compost (service or DIY) for food scraps',
      levels: {
        start: 'Collect scraps in a sealed bin for one week.',
        levelUp: 'Enroll in a service or start a simple balcony bin.',
        stretch: 'Compost year-round; share surplus with neighbors or plants.'
      },
      enabler: 'Service locator or small aerated bin + browns guide',
      why: 'Diverting food waste avoids methane—one of the fastest climate wins at home.',
      chips: ['Short (10–20m)', 'Low'],
      accessTags: ['compost_service|balcony|yard'],
      prerequisites: ['compost_service OR outdoor_space'],
      estImpactKgPerYear: 120,
      equivalents: ['≈600 km not driven', '≈6 tree-years'],
      fitWeights: { Strategist: 1, Trailblazer: 1, Coordinator: 2, Visionary: 2, Explorer: 1, Catalyst: 1, Builder: 1, Networker: 1, Steward: 2, Seed: 1 },
      behaviorDistance: 'medium',
      priority: 5,
      personaOverlays: {
        Strategist: { tone: 'plan + track', nudge: 'Set a weekly scrap transfer time; log it.' },
        Trailblazer: { tone: 'quick trial', nudge: 'Collect scraps for 3 days—see what you save.' },
        Coordinator: { tone: 'togetherness', nudge: 'Start a building-wide share bin or pickup rota.' },
        Visionary: { tone: 'values & future', nudge: 'Turn leftovers into soil—circle of care.' },
        Explorer: { tone: 'learn by doing', nudge: 'Try a mini bin; note smells and fixes.' },
        Catalyst: { tone: 'energize others', nudge: 'Invite neighbors to join a compost trial ✨.' },
        Builder: { tone: 'stepwise setup', nudge: 'Set up bin + browns; add a small sign.' },
        Networker: { tone: 'share resources', nudge: 'Share a map of drop-off points locally.' },
        Steward: { tone: 'quiet consistency', nudge: 'Empty your bin weekly—calm, steady loop.' },
        Seed: { tone: 'safe micro-start', nudge: 'Keep scraps in a jar for one day 🌱.' }
      }
    },
    {
      id: 'waste_ewaste_calendar',
      domain: 'waste',
      action: 'Set a quarterly e-waste drop-off reminder',
      levels: {
        start: 'Gather dead batteries/cables in one box.',
        levelUp: 'Find your nearest e-waste site and add a date.',
        stretch: 'Do a quarterly clear-out and share the reminder.'
      },
      enabler: 'E-waste site finder + calendar template',
      why: 'Keeps hazardous materials out of landfills and enables proper recycling.',
      chips: ['Micro (≤5m)', 'No-spend'],
      accessTags: ['ewaste_center_nearby'],
      prerequisites: ['has_ewaste_items'],
      estImpactKgPerYear: 10,
      equivalents: ['≈50 km not driven', '≈0.5 tree-years'],
      fitWeights: { Strategist: 2, Trailblazer: 0, Coordinator: 1, Visionary: 0, Explorer: 0, Catalyst: 1, Builder: 2, Networker: 2, Steward: 1, Seed: 2 },
      behaviorDistance: 'small',
      priority: 3,
      personaOverlays: {
        Strategist: { tone: 'plan + track', nudge: 'Set a 15-min ‘e-waste’ block next month.' },
        Trailblazer: { tone: 'quick trial', nudge: 'Start a cable/battery box today.' },
        Coordinator: { tone: 'togetherness', nudge: 'Offer to collect a friend’s e-waste too.' },
        Visionary: { tone: 'values & future', nudge: 'Handle tech gently—close the loop responsibly.' },
        Explorer: { tone: 'learn by doing', nudge: 'Drop one small item; note the process.' },
        Catalyst: { tone: 'energize others', nudge: 'Share the drop-off date—who wants in? ✨' },
        Builder: { tone: 'stepwise setup', nudge: 'Label a box ‘e-waste’ and park it by the desk.' },
        Networker: { tone: 'share resources', nudge: 'Post your closest site and hours.' },
        Steward: { tone: 'quiet consistency', nudge: 'A small quarterly ritual—box, date, done.' },
        Seed: { tone: 'safe micro-start', nudge: 'Put one battery in a labeled jar today 🌱.' }
      }
    },
    {
      id: 'waste_sort_station_labels',
      domain: 'waste',
      action: 'Create a simple home sort-station with labels',
      levels: {
        start: 'Set up two bins: recycle + trash (or compost where available).',
        levelUp: 'Add clear labels that guests understand at a glance.',
        stretch: 'Add a small ‘return/reuse’ box for jars and mailers.'
      },
      enabler: 'Printable labels + small stacking bins',
      why: 'Clear sorting reduces contamination and keeps recyclables in the loop.',
      chips: ['Short (10–20m)', 'Low'],
      accessTags: ['home_access'],
      prerequisites: ['multi_bin_access'],
      estImpactKgPerYear: 20,
      equivalents: ['≈100 km not driven', '≈1 tree-year'],
      fitWeights: { Strategist: 2, Trailblazer: 0, Coordinator: 1, Visionary: 0, Explorer: 0, Catalyst: 1, Builder: 2, Networker: 1, Steward: 2, Seed: 2 },
      behaviorDistance: 'small',
      priority: 4,
      personaOverlays: {
        Strategist: { tone: 'plan + track', nudge: 'Print labels; set up two bins today.' },
        Trailblazer: { tone: 'quick trial', nudge: 'Try adding one clear label—see if it helps.' },
        Coordinator: { tone: 'togetherness', nudge: 'Explain the labels in your house chat once.' },
        Visionary: { tone: 'values & future', nudge: 'Make it easy for everyone to care, quietly.' },
        Explorer: { tone: 'learn by doing', nudge: 'Note what items confuse guests—adjust labels.' },
        Catalyst: { tone: 'energize others', nudge: 'Share your tidy station photo ✨.' },
        Builder: { tone: 'stepwise setup', nudge: 'Add one bin per week until it flows.' },
        Networker: { tone: 'share resources', nudge: 'Post a local recycling guide link.' },
        Steward: { tone: 'quiet consistency', nudge: 'Keep labels neat—small, steady clarity.' },
        Seed: { tone: 'safe micro-start', nudge: 'Place one extra bin today 🌱.' }
      }
    },
    {
      id: 'waste_jar_reuse_shelf',
      domain: 'waste',
      action: 'Keep a small jar-reuse shelf for storage and refills',
      levels: {
        start: 'Save and wash two jars; remove labels.',
        levelUp: 'Use jars for pantry storage or take to refill stores.',
        stretch: 'Maintain a neat shelf; rotate in/out as needed.'
      },
      enabler: 'Label remover trick (soak + oil) + shelf space',
      why: 'Reusing containers cuts new packaging and supports refill habits.',
      chips: ['Micro (≤5m)', 'No-spend'],
      accessTags: ['kitchen_space'],
      prerequisites: ['uses_glass_jars'],
      estImpactKgPerYear: 10,
      equivalents: ['≈50 km not driven', '≈0.5 tree-years'],
      fitWeights: { Strategist: 1, Trailblazer: 1, Coordinator: 0, Visionary: 1, Explorer: 1, Catalyst: 0, Builder: 1, Networker: 2, Steward: 2, Seed: 2 },
      behaviorDistance: 'small',
      priority: 2,
      personaOverlays: {
        Strategist: { tone: 'plan + track', nudge: 'Wash two jars tonight; add simple labels.' },
        Trailblazer: { tone: 'quick trial', nudge: 'Save one jar today—use it for snacks.' },
        Coordinator: { tone: 'togetherness', nudge: 'Offer spare jars to a friend who refills.' },
        Visionary: { tone: 'values & future', nudge: 'Small reuse, less waste—quietly aligned.' },
        Explorer: { tone: 'learn by doing', nudge: 'Test jars for bulk items; note fit and seal.' },
        Catalyst: { tone: 'energize others', nudge: 'Post a neat jar-shelf photo ✨.' },
        Builder: { tone: 'stepwise setup', nudge: 'Dedicate one shelf; keep 6 jars ready.' },
        Networker: { tone: 'share resources', nudge: 'Share the best label-removal tip.' },
        Steward: { tone: 'quiet consistency', nudge: 'Keep two jars in rotation each week.' },
        Seed: { tone: 'safe micro-start', nudge: 'Rinse one jar and set it aside 🌱.' }
      }
    },
    {
      id: 'waste_fridge_eat_me_first',
      domain: 'waste',
      action: 'Create an ‘Eat Me First’ fridge box',
      levels: {
        start: 'Place a small box and add items expiring soon.',
        levelUp: 'Cook from the box twice a week.',
        stretch: 'Make it a household norm; rotate items daily.'
      },
      enabler: 'Clear container + ‘Eat Me First’ label',
      why: 'Reduces food waste—one of the biggest home climate wins.',
      chips: ['Micro (≤5m)', 'Low'],
      accessTags: ['fridge_access'],
      prerequisites: ['has_fridge'],
      estImpactKgPerYear: 60,
      equivalents: ['≈300 km not driven', '≈3 tree-years'],
      fitWeights: { Strategist: 2, Trailblazer: 1, Coordinator: 1, Visionary: 1, Explorer: 1, Catalyst: 1, Builder: 2, Networker: 1, Steward: 2, Seed: 2 },
      behaviorDistance: 'small',
      priority: 5,
      personaOverlays: {
        Strategist: { tone: 'plan + track', nudge: 'Check the box before dinner—choose one item.' },
        Trailblazer: { tone: 'quick trial', nudge: 'Make tonight’s meal from the box—fast and fun.' },
        Coordinator: { tone: 'togetherness', nudge: 'Explain the box to housemates in 1 minute.' },
        Visionary: { tone: 'values & future', nudge: 'Honor the food you have—use it with care.' },
        Explorer: { tone: 'learn by doing', nudge: 'Try a ‘fridge clear’ recipe; note what worked.' },
        Catalyst: { tone: 'energize others', nudge: 'Start a weekly ‘box challenge’ photo thread ✨.' },
        Builder: { tone: 'stepwise setup', nudge: 'Label the box and set a Wed/Sat check routine.' },
        Networker: { tone: 'share resources', nudge: 'Share a 3-ingredient ‘use-me’ recipe.' },
        Steward: { tone: 'quiet consistency', nudge: 'Peek in daily—small saves add up.' },
        Seed: { tone: 'safe micro-start', nudge: 'Put one item in the box today 🌱.' }
      }
    }
  ],
  meta: {
    equivalences: { carKgPerKm: 0.20, treeKgPerYear: 21, coffeeKgPerCup: 0.28, burgerKgPerBurger: 3.0 }
  }
};


