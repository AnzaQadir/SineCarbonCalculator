export type Chapter = {
  id: "hero" | "chapter1" | "chapter2" | "chapter3";
  kicker?: string;
  title: string;
  lead?: string;
  body?: string;
};

export const METHODOLOGY: Chapter[] = [
  {
    id: "hero",
    title: "Zerrah Methodology",
    lead:
      "Exploring the thinking, science, and stories behind Zerrah’s personalization.",
  },
  {
    id: "chapter1",
    kicker: "Chapter 1",
    title: "How we designed the Zerrah personality types",
    body:
      `### Framing the Core Dimensions\n\n\n\nWe began by identifying two key dimensions that shape how people approach climate action:\n\n- **Decision-Making Style** (🧭 Analyst · ✨ Intuitive · 🤝 Connector) → How people *decide* what matters to them.\n\n- **Action-Taking Style** (📅 Planner · 🧪 Experimenter · 🤝 Collaborator) → How people *act* on those decisions.\n\nThese two axes gave us a 3x3 framework — a simple but powerful way to capture the diversity of everyday climate mindsets.\n\n_Figure — Decision × Action Grid_\n\n<!--GRID_BREAK-->\n\n### Rooted in Behavioral Science & Practical Observation\n\n- **Behavioral science** → People vary in whether they seek structure, improvise, or rely on others to act.\n- **Climate psychology** → Some need data, others need inspiration, and many need community.\n\n### Why This Matters\n\nInstead of treating climate action as one-size-fits-all, Zerrah personalizes the journey. These archetypes give users a way to see themselves in the movement, whether they’re a Trailblazer jumping in headfirst, a Builder creating systems at home, or a Visionary dreaming of greener futures.\n\nThe result is a tool that makes climate action feel human, personal, and possible.`,
  },
  {
    id: "chapter2",
    kicker: "Chapter 2",
    title: "How Zerrah tailors climate action recommendations for you",
    body: ``,
  },
  {
    id: "chapter3",
    kicker: "Chapter 3",
    title: "How the Zerrah dashboard works",
    body:
      `# How the Zerrah dashboard works\n\nThe Zerrah Dashboard takes your quiz responses and maps them across five key lifestyle areas: home energy, transportation, food and diet, clothing, and waste. Each of these categories is linked to globally recognized emission factors, which are scientific estimates of how much CO₂ is released by everyday actions. For example, driving a kilometer adds about 0.2 kg of CO₂ to the atmosphere, a beef burger carries roughly 2.5–3 kg of emissions, and producing a cotton T-shirt creates around 4–5 kg. By multiplying your reported behaviors, such as how much you drive, what you eat, or how often you shop, we calculate your personal footprint across each category.\n\nBut numbers on their own can feel abstract. To make them more relatable, the dashboard translates your footprint into everyday equivalents: kilometers driven, burgers eaten, coffee cups used, or flights taken. Suddenly, what once looked like a statistic becomes something you can picture in your daily life.\n\nZerrah also flips the script by showing not just your impact, but your impact avoided. When you choose sustainable alternatives, the dashboard subtracts the emissions of your choice from the conventional option. These avoided emissions are reframed as wins: T-shirts saved, burgers avoided, or even “tree years” gained. It’s a reminder that every choice you make has a measurable positive effect.\n\nTo tie it all together, the dashboard adds up your lifestyle impacts into a total annual carbon footprint. This number, expressed in kilograms of CO₂ per year, is broken down into categories like home, transport, food, clothing, and waste. By benchmarking against global and national averages, you can see how your lifestyle compares and where small changes could make the biggest difference.`,
  },
];

export const BRAND_VARS = {
  ink: "#1C1B19",
  canvas: "#F6F4F0",
  accent: "#2FBF71",
  muted: "#EAE6DF",
};

export type ArchetypeCell = {
  id: string;
  name: string;
  decision: 'Analyst'|'Intuitive'|'Connector';
  action: 'Planner'|'Experimenter'|'Collaborator';
  tagline: string;
  blurb: string;
};

export const ARCHETYPES_3x3: ArchetypeCell[] = [
  { id: 'strategist', name: 'Strategist', decision: 'Analyst', action: 'Planner', tagline: 'Plans with precision', blurb: 'Gathers facts and maps every step for precise action.' },
  { id: 'trailblazer', name: 'Trailblazer', decision: 'Analyst', action: 'Experimenter', tagline: 'Experiments with data', blurb: 'Dives into data‑led experiments and refines as they go.' },
  { id: 'coordinator', name: 'Coordinator', decision: 'Analyst', action: 'Collaborator', tagline: 'Leads research groups', blurb: 'Brings people together to research and launch solutions.' },
  { id: 'visionary', name: 'Visionary', decision: 'Intuitive', action: 'Planner', tagline: 'Turns instinct into plans', blurb: 'Trusts gut instincts to shape big goals into plans.' },
  { id: 'explorer', name: 'Explorer', decision: 'Intuitive', action: 'Experimenter', tagline: 'Learns by doing', blurb: 'Jumps in headfirst and learns by doing.' },
  { id: 'catalyst', name: 'Catalyst', decision: 'Intuitive', action: 'Collaborator', tagline: 'Sparks groups into action', blurb: 'Sparks collective action by tapping into shared insights.' },
  { id: 'builder', name: 'Builder', decision: 'Connector', action: 'Planner', tagline: 'Designs clear projects', blurb: 'Designs clear, group‑driven projects with community input.' },
  { id: 'networker', name: 'Networker', decision: 'Connector', action: 'Experimenter', tagline: 'Co‑creates tests', blurb: 'Co‑creates small tests with peers and iterates together.' },
  { id: 'steward', name: 'Steward', decision: 'Connector', action: 'Collaborator', tagline: 'Protects what matters', blurb: 'Joins forces to protect what matters through shared care.' },
];


