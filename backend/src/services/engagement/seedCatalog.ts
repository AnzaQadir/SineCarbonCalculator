/**
 * Seed recommendation catalog with full recommendation data
 */

import { RecommendationCatalog } from '../../models';

interface Trigger {
  type: string;
  value: string | number;
}

interface FitRule {
  if: string;
  boost: number;
}

interface CTA {
  label: string;
  action_type: string;
  target?: string;
}

interface RecommendationData {
  id: string;
  title: string;
  category: string;
  why: string;
  how?: string[];
  context_requirements: string[];
  triggers: Trigger[];
  utility_model: {
    pkr_month: number;
    minutes: number;
    kgco2e_month: number;
    source?: string;
    confidence?: number;
    user_equivalent?: string;
  };
  effort: number;
  fit_rules: FitRule[];
  verify: string[];
  rewards: {
    points: number;
    streak: string;
    [key: string]: number | string;
  };
  messages: Record<string, string>;
  empathy_note?: string;
  cta?: CTA;
  story_snippet?: string;
}

interface CatalogData {
  transport: RecommendationData[];
  food: RecommendationData[];
  clothes: RecommendationData[];
  home: RecommendationData[];
  Waste: RecommendationData[];
}

/**
 * Convert effort number to effort object
 */
function effortNumberToObject(effort: number) {
  // Map effort 1-3 to steps and time
  const effortMap: Record<number, { steps: number; avgMinutesToDo: number }> = {
    1: { steps: 1, avgMinutesToDo: 5 },
    2: { steps: 2, avgMinutesToDo: 15 },
    3: { steps: 3, avgMinutesToDo: 30 },
  };
  
  const base = effortMap[effort] || effortMap[2];
  return {
    steps: base.steps,
    requiresPurchase: false, // Will be determined by context_requirements if needed
    avgMinutesToDo: base.avgMinutesToDo,
  };
}

/**
 * Extract tags from recommendation data
 */
function extractTags(rec: RecommendationData, howSteps: string[]): string[] {
  const tags: string[] = [];
  
  // Add category
  if (rec.category) {
    tags.push(rec.category.toLowerCase());
  }
  
  // Add effort level
  if (rec.effort === 1) tags.push('quick');
  if (rec.effort === 2) tags.push('moderate');
  if (rec.effort === 3) tags.push('involved');
  
  // Add context hints
  if (rec.context_requirements?.includes('maps_access')) tags.push('maps');
  if (rec.context_requirements?.includes('calendar_access')) tags.push('planning');
  if (rec.context_requirements?.includes('freezer_available')) tags.push('freezer');
  if (rec.context_requirements?.includes('contacts_access')) tags.push('social');
  if (rec.context_requirements?.includes('work_policy_optional')) tags.push('policy');
  if (rec.context_requirements?.includes('community_access')) tags.push('community');
  
  // Add keywords from title/how
  const titleWords = rec.title.toLowerCase().split(/\s+/);
  titleWords.forEach(word => {
    if (word.length > 3 && !['the', 'and', 'for', 'with', 'your'].includes(word)) {
      tags.push(word);
    }
  });

  howSteps.forEach(step => {
    step
      .toLowerCase()
      .split(/\s+/)
      .forEach(word => {
        if (word.length > 4) {
          const cleaned = word.replace(/[^a-z0-9]/g, '');
          if (cleaned.length > 2) {
            tags.push(cleaned);
          }
        }
      });
  });

  rec.triggers?.forEach(trigger => {
    if (trigger.type) {
      tags.push(trigger.type.toLowerCase());
    }
    if (trigger.value !== undefined && trigger.value !== null) {
      const valueStr = String(trigger.value).toLowerCase();
      tags.push(valueStr);
    }
  });

  if (rec.cta?.action_type) {
    tags.push(rec.cta.action_type.toLowerCase());
  }
  if (rec.cta?.target) {
    tags.push(rec.cta.target.toLowerCase());
  }
  
  return [...new Set(tags)]; // Remove duplicates
}

/**
 * Check if requires purchase
 */
