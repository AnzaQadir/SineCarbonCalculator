"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transportCatalog = void 0;
// Batch 1: Transport
exports.transportCatalog = {
    catalogVersion: 'v1.0',
    domains: ['transport', 'food', 'home', 'clothing', 'waste'],
    cards: [
        {
            id: 'transport_no_car_day',
            domain: 'transport',
            action: 'Have one no-car day each week by batching errands',
            levels: {
                start: 'Batch errands into one loop this week.',
                levelUp: 'Choose one fixed no-car day weekly.',
                stretch: 'Make it two no-car days or add a carpool rota.'
            },
            enabler: 'Route optimizer app + bike pannier or sturdy tote',
            why: 'Avoids ~150–250 kg CO₂/year for a typical 1-day/week shift.',
            chips: ['Short (10–20m)', 'No-spend'],
            accessTags: ['transit_nearby|bike_lanes'],
            prerequisites: ['car_owner OR kmPerWeek>=100'],
            estImpactKgPerYear: 200,
            equivalents: ['≈1000 km not driven', '≈10 tree-years'],
            fitWeights: { Strategist: 2, Trailblazer: 1, Coordinator: 1, Visionary: 1, Explorer: 1, Catalyst: 1, Builder: 2, Networker: 1, Steward: 1, Seed: 0 },
            behaviorDistance: 'medium',
            priority: 5,
            personaOverlays: {
                Strategist: { tone: 'plan + track', nudge: 'Thu 8pm: map next week’s loop in 10 minutes.' },
                Trailblazer: { tone: 'quick trial', nudge: 'Pick a no-car day this week—see how it feels 🚲.' },
                Coordinator: { tone: 'togetherness', nudge: 'Ask a friend to walk one errand together.' },
                Visionary: { tone: 'values & future', nudge: 'Choose a weekly slow day—notice how your city feels.' },
                Explorer: { tone: 'learn by doing', nudge: 'Try one loop today; jot a 1-line note on what worked.' },
                Catalyst: { tone: 'energize others', nudge: 'Start a ‘No-Car Tuesday’ in the group chat ✨.' },
                Builder: { tone: 'stepwise setup', nudge: 'Create a 3-stop loop template; reuse weekly.' },
                Networker: { tone: 'share resources', nudge: 'Post your best route + transit tip to your circle.' },
                Steward: { tone: 'quiet consistency', nudge: 'Keep your chosen day—notice the calm it brings.' },
                Seed: { tone: 'safe micro-start', nudge: 'Walk one errand this week. That’s enough 🌱.' }
            }
        },
        {
            id: 'transport_tire_pressure_eco',
            domain: 'transport',
            action: 'Keep tires at spec and drive smooth each week',
            levels: {
                start: 'Check tire pressure once this week; remove roof rack if unused.',
                levelUp: 'Set a monthly pressure reminder and gentle acceleration habit.',
                stretch: 'Do quarterly maintenance (filters, alignment) for steady efficiency.'
            },
            enabler: 'Digital tire gauge + nearby air pump map',
            why: 'Proper tire pressure and smooth driving can trim fuel use ~5–10% for typical drivers.',
            chips: ['Short (10–20m)', 'Low'],
            accessTags: ['car_owner'],
            prerequisites: ['car_owner', 'kmPerWeek>=100'],
            estImpactKgPerYear: 120,
            equivalents: ['≈600 km not driven', '≈6 tree-years'],
            fitWeights: { Strategist: 2, Trailblazer: 1, Coordinator: 0, Visionary: 0, Explorer: 1, Catalyst: 0, Builder: 2, Networker: 0, Steward: 1, Seed: 0 },
            behaviorDistance: 'small',
            priority: 4,
            personaOverlays: {
                Strategist: { tone: 'plan + track', nudge: 'First Sunday monthly: pressure check + log it.' },
                Trailblazer: { tone: 'quick trial', nudge: 'Top up today and try gentle starts—notice the feel.' },
                Coordinator: { tone: 'togetherness', nudge: 'Remind your carpool to check pressure this week.' },
                Visionary: { tone: 'values & future', nudge: 'A small care ritual for fewer emissions, every month.' },
                Explorer: { tone: 'learn by doing', nudge: 'Test eco-driving on one route; compare your trip note.' },
                Catalyst: { tone: 'energize others', nudge: 'Share a 10-sec how-to tire check video with friends.' },
                Builder: { tone: 'stepwise setup', nudge: 'Add a ‘vehicle care’ checklist to your calendar.' },
                Networker: { tone: 'share resources', nudge: 'Post your cheapest reliable air pump spot.' },
                Steward: { tone: 'quiet consistency', nudge: 'Same date monthly—small care, steady savings.' },
                Seed: { tone: 'safe micro-start', nudge: 'Buy/borrow a gauge once; check one tire today 🌱.' }
            }
        },
        {
            id: 'transport_carpool_regular_trip',
            domain: 'transport',
            action: 'Set a weekly carpool rota for a recurring trip',
            levels: {
                start: 'Find one buddy for your commute/school run this week.',
                levelUp: 'Make a 2–3 person rota and share a simple calendar.',
                stretch: 'Carpool two+ days each week or for weekend activities.'
            },
            enabler: 'Carpool matching app or shared calendar template',
            why: 'Sharing a ride halves emissions for that trip; one day/week can avoid ~200 kg CO₂/year.',
            chips: ['Short (10–20m)', 'No-spend'],
            accessTags: ['car_owner'],
            prerequisites: ['car_owner OR regular_commute'],
            estImpactKgPerYear: 200,
            equivalents: ['≈1000 km not driven', '≈10 tree-years'],
            fitWeights: { Strategist: 1, Trailblazer: 1, Coordinator: 2, Visionary: 1, Explorer: 0, Catalyst: 2, Builder: 1, Networker: 2, Steward: 1, Seed: 0 },
            behaviorDistance: 'medium',
            priority: 4,
            personaOverlays: {
                Strategist: { tone: 'plan + track', nudge: 'Set a repeating rota block every Sunday night.' },
                Trailblazer: { tone: 'quick trial', nudge: 'Try sharing tomorrow’s ride—see if it sticks.' },
                Coordinator: { tone: 'togetherness', nudge: 'Spin up a 3-person rota and pin it in chat.' },
                Visionary: { tone: 'values & future', nudge: 'Shared rides, lighter streets—invite one person.' },
                Explorer: { tone: 'learn by doing', nudge: 'Test carpool once; note pros/cons for next time.' },
                Catalyst: { tone: 'energize others', nudge: 'Post a ‘carpool roll call’—who’s in this week? ✨' },
                Builder: { tone: 'stepwise setup', nudge: 'Create a simple rota doc; reuse weekly.' },
                Networker: { tone: 'share resources', nudge: 'Match two people with similar hours; intro them.' },
                Steward: { tone: 'quiet consistency', nudge: 'Pick one shared ride day and keep it gentle.' },
                Seed: { tone: 'safe micro-start', nudge: 'Ask one friend for a shared ride once this week 🌱.' }
            }
        },
        {
            id: 'transport_replace_short_trip_active',
            domain: 'transport',
            action: 'Walk or bike any trip under 2 km',
            levels: {
                start: 'Replace one short errand this week.',
                levelUp: 'Make all sub-2 km trips active when feasible.',
                stretch: 'Add a 5 km weekend walk/ride for fun and fitness.'
            },
            enabler: 'Small backpack or pannier; basic lights/reflectors',
            why: 'Short car trips are fuel-inefficient; shifting these saves meaningful CO₂ and feels good.',
            chips: ['Micro (≤5m)', 'No-spend'],
            accessTags: ['safe_walkways|bike_lanes'],
            prerequisites: ['city_walkable OR bike_lanes'],
            estImpactKgPerYear: 100,
            equivalents: ['≈500 km not driven', '≈5 tree-years'],
            fitWeights: { Strategist: 1, Trailblazer: 2, Coordinator: 1, Visionary: 1, Explorer: 2, Catalyst: 1, Builder: 1, Networker: 0, Steward: 1, Seed: 1 },
            behaviorDistance: 'small',
            priority: 4,
            personaOverlays: {
                Strategist: { tone: 'plan + track', nudge: 'Flag sub-2 km errands on your list; go active.' },
                Trailblazer: { tone: 'quick trial', nudge: 'It’s nice out—walk that close errand today 🥾.' },
                Coordinator: { tone: 'togetherness', nudge: 'Invite a neighbor for a ‘walk and chat’ errand.' },
                Visionary: { tone: 'values & future', nudge: 'Choose the slower path—notice your neighborhood.' },
                Explorer: { tone: 'learn by doing', nudge: 'Test one route; drop a one-line review for yourself.' },
                Catalyst: { tone: 'energize others', nudge: 'Start a ‘2-km club’ selfie thread 🚶‍♀️✨.' },
                Builder: { tone: 'stepwise setup', nudge: 'Pack a tiny errand kit (bag, list, bottle) by the door.' },
                Networker: { tone: 'share resources', nudge: 'Share your safest shortcut with the group.' },
                Steward: { tone: 'quiet consistency', nudge: 'Keep choosing the close walk—small, steady care.' },
                Seed: { tone: 'safe micro-start', nudge: 'Walk just one errand this week. That’s a win 🌱.' }
            }
        },
        {
            id: 'transport_remote_meeting_day',
            domain: 'transport',
            action: 'Swap one commute with a remote day or virtual meeting',
            levels: {
                start: 'Pick one remote day or virtual meeting this month.',
                levelUp: 'Make it biweekly with a simple team agreement.',
                stretch: 'Set a weekly remote day by default.'
            },
            enabler: 'Team agreement template + calendar blocks for deep work',
            why: 'Replacing a weekly round-trip commute can avoid ~200 kg CO₂/year for typical distances.',
            chips: ['Short (10–20m)', 'No-spend'],
            accessTags: ['remote_friendly_role'],
            prerequisites: ['has_remote_option'],
            estImpactKgPerYear: 200,
            equivalents: ['≈1000 km not driven', '≈10 tree-years'],
            fitWeights: { Strategist: 2, Trailblazer: 1, Coordinator: 1, Visionary: 2, Explorer: 1, Catalyst: 1, Builder: 2, Networker: 0, Steward: 1, Seed: 1 },
            behaviorDistance: 'medium',
            priority: 4,
            personaOverlays: {
                Strategist: { tone: 'plan + track', nudge: 'Block your remote day for next month now.' },
                Trailblazer: { tone: 'quick trial', nudge: 'Try a video meeting today instead of a drive.' },
                Coordinator: { tone: 'togetherness', nudge: 'Align with your team on one shared remote day.' },
                Visionary: { tone: 'values & future', nudge: 'Create space to think—choose one quiet remote day.' },
                Explorer: { tone: 'learn by doing', nudge: 'Test a remote day; jot what helped focus.' },
                Catalyst: { tone: 'energize others', nudge: 'Float the idea: ‘Remote Wednesday?’ in the chat ✨.' },
                Builder: { tone: 'stepwise setup', nudge: 'Set a meeting-light block and a check-in ritual.' },
                Networker: { tone: 'share resources', nudge: 'Share your best call setup tips with a colleague.' },
                Steward: { tone: 'quiet consistency', nudge: 'Keep your chosen day—notice the calmer week.' },
                Seed: { tone: 'safe micro-start', nudge: 'Ask for one remote meeting this month 🌱.' }
            }
        },
        {
            id: 'transport_rail_instead_short_flight',
            domain: 'transport',
            action: 'Choose rail or bus for one sub-800 km trip',
            levels: {
                start: 'Replace one short-haul flight this year.',
                levelUp: 'Plan two rail/bus trips for near cities.',
                stretch: 'Under 1000 km, go flight-free by default.'
            },
            enabler: 'Rail planner app + overnight options; packing list for easy transfers',
            why: 'Swapping one short-haul round trip can avoid around ~300 kg CO₂.',
            chips: ['Short (10–20m)', 'Med'],
            accessTags: ['rail_bus_available'],
            prerequisites: ['has_rail_bus_in_region'],
            estImpactKgPerYear: 300,
            equivalents: ['≈1500 km not driven', '≈14 tree-years'],
            fitWeights: { Strategist: 1, Trailblazer: 1, Coordinator: 0, Visionary: 2, Explorer: 2, Catalyst: 1, Builder: 1, Networker: 0, Steward: 1, Seed: 0 },
            behaviorDistance: 'large',
            priority: 5,
            personaOverlays: {
                Strategist: { tone: 'plan + track', nudge: 'Add one rail trip to your annual plan now.' },
                Trailblazer: { tone: 'quick trial', nudge: 'Pick the next short trip—try the train this time.' },
                Coordinator: { tone: 'togetherness', nudge: 'Invite a friend for a scenic rail day.' },
                Visionary: { tone: 'values & future', nudge: 'Choose the slower, lower-carbon path this season.' },
                Explorer: { tone: 'learn by doing', nudge: 'Test an overnight bus—note comfort tips for later.' },
                Catalyst: { tone: 'energize others', nudge: 'Share a snap of your rail view to inspire ✨.' },
                Builder: { tone: 'stepwise setup', nudge: 'Save a go-to route template with timings.' },
                Networker: { tone: 'share resources', nudge: 'Post the best booking site and seat picks.' },
                Steward: { tone: 'quiet consistency', nudge: 'Make one rail choice this year—hold that line.' },
                Seed: { tone: 'safe micro-start', nudge: 'Browse rail options once; bookmark one route 🌱.' }
            }
        },
        {
            id: 'transport_transit_trial_3rides',
            domain: 'transport',
            action: 'Try public transit for three rides per week',
            levels: {
                start: 'Use transit for one errand this week.',
                levelUp: 'Do 3 rides/week for a month and see what sticks.',
                stretch: 'Make one routine trip transit-first every week.'
            },
            enabler: 'Transit card + route app; saved ‘favorite’ routes',
            why: 'Replacing ~15 km/week of car trips by transit can avoid ~150 kg CO₂/year.',
            chips: ['Short (10–20m)', 'Low'],
            accessTags: ['transit_nearby'],
            prerequisites: ['city_has_transit OR kmPerWeek>=50'],
            estImpactKgPerYear: 150,
            equivalents: ['≈750 km not driven', '≈7 tree-years'],
            fitWeights: { Strategist: 1, Trailblazer: 1, Coordinator: 1, Visionary: 1, Explorer: 2, Catalyst: 1, Builder: 1, Networker: 0, Steward: 1, Seed: 1 },
            behaviorDistance: 'medium',
            priority: 3,
            personaOverlays: {
                Strategist: { tone: 'plan + track', nudge: 'Save two go-to routes; schedule them this week.' },
                Trailblazer: { tone: 'quick trial', nudge: 'Hop on the next bus/train—just try one ride today.' },
                Coordinator: { tone: 'togetherness', nudge: 'Transit to coffee with a friend—make it a mini plan.' },
                Visionary: { tone: 'values & future', nudge: 'Choose shared transit—lighter streets, clearer air.' },
                Explorer: { tone: 'learn by doing', nudge: 'Test a new line; note what made it easy.' },
                Catalyst: { tone: 'energize others', nudge: 'Invite a buddy for a transit errand challenge ✨.' },
                Builder: { tone: 'stepwise setup', nudge: 'Pin routes and alarms; repeat weekly.' },
                Networker: { tone: 'share resources', nudge: 'Share off-peak tips or best seats with your circle.' },
                Steward: { tone: 'quiet consistency', nudge: 'Keep one transit trip each week—gentle and steady.' },
                Seed: { tone: 'safe micro-start', nudge: 'Buy/borrow a card; take one short ride 🌱.' }
            }
        }
    ],
    meta: {
        equivalences: { carKgPerKm: 0.20, treeKgPerYear: 21, coffeeKgPerCup: 0.28, burgerKgPerBurger: 3.0 }
    }
};
