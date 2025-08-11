"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clothingCatalog = void 0;
exports.clothingCatalog = {
    catalogVersion: 'v1.0',
    domains: ['transport', 'food', 'home', 'clothing', 'waste'],
    cards: [
        {
            id: 'clothing_repair_first_kit',
            domain: 'clothing',
            action: 'Adopt a repair-first rule with a simple mending kit',
            levels: {
                start: 'Assemble needle, thread, buttons, and fabric glue.',
                levelUp: 'Fix one easy item (loose button, small tear) this week.',
                stretch: 'Schedule a monthly 20-minute fix session for minor repairs.'
            },
            enabler: 'Basic repair kit (needle, thread, fabric glue, spare buttons)',
            why: 'Extending garment life by 9 months can cut its footprint by ~20–30%.',
            chips: ['Micro (≤5m)', 'Low'],
            accessTags: ['home_access|basic_tools'],
            prerequisites: ['owns_clothes_needing_minor_repairs'],
            estImpactKgPerYear: 40,
            equivalents: ['≈200 km not driven', '≈2 tree-years'],
            fitWeights: { Strategist: 2, Trailblazer: 1, Coordinator: 0, Visionary: 1, Explorer: 1, Catalyst: 0, Builder: 2, Networker: 1, Steward: 2, Seed: 2 },
            behaviorDistance: 'small',
            priority: 5,
            personaOverlays: {
                Strategist: { tone: 'plan + track', nudge: 'Make a tiny “to-fix” list; do one item Friday.' },
                Trailblazer: { tone: 'quick trial', nudge: 'Glue/ stitch one loose edge today—fast win.' },
                Coordinator: { tone: 'togetherness', nudge: 'Offer a 10-min mend for a housemate’s button.' },
                Visionary: { tone: 'values & future', nudge: 'Care = less waste; fix one small thing today.' },
                Explorer: { tone: 'learn by doing', nudge: 'Try one mend; note what tool helped most.' },
                Catalyst: { tone: 'energize others', nudge: 'Share a before/after repair pic ✨.' },
                Builder: { tone: 'stepwise setup', nudge: 'Create a small “mend box” and park it by the desk.' },
                Networker: { tone: 'share resources', nudge: 'Post a quick video of your 2-minute button fix.' },
                Steward: { tone: 'quiet consistency', nudge: 'Fix one small thing each month—gentle upkeep.' },
                Seed: { tone: 'safe micro-start', nudge: 'Thread a needle once; that’s enough 🌱.' }
            }
        },
        {
            id: 'clothing_care_cold_airdry_depill',
            domain: 'clothing',
            action: 'Care to last: wash cold, air-dry, and de-pill knits',
            levels: {
                start: 'Set “cold” as default; hang one delicates load.',
                levelUp: 'Air-dry weekly basics; use a fabric shaver on knits.',
                stretch: 'Make air-dry your norm; rotate gentle-care items each week.'
            },
            enabler: 'Cold-active detergent + drying rack + fabric shaver',
            why: 'Gentle care reduces energy use and extends garment life—less frequent buying.',
            chips: ['Short (10–20m)', 'Low'],
            accessTags: ['laundry_access|indoor_rack_space'],
            prerequisites: ['has_washing_machine_access'],
            estImpactKgPerYear: 35,
            equivalents: ['≈175 km not driven', '≈1–2 tree-years'],
            fitWeights: { Strategist: 1, Trailblazer: 1, Coordinator: 0, Visionary: 1, Explorer: 1, Catalyst: 0, Builder: 1, Networker: 0, Steward: 2, Seed: 1 },
            behaviorDistance: 'small',
            priority: 4,
            personaOverlays: {
                Strategist: { tone: 'plan + track', nudge: 'Set cold + air-dry on your next load; tick it.' },
                Trailblazer: { tone: 'quick trial', nudge: 'Air-dry today’s top—see how it feels.' },
                Coordinator: { tone: 'togetherness', nudge: 'Share the rack for delicates day with housemates.' },
                Visionary: { tone: 'values & future', nudge: 'Care for what you own—less buying, more meaning.' },
                Explorer: { tone: 'learn by doing', nudge: 'Try a fabric shaver; note the improvement.' },
                Catalyst: { tone: 'energize others', nudge: 'Post a de-pill before/after knit ✨.' },
                Builder: { tone: 'stepwise setup', nudge: 'Add “air-dry” clips to your laundry checklist.' },
                Networker: { tone: 'share resources', nudge: 'Recommend a reliable fabric shaver brand.' },
                Steward: { tone: 'quiet consistency', nudge: 'Keep cold + air-dry weekly—calm routine.' },
                Seed: { tone: 'safe micro-start', nudge: 'Set the next wash to cold—done 🌱.' }
            }
        },
        {
            id: 'clothing_secondhand_first',
            domain: 'clothing',
            action: 'Make second-hand-first your search habit',
            levels: {
                start: 'Browse a thrift/resale app for your next item.',
                levelUp: 'Buy one second-hand wardrobe staple this month.',
                stretch: 'Default to second-hand for basics and occasion wear.'
            },
            enabler: 'Resale apps list + local thrift map',
            why: 'Buying used avoids production emissions and water—big win for fashion.',
            chips: ['Short (10–20m)', 'Low'],
            accessTags: ['resale_apps|thrift_store_nearby'],
            prerequisites: ['open_to_secondhand'],
            estImpactKgPerYear: 120,
            equivalents: ['≈600 km not driven', '≈6 tree-years'],
            fitWeights: { Strategist: 1, Trailblazer: 2, Coordinator: 0, Visionary: 1, Explorer: 2, Catalyst: 1, Builder: 1, Networker: 2, Steward: 1, Seed: 1 },
            behaviorDistance: 'medium',
            priority: 5,
            personaOverlays: {
                Strategist: { tone: 'plan + track', nudge: 'Add one staple to your second-hand wish list.' },
                Trailblazer: { tone: 'quick trial', nudge: 'Search your size now; save 2 favorites.' },
                Coordinator: { tone: 'togetherness', nudge: 'Plan a 20-min thrift stop with a friend.' },
                Visionary: { tone: 'values & future', nudge: 'Choose reuse—lighter on the planet and pocket.' },
                Explorer: { tone: 'learn by doing', nudge: 'Try one resale app; note fit/quality tips.' },
                Catalyst: { tone: 'energize others', nudge: 'Share your best find—spark the habit ✨.' },
                Builder: { tone: 'stepwise setup', nudge: 'Create a saved searches set for sizes/colors.' },
                Networker: { tone: 'share resources', nudge: 'Post your trusted sellers/shops list.' },
                Steward: { tone: 'quiet consistency', nudge: 'Check second-hand first—simple default.' },
                Seed: { tone: 'safe micro-start', nudge: 'Browse once today; save one item 🌱.' }
            }
        },
        {
            id: 'clothing_capsule_repeat_week',
            domain: 'clothing',
            action: 'Run a capsule “repeat outfit” week',
            levels: {
                start: 'Pick 5–7 pieces for the week; repeat outfits guilt-free.',
                levelUp: 'Extend to two weeks; note what you actually wear.',
                stretch: 'Build a small capsule list for each season.'
            },
            enabler: 'Simple capsule checklist template',
            why: 'Wearing what you have more cuts impulse buys and fashion waste.',
            chips: ['Short (10–20m)', 'No-spend'],
            accessTags: ['wardrobe_access'],
            prerequisites: ['open_to_capsule'],
            estImpactKgPerYear: 50,
            equivalents: ['≈250 km not driven', '≈2 tree-years'],
            fitWeights: { Strategist: 2, Trailblazer: 1, Coordinator: 0, Visionary: 1, Explorer: 1, Catalyst: 1, Builder: 2, Networker: 0, Steward: 2, Seed: 1 },
            behaviorDistance: 'small',
            priority: 4,
            personaOverlays: {
                Strategist: { tone: 'plan + track', nudge: 'Choose this week’s 7 pieces; list them.' },
                Trailblazer: { tone: 'quick trial', nudge: 'Repeat one outfit today—notice the ease.' },
                Coordinator: { tone: 'togetherness', nudge: 'Invite a friend to try a capsule week.' },
                Visionary: { tone: 'values & future', nudge: 'Less clutter, more space—see what stays.' },
                Explorer: { tone: 'learn by doing', nudge: 'Test a 5-piece set; note gaps/overlaps.' },
                Catalyst: { tone: 'energize others', nudge: 'Share a capsule grid pic ✨.' },
                Builder: { tone: 'stepwise setup', nudge: 'Create 3 repeatable outfits for work.' },
                Networker: { tone: 'share resources', nudge: 'Post a template for others to copy.' },
                Steward: { tone: 'quiet consistency', nudge: 'Repeat what works—steady and simple.' },
                Seed: { tone: 'safe micro-start', nudge: 'Pick tomorrow’s outfit now 🌱.' }
            }
        },
        {
            id: 'clothing_mend_tailor_monthly',
            domain: 'clothing',
            action: 'Mend or tailor one item per month',
            levels: {
                start: 'Pick one item to mend or tailor this month.',
                levelUp: 'Book a local tailor or DIY; set a date.',
                stretch: 'Keep a monthly slot to refresh/fit what you own.'
            },
            enabler: 'Local tailor finder + simple DIY guides',
            why: 'Tailoring extends useful life and improves fit—less new buying.',
            chips: ['Short (10–20m)', 'Low'],
            accessTags: ['tailor_nearby|diy_friendly'],
            prerequisites: ['has_item_to_mend_or_tailor'],
            estImpactKgPerYear: 30,
            equivalents: ['≈150 km not driven', '≈1 tree-year'],
            fitWeights: { Strategist: 2, Trailblazer: 1, Coordinator: 0, Visionary: 1, Explorer: 1, Catalyst: 0, Builder: 2, Networker: 1, Steward: 2, Seed: 1 },
            behaviorDistance: 'small',
            priority: 3,
            personaOverlays: {
                Strategist: { tone: 'plan + track', nudge: 'Drop a calendar block: “Mend 1 item”.' },
                Trailblazer: { tone: 'quick trial', nudge: 'Pin/hem one item today—quick win.' },
                Coordinator: { tone: 'togetherness', nudge: 'Ask the group for best local tailor recs.' },
                Visionary: { tone: 'values & future', nudge: 'Fit what you love—buy less, cherish more.' },
                Explorer: { tone: 'learn by doing', nudge: 'Try one DIY mend; note what you’d outsource.' },
                Catalyst: { tone: 'energize others', nudge: 'Share a refreshed fit photo ✨.' },
                Builder: { tone: 'stepwise setup', nudge: 'Create a small queue: hem, button, seam.' },
                Networker: { tone: 'share resources', nudge: 'List two trusted tailors in your area.' },
                Steward: { tone: 'quiet consistency', nudge: 'One item monthly—gentle upkeep.' },
                Seed: { tone: 'safe micro-start', nudge: 'Pick the item; set it by the door 🌱.' }
            }
        },
        {
            id: 'clothing_swap_event_friends',
            domain: 'clothing',
            action: 'Host or join a small clothing swap with friends',
            levels: {
                start: 'Invite 2–3 friends; each bring 3 items.',
                levelUp: 'Make a 1-hour swap—simple rules, tea, good vibes.',
                stretch: 'Repeat monthly or rotate hosts; donate leftovers.'
            },
            enabler: 'Simple swap guide + checklist (sizes, rules, donate box)',
            why: 'Swapping keeps clothes in use and avoids new production.',
            chips: ['Weekend (1–3h)', 'No-spend'],
            accessTags: ['community|friends_group'],
            prerequisites: ['has_items_to_swap'],
            estImpactKgPerYear: 60,
            equivalents: ['≈300 km not driven', '≈3 tree-years'],
            fitWeights: { Strategist: 0, Trailblazer: 1, Coordinator: 2, Visionary: 1, Explorer: 1, Catalyst: 2, Builder: 1, Networker: 2, Steward: 1, Seed: 1 },
            behaviorDistance: 'medium',
            priority: 4,
            personaOverlays: {
                Strategist: { tone: 'plan + track', nudge: 'Pick a date; share a tiny agenda.' },
                Trailblazer: { tone: 'quick trial', nudge: 'Start a 3-item mini swap this weekend.' },
                Coordinator: { tone: 'togetherness', nudge: 'Create a group chat + size list; go.' },
                Visionary: { tone: 'values & future', nudge: 'Make sharing normal—style, not waste.' },
                Explorer: { tone: 'learn by doing', nudge: 'Try a new look; note fit/feel for next time.' },
                Catalyst: { tone: 'energize others', nudge: 'Post a swap invite graphic ✨.' },
                Builder: { tone: 'stepwise setup', nudge: 'Prepare donate box; set quick rules.' },
                Networker: { tone: 'share resources', nudge: 'Tag a local charity for leftovers.' },
                Steward: { tone: 'quiet consistency', nudge: 'Keep it small and regular—easy cadence.' },
                Seed: { tone: 'safe micro-start', nudge: 'Ask two friends if they’d trade one item 🌱.' }
            }
        },
        {
            id: 'clothing_pause_24hr_rule',
            domain: 'clothing',
            action: 'Use a 24-hour pause-to-consider rule before buying',
            levels: {
                start: 'Add to cart; wait 24 hours before purchase.',
                levelUp: 'Ask 3 questions: need, versatility, care effort.',
                stretch: 'Make pause-to-consider your default for all apparel buys.'
            },
            enabler: 'Simple 3-question checklist in notes app',
            why: 'Pausing reduces impulse buys and waste—less return shipping and unused items.',
            chips: ['Micro (≤5m)', 'No-spend'],
            accessTags: ['online_shopping'],
            prerequisites: ['shops_online'],
            estImpactKgPerYear: 25,
            equivalents: ['≈125 km not driven', '≈1 tree-year'],
            fitWeights: { Strategist: 2, Trailblazer: 0, Coordinator: 0, Visionary: 1, Explorer: 1, Catalyst: 1, Builder: 2, Networker: 1, Steward: 2, Seed: 2 },
            behaviorDistance: 'small',
            priority: 3,
            personaOverlays: {
                Strategist: { tone: 'plan + track', nudge: 'Save item; set a 24h reminder.' },
                Trailblazer: { tone: 'quick trial', nudge: 'Try the 24h pause once—notice the urge fade.' },
                Coordinator: { tone: 'togetherness', nudge: 'Share your 3 checks with a friend.' },
                Visionary: { tone: 'values & future', nudge: 'Buy what fits your values—slow and sure.' },
                Explorer: { tone: 'learn by doing', nudge: 'Note how many carts you abandon this week.' },
                Catalyst: { tone: 'energize others', nudge: 'Post your 3-question rule card ✨.' },
                Builder: { tone: 'stepwise setup', nudge: 'Pin the checklist to your phone’s home screen.' },
                Networker: { tone: 'share resources', nudge: 'Share a wallet-friendly brand with good care info.' },
                Steward: { tone: 'quiet consistency', nudge: 'Keep the 24h pause—calm and steady.' },
                Seed: { tone: 'safe micro-start', nudge: 'Wait 1 hour today; that’s a start 🌱.' }
            }
        }
    ],
    meta: {
        equivalences: { carKgPerKm: 0.20, treeKgPerYear: 21, coffeeKgPerCup: 0.28, burgerKgPerBurger: 3.0 }
    }
};
