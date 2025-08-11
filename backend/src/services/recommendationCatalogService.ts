import { Catalog, Card, Domain } from '../types/recommendationCatalog';
import { transportCatalog } from './recommendationCatalog.transport';
import { homeCatalog } from './recommendationCatalog.home';
import { foodCatalog } from './recommendationCatalog.food';
import { wasteCatalog } from './recommendationCatalog.waste';
import { clothingCatalog } from './recommendationCatalog.clothing';

export interface CatalogQuery {
  domain?: Domain;
  persona?: string; // e.g., 'Strategist'
  maxItems?: number;
}

const catalogs: Catalog[] = [transportCatalog, homeCatalog, foodCatalog, wasteCatalog, clothingCatalog];

function scoreCard(card: Card, persona?: string): number {
  // Higher priority and better persona fit score higher; fallback to 0 persona weight
  const personaWeight = persona ? (card.fitWeights[persona] ?? 0) : 0;
  // estImpactKgPerYear is informative but we favor editorial priority and persona fit
  return card.priority * 10 + personaWeight * 3 + Math.min(5, Math.round(card.estImpactKgPerYear / 100));
}

export function queryCatalog({ domain, persona, maxItems }: CatalogQuery = {}): Card[] {
  let cards = catalogs.flatMap(c => c.cards);
  if (domain) cards = cards.filter(c => c.domain === domain);
  cards = cards
    .sort((a, b) => scoreCard(b, persona) - scoreCard(a, persona));
  if (typeof maxItems === 'number' && maxItems > 0) {
    cards = cards.slice(0, maxItems);
  }
  return cards;
}

export function getCatalogMeta(): Catalog['meta'] {
  // Use first catalog's meta for now
  return catalogs[0].meta;
}