function requiresPurchase(rec: RecommendationData, howSteps: string[]): boolean {
  const purchaseKeywords = ['buy', 'purchase', 'replace', 'swap', 'bulb', 'led', 'strip', 'smart'];
  const text = [
    rec.title,
    rec.messages?.web_subtitle,
    rec.story_snippet,
    rec.why,
    howSteps.join(' '),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return purchaseKeywords.some(keyword => text.includes(keyword));
}

function normalizeSteps(steps?: string[]): string[] {
  return (steps || [])
    .map((step) => step?.trim())
    .filter((step): step is string => Boolean(step && step.length > 0));
}

type StepContext = {
  actionTitle: string;
  subtitle?: string | null;
  why?: string;
  requiresPurchase: boolean;
};

const baseFallbackSteps = (ctx: StepContext): string[] => {
  const lowerAction = ctx.actionTitle.replace(/\.+$/, '').toLowerCase();
  return [
    `Choose when you will ${lowerAction}.`,
    ctx.requiresPurchase
      ? 'Gather or order anything you need ahead of time.'
      : 'Line up anything you already have to make it easy.',
    'Do it, notice what worked, and plan to repeat it.',
  ];
};

function categoryStepBuilders(category: string, ctx: StepContext): string[] | null {
  const key = category.toLowerCase();
  const subtitle = ctx.subtitle || ctx.why || ctx.actionTitle;

  switch (key) {
    case 'transport':
      return [
        `Pick the trip you will shift: ${subtitle}`,
        ctx.requiresPurchase
          ? 'Book the ticket or reserve the seat and note departure details.'
          : 'Plan the route and timings so the swap feels easy.',
        'Take the trip and reflect on how the change felt.',
      ];
    case 'food':
      return [
        `Choose the meal or moment to try: ${subtitle}`,
        ctx.requiresPurchase
          ? 'Shop or prep the ingredients and set them where you will see them.'
          : 'Prep what you already have so the swap is ready to go.',
        'Cook or assemble it and note how it went for next time.',
      ];
    case 'home':
      return [
        `Decide which spot or habit to tackle first: ${subtitle}`,
        ctx.requiresPurchase
          ? 'Pick up any supplies or tools you need before you start.'
          : 'Gather the tools you already own and set a start time.',
        'Make the change and do a quick reset afterward.',
      ];
    case 'waste':
      return [
        `Identify where the waste shows up: ${subtitle}`,
        ctx.requiresPurchase
          ? 'Collect any containers or gear you need to support the new habit.'
          : 'Set up bins or reminders with what you already have.',
        'Put the new routine into practice and review at week end.',
      ];
    case 'clothing':
    case 'clothes':
      return [
        `Choose the item or purchase you will shift: ${subtitle}`,
        ctx.requiresPurchase
          ? 'Line up the resale/borrow options and set alerts or bookmarks.'
          : 'Open your preferred resale or swap source and save a search.',
        'Follow through on your next purchase moment and log the win.',
      ];
    default:
      return null;
  }
}

function generateHowSteps(rec: RecommendationData, requiresPurchaseFlag: boolean): string[] {
  const existing = normalizeSteps(rec.how);
  if (existing.length > 0) {
    return existing;
  }

  const ctx: StepContext = {
    actionTitle: rec.title,
    subtitle: rec.messages?.web_subtitle || rec.story_snippet,
    why: rec.why,
    requiresPurchase: requiresPurchaseFlag,
  };

  const categorySteps = categoryStepBuilders(rec.category, ctx);
  if (categorySteps && categorySteps.length > 0) {
    return categorySteps;
  }

  return baseFallbackSteps(ctx);
}

/**
 * Seed catalog from JSON data
 */
export async function seedCatalogFromJSON(catalogData: CatalogData): Promise<void> {
  const allRecommendations: RecommendationData[] = [
    ...(catalogData.transport || []),
    ...(catalogData.food || []),
    ...(catalogData.clothes || []),
    ...(catalogData.home || []),
    ...(catalogData.Waste || []),
  ];

  const itemsToCreate = allRecommendations.map((rec) => {
    const effortObj = effortNumberToObject(rec.effort);
    const tentativePurchase = requiresPurchase(rec, normalizeSteps(rec.how));
    const generatedHow = generateHowSteps(rec, tentativePurchase);
    const purchase = requiresPurchase(rec, generatedHow);
    
    return {
      id: rec.id,
      category: rec.category.toLowerCase(),
      title: rec.title,
      subtitle: rec.messages?.web_subtitle || null,
      metrics: {
        pkrMonth: rec.utility_model.pkr_month,
        minutes: rec.utility_model.minutes,
        kgco2eMonth: rec.utility_model.kgco2e_month,
      },
      effort: {
        ...effortObj,
        requiresPurchase: purchase,
      },
      tags: extractTags(rec, generatedHow),
      regions: ['PK'], // Default to PK, can be enhanced
      active: true,
      metadata: {
        why: rec.why,
        how: generatedHow,
        contextRequirements: rec.context_requirements,
        triggers: rec.triggers,
        fitRules: rec.fit_rules,
        verify: rec.verify,
        rewards: rec.rewards,
        messages: rec.messages,
        empathyNote: rec.empathy_note ?? null,
        cta: rec.cta ?? null,
        storySnippet: rec.story_snippet ?? null,
        utilityModel: rec.utility_model,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  // Use bulkCreate with updateOnDuplicate to handle re-runs
  for (const item of itemsToCreate) {
    await RecommendationCatalog.upsert(item);
  }

  console.log(`✅ Seeded ${itemsToCreate.length} recommendations to catalog`);
}

/**
 * Seed with the provided catalog data
 */
export async function seedFullCatalog(): Promise<void> {
  const catalogData: CatalogData = {
    transport: [
      {
        id: 'transport.route_planner.before_errands',
        title: 'Plan routes before errands',
        category: 'transport',
        why: 'Smart routing reduces backtracking, time, and fuel.',
        how: [
          "Open Google Maps, add all stops, pick 'lowest distance' order.",
          'Save the trip as a starred list for next time.',
        ],
        context_requirements: ['maps_access'],
        triggers: [
          { type: 'time_window', value: 'weekend_morning' },
          { type: 'event', value: 'multi_stop_day' },
        ],
        utility_model: {
          pkr_month: 250,
          minutes: 20,
          kgco2e_month: 2.0,
          source: 'Zerrah Model v1.0 (country averages + published factors)',
          confidence: 0.8,
          user_equivalent: '≈ skipping a 10 km drive this month',
        },
        effort: 1,
        fit_rules: [
          { if: "user.locale='PK'", boost: 0.2 },
          { if: 'user.channel.whatsapp=true', boost: 0.1 },
        ],
        verify: ['screenshot:maps_multi_stop', 'maps_visit'],
        rewards: { points: 10, streak: 'smart_errands' },
        messages: {
          whatsapp:
            '🗺️ Quick win: map all stops before you head out—less zig-zag, less fuel. Want me to open Maps with multi-stop flow?',
          web_subtitle: '5-min setup • saves time & fuel',
        },
        empathy_note: "If today's packed, I can tee this up Saturday morning.",
        cta: { label: 'Open multi-stop in Maps', action_type: 'map', target: 'google_maps' },
        story_snippet: 'Sara planned one loop and shaved 18 minutes off her errands.',
      },
      {
        id: 'transport.tyre_pressure.monthly',
        title: 'Check tyre pressure monthly',
        category: 'transport',
        why: 'Proper pressure can save up to ~10% fuel and improves safety.',
        how: ['Use any petrol pump air; inflate to manufacturer PSI.', 'Set a monthly reminder.'],
        context_requirements: ['locale', 'maps_access'],
        triggers: [
          { type: 'time_window', value: 'weekend_morning' },
          { type: 'cooldown_days', value: '25' },
        ],
        utility_model: {
          pkr_month: 300,
          minutes: 3,
          kgco2e_month: 4.0,
          source: 'Zerrah Model v1.0 (country averages + published factors)',
          confidence: 0.8,
          user_equivalent: '≈ skipping a 20 km drive this month',
        },
        effort: 1,
        fit_rules: [
          { if: "user.locale='PK'", boost: 0.2 },
          { if: 'user.channel.whatsapp=true', boost: 0.1 },
        ],
        verify: ['photo:gauge_reading', 'maps_visit'],
        rewards: { points: 10, streak: 'monthly_maintenance' },
        messages: {
          whatsapp:
            '🛞 3-min save: top up tyre air. I can map you to the nearest pump or set a monthly reminder.',
          web_subtitle: '3-min action • ~₨300/mo',
        },
        empathy_note: "Short on time? I'll remind you Sunday 10am near a pump you use.",
        cta: { label: 'Map nearest pump', action_type: 'map', target: 'google_maps' },
        story_snippet: 'Rashid from Lahore saves roughly a tank a year by keeping tyres topped up.',
      },
      {
        id: 'transport.batch_errands.once_weekly',
        title: 'Batch errands once a week',
        category: 'transport',
        why: 'Combining trips cuts cold starts and fuel burn.',
        how: ["Pick one 'errands day'.", 'Group 3–4 stops in one loop route.'],
        context_requirements: ['calendar_access', 'maps_access'],
        triggers: [
          { type: 'rrule', value: 'FREQ=WEEKLY;BYDAY=FRI,SAT' },
          { type: 'cooldown_days', value: '5' },
        ],
        utility_model: {
          pkr_month: 500,
          minutes: 40,
          kgco2e_month: 5.0,
          source: 'Zerrah Model v1.0 (country averages + published factors)',
          confidence: 0.75,
          user_equivalent: '≈ skipping a 25 km drive this month',
        },
        effort: 2,
        fit_rules: [{ if: 'user.has_car=true', boost: 0.2 }],
        verify: ['maps_visit', 'screenshot:maps_route_history'],
        rewards: { points: 15, streak: 'weekly_planner' },
        messages: {
          whatsapp: "🧭 One loop > four mini trips. Ready to set a weekly 'errands block'?",
          web_subtitle: 'Weekly habit • saves fuel & time',
        },
        empathy_note: 'If Fridays are busy, pick whichever day has the fewest meetings.',
        cta: { label: 'Add weekly block', action_type: 'calendar', target: 'native_calendar' },
        story_snippet: 'Bilal set a Saturday slot and cut two midweek drives.',
      },
      {
        id: 'transport.carpool.once_weekly',
        title: 'Share a ride once a week',
        category: 'transport',
        why: 'One shared trip a week reduces fuel and congestion.',
        how: ['Ask a colleague/neighbor for the same route day.', 'Alternate drivers or split fare.'],
        context_requirements: ['contacts_access', 'workdays'],
        triggers: [
          { type: 'rrule', value: 'FREQ=WEEKLY;BYDAY=TUE,THU' },
          { type: 'cooldown_days', value: '6' },
        ],
        utility_model: {
          pkr_month: 800,
          minutes: 15,
          kgco2e_month: 8.0,
          source: 'Zerrah Model v1.0 (country averages + published factors)',
          confidence: 0.7,
          user_equivalent: '≈ skipping a 40 km drive this month',
        },
        effort: 3,
        fit_rules: [{ if: 'user.commute_km>8', boost: 0.2 }],
        verify: ['text:carpool_confirm', 'photo:passengers_seatbelt'],
        rewards: { points: 20, streak: 'share_the_ride' },
        messages: {
          whatsapp: "🚗🤝 This week's eco-move: share one commute. Want a nudge to your office buddy?",
          web_subtitle: 'Weekly • big CO₂ cut',
        },
        empathy_note: 'Not sure who to ask? I can draft a friendly message for you.',
        cta: { label: 'Message a carpool buddy', action_type: 'share', target: 'contacts_picker' },
        story_snippet: 'Ayesha and Noor alternate Thursdays; both save on fuel.',
      },
      {
        id: 'transport.keep_speed_80_90',
        title: 'Cruise at 80–90 km/h on highways',
        category: 'transport',
        why: 'Moderate speeds are more fuel-efficient than rapid acceleration.',
        how: ['Use cruise control if available.', 'Accelerate gently; avoid late braking.'],
        context_requirements: ['telematics_optional'],
        triggers: [{ type: 'event', value: 'highway_trip_detected' }],
        utility_model: {
          pkr_month: 300,
          minutes: 0,
          kgco2e_month: 3.5,
          source: 'Zerrah Model v1.0 (country averages + published factors)',
          confidence: 0.75,
          user_equivalent: '≈ skipping a 18 km drive this month',
        },
        effort: 1,
        fit_rules: [{ if: 'user.highway_trips_per_month>=2', boost: 0.2 }],
        verify: ['photo:dashboard_avg_consumption', 'manual_log:avg_speed'],
        rewards: { points: 10, streak: 'smooth_driver' },
        messages: {
          whatsapp: '🛣️ Pro tip: steady 80–90 km/h saves fuel. Try it this trip?',
          web_subtitle: 'No extra time • less fuel',
        },
        empathy_note: "If traffic's messy, don't stress—aim for smoother acceleration instead.",
        cta: { label: 'View driving tips', action_type: 'open', target: 'driving_tips_modal' },
        story_snippet: "Hamza's highway average improved after using cruise control.",
      },
      {
        id: 'transport.remove_roof_rack_when_idle',
        title: 'Remove roof rack when not in use',
        category: 'transport',
        why: 'Less drag = better mileage.',
        how: ['Unscrew and store the rack when not needed.', 'Set a reminder to re-attach only for trips.'],
        context_requirements: [],
        triggers: [{ type: 'event', value: 'post_trip_return' }],
        utility_model: {
          pkr_month: 200,
          minutes: 5,
          kgco2e_month: 2.0,
          source: 'Zerrah Model v1.0 (country averages + published factors)',
          confidence: 0.75,
          user_equivalent: '≈ skipping a 10 km drive this month',
        },
        effort: 2,
        fit_rules: [{ if: 'user.has_roof_rack=true', boost: 0.4 }],
        verify: ['photo:car_roof_without_rack'],
        rewards: { points: 10, streak: 'lean_car' },
        messages: {
          whatsapp: '🔧 Not hauling? Pop off the roof rack and save fuel.',
          web_subtitle: '5-min once • ongoing save',
        },
        empathy_note: "No tools handy? I'll remind you the evening before your next long drive.",
        cta: { label: 'See removal checklist', action_type: 'open', target: 'checklist_modal' },
        story_snippet: 'After a camping trip, Ali stowed the rack and noticed better mileage.',
      },
      {
        id: 'transport.light_maintenance_quarterly',
        title: 'Quarterly light maintenance (oil/filters)',
        category: 'transport',
        why: 'Well-tuned engines burn less fuel.',
        how: ['Book oil change & air filter check.', 'Keep service record photo.'],
        context_requirements: ['calendar_access'],
        triggers: [
          { type: 'rrule', value: 'FREQ=MONTHLY;INTERVAL=3' },
          { type: 'cooldown_days', value: '80' },
        ],
        utility_model: {
          pkr_month: 250,
          minutes: 20,
          kgco2e_month: 2.5,
          source: 'Zerrah Model v1.0 (country averages + published factors)',
          confidence: 0.7,
          user_equivalent: '≈ skipping a 12 km drive this month',
        },
        effort: 3,
        fit_rules: [{ if: 'user.car_age_years>=5', boost: 0.2 }],
        verify: ['photo:service_invoice'],
        rewards: { points: 25, streak: 'care_keeper' },
        messages: {
          whatsapp: '🛠️ Quick service = smoother, cheaper drives. Book a slot for this month?',
          web_subtitle: 'Quarterly • fuel & safety',
        },
        empathy_note: 'Hate calling shops? I can block time on your calendar first.',
        cta: { label: 'Add service reminder', action_type: 'calendar', target: 'native_calendar' },
        story_snippet: "Mariam's older Corolla ran cooler after a filter change.",
      },
      {
        id: 'transport.avoid_idling_over_60s',
        title: 'Turn off engine if idling >60s',
        category: 'transport',
        why: 'Idling wastes fuel and money.',
        how: ['Switch off at long lights or waits.', 'Restart when moving again.'],
        context_requirements: [],
        triggers: [{ type: 'event', value: 'frequent_red_lights_area' }],
        utility_model: {
          pkr_month: 150,
          minutes: 0,
          kgco2e_month: 1.5,
          source: 'Zerrah Model v1.0 (country averages + published factors)',
          confidence: 0.85,
          user_equivalent: '≈ skipping an 8 km drive this month',
        },
        effort: 1,
        fit_rules: [{ if: "user.city='Karachi'", boost: 0.1 }],
        verify: ['manual_log:idling_events'],
        rewards: { points: 8, streak: 'no_idling' },
        messages: {
          whatsapp: '⏱️ Long red light? Kill the engine and save fuel.',
          web_subtitle: 'No time cost • fuel save',
        },
        empathy_note: 'If it feels awkward at first, try it only at the longest lights.',
        cta: { label: 'See when to switch off', action_type: 'open', target: 'idling_tips_modal' },
        story_snippet: 'Zeeshan switched off at his longest signal and saw better average.',
      },
      {
        id: 'transport.motorbike_tire_chain_lube',
        title: 'Bike: tyre air & chain lube monthly',
        category: 'transport',
        why: 'Smooth chains and correct tyre air improve mileage.',
        how: ['Check PSI and apply lube.', 'Set a monthly reminder.'],
        context_requirements: [],
        triggers: [{ type: 'cooldown_days', value: '28' }],
        utility_model: {
          pkr_month: 200,
          minutes: 10,
          kgco2e_month: 1.5,
          source: 'Zerrah Model v1.0 (country averages + published factors)',
          confidence: 0.8,
          user_equivalent: '≈ a couple of short bike trips worth of fuel',
        },
        effort: 2,
        fit_rules: [{ if: 'user.has_bike=true', boost: 0.4 }],
        verify: ['photo:psi_gauge', 'photo:chain_lube'],
        rewards: { points: 12, streak: 'bike_care' },
        messages: {
          whatsapp: '🏍️ 10-min tune: air + chain lube. Shall I remind monthly?',
          web_subtitle: 'Monthly • smoother ride',
        },
        empathy_note: "No lube at home? I'll ping you when you're near a service kiosk.",
        cta: { label: 'Set monthly reminder', action_type: 'calendar', target: 'native_calendar' },
        story_snippet: "Imran's 125 felt zippier after a quick chain clean.",
      },
      {
        id: 'transport.work_from_home_once_weekly',
        title: 'Work from home once a week',
        category: 'transport',
        why: 'Skip one round-trip → big CO₂ and PKR savings.',
        how: ['Pick one low-meeting day.', 'Block your calendar for deep work.'],
        context_requirements: ['work_policy_optional', 'calendar_access'],
        triggers: [{ type: 'rrule', value: 'FREQ=WEEKLY;BYDAY=WED' }],
        utility_model: {
          pkr_month: 1200,
          minutes: 90,
          kgco2e_month: 10.0,
          source: 'Zerrah Model v1.0 (country averages + published factors)',
          confidence: 0.7,
          user_equivalent: '≈ skipping a 50 km drive this month',
        },
        effort: 2,
        fit_rules: [{ if: 'user.remote_ok=true', boost: 0.4 }],
        verify: ['calendar_event:wfh', 'manual_log:skipped_commute'],
        rewards: { points: 30, streak: 'remote_plus' },
        messages: {
          whatsapp: '💻 One WFH day = less fuel, more focus. Want me to block Wednesdays?',
          web_subtitle: 'Weekly • big save',
        },
        empathy_note: 'If Wednesdays are meeting-heavy, choose any lighter day.',
        cta: { label: 'Block WFH day', action_type: 'calendar', target: 'native_calendar' },
        story_snippet: "Nimra's team picked Tuesdays; happier calendars, fewer commutes.",
      },
    ],
    food: [
      {
        id: 'food.leftover_remix_daal_roti',
        title: 'Leftover remix: add daal to atta',
        category: 'food',
        why: 'Boosts protein and uses leftovers—less waste, more nutrition.',
        how: ['Mix cooked daal into kneaded atta.', 'Make parathas/rotis; label date.'],
        context_requirements: [],
        triggers: [{ type: 'time_window', value: 'weeknight_dinner' }],
        utility_model: {
          pkr_month: 400,
          minutes: 10,
          kgco2e_month: 2.0,
          source: 'Zerrah Model v1.0 (household food-waste factors)',
          confidence: 0.8,
          user_equivalent: '≈ rescuing 2–3 leftover servings / month',
        },
        effort: 2,
        fit_rules: [{ if: "user.diet.includes('lentils')", boost: 0.2 }],
        verify: ['photo:cooked_rotis', 'manual_log:remix_used'],
        rewards: { points: 12, streak: 'no_waste_kitchen' },
        messages: {
          whatsapp: '🍛+🫓 Pro hack: mix leftover daal into atta—tasty, protein-rich rotis. Try tonight?',
          web_subtitle: '10-min • saves food & ₨',
        },
        empathy_note: "No leftover daal today? Star this and use it next time you cook lentils.",
        cta: { label: 'Open quick recipe', action_type: 'open', target: 'recipe_modal' },
        story_snippet: "Hina's 'daal parathas' became a weekly favorite at home.",
      },
      {
        id: 'food.freeze_before_spoil_basics',
        title: 'Freeze food before it spoils (bread/rice/fruit)',
        category: 'food',
        why: 'Freezing preserves quality and avoids waste.',
        how: ['Slice bread; freeze flat.', 'Cool rice; box and freeze; date-label.'],
        context_requirements: ['freezer_available'],
        triggers: [{ type: 'rrule', value: 'FREQ=WEEKLY;BYDAY=SUN' }],
        utility_model: {
          pkr_month: 600,
          minutes: 15,
          kgco2e_month: 3.0,
          source: 'Zerrah Model v1.0 (household food-waste factors)',
          confidence: 0.8,
          user_equivalent: '≈ saving 3–4 loaves/meals from the bin per month',
        },
        effort: 2,
        fit_rules: [{ if: 'user.has_freezer=true', boost: 0.3 }],
        verify: ['photo:labeled_boxes'],
        rewards: { points: 15, streak: 'freeze_saver' },
        messages: {
          whatsapp: '❄️ Quick check: freeze bread/leftovers before they turn. Want a Sunday reminder?',
          web_subtitle: 'Weekly • big waste cut',
        },
        empathy_note: 'Short on containers? Zip bags work—label with a marker.',
        cta: { label: 'Set Sunday freezer check', action_type: 'calendar', target: 'native_calendar' },
        story_snippet: 'Usman freezes half his loaf—no more moldy bread.',
      },
      {
        id: 'food.store_herbs_grains_right',
        title: 'Store herbs & grains right',
        category: 'food',
        why: 'Good storage extends freshness and reduces waste.',
        how: ['Herbs in a jar with water, cover loosely.', 'Grains in airtight jars away from heat.'],
        context_requirements: [],
        triggers: [{ type: 'event', value: 'grocery_day' }],
        utility_model: {
          pkr_month: 300,
          minutes: 8,
          kgco2e_month: 1.2,
          source: 'Zerrah Model v1.0 (household food-waste factors)',
          confidence: 0.85,
          user_equivalent: '≈ herbs lasting an extra week + fewer stale grains',
        },
        effort: 1,
        fit_rules: [{ if: 'user.cooks_at_home=true', boost: 0.2 }],
        verify: ['photo:herbs_in_jar', 'photo:airtight_jars'],
        rewards: { points: 10, streak: 'fresh_keeper' },
        messages: {
          whatsapp: '🌿 Jar your herbs, seal your grains—lasts longer, tastes better. Do it after your next shop?',
          web_subtitle: 'Simple habit • less waste',
        },
        empathy_note: 'No jars? A glass with water and a loose bag works for herbs.',
        cta: { label: 'See storage guide', action_type: 'open', target: 'storage_tips_modal' },
        story_snippet: 'Mint and coriander stopped wilting by midweek for Areeba.',
      },
      {
        id: 'food.one_plant_meal_weekly',
        title: 'One plant-based meal weekly',
        category: 'food',
        why: 'Lentils/beans cut costs and emissions, add fiber.',
        how: ['Pick one weekly dal/chickpea meal.', 'Batch-cook; freeze portions.'],
        context_requirements: [],
        triggers: [{ type: 'rrule', value: 'FREQ=WEEKLY;BYDAY=MON' }],
        utility_model: {
          pkr_month: 500,
          minutes: 20,
          kgco2e_month: 5.0,
          source: 'Zerrah Model v1.0 (diet swap factors)',
          confidence: 0.75,
          user_equivalent: '≈ swapping one meat meal for dal each week',
        },
        effort: 2,
        fit_rules: [{ if: 'user.diet.flexitarian=true', boost: 0.2 }],
        verify: ['photo:meal', 'manual_log:swap_meat_to_dal'],
        rewards: { points: 18, streak: 'meatless_plus' },
        messages: {
          whatsapp: "🥣 This week's swap: one dal/bean meal. I can send a 15-min recipe. Want it?",
          web_subtitle: 'Weekly • ₨ & CO₂ save',
        },
        empathy_note: "Worried about protein? I'll include quick lentil + veggie combos.",
        cta: { label: 'Send 15-min recipe', action_type: 'open', target: 'recipe_modal' },
        story_snippet: "Fahad's Monday dal became a family staple.",
      },
      {
        id: 'food.meal_plan_simple3',
        title: "Simple '3-meal' weekly plan",
        category: 'food',
        why: 'Mini planning slashes mid-week waste & stress.',
        how: ['Pick 3 core meals for the week.', 'Buy only matching ingredients.'],
        context_requirements: ['calendar_access'],
        triggers: [{ type: 'rrule', value: 'FREQ=WEEKLY;BYDAY=SAT' }],
        utility_model: {
          pkr_month: 700,
          minutes: 25,
          kgco2e_month: 4.0,
          source: 'Zerrah Model v1.0 (household food-waste factors)',
          confidence: 0.75,
          user_equivalent: '≈ one fewer midweek order + fewer spoiled veggies',
        },
        effort: 2,
        fit_rules: [{ if: 'user.pref.quick_hacks=true', boost: 0.1 }],
        verify: ['photo:list', 'screenshot:grocery_list'],
        rewards: { points: 20, streak: 'planner_light' },
        messages: {
          whatsapp: '📝 Choose just 3 meals for the week—less waste, faster cooking. Want a template?',
          web_subtitle: 'Weekly • calm & savings',
        },
        empathy_note: "Hate planning? I'll suggest a 3-meal combo that reuses ingredients.",
        cta: { label: 'Open 3-meal template', action_type: 'open', target: 'planner_template' },
        story_snippet: "Aamna's 3-meal plan cut weekday stress in half.",
      },
      {
        id: 'food.first_in_first_out_label',
        title: 'Label leftovers with date (FIFO)',
        category: 'food',
        why: "Date labels prevent 'mystery box' waste.",
        how: ['Write dish + date on tape/marker.', 'Put older items front-row.'],
        context_requirements: [],
        triggers: [{ type: 'event', value: 'post_cook' }],
        utility_model: {
          pkr_month: 350,
          minutes: 5,
          kgco2e_month: 1.5,
          source: 'Zerrah Model v1.0 (household food-waste factors)',
          confidence: 0.85,
          user_equivalent: '≈ eating through leftovers before they spoil',
        },
        effort: 1,
        fit_rules: [{ if: 'user.cooks_batch=true', boost: 0.2 }],
        verify: ['photo:labeled_containers'],
        rewards: { points: 10, streak: 'fifo_master' },
        messages: {
          whatsapp: '🏷️ 30-sec habit: date your leftovers. Want printable labels?',
          web_subtitle: 'Tiny habit • big impact',
        },
        empathy_note: 'No tape? Use a dry-erase marker on the lid.',
        cta: { label: 'Download labels', action_type: 'download', target: 'labels_pdf' },
        story_snippet: "'No more mystery boxes' after labels—Sadia",
      },
      {
        id: 'food.defrost_safely_fridge',
        title: 'Defrost in fridge overnight',
        category: 'food',
        why: 'Safer and reduces last-minute spoilage.',
        how: ["Move tomorrow's item to fridge at night.", 'Place on a tray to avoid drips.'],
        context_requirements: [],
        triggers: [{ type: 'time_window', value: 'night_9pm' }],
        utility_model: {
          pkr_month: 200,
          minutes: 3,
          kgco2e_month: 1.0,
          source: 'Zerrah Model v1.0 (household food-waste factors)',
          confidence: 0.85,
          user_equivalent: '≈ one rushed takeaway avoided per month',
        },
        effort: 1,
        fit_rules: [{ if: 'user.has_fridge=true', boost: 0.1 }],
        verify: ['manual_log:defrost_move'],
        rewards: { points: 8, streak: 'smart_prep' },
        messages: {
          whatsapp: "🧊 Move tomorrow's item to the fridge tonight—no waste panic. Set a nightly nudge?",
          web_subtitle: '1-min prep • less waste',
        },
        empathy_note: "Forgetful? I'll ping you at 9pm on cooking days.",
        cta: { label: 'Set 9pm reminder', action_type: 'calendar', target: 'native_calendar' },
        story_snippet: "Kamran's '9pm move' stopped last-minute wastage.",
      },
      {
        id: 'food.pressure_cooker_legumes_weekly',
        title: 'Pressure-cook legumes weekly',
        category: 'food',
        why: 'Batching saves energy and time.',
        how: ['Soak beans overnight; pressure-cook.', 'Freeze portions for quick meals.'],
        context_requirements: [],
        triggers: [{ type: 'rrule', value: 'FREQ=WEEKLY;BYDAY=SUN' }],
        utility_model: {
          pkr_month: 300,
          minutes: 30,
          kgco2e_month: 2.0,
          source: 'Zerrah Model v1.0 (appliance energy + batch-cooking factors)',
          confidence: 0.8,
          user_equivalent: '≈ 2 quick weeknight meals always ready',
        },
        effort: 2,
        fit_rules: [{ if: 'user.has_pressure_cooker=true', boost: 0.3 }],
        verify: ['photo:containers_portions'],
        rewards: { points: 15, streak: 'batch_cook' },
        messages: {
          whatsapp: '⏲️ One Sunday batch = week of quick meals. Need a legumes timing chart?',
          web_subtitle: 'Weekly • energy & ₨ save',
        },
        empathy_note: 'No time Sunday? Any day works—set the reminder when you like.',
        cta: { label: 'Open timing chart', action_type: 'open', target: 'legumes_chart_modal' },
        story_snippet: "Hammad's freezer portions killed weekday chaos.",
      },
      {
        id: 'food.keep_fruit_visible',
        title: 'Keep fruit visible (front bowl)',
        category: 'food',
        why: 'Visible fruit gets eaten; hidden fruit spoils.',
        how: ['Bowl on counter; rotate ripe to front.', 'Chill only fruit that needs it.'],
        context_requirements: [],
        triggers: [{ type: 'event', value: 'grocery_day' }],
        utility_model: {
          pkr_month: 250,
          minutes: 2,
          kgco2e_month: 1.0,
          source: 'Zerrah Model v1.0 (household food-waste factors)',
          confidence: 0.9,
          user_equivalent: '≈ finishing a bag of fruit before it goes soft',
        },
        effort: 1,
        fit_rules: [{ if: 'user.kitchen_counter_space=true', boost: 0.1 }],
        verify: ['photo:fruit_bowl'],
        rewards: { points: 6, streak: 'eat_me_first' },
        messages: {
          whatsapp: '🍎 Put fruit bowl front-and-center—more eaten, less binned. Do it after your shop?',
          web_subtitle: 'Tiny nudge • less waste',
        },
        empathy_note: 'No counter space? Keep it on the fridge top—still visible.',
        cta: { label: 'See quick setup', action_type: 'open', target: 'fruit_bowl_tip' },
        story_snippet: 'Visible fruit = more snacking, less waste—Moiz',
      },
      {
        id: 'food.share_leftover_hack',
        title: 'Share your leftover hack',
        category: 'food',
        why: 'Community tips spark new routines and reduce waste.',
        how: ['Post your favorite remix in Zerrah.', 'Try one shared tip this week.'],
        context_requirements: ['community_access'],
        triggers: [{ type: 'rrule', value: 'FREQ=WEEKLY;BYDAY=FRI' }],
        utility_model: {
          pkr_month: 150,
          minutes: 5,
          kgco2e_month: 1.0,
          source: 'Zerrah Model v1.0 (peer activation effect)',
          confidence: 0.7,
          user_equivalent: '≈ inspiring one more no-waste meal in your circle',
        },
        effort: 1,
        fit_rules: [{ if: 'user.persona.SocialSharer>=0.2', boost: 0.2 }],
        verify: ['text:tip_shared', 'photo:result'],
        rewards: { points: 12, streak: 'community_chef' },
        messages: {
          whatsapp: "👩‍🍳 Your turn! What's your best leftover remix? Share and earn bonus points.",
          web_subtitle: 'Weekly • inspire others',
        },
        empathy_note: 'Shy to post? Upload a photo only—no caption required.',
        cta: { label: 'Share a tip', action_type: 'open', target: 'community_post' },
        story_snippet: "'Daal pancakes' started trending after Fatima posted hers.",
      },
    ],
    clothes: [
      {
        id: 'clothes.one_in_one_out',
        title: 'Donate one when you buy one',
        category: 'clothes',
        why: 'Keeps closet balanced and extends clothing life for others.',
        how: ['When a new item arrives, pick one to donate.', 'Bag it and schedule pickup/drop.'],
        context_requirements: ['calendar_access'],
        triggers: [{ type: 'event', value: 'purchase_detected' }],
        utility_model: {
          pkr_month: 0,
          minutes: 15,
          kgco2e_month: 4.0,
          source: 'Zerrah Model v1.0 (textile lifecycle factors)',
          confidence: 0.7,
          user_equivalent: '≈ extending the life of one garment instead of rebuying',
        },
        effort: 2,
        fit_rules: [{ if: 'user.purchase_events_month>=1', boost: 0.3 }],
        verify: ['photo:donation_bag', 'photo:receipt'],
        rewards: { points: 18, streak: 'closet_balance' },
        messages: {
          whatsapp: '👕 New item in? Pick one out to donate—quick, satisfying win. Need a pickup link?',
          web_subtitle: 'On purchase • big impact',
        },
        empathy_note: "Not ready to donate? Park it in a 'maybe' bag for 30 days.",
        cta: { label: 'Schedule pickup', action_type: 'open', target: 'donation_partners' },
        story_snippet: 'Haseeb made space and helped a neighbor with winter wear.',
      },
      {
        id: 'clothes.air_out_between_wears',
        title: 'Air out between wears',
        category: 'clothes',
        why: 'Reduces washes and extends fabric life.',
        how: ['Hang sweaters/jeans on a chair hook overnight.', 'Spot clean small marks.'],
        context_requirements: [],
        triggers: [{ type: 'event', value: 'post_wear' }],
        utility_model: {
          pkr_month: 150,
          minutes: 5,
          kgco2e_month: 1.0,
          source: 'Zerrah Model v1.0 (laundry energy factors)',
          confidence: 0.85,
          user_equivalent: '≈ one fewer laundry cycle per month',
        },
        effort: 1,
        fit_rules: [{ if: 'user.laundry_loads_week<=2', boost: 0.1 }],
        verify: ['photo:airing_clothes'],
        rewards: { points: 8, streak: 'gentle_care' },
        messages: {
          whatsapp: '🌬️ Hang to air—less laundry, longer-lasting clothes. Try tonight?',
          web_subtitle: 'Tiny habit • fabric care',
        },
        empathy_note: 'No stand? Back of a chair works fine.',
        cta: { label: 'See spot-clean tips', action_type: 'open', target: 'spot_clean_modal' },
        story_snippet: 'Airing jeans kept color and shape longer—Aisha',
      },
      {
        id: 'clothes.mend_small_tears',
        title: 'Mend small tears/loose buttons',
        category: 'clothes',
        why: 'Quick fixes add months of use.',
        how: ['Keep a mini kit (needle/thread/buttons).', 'Fix within 48h of noticing.'],
        context_requirements: [],
        triggers: [{ type: 'event', value: 'clothes_damage_spotted' }],
        utility_model: {
          pkr_month: 200,
          minutes: 15,
          kgco2e_month: 2.0,
          source: 'Zerrah Model v1.0 (textile lifecycle factors)',
          confidence: 0.75,
          user_equivalent: '≈ extending 1–2 items by several months',
        },
        effort: 2,
        fit_rules: [{ if: 'user.pref.diy=true', boost: 0.2 }],
        verify: ['photo:before_after'],
        rewards: { points: 12, streak: 'fix_it_fast' },
        messages: {
          whatsapp: '🪡 15-min mend now = months more wear. Need a basic mending guide?',
          web_subtitle: 'DIY • extends life',
        },
        empathy_note: 'No kit? A travel kit or safety pin buys you time.',
        cta: { label: 'Open mending guide', action_type: 'open', target: 'mending_modal' },
        story_snippet: 'Usra fixed a loose button and kept her favorite shirt in rotation.',
      },
      {
        id: 'clothes.wash_cold_full_load',
        title: 'Wash cold with full loads',
        category: 'clothes',
        why: 'Saves energy, protects fabric color/elastic.',
        how: ['Set cold wash default.', 'Run only with a full drum.'],
        context_requirements: [],
        triggers: [{ type: 'event', value: 'laundry_day' }],
        utility_model: {
          pkr_month: 300,
          minutes: 0,
          kgco2e_month: 2.5,
          source: 'Zerrah Model v1.0 (laundry energy factors)',
          confidence: 0.85,
          user_equivalent: '≈ switching one hot load to cold per month',
        },
        effort: 1,
        fit_rules: [{ if: 'user.has_washing_machine=true', boost: 0.2 }],
        verify: ['photo:washing_machine_panel'],
        rewards: { points: 10, streak: 'cold_clean' },
        messages: {
          whatsapp: '🧺 Cold + full loads = cheaper, gentler washes. Set as default?',
          web_subtitle: 'Zero effort • energy save',
        },
        empathy_note: 'Worried about stains? Pre-treat spots; cold still works great.',
        cta: { label: 'Make cold the default', action_type: 'open', target: 'washer_settings_modal' },
        story_snippet: 'Colors stayed brighter after switching to cold—Rija',
      },
      {
        id: 'clothes.line_dry_when_possible',
        title: 'Line-dry when possible',
        category: 'clothes',
        why: 'Avoids dryer energy and fabric wear.',
        how: ['Use balcony/indoor rack.', 'Sun-dry whites; shade for colors.'],
        context_requirements: [],
        triggers: [{ type: 'time_window', value: 'sunny_day' }],
        utility_model: {
          pkr_month: 250,
          minutes: 5,
          kgco2e_month: 2.0,
          source: 'Zerrah Model v1.0 (laundry energy factors)',
          confidence: 0.8,
          user_equivalent: '≈ avoiding 1–2 dryer cycles a month',
        },
        effort: 2,
        fit_rules: [{ if: 'user.has_balcony=true', boost: 0.2 }],
        verify: ['photo:clothes_on_line'],
        rewards: { points: 10, streak: 'air_dry' },
        messages: {
          whatsapp: '☀️ Dry on a rack today—better for clothes and bill. Weather looks good; try it?',
          web_subtitle: 'Sunny day • save energy',
        },
        empathy_note: 'No balcony? A foldable rack near a window helps.',
        cta: { label: 'See line-dry setup', action_type: 'open', target: 'line_dry_tip' },
        story_snippet: 'Line-drying whites in sun keeps them crisp—Nadia',
      },
      {
        id: 'clothes.capsule_wardrobe_mini',
        title: 'Mini capsule (10 go-to items)',
        category: 'clothes',
        why: 'Fewer, better pieces reduce impulse buys.',
        how: ['Pick 10 mix-and-match items.', 'Park the rest for 30 days.'],
        context_requirements: [],
        triggers: [{ type: 'time_window', value: 'weekend_afternoon' }],
        utility_model: {
          pkr_month: 0,
          minutes: 30,
          kgco2e_month: 3.0,
          source: 'Zerrah Model v1.0 (consumption reduction factors)',
          confidence: 0.7,
          user_equivalent: '≈ one avoided low-intent purchase per month',
        },
        effort: 3,
        fit_rules: [{ if: 'user.pref.minimalist=true', boost: 0.2 }],
        verify: ['photo:capsule_stack'],
        rewards: { points: 20, streak: 'capsule_mode' },
        messages: {
          whatsapp: '🧩 Choose 10 favorites for this month—less clutter, clearer outfits. Want a checklist?',
          web_subtitle: 'One-time • clarity boost',
        },
        empathy_note: "Can't decide? Start with 5 items for weekdays only.",
        cta: { label: 'Open capsule checklist', action_type: 'open', target: 'capsule_checklist' },
        story_snippet: "A 10-item mini-capsule ended 'nothing to wear' mornings—Erum",
      },
      {
        id: 'clothes.delay_buy_24h_rule',
        title: '24-hour delay rule before buying',
        category: 'clothes',
        why: 'Cools impulse, saves money and waste.',
        how: ['Save item in cart.', 'Revisit next day; buy only if still needed.'],
        context_requirements: [],
        triggers: [{ type: 'event', value: 'add_to_cart' }],
        utility_model: {
          pkr_month: 800,
          minutes: 5,
          kgco2e_month: 4.0,
          source: 'Zerrah Model v1.0 (consumption reduction factors)',
          confidence: 0.75,
          user_equivalent: '≈ one fewer impulse buy per month',
        },
        effort: 1,
        fit_rules: [{ if: 'user.frequent_online_shopping=true', boost: 0.3 }],
        verify: ['screenshot:cart_saved'],
        rewards: { points: 12, streak: 'mindful_buy' },
        messages: {
          whatsapp: '⏳ Put it in the cart—decide tomorrow. Your wallet (and planet) will thank you.',
          web_subtitle: 'Pause • fewer regrets',
        },
        empathy_note: "If it's sold out tomorrow, it probably wasn't meant to be.",
        cta: { label: 'Save to wish list', action_type: 'open', target: 'wishlist_tip' },
        story_snippet: 'Waiting 24h killed half my impulse buys—Zoha',
      },
      {
        id: 'clothes.swap_party_annual',
        title: 'Host/attend a clothing swap (annual)',
        category: 'clothes',
        why: 'Refresh style without new production.',
        how: ['Invite friends; set simple rules.', 'Sort by size/category for easy picks.'],
        context_requirements: ['contacts_access'],
        triggers: [{ type: 'rrule', value: 'FREQ=YEARLY;BYMONTH=11' }],
        utility_model: {
          pkr_month: 0,
          minutes: 60,
          kgco2e_month: 6.0,
          source: 'Zerrah Model v1.0 (reuse & sharing factors)',
          confidence: 0.7,
          user_equivalent: '≈ 1–2 items swapped instead of bought',
        },
        effort: 3,
        fit_rules: [{ if: 'user.persona.SocialSharer>=0.2', boost: 0.2 }],
        verify: ['photo:swap_event'],
        rewards: { points: 35, streak: 'swap_champ' },
        messages: {
          whatsapp: '👗 Swap party time—fun, free, sustainable. Want invites drafted?',
          web_subtitle: 'Annual • big footprint cut',
        },
        empathy_note: "Don't host? Ask a friend; small swaps are just as fun.",
        cta: { label: 'Draft invites', action_type: 'share', target: 'contacts_picker' },
        story_snippet: "Ten friends swapped; everyone found a 'new' favorite—Alina",
      },
      {
        id: 'clothes.shoe_repair_before_replace',
        title: 'Repair shoes before replacing',
        category: 'clothes',
        why: 'Heel/sole fixes extend life at low cost.',
        how: ['Visit cobbler for re-soling.', 'Condition leather quarterly.'],
        context_requirements: [],
        triggers: [{ type: 'event', value: 'shoe_damage' }],
        utility_model: {
          pkr_month: 300,
          minutes: 20,
          kgco2e_month: 2.0,
          source: 'Zerrah Model v1.0 (textile/leather repair factors)',
          confidence: 0.75,
          user_equivalent: '≈ keeping a pair going for another season',
        },
        effort: 2,
        fit_rules: [{ if: 'user.owns_leather_shoes=true', boost: 0.2 }],
        verify: ['photo:receipt', 'photo:before_after'],
        rewards: { points: 14, streak: 'repair_first' },
        messages: {
          whatsapp: '👞 Worn sole? Repair beats replace—cheaper, greener. Need nearby cobbler?',
          web_subtitle: 'One fix • months more',
        },
        empathy_note: "No time this week? Snap a photo; I'll remind you next weekend.",
        cta: { label: 'Find a cobbler', action_type: 'map', target: 'google_maps' },
        story_snippet: 'A quick re-sole saved Adeel from buying new boots.',
      },
      {
        id: 'clothes.sort_quarterly_keep_donate',
        title: 'Quarterly keep/donate sort',
        category: 'clothes',
        why: 'Regular curation prevents clutter and waste.',
        how: ['Set 30-min timer.', 'Keep/love; donate/duplicate; repair/minor flaws.'],
        context_requirements: ['calendar_access'],
        triggers: [{ type: 'rrule', value: 'FREQ=MONTHLY;INTERVAL=3' }],
        utility_model: {
          pkr_month: 0,
          minutes: 30,
          kgco2e_month: 4.0,
          source: 'Zerrah Model v1.0 (consumption reduction factors)',
          confidence: 0.75,
          user_equivalent: "≈ rediscovering 1–2 items you'll actually wear",
        },
        effort: 3,
        fit_rules: [{ if: 'user.pref.organized=true', boost: 0.2 }],
        verify: ['photo:donation_bag'],
        rewards: { points: 20, streak: 'curation_pro' },
        messages: {
          whatsapp: '🗂️ 30-min closet pass—keep/donate/repair. Shall I book it for this weekend?',
          web_subtitle: 'Quarterly • fresh closet',
        },
        empathy_note: 'If 30 minutes feels heavy, try a 10-minute shelf sprint.',
        cta: { label: 'Book 30-min slot', action_type: 'calendar', target: 'native_calendar' },
        story_snippet: "One quick pass revealed three 'new' outfits—Kiran",
      },
    ],
    home: [
      {
        id: 'home.unplug_idle_chargers',
        title: 'Unplug idle chargers',
        category: 'home',
        why: "Wall warts sip power even when nothing's charging.",
        how: ['Use a power strip with switch.', 'Turn off after charging.'],
        context_requirements: [],
        triggers: [{ type: 'time_window', value: 'night_10pm' }],
        utility_model: {
          pkr_month: 150,
          minutes: 2,
          kgco2e_month: 1.2,
          source: 'Zerrah Model v1.0 (standby load factors)',
          confidence: 0.85,
          user_equivalent: '≈ cutting phantom load from chargers and TV boxes',
        },
        effort: 1,
        fit_rules: [{ if: 'user.pref.quick_hacks=true', boost: 0.1 }],
        verify: ['photo:power_strip_off'],
        rewards: { points: 6, streak: 'phantom_buster' },
        messages: {
          whatsapp: '🔌 Kill phantom load: switch off the charger strip at night. Want a 10pm nudge?',
          web_subtitle: 'Tiny habit • energy save',
        },
        empathy_note: 'Put the strip where you can see it—easy to remember.',
        cta: { label: 'Set 10pm nudge', action_type: 'calendar', target: 'native_calendar' },
        story_snippet: 'A nightly switch saved Sana a few hundred rupees a month.',
      },
      {
        id: 'home.swap_led_bulbs',
        title: 'Swap bulbs to LEDs',
        category: 'home',
        why: 'LEDs use up to ~80% less power and last longer.',
        how: ['Replace most-used bulbs first (kitchen/living).', 'Keep spares labeled by room.'],
        context_requirements: [],
        triggers: [{ type: 'event', value: 'bulb_failure' }],
        utility_model: {
          pkr_month: 600,
          minutes: 20,
          kgco2e_month: 5.0,
          source: 'Zerrah Model v1.0 (lighting energy factors)',
          confidence: 0.8,
          user_equivalent: '≈ swapping 3–4 high-use bulbs',
        },
        effort: 2,
        fit_rules: [{ if: 'user.has_old_bulbs=true', boost: 0.3 }],
        verify: ['photo:new_led_bulb'],
        rewards: { points: 20, streak: 'bright_save' },
        messages: {
          whatsapp: '💡 Next failed bulb? Replace with LED—cheaper long-term. Need a quick sizing guide?',
          web_subtitle: 'One-time • large save',
        },
        empathy_note: 'Unsure of size? Take a photo of the old bulb base.',
        cta: { label: 'Open LED sizing guide', action_type: 'open', target: 'bulb_guide_modal' },
        story_snippet: "Kitchen + lounge LEDs halved Zain's lighting bill.",
      },
      {
        id: 'home.use_daylight',
        title: 'Use daylight (open curtains)',
        category: 'home',
        why: 'Free light reduces daytime electricity use.',
        how: ['Open curtains mornings.', 'Desk near window; mirror to bounce light.'],
        context_requirements: [],
        triggers: [{ type: 'time_window', value: 'morning_8am' }],
        utility_model: {
          pkr_month: 150,
          minutes: 0,
          kgco2e_month: 1.0,
          source: 'Zerrah Model v1.0 (lighting substitution)',
          confidence: 0.9,
          user_equivalent: '≈ keeping lights off through late morning',
        },
        effort: 1,
        fit_rules: [{ if: 'user.home_office=true', boost: 0.1 }],
        verify: ['photo:open_curtains'],
        rewards: { points: 6, streak: 'sun_first' },
        messages: {
          whatsapp: '🌞 Let the sun in—lights off till noon. Want a morning reminder?',
          web_subtitle: 'Zero effort • saves power',
        },
        empathy_note: 'South-facing rooms get the strongest light—start there.',
        cta: { label: 'Set 8am cue', action_type: 'calendar', target: 'native_calendar' },
        story_snippet: 'Daylight desk = fewer headaches for Nida.',
      },
      {
        id: 'home.laundry_cold',
        title: 'Do laundry in cold water',
        category: 'home',
        why: 'Detergents work cold; save energy and protect fabrics.',
        how: ['Set washing machine to cold default.', 'Use full loads only.'],
        context_requirements: [],
        triggers: [{ type: 'event', value: 'laundry_day' }],
        utility_model: {
          pkr_month: 250,
          minutes: 0,
          kgco2e_month: 2.0,
          source: 'Zerrah Model v1.0 (laundry energy factors)',
          confidence: 0.85,
          user_equivalent: '≈ switching one mixed load to cold',
        },
        effort: 1,
        fit_rules: [{ if: 'user.has_washing_machine=true', boost: 0.1 }],
        verify: ['photo:panel_cold'],
        rewards: { points: 10, streak: 'cold_cycle' },
        messages: {
          whatsapp: '🧺 Switch to cold wash—same clean, lower bill. Set as default?',
          web_subtitle: 'Zero effort • energy save',
        },
        empathy_note: 'Pre-treat collars/cuffs; cold still handles the rest.',
        cta: { label: 'Make cold default', action_type: 'open', target: 'washer_settings_modal' },
        story_snippet: "Cold cycles kept colors bright in Rabia's wardrobe.",
      },
      {
        id: 'home.last_checks_lights_fans',
        title: 'Last checks for lights/fans',
        category: 'home',
        why: 'Quick scan avoids unattended power use.',
        how: ['Before leaving a room, look back once.', 'Teach household the same cue.'],
        context_requirements: [],
        triggers: [{ type: 'time_window', value: 'night_11pm' }],
        utility_model: {
          pkr_month: 200,
          minutes: 3,
          kgco2e_month: 1.5,
          source: 'Zerrah Model v1.0 (standby + forgotten load)',
          confidence: 0.85,
          user_equivalent: '≈ turning off a couple of fans/lights nightly',
        },
        effort: 1,
        fit_rules: [{ if: 'user.household_size>=3', boost: 0.1 }],
        verify: ['manual_log:last_check_streak'],
        rewards: { points: 8, streak: 'look_back' },
        messages: {
          whatsapp: '👀 One last look—lights/fans off. Want a nightly nudge?',
          web_subtitle: 'Tiny habit • adds up',
        },
        empathy_note: "Make it a game for kids: 'last out, look back'.",
        cta: { label: 'Set 11pm cue', action_type: 'calendar', target: 'native_calendar' },
        story_snippet: "A 'look back' sticky note trained the whole house—Javeria",
      },
      {
        id: 'home.schedule_off_peak_laundry',
        title: 'Laundry in off-peak hours',
        category: 'home',
        why: 'Shifts load to cheaper/cleaner grid hours.',
        how: ['Check your DISCO off-peak window.', 'Run a timer start.'],
        context_requirements: ['tariff_window_optional'],
        triggers: [{ type: 'time_window', value: 'off_peak' }],
        utility_model: {
          pkr_month: 300,
          minutes: 0,
          kgco2e_month: 1.5,
          source: 'Zerrah Model v1.0 (grid intensity + tariff patterns)',
          confidence: 0.7,
          user_equivalent: '≈ shifting one load to low-tariff hours',
        },
        effort: 1,
        fit_rules: [{ if: 'user.has_washing_machine=true', boost: 0.1 }],
        verify: ['photo:timer_set'],
        rewards: { points: 10, streak: 'offpeak_pro' },
        messages: {
          whatsapp: '⏰ Run laundry off-peak—cheaper, cleaner. Set a timer now?',
          web_subtitle: 'Zero effort • tariff smart',
        },
        empathy_note: 'Unsure of hours? I can list common off-peak windows.',
        cta: { label: 'See off-peak hours', action_type: 'open', target: 'offpeak_info_modal' },
        story_snippet: "Timer starts kept Ali's bills predictable.",
      },
      {
        id: 'home.ac_setpoint_plus_one',
        title: 'AC setpoint +1°C with fan',
        category: 'home',
        why: 'Each +1°C can cut cooling energy by ~5–10%.',
        how: ['Bump AC 25→26°C.', 'Turn on ceiling/pedestal fan.'],
        context_requirements: [],
        triggers: [{ type: 'time_window', value: 'evening_hot' }],
        utility_model: {
          pkr_month: 800,
          minutes: 0,
          kgco2e_month: 6.0,
          source: 'Zerrah Model v1.0 (cooling energy factors)',
          confidence: 0.75,
          user_equivalent: '≈ one evening of AC load avoided per week',
        },
        effort: 1,
        fit_rules: [{ if: 'user.has_ac=true', boost: 0.3 }],
        verify: ['photo:thermostat_26c'],
        rewards: { points: 18, streak: 'cool_wise' },
        messages: {
          whatsapp: '❄️ Nudge the AC up by 1°C and use a fan—same comfort, lower bill. Do it now?',
          web_subtitle: '+1°C • big energy save',
        },
        empathy_note: 'Try it for 20 minutes; if it feels fine, keep it.',
        cta: { label: 'Set 26°C now', action_type: 'open', target: 'ac_tip_modal' },
        story_snippet: "Ayesha's room stayed comfy at 26°C with a fan.",
      },
      {
        id: 'home.clean_ac_filter_monthly',
        title: 'Clean AC filter monthly (cooling season)',
        category: 'home',
        why: 'Clogged filters waste energy and reduce cooling.',
        how: ['Vacuum or rinse filter; dry before reinstall.', 'Set monthly reminder in summer.'],
        context_requirements: [],
        triggers: [{ type: 'rrule', value: 'FREQ=MONTHLY;BYMONTH=4,5,6,7,8,9' }],
        utility_model: {
          pkr_month: 500,
          minutes: 15,
          kgco2e_month: 4.0,
          source: 'Zerrah Model v1.0 (cooling maintenance factors)',
          confidence: 0.75,
          user_equivalent: '≈ stronger airflow + lower cooling time',
        },
        effort: 2,
        fit_rules: [{ if: 'user.has_ac=true', boost: 0.3 }],
        verify: ['photo:filter_clean'],
        rewards: { points: 15, streak: 'filter_fresh' },
        messages: {
          whatsapp: '🧼 15-min AC filter clean = stronger cool, less bill. Remind monthly?',
          web_subtitle: 'Seasonal • comfort & save',
        },
        empathy_note: 'No vacuum? A gentle rinse works—dry fully before reinstall.',
        cta: { label: 'Set monthly reminder', action_type: 'calendar', target: 'native_calendar' },
        story_snippet: "Clean filters ended Mariam's \"AC not cooling\" headaches.",
      },
      {
        id: 'home.fridge_temp_optimize',
        title: 'Optimize fridge temperature',
        category: 'home',
        why: 'Correct temps preserve food and cut waste.',
        how: ['Set fridge 3–4°C, freezer −18°C.', 'Keep space for airflow.'],
        context_requirements: [],
        triggers: [{ type: 'event', value: 'food_spoil_report' }],
        utility_model: {
          pkr_month: 250,
          minutes: 5,
          kgco2e_month: 1.5,
          source: 'Zerrah Model v1.0 (appliance efficiency + spoilage)',
          confidence: 0.85,
          user_equivalent: '≈ fewer spoiled leftovers this month',
        },
        effort: 1,
        fit_rules: [{ if: 'user.has_fridge=true', boost: 0.2 }],
        verify: ['photo:temp_setting'],
        rewards: { points: 10, streak: 'chill_right' },
        messages: {
          whatsapp: '🧊 Dial fridge to 3–4°C, freezer −18°C—fresher food, fewer tosses. Do it now?',
          web_subtitle: '1-time • less waste',
        },
        empathy_note: 'No thermometer? Start at middle setting; tweak after a day.',
        cta: { label: 'See ideal settings', action_type: 'open', target: 'fridge_settings_modal' },
        story_snippet: 'Correct temps kept produce crisp through the week—Taha',
      },
      {
        id: 'home.smart_power_strip_media',
        title: 'Smart power strip for TV/media',
        category: 'home',
        why: 'Kill standby draw from TV, set-top box, consoles.',
        how: ['Plug into a smart strip.', 'Schedule nightly off.'],
        context_requirements: ['smart_plug_optional'],
        triggers: [{ type: 'time_window', value: 'night_12am' }],
        utility_model: {
          pkr_month: 350,
          minutes: 10,
          kgco2e_month: 2.5,
          source: 'Zerrah Model v1.0 (standby load factors)',
          confidence: 0.8,
          user_equivalent: '≈ eliminating idle draw from your media stack',
        },
        effort: 2,
        fit_rules: [{ if: 'user.has_tv_setup=true', boost: 0.2 }],
        verify: ['screenshot:smart_plug_schedule', 'photo:setup'],
        rewards: { points: 14, streak: 'standby_slayer' },
        messages: {
          whatsapp: '🔌 Auto-off your TV stack at midnight with a smart strip. Want a setup guide?',
          web_subtitle: 'Nightly • phantom bust',
        },
        empathy_note: 'No smart strip? Use a basic switch strip as step one.',
        cta: { label: 'Open setup guide', action_type: 'open', target: 'smart_strip_modal' },
        story_snippet: 'Midnight auto-off made bills less spiky—Sarmad',
      },
    ],
    Waste: [
      {
        id: 'waste.refuse_single_use_cutlery',
        title: 'Refuse single-use cutlery/straws',
        category: 'waste',
        why: "Avoids plastic waste you don't need.",
        how: ["Untick cutlery on apps.", "Add 'no cutlery' note on orders."],
        context_requirements: [],
        triggers: [{ type: 'event', value: 'food_order_detected' }],
        utility_model: {
          pkr_month: 0,
          minutes: 0,
          kgco2e_month: 1.0,
          source: 'Zerrah Model v1.0 (single-use avoidance factors)',
          confidence: 0.9,
          user_equivalent: '≈ a small bag of disposables avoided monthly',
        },
        effort: 1,
        fit_rules: [{ if: 'user.orders_takeout_weekly=true', boost: 0.2 }],
        verify: ['screenshot:order_note'],
        rewards: { points: 6, streak: 'no_extras' },
        messages: {
          whatsapp: "🥡 Untick 'cutlery' on your order—small click, cleaner bin. Want me to send the exact steps?",
          web_subtitle: 'Zero effort • less plastic',
        },
        empathy_note: 'Keep a metal spoon in your bag for on-the-go.',
        cta: { label: 'See app steps', action_type: 'open', target: 'food_app_steps_modal' },
        story_snippet: 'Three clicks per order = zero plastic cutlery—Anum',
      },
      {
        id: 'waste.repurpose_glass_jars',
        title: 'Repurpose glass jars',
        category: 'waste',
        why: 'Reuse jars for spices, pulses, or planters.',
        how: ['Remove labels with hot water.', 'Store staples or use as planters.'],
        context_requirements: [],
        triggers: [{ type: 'event', value: 'empty_jar' }],
        utility_model: {
          pkr_month: 150,
          minutes: 10,
          kgco2e_month: 0.8,
          source: 'Zerrah Model v1.0 (reuse factors)',
          confidence: 0.85,
          user_equivalent: '≈ buying one fewer storage jar',
        },
        effort: 1,
        fit_rules: [{ if: 'user.cooks_at_home=true', boost: 0.1 }],
        verify: ['photo:jar_reuse'],
        rewards: { points: 8, streak: 'jar_genius' },
        messages: {
          whatsapp: '🫙 Empty jar? Turn it into a spice/pulse jar. Need label-removal tips?',
          web_subtitle: 'Simple reuse • save ₹',
        },
        empathy_note: 'Sticky label? A bit of oil loosens glue.',
        cta: { label: 'Open label-removal tips', action_type: 'open', target: 'label_tips_modal' },
        story_snippet: "Reused jars made Sana's pantry look boutique.",
      },
      {
        id: 'waste.carry_tote_bottle',
        title: 'Carry a tote & bottle',
        category: 'waste',
        why: 'Avoids bags and bottled water waste.',
        how: ['Keep a foldable tote + bottle in your bag/car.', 'Refill before leaving.'],
        context_requirements: [],
        triggers: [{ type: 'time_window', value: 'leaving_home' }],
        utility_model: {
          pkr_month: 300,
          minutes: 3,
          kgco2e_month: 2.0,
          source: 'Zerrah Model v1.0 (disposable avoidance factors)',
          confidence: 0.8,
          user_equivalent: '≈ avoiding a dozen disposable bags/bottles monthly',
        },
        effort: 1,
        fit_rules: [{ if: 'user.drinks_on_the_go=true', boost: 0.2 }],
        verify: ['photo:tote_bottle'],
        rewards: { points: 10, streak: 'prepared_always' },
        messages: {
          whatsapp: "👜+🥤 Tote + bottle by the door = fewer disposables. Want a 'leaving home' nudge?",
          web_subtitle: 'Tiny prep • fewer disposables',
        },
        empathy_note: "Hang it on the doorknob so you can't miss it.",
        cta: { label: "Set 'leaving home' cue", action_type: 'calendar', target: 'native_calendar' },
        story_snippet: 'A small tote killed most plastic bags for Mohsin.',
      },
      {
        id: 'waste.compact_bin_segregation',
        title: 'Segregate wet/dry at home',
        category: 'waste',
        why: 'Makes recycling/composting possible and easier.',
        how: ['Two bins: wet (organic) & dry (recyclables).', 'Keep signage simple.'],
        context_requirements: [],
        triggers: [{ type: 'event', value: 'bin_setup_day' }],
        utility_model: {
          pkr_month: 0,
          minutes: 15,
          kgco2e_month: 3.0,
          source: 'Zerrah Model v1.0 (recycling enablement)',
          confidence: 0.8,
          user_equivalent: '≈ enabling clean recycling each week',
        },
        effort: 2,
        fit_rules: [{ if: 'user.household_size>=3', boost: 0.1 }],
        verify: ['photo:two_bins'],
        rewards: { points: 15, streak: 'sorted_home' },
        messages: {
          whatsapp: '🗑️ Two bins = clean recycling, easy compost. Ready to set them up this weekend?',
          web_subtitle: 'One-time • enables recycling',
        },
        empathy_note: 'No space? Use stackable bins or two bags in one stand.',
        cta: { label: 'See setup guide', action_type: 'open', target: 'bin_setup_modal' },
        story_snippet: "Two bins ended the \"messy recycling\" excuse at Farhan's place.",
      },
      {
        id: 'waste.compost_easy_bottle',
        title: 'Start tiny compost (bottle/bin)',
        category: 'waste',
        why: 'Turns peels/scraps into plant food.',
        how: ['Use bottle/bin with holes & dry browns.', 'Stir weekly; use for pots.'],
        context_requirements: [],
        triggers: [{ type: 'time_window', value: 'weekend_morning' }],
        utility_model: {
          pkr_month: 0,
          minutes: 25,
          kgco2e_month: 4.0,
          source: 'Zerrah Model v1.0 (home composting factors)',
          confidence: 0.7,
          user_equivalent: '≈ diverting kitchen scraps weekly',
        },
        effort: 3,
        fit_rules: [{ if: 'user.has_balcony_garden=true', boost: 0.3 }],
        verify: ['photo:compost_setup'],
        rewards: { points: 24, streak: 'soil_maker' },
        messages: {
          whatsapp: '🌱 DIY compost in a bottle/bin—small, smell-safe, plant-happy. Want a 4-step guide?',
          web_subtitle: 'Weekend • garden boost',
        },
        empathy_note: 'Start tiny—1 bottle first; upgrade later if you like it.',
        cta: { label: 'Open 4-step guide', action_type: 'open', target: 'compost_modal' },
        story_snippet: 'Herb pots loved the homemade compost—Mahnoor',
      },
      {
        id: 'waste.opt_in_ebills',
        title: 'Opt-in to e-bills/receipts',
        category: 'waste',
        why: 'Cuts paper waste and filing hassle.',
        how: ["Enable e-bills in utility/vendor portals.", "Create an 'e-bills' email label."],
        context_requirements: ['email_access_optional'],
        triggers: [{ type: 'event', value: 'bill_cycle' }],
        utility_model: {
          pkr_month: 0,
          minutes: 10,
          kgco2e_month: 0.8,
          source: 'Zerrah Model v1.0 (paper + logistics factors)',
          confidence: 0.85,
          user_equivalent: '≈ a stack of paper mail avoided',
        },
        effort: 1,
        fit_rules: [{ if: 'user.pref.digital=true', boost: 0.2 }],
        verify: ['screenshot:ebill_enabled'],
        rewards: { points: 8, streak: 'paperless_plus' },
        messages: {
          whatsapp: '📨 Turn on e-bills—less clutter, less waste. Need the right links?',
          web_subtitle: 'One-time • simpler life',
        },
        empathy_note: "I can help you create an email filter labeled 'e-bills'.",
        cta: { label: 'Open provider links', action_type: 'open', target: 'ebill_links_modal' },
        story_snippet: 'Paper piles vanished after e-bills—Haris',
      },
      {
        id: 'waste.refill_station_detergents',
        title: 'Refill detergents at a station',
        category: 'waste',
        why: 'Reduces plastic from new containers.',
        how: ['Locate a refill point near you.', 'Carry empties; refill monthly.'],
        context_requirements: ['maps_access'],
        triggers: [{ type: 'event', value: 'detergent_low' }],
        utility_model: {
          pkr_month: 100,
          minutes: 15,
          kgco2e_month: 1.0,
          source: 'Zerrah Model v1.0 (packaging avoidance factors)',
          confidence: 0.75,
          user_equivalent: '≈ one fewer plastic bottle per month',
        },
        effort: 2,
        fit_rules: [{ if: 'user.city_has_refill_shops=true', boost: 0.3 }],
        verify: ['photo:refill_counter'],
        rewards: { points: 10, streak: 'refill_ranger' },
        messages: {
          whatsapp: "🧼 Bring your empty—refill, don't rebuy. Want nearby refill spots?",
          web_subtitle: 'Monthly • less plastic',
        },
        empathy_note: 'No station nearby? Reuse bulk packs longer; decant into small bottles.',
        cta: { label: 'Find refill station', action_type: 'map', target: 'google_maps' },
        story_snippet: 'Refill runs cut plastic in our home by half—Aqsa',
      },
      {
        id: 'waste.repair_electronics_first',
        title: 'Repair electronics before replacing',
        category: 'waste',
        why: 'Extends device life and avoids e-waste.',
        how: ['Try battery/screen replacements first.', 'Ask for a repair quote.'],
        context_requirements: [],
        triggers: [{ type: 'event', value: 'device_fault' }],
        utility_model: {
          pkr_month: 500,
          minutes: 40,
          kgco2e_month: 3.0,
          source: 'Zerrah Model v1.0 (electronics lifecycle factors)',
          confidence: 0.7,
          user_equivalent: '≈ delaying one new phone/tablet purchase cycle',
        },
        effort: 3,
        fit_rules: [{ if: 'user.owns_old_devices=true', boost: 0.2 }],
        verify: ['photo:repair_invoice'],
        rewards: { points: 18, streak: 'fix_not_toss' },
        messages: {
          whatsapp: '🔧 Broken screen? Battery dying? Repair first—cheaper, greener. Need nearby shops?',
          web_subtitle: 'One-time • big save',
        },
        empathy_note: 'Ask for a quote first—repairs are often faster than you think.',
        cta: { label: 'Find repair shop', action_type: 'map', target: 'google_maps' },
        story_snippet: "A new battery gave Zoya's phone another year.",
      },
      {
        id: 'waste.recycle_metal_paper_drop',
        title: 'Monthly metal/paper drop-off',
        category: 'waste',
        why: 'Recycling these has strong markets & impact.',
        how: ["Keep a 'recyclables' box.", 'Drop monthly at nearest kabari/recycler.'],
        context_requirements: ['maps_access'],
        triggers: [{ type: 'rrule', value: 'FREQ=MONTHLY;BYDAY=SA;BYHOUR=10' }],
        utility_model: {
          pkr_month: 0,
          minutes: 30,
          kgco2e_month: 3.0,
          source: 'Zerrah Model v1.0 (recycling factors)',
          confidence: 0.75,
          user_equivalent: '≈ diverting a box of clean recyclables monthly',
        },
        effort: 2,
        fit_rules: [{ if: "user.city='Karachi'", boost: 0.1 }],
        verify: ['photo:dropoff_site'],
        rewards: { points: 14, streak: 'recycle_run' },
        messages: {
          whatsapp: '♻️ Box your metal/paper; 1st Saturday drop-off. Want the nearest recycler pinned?',
          web_subtitle: 'Monthly • real impact',
        },
        empathy_note: 'If weekends are hectic, pick any monthly date that sticks.',
        cta: { label: 'Pin nearest recycler', action_type: 'map', target: 'google_maps' },
        story_snippet: "A monthly 'recycle run' became a family ritual—Areeb",
      },
      {
        id: 'waste.bring_own_tiffin_takeout',
        title: 'Bring your own tiffin for takeout',
        category: 'waste',
        why: 'Avoids single-use boxes and keeps food hotter.',
        how: ['Keep a clean tiffin in car/bag.', 'Ask restaurant to pack in it.'],
        context_requirements: [],
        triggers: [{ type: 'event', value: 'dine_out_plan' }],
        utility_model: {
          pkr_month: 100,
          minutes: 5,
          kgco2e_month: 1.0,
          source: 'Zerrah Model v1.0 (single-use avoidance factors)',
          confidence: 0.8,
          user_equivalent: '≈ avoiding several plastic boxes monthly',
        },
        effort: 2,
        fit_rules: [{ if: 'user.eats_out_weekly=true', boost: 0.2 }],
        verify: ['photo:tiffin_packed'],
        rewards: { points: 10, streak: 'reusable_ready' },
        messages: {
          whatsapp: '🥘 Taking away? Ask them to pack in your tiffin—simple, sturdy, sustainable.',
          web_subtitle: 'On outings • less waste',
        },
        empathy_note: "Keep one in the car so you don't forget.",
        cta: { label: 'See restaurant script', action_type: 'open', target: 'tiffin_script_modal' },
        story_snippet: 'Tiffin routine = zero soggy boxes—Hiba',
      },
      {
        id: 'waste.bulk_buy_staples_low_packaging',
        title: 'Buy staples in bulk (low packaging)',
        category: 'waste',
        why: 'Less plastic per kg and fewer trips.',
        how: ['Buy larger packs of pulses/rice/flour.', 'Store in airtight jars.'],
        context_requirements: [],
        triggers: [{ type: 'event', value: 'pantry_low' }],
        utility_model: {
          pkr_month: 200,
          minutes: 10,
          kgco2e_month: 1.5,
          source: 'Zerrah Model v1.0 (packaging intensity factors)',
          confidence: 0.8,
          user_equivalent: '≈ fewer flimsy bags + fewer trips',
        },
        effort: 2,
        fit_rules: [{ if: 'user.has_storage_space=true', boost: 0.2 }],
        verify: ['photo:bulk_storage'],
        rewards: { points: 10, streak: 'bulk_saver' },
        messages: {
          whatsapp: '📦 Stock staples in bulk—less packaging, fewer runs. Need a storage checklist?',
          web_subtitle: 'Pantry smart • save trips',
        },
        empathy_note: 'No jars yet? Reuse cleaned bottles till you get airtight ones.',
        cta: { label: 'Open storage checklist', action_type: 'open', target: 'storage_checklist' },
        story_snippet: 'Bulk pulses made weekly shopping optional—Uzair',
      },
    ],
  };

  await seedCatalogFromJSON(catalogData);
}




