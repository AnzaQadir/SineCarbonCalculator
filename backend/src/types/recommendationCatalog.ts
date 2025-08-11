export type Domain = 'transport' | 'food' | 'home' | 'clothing' | 'waste';

export type BehaviorDistance = 'small' | 'medium' | 'large';

export interface PersonaOverlay {
  tone: string;
  nudge: string;
}

export interface Card {
  id: string;
  domain: Domain;
  action: string;
  levels: {
    start: string;
    levelUp: string;
    stretch: string;
  };
  enabler?: string;
  why: string;
  chips: string[];
  accessTags: string[];
  prerequisites: string[];
  estImpactKgPerYear: number;
  equivalents?: string[];
  fitWeights: Record<string, number>;
  behaviorDistance: BehaviorDistance;
  priority: number; // 1..5
  personaOverlays: Record<string, PersonaOverlay>; // keys are persona names
}

export interface CatalogMeta {
  equivalences: {
    carKgPerKm: number;
    treeKgPerYear: number;
    coffeeKgPerCup: number;
    burgerKgPerBurger: number;
  };
}

export interface Catalog {
  catalogVersion: string;
  domains: Domain[];
  cards: Card[];
  meta: CatalogMeta;
}


