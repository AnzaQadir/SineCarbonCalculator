import { Catalog } from '../types/recommendationCatalog';

export const clothingCatalog: Catalog = {
  catalogVersion: 'v1.0',
  domains: ['transport', 'food', 'home', 'clothing', 'waste'],
  cards: [
    {
      id: 'clothing_repair_first_kit',
      domain: 'clothing',
      action: 'Create a tiny repair kit so small fixes become effortless.',
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
      action: 'Wash on cold and air-dry a few clothes to make them last longer.',
      levels: {
        start: 'Set "cold" as default; hang one delicates load.',
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
      action: 'Search second-hand before buying new to save money and emissions.',
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
      action: 'Repeat outfits for a week using 4 simple pieces.',
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
      action: 'Pick one item to mend or tailor each month.',
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
      action: 'Do a small clothing swap with 2–3 friends.',
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
      action: 'Use a 24-hour pause before buying clothes online.',
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
        Builder: { tone: 'stepwise setup', nudge: 'Pin the checklist to your phone\'s home screen.' },
        Networker: { tone: 'share resources', nudge: 'Share a wallet-friendly brand with good care info.' },
        Steward: { tone: 'quiet consistency', nudge: 'Keep the 24h pause—calm and steady.' },
        Seed: { tone: 'safe micro-start', nudge: 'Wait 1 hour today; that\'s a start 🌱.' }
      }
    },
    {
      id: 'clothing_one_in_one_out_donate',
      domain: 'clothing',
      action: 'Donate one item each time you buy new clothes.',
      levels: {
        start: 'When you buy something new, pick 1 item to donate.',
        levelUp: 'Make "1 in, 1 out" your rule for all clothing buys.',
        stretch: 'Upgrade to "1 in, 2 out" until your wardrobe feels light.'
      },
      enabler: 'Donation bag/box near your closet + list of nearby charities.',
      why: 'Keeps your wardrobe balanced and passes good clothes to people who can use them.',
      chips: ['Micro (≤5m)', 'No-spend'],
      accessTags: ['wardrobe_access|donation_dropoff_nearby'],
      prerequisites: ['buys_new_clothes_regularly'],
      estImpactKgPerYear: 80,
      equivalents: ['≈400 km not driven', '≈4 tree-years'],
      fitWeights: { Strategist: 2, Trailblazer: 1, Coordinator: 1, Visionary: 1, Explorer: 0, Catalyst: 1, Builder: 2, Networker: 1, Steward: 2, Seed: 1 },
      behaviorDistance: 'medium',
      priority: 4,
      personaOverlays: {
        Strategist: { tone: 'plan + track', nudge: 'Add a "1 in, 1 out" note to your shopping list.' },
        Trailblazer: { tone: 'quick trial', nudge: 'Next buy? Drop 1 item in the donation bag—instant win.' },
        Coordinator: { tone: 'togetherness', nudge: 'Ask your household to share the same donate rule.' },
        Visionary: { tone: 'values & future', nudge: 'Let every new piece fund a small act of generosity.' },
        Explorer: { tone: 'learn by doing', nudge: 'Try the rule once this month and see how it feels.' },
        Catalyst: { tone: 'energize others', nudge: 'Share your "1 in, 1 out" rule on socials ✨.' },
        Builder: { tone: 'stepwise setup', nudge: 'Place a labeled donation box by your closet today.' },
        Networker: { tone: 'share resources', nudge: 'List one trusted charity or thrift drop-off spot.' },
        Steward: { tone: 'quiet consistency', nudge: 'Quietly keep the rule—small, steady decluttering.' },
        Seed: { tone: 'safe micro-start', nudge: 'Choose one rarely-used item and set it aside 🌱.' }
      }
    },
    {
      id: 'clothing_air_out_rewear',
      domain: 'clothing',
      action: 'Air out outfits so you can rewear before washing.',
      levels: {
        start: 'Hang today\'s clothes on a chair or hook instead of tossing in the wash.',
        levelUp: 'Pick 2–3 low-sweat items (jeans, sweaters) to rewear this week.',
        stretch: 'Make a quick "sniff + spot check" your default before every wash.'
      },
      enabler: 'A dedicated "rewear chair" or hooks/rail in your room.',
      why: 'Rewearing clean-enough clothes cuts laundry loads, saves energy, and keeps fabrics strong.',
      chips: ['Micro (≤5m)', 'Low'],
      accessTags: ['home_access|closet_space'],
      prerequisites: ['has_everyday_clothes'],
      estImpactKgPerYear: 20,
      equivalents: ['≈100 km not driven', '≈1 tree-year'],
      fitWeights: { Strategist: 1, Trailblazer: 1, Coordinator: 0, Visionary: 1, Explorer: 1, Catalyst: 0, Builder: 1, Networker: 0, Steward: 2, Seed: 2 },
      behaviorDistance: 'small',
      priority: 3,
      personaOverlays: {
        Strategist: { tone: 'plan + track', nudge: 'Pick one "rewear spot" today and use it tonight.' },
        Trailblazer: { tone: 'quick trial', nudge: 'Air out today\'s outfit once and notice the difference.' },
        Coordinator: { tone: 'togetherness', nudge: 'Suggest a shared "rewear hook" in the house.' },
        Visionary: { tone: 'values & future', nudge: 'Less washing = longer garment life and lower footprint.' },
        Explorer: { tone: 'learn by doing', nudge: 'Test rewearing jeans once; note if you really needed a wash.' },
        Catalyst: { tone: 'energize others', nudge: 'Share your "rewear chair" setup pic ✨.' },
        Builder: { tone: 'stepwise setup', nudge: 'Add one wall hook or chair dedicated to rewear items.' },
        Networker: { tone: 'share resources', nudge: 'Trade tips with a friend on rewearing without over-washing.' },
        Steward: { tone: 'quiet consistency', nudge: 'Gently rewear low-sweat items each week—calm routine.' },
        Seed: { tone: 'safe micro-start', nudge: 'Hang one item instead of washing it today 🌱.' }
      }
    },
    {
      id: 'clothing_buy_30_wear_mindset',
      domain: 'clothing',
      action: 'Use the "30 wears" rule before buying clothes.',
      levels: {
        start: 'Ask "Will I wear this at least 10 times?" before your next buy.',
        levelUp: 'Upgrade to a "30+ wears" rule for basics and workwear.',
        stretch: 'Keep a tiny list of "workhorse" pieces you reach for every week.'
      },
      enabler: '3-question checklist in your notes (occasions, outfits, care).',
      why: 'Choosing pieces you\'ll wear often cuts impulse buys, saves money, and reduces fashion waste.',
      chips: ['Micro (≤5m)', 'No-spend'],
      accessTags: ['online_shopping|in_store_shopping'],
      prerequisites: ['plans_to_buy_clothes'],
      estImpactKgPerYear: 60,
      equivalents: ['≈300 km not driven', '≈3 tree-years'],
      fitWeights: { Strategist: 2, Trailblazer: 1, Coordinator: 0, Visionary: 2, Explorer: 1, Catalyst: 1, Builder: 2, Networker: 1, Steward: 2, Seed: 2 },
      behaviorDistance: 'small',
      priority: 4,
      personaOverlays: {
        Strategist: { tone: 'plan + track', nudge: 'Add "30 wears?" as a checkbox to your shopping list.' },
        Trailblazer: { tone: 'quick trial', nudge: 'Try the 30-wears question on your very next scroll-buy.' },
        Coordinator: { tone: 'togetherness', nudge: 'Share the rule with a friend as an "accountability pact".' },
        Visionary: { tone: 'values & future', nudge: 'Choose clothes that match your future self, not a momentary mood.' },
        Explorer: { tone: 'learn by doing', nudge: 'Review your last 5 buys—how many hit 10 wears?' },
        Catalyst: { tone: 'energize others', nudge: 'Post your 30-wears rule as a story template ✨.' },
        Builder: { tone: 'stepwise setup', nudge: 'Write 3 go-to outfits you\'d use this item in.' },
        Networker: { tone: 'share resources', nudge: 'Swap "30-wear favorites" lists with a friend.' },
        Steward: { tone: 'quiet consistency', nudge: 'Let the 30-wears rule quietly guide every purchase.' },
        Seed: { tone: 'safe micro-start', nudge: 'Ask "Will I wear this 3 times?" today—that\'s enough 🌱.' }
      }
    },
    {
      id: 'clothing_natural_fibres_basics',
      domain: 'clothing',
      action: 'Pick natural or durable fibres when replacing basics.',
      levels: {
        start: 'Check the label and choose cotton/linen/wool for your next basic.',
        levelUp: 'Prioritize natural/durable blends for tees, jeans, socks, and everyday wear.',
        stretch: 'Keep a short list of brands with sturdy, repair-friendly fabrics.'
      },
      enabler: 'Note on your phone of fabrics/brands you trust.',
      why: 'Sturdier fabrics last longer, feel better, and often shed fewer microplastics.',
      chips: ['Short (10–20m)', 'Low'],
      accessTags: ['in_store_shopping|online_shopping'],
      prerequisites: ['open_to_label_checking'],
      estImpactKgPerYear: 30,
      equivalents: ['≈150 km not driven', '≈1–2 tree-years'],
      fitWeights: { Strategist: 1, Trailblazer: 1, Coordinator: 0, Visionary: 2, Explorer: 1, Catalyst: 0, Builder: 1, Networker: 0, Steward: 2, Seed: 1 },
      behaviorDistance: 'medium',
      priority: 3,
      personaOverlays: {
        Strategist: { tone: 'plan + track', nudge: 'Add "check fabric label" as a tiny shopping rule.' },
        Trailblazer: { tone: 'quick trial', nudge: 'Next buy: choose the more durable fabric once and feel the difference.' },
        Coordinator: { tone: 'togetherness', nudge: 'Share one fabric tip with family before a shopping trip.' },
        Visionary: { tone: 'values & future', nudge: 'Invest in pieces that last—less churn, more intention.' },
        Explorer: { tone: 'learn by doing', nudge: 'Compare two fabrics side by side; notice weight and feel.' },
        Catalyst: { tone: 'energize others', nudge: 'Post a quick "how to read labels" story ✨.' },
        Builder: { tone: 'stepwise setup', nudge: 'Create a mini list: "yes fabrics" and "avoid fabrics".' },
        Networker: { tone: 'share resources', nudge: 'Ask your circle for their favorite long-lasting brands.' },
        Steward: { tone: 'quiet consistency', nudge: 'Quietly pick sturdy fabrics each time—small, strong habit.' },
        Seed: { tone: 'safe micro-start', nudge: 'Read one clothing label today; that\'s enough 🌱.' }
      }
    },
    {
      id: 'clothing_borrow_for_events',
      domain: 'clothing',
      action: 'Borrow or rent outfits for weddings and big events.',
      levels: {
        start: 'For your next event, ask a friend or family member to borrow an outfit.',
        levelUp: 'Create a small "occasionwear circle" with 2–3 people you swap with.',
        stretch: 'Default to borrow/rent for rare, formal events instead of buying new.'
      },
      enabler: 'Friends/family chat and a shared album of outfits and sizes.',
      why: 'Special-event outfits are worn rarely; borrowing saves money and avoids one-off purchases.',
      chips: ['Short (10–20m)', 'No-spend'],
      accessTags: ['community|friends_group'],
      prerequisites: ['attends_formal_events'],
      estImpactKgPerYear: 40,
      equivalents: ['≈200 km not driven', '≈2 tree-years'],
      fitWeights: { Strategist: 0, Trailblazer: 1, Coordinator: 2, Visionary: 1, Explorer: 1, Catalyst: 2, Builder: 1, Networker: 2, Steward: 1, Seed: 1 },
      behaviorDistance: 'medium',
      priority: 4,
      personaOverlays: {
        Strategist: { tone: 'plan + track', nudge: 'Note your next event and who you could borrow from.' },
        Trailblazer: { tone: 'quick trial', nudge: 'Ask one trusted friend for a dress/suit this season—see how it goes.' },
        Coordinator: { tone: 'togetherness', nudge: 'Start a small swap circle for formalwear in your group chat.' },
        Visionary: { tone: 'values & future', nudge: 'Make glamour about style and sharing, not constant buying.' },
        Explorer: { tone: 'learn by doing', nudge: 'Try one borrowed outfit; notice compliments and comfort.' },
        Catalyst: { tone: 'energize others', nudge: 'Share a "borrowed, not bought" event look ✨.' },
        Builder: { tone: 'stepwise setup', nudge: 'Create a shared album for event outfits and sizes.' },
        Networker: { tone: 'share resources', nudge: 'Tag friends in a "who wants to swap occasionwear?" post.' },
        Steward: { tone: 'quiet consistency', nudge: 'Calmly default to borrowing for rare events.' },
        Seed: { tone: 'safe micro-start', nudge: 'For one upcoming event, just ask if borrowing is an option 🌱.' }
      }
    },
    {
      id: 'clothing_store_properly_care',
      domain: 'clothing',
      action: 'Store clothes properly so they keep their shape and last longer.',
      levels: {
        start: 'Fold heavy knits instead of hanging to avoid stretching.',
        levelUp: 'Do a 15-minute closet reset: refold knits, hang shirts, group by use.',
        stretch: 'Seasonally refresh storage (dry place, moth protection, labeled boxes).'
      },
      enabler: 'Shelves, drawers, and a few breathable bags or boxes.',
      why: 'Good storage prevents stretching, damage, and mildew, so you replace fewer clothes.',
      chips: ['Short (10–20m)', 'Low'],
      accessTags: ['wardrobe_access'],
      prerequisites: ['has_closet_or_drawers'],
      estImpactKgPerYear: 15,
      equivalents: ['≈75 km not driven', '≈1 tree-year (rounded)'],
      fitWeights: { Strategist: 1, Trailblazer: 0, Coordinator: 0, Visionary: 1, Explorer: 0, Catalyst: 0, Builder: 2, Networker: 0, Steward: 2, Seed: 2 },
      behaviorDistance: 'small',
      priority: 3,
      personaOverlays: {
        Strategist: { tone: 'plan + track', nudge: 'Block 15 minutes this week for a mini closet tune-up.' },
        Trailblazer: { tone: 'quick trial', nudge: 'Refold just one chunky sweater today—feel the tidy win.' },
        Coordinator: { tone: 'togetherness', nudge: 'Turn it into a small shared tidy-up with a housemate.' },
        Visionary: { tone: 'values & future', nudge: 'Protect what you own so you can buy less over time.' },
        Explorer: { tone: 'learn by doing', nudge: 'Experiment with one new way of folding or storing knits.' },
        Catalyst: { tone: 'energize others', nudge: 'Share a before/after closet snap ✨.' },
        Builder: { tone: 'stepwise setup', nudge: 'Tackle one shelf at a time, not the whole closet.' },
        Networker: { tone: 'share resources', nudge: 'Ask a friend for their favorite storage hack.' },
        Steward: { tone: 'quiet consistency', nudge: 'Keep gently refolding knits over time—no big overhaul needed.' },
        Seed: { tone: 'safe micro-start', nudge: 'Fold one heavy knit off a hanger today 🌱.' }
      }
    }
  ],
  meta: {
    equivalences: { carKgPerKm: 0.20, treeKgPerYear: 21, coffeeKgPerCup: 0.28, burgerKgPerBurger: 3.0 }
  }
};


