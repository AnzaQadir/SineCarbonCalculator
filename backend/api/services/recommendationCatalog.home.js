"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.homeCatalog = void 0;
exports.homeCatalog = {
    catalogVersion: 'v1.0',
    domains: ['transport', 'food', 'home', 'clothing', 'waste'],
    cards: [
        {
            id: 'home_led_sweep',
            domain: 'home',
            action: 'Swap a few of your most-used bulbs to LEDs.',
            levels: {
                start: 'Replace your 3 most-used bulbs (kitchen, living room, hallway).',
                levelUp: 'Swap remaining high-use bulbs and add a ‘lights off when leaving’ habit.',
                stretch: 'Complete a whole-home LED sweep and label switches for guests.'
            },
            enabler: 'LED multipack + simple home fixture map',
            why: 'LEDs use ~75–80% less electricity than incandescents—steady savings each day.',
            chips: ['Short (10–20m)', 'Low'],
            accessTags: ['grid_energy|mixed_energy'],
            prerequisites: ['has_replaceable_bulbs'],
            estImpactKgPerYear: 150,
            equivalents: ['≈750 km not driven', '≈7 tree-years'],
            fitWeights: { Strategist: 2, Trailblazer: 1, Coordinator: 0, Visionary: 1, Explorer: 1, Catalyst: 0, Builder: 2, Networker: 1, Steward: 1, Seed: 1 },
            behaviorDistance: 'small',
            priority: 5,
            personaOverlays: {
                Strategist: { tone: 'plan + track', nudge: 'Sat 10am: swap 3 bulbs; check them off your list.' },
                Trailblazer: { tone: 'quick trial', nudge: 'Swap the brightest bulb today—feel the instant win.' },
                Coordinator: { tone: 'togetherness', nudge: 'Split a bulk LED pack with a neighbor.' },
                Visionary: { tone: 'values & future', nudge: 'Softer light, lower energy—start with one room you love.' },
                Explorer: { tone: 'learn by doing', nudge: 'Before/after meter reading? Snap a pic for yourself.' },
                Catalyst: { tone: 'energize others', nudge: 'Host a 15-min ‘bulb swap’ sprint in your group chat ✨.' },
                Builder: { tone: 'stepwise setup', nudge: 'Make a fixture checklist; finish one area per week.' },
                Networker: { tone: 'share resources', nudge: 'Post your best local deal on long-life LEDs.' },
                Steward: { tone: 'quiet consistency', nudge: 'Replace a few each week—gentle progress adds up.' },
                Seed: { tone: 'safe micro-start', nudge: 'Just change one bulb today. That’s enough 🌱.' }
            }
        },
        {
            id: 'home_thermostat_1c',
            domain: 'home',
            action: 'Nudge your thermostat by 1°C and keep a simple schedule.',
            levels: {
                start: 'Shift by 1°C for a week (warmer in summer, cooler in winter).',
                levelUp: 'Set a daily schedule (sleep/away) that fits your routine.',
                stretch: 'Add seasonal tweaks (curtains, fans, drafts) for extra comfort with less energy.'
            },
            enabler: 'Programmable/smart thermostat or a paper schedule card',
            why: 'A 1°C change can trim heating/cooling use by a few percent—quiet savings all season.',
            chips: ['Short (10–20m)', 'No-spend'],
            accessTags: ['has_thermostat|ac_heating'],
            prerequisites: ['has_heating_or_cooling'],
            estImpactKgPerYear: 180,
            equivalents: ['≈900 km not driven', '≈9 tree-years'],
            fitWeights: { Strategist: 2, Trailblazer: 1, Coordinator: 0, Visionary: 1, Explorer: 1, Catalyst: 0, Builder: 2, Networker: 0, Steward: 1, Seed: 1 },
            behaviorDistance: 'small',
            priority: 5,
            personaOverlays: {
                Strategist: { tone: 'plan + track', nudge: 'Sun 8pm: set next week’s temp schedule in 10 minutes.' },
                Trailblazer: { tone: 'quick trial', nudge: 'Nudge 1°C now—see if comfort still feels good.' },
                Coordinator: { tone: 'togetherness', nudge: 'Align with housemates on a shared temp plan.' },
                Visionary: { tone: 'values & future', nudge: 'A calmer home that uses less—choose your sweet spot.' },
                Explorer: { tone: 'learn by doing', nudge: 'Test daytime vs evening settings; note what works.' },
                Catalyst: { tone: 'energize others', nudge: 'Share your new schedule—invite a friend to try.' },
                Builder: { tone: 'stepwise setup', nudge: 'Create ‘home/away/sleep’ presets you can reuse.' },
                Networker: { tone: 'share resources', nudge: 'Post a quick how-to for your thermostat model.' },
                Steward: { tone: 'quiet consistency', nudge: 'Keep the 1°C shift steady—gentle savings, all season.' },
                Seed: { tone: 'safe micro-start', nudge: 'Try a tiny 1°C change today. That’s the whole task 🌱.' }
            }
        },
        {
            id: 'home_hotwater_showers',
            domain: 'home',
            action: 'Shorten showers slightly and turn off hot water while soaping.',
            levels: {
                start: 'Cut showers by ~1 minute and turn off tap while soaping.',
                levelUp: 'Install a low-flow showerhead or aerator; set a simple timer.',
                stretch: 'Set your water heater to an efficient, safe temperature per local guidance.'
            },
            enabler: 'Low-flow showerhead + 5-minute shower timer',
            why: 'Heating water is energy-intensive; small daily tweaks save steadily.',
            chips: ['Short (10–20m)', 'Low'],
            accessTags: ['water_heater_access|shower_access'],
            prerequisites: ['electric_or_gas_water_heater'],
            estImpactKgPerYear: 100,
            equivalents: ['≈500 km not driven', '≈5 tree-years'],
            fitWeights: { Strategist: 1, Trailblazer: 1, Coordinator: 0, Visionary: 1, Explorer: 1, Catalyst: 0, Builder: 1, Networker: 0, Steward: 2, Seed: 1 },
            behaviorDistance: 'small',
            priority: 4,
            personaOverlays: {
                Strategist: { tone: 'plan + track', nudge: 'Place a 5-min timer in the bathroom—log one win.' },
                Trailblazer: { tone: 'quick trial', nudge: 'Try a 1-minute shorter shower today—easy win.' },
                Coordinator: { tone: 'togetherness', nudge: 'Share the timer idea with housemates for fun.' },
                Visionary: { tone: 'values & future', nudge: 'A calmer, lighter routine—less heat, same comfort.' },
                Explorer: { tone: 'learn by doing', nudge: 'Test the new showerhead; note comfort afterwards.' },
                Catalyst: { tone: 'energize others', nudge: 'Start a ‘5-minute shower’ challenge in your circle ✨.' },
                Builder: { tone: 'stepwise setup', nudge: 'Create a bathroom card: timer, towel, tap-off reminder.' },
                Networker: { tone: 'share resources', nudge: 'Drop a link to a reliable low-flow model that you like.' },
                Steward: { tone: 'quiet consistency', nudge: 'Keep the shorter shower—small care, daily.' },
                Seed: { tone: 'safe micro-start', nudge: 'Turn off the tap once while soaping today 🌱.' }
            }
        },
        {
            id: 'home_vampire_power_strip',
            domain: 'home',
            action: 'Put standby devices on a switchable strip and turn them fully off.',
            levels: {
                start: 'Set up one ‘entertainment corner’ on a power strip and switch off when done.',
                levelUp: 'Add two more zones (office chargers, console area).',
                stretch: 'Whole-home standby sweep: label strips and make off the default.'
            },
            enabler: 'Switchable power strip or smart plug; simple zone labels',
            why: 'Standby loads can be a quiet 5–10% of home electricity—easy to trim.',
            chips: ['Micro (≤5m)', 'Low'],
            accessTags: ['power_strips'],
            prerequisites: ['has_standby_devices'],
            estImpactKgPerYear: 80,
            equivalents: ['≈400 km not driven', '≈4 tree-years'],
            fitWeights: { Strategist: 2, Trailblazer: 1, Coordinator: 0, Visionary: 0, Explorer: 0, Catalyst: 0, Builder: 2, Networker: 1, Steward: 1, Seed: 1 },
            behaviorDistance: 'small',
            priority: 4,
            personaOverlays: {
                Strategist: { tone: 'plan + track', nudge: 'Tonight: set up one zone; tick it off your list.' },
                Trailblazer: { tone: 'quick trial', nudge: 'Unplug/switch off the TV corner after your next show.' },
                Coordinator: { tone: 'togetherness', nudge: 'Ask housemates to try the ‘off’ habit this week.' },
                Visionary: { tone: 'values & future', nudge: 'A calmer home, fewer glowing lights—flip the switch.' },
                Explorer: { tone: 'learn by doing', nudge: 'Test one zone for a week; note if anything was missed.' },
                Catalyst: { tone: 'energize others', nudge: 'Share your labeled strip setup—copy it, friends ✨.' },
                Builder: { tone: 'stepwise setup', nudge: 'Create 3 zones; add small labels: TV, desk, chargers.' },
                Networker: { tone: 'share resources', nudge: 'Recommend a reliable strip that worked for you.' },
                Steward: { tone: 'quiet consistency', nudge: 'Flip it off each night—easy, steady savings.' },
                Seed: { tone: 'safe micro-start', nudge: 'Switch off one device corner once today 🌱.' }
            }
        },
        {
            id: 'home_cold_wash_offpeak',
            domain: 'home',
            action: 'Set your next laundry load to cold and wash only full loads.',
            levels: {
                start: 'Switch detergent and set ‘cold’ as your default.',
                levelUp: 'Run full loads and schedule off-peak where available.',
                stretch: 'Air-dry delicate items; keep cold as your norm.'
            },
            enabler: 'Cold-active detergent + quick machine settings guide',
            why: 'Cold washes cut hot-water energy; grouping loads reduces wasteful cycles.',
            chips: ['Micro (≤5m)', 'Low'],
            accessTags: ['laundry_access'],
            prerequisites: ['has_washing_machine_access'],
            estImpactKgPerYear: 60,
            equivalents: ['≈300 km not driven', '≈3 tree-years'],
            fitWeights: { Strategist: 1, Trailblazer: 1, Coordinator: 0, Visionary: 1, Explorer: 1, Catalyst: 0, Builder: 1, Networker: 1, Steward: 2, Seed: 1 },
            behaviorDistance: 'small',
            priority: 3,
            personaOverlays: {
                Strategist: { tone: 'plan + track', nudge: 'Set ‘cold’ once—your machine will remember.' },
                Trailblazer: { tone: 'quick trial', nudge: 'Try cold on your next load—see if it cleans just fine.' },
                Coordinator: { tone: 'togetherness', nudge: 'Share off-peak hours with housemates on the fridge.' },
                Visionary: { tone: 'values & future', nudge: 'Gentler on clothes, gentler on energy—choose cold.' },
                Explorer: { tone: 'learn by doing', nudge: 'Note which detergent worked best for cold cycles.' },
                Catalyst: { tone: 'energize others', nudge: 'Post a ‘cold-only’ challenge for this week ✨.' },
                Builder: { tone: 'stepwise setup', nudge: 'Create a simple laundry routine: full loads, off-peak.' },
                Networker: { tone: 'share resources', nudge: 'Recommend your go-to cold-wash detergent.' },
                Steward: { tone: 'quiet consistency', nudge: 'Keep cold as default—small, steady savings.' },
                Seed: { tone: 'safe micro-start', nudge: 'Set your next load to cold. That’s the task 🌱.' }
            }
        },
        {
            id: 'home_line_dry_two_loads',
            domain: 'home',
            action: 'Air-dry at least one laundry load each week.',
            levels: {
                start: 'Air-dry one load this week (towels or shirts).',
                levelUp: 'Make it two loads/week; keep the dryer for heavy linens.',
                stretch: 'Air-dry most loads; use dryer only when truly needed.'
            },
            enabler: 'Folding rack or clothesline + clothespins',
            why: 'Skipping the dryer saves electricity/gas and keeps clothes lasting longer.',
            chips: ['Short (10–20m)', 'Low'],
            accessTags: ['balcony|outdoor_space|indoor_rack_space'],
            prerequisites: ['has_space_to_dry'],
            estImpactKgPerYear: 70,
            equivalents: ['≈350 km not driven', '≈3 tree-years'],
            fitWeights: { Strategist: 1, Trailblazer: 1, Coordinator: 0, Visionary: 1, Explorer: 1, Catalyst: 0, Builder: 1, Networker: 0, Steward: 2, Seed: 1 },
            behaviorDistance: 'medium',
            priority: 3,
            personaOverlays: {
                Strategist: { tone: 'plan + track', nudge: 'Pick two weekly slots to hang laundry—repeat.' },
                Trailblazer: { tone: 'quick trial', nudge: 'Air-dry today’s load—see how fast it goes.' },
                Coordinator: { tone: 'togetherness', nudge: 'Share the rack schedule so everyone gets a turn.' },
                Visionary: { tone: 'values & future', nudge: 'Sun + breeze = gentle energy—choose line-drying.' },
                Explorer: { tone: 'learn by doing', nudge: 'Test different spots; note which dries quickest.' },
                Catalyst: { tone: 'energize others', nudge: 'Share a cozy line-dry photo to inspire ✨.' },
                Builder: { tone: 'stepwise setup', nudge: 'Assemble the rack; store it by the machine for ease.' },
                Networker: { tone: 'share resources', nudge: 'Recommend a sturdy rack that fits small spaces.' },
                Steward: { tone: 'quiet consistency', nudge: 'Keep two air-dry loads/week—gentle, steady habit.' },
                Seed: { tone: 'safe micro-start', nudge: 'Hang just five items to dry today 🌱.' }
            }
        },
        {
            id: 'home_energy_audit_seal_leaks',
            domain: 'home',
            action: 'Check your home for drafts and seal one small gap.',
            levels: {
                start: 'Request a free/low-cost energy check or do a quick self-audit.',
                levelUp: 'Seal door/window gaps with simple weatherstripping; insulate hot-water pipes.',
                stretch: 'Plan bigger upgrades (attic insulation, smart thermostat) when ready.'
            },
            enabler: 'Utility audit program locator + DIY weatherstripping kit',
            why: 'Audits surface fixes that can cut heating/cooling waste—often the biggest home win.',
            chips: ['Weekend (1–3h)', 'Low'],
            accessTags: ['utility_audit_program|diy_friendly'],
            prerequisites: ['has_control_over_home OR permission_from_landlord'],
            estImpactKgPerYear: 250,
            equivalents: ['≈1250 km not driven', '≈12 tree-years'],
            fitWeights: { Strategist: 2, Trailblazer: 1, Coordinator: 0, Visionary: 1, Explorer: 1, Catalyst: 0, Builder: 2, Networker: 1, Steward: 1, Seed: 0 },
            behaviorDistance: 'medium',
            priority: 5,
            personaOverlays: {
                Strategist: { tone: 'plan + track', nudge: 'Book the check today; add a task list for fixes.' },
                Trailblazer: { tone: 'quick trial', nudge: 'Do a 15-min draft hunt with a tissue by doors/windows.' },
                Coordinator: { tone: 'togetherness', nudge: 'Ask your building group if anyone wants to co-order kits.' },
                Visionary: { tone: 'values & future', nudge: 'A cozier home that uses less—start with one door.' },
                Explorer: { tone: 'learn by doing', nudge: 'Seal one gap; note the comfort change this week.' },
                Catalyst: { tone: 'energize others', nudge: 'Share a before/after of a sealed gap ✨.' },
                Builder: { tone: 'stepwise setup', nudge: 'Create a map of gaps; fix the top 3 this weekend.' },
                Networker: { tone: 'share resources', nudge: 'Post where to get affordable weatherstripping locally.' },
                Steward: { tone: 'quiet consistency', nudge: 'Seal one small draft each weekend—gentle progress.' },
                Seed: { tone: 'safe micro-start', nudge: 'Book an audit slot or watch a 2-min self-check video 🌱.' }
            }
        }
    ],
    meta: {
        equivalences: { carKgPerKm: 0.20, treeKgPerYear: 21, coffeeKgPerCup: 0.28, burgerKgPerBurger: 3.0 }
    }
};
