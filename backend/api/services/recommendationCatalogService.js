"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryCatalog = queryCatalog;
exports.getCatalogMeta = getCatalogMeta;
const recommendationCatalog_transport_1 = require("./recommendationCatalog.transport");
const recommendationCatalog_home_1 = require("./recommendationCatalog.home");
const recommendationCatalog_food_1 = require("./recommendationCatalog.food");
const recommendationCatalog_waste_1 = require("./recommendationCatalog.waste");
const recommendationCatalog_clothing_1 = require("./recommendationCatalog.clothing");
const catalogs = [recommendationCatalog_transport_1.transportCatalog, recommendationCatalog_home_1.homeCatalog, recommendationCatalog_food_1.foodCatalog, recommendationCatalog_waste_1.wasteCatalog, recommendationCatalog_clothing_1.clothingCatalog];
function scoreCard(card, persona) {
    // Higher priority and better persona fit score higher; fallback to 0 persona weight
    const personaWeight = persona ? (card.fitWeights[persona] ?? 0) : 0;
    // estImpactKgPerYear is informative but we favor editorial priority and persona fit
    return card.priority * 10 + personaWeight * 3 + Math.min(5, Math.round(card.estImpactKgPerYear / 100));
}
function queryCatalog({ domain, persona, maxItems } = {}) {
    let cards = catalogs.flatMap(c => c.cards);
    if (domain)
        cards = cards.filter(c => c.domain === domain);
    cards = cards
        .sort((a, b) => scoreCard(b, persona) - scoreCard(a, persona));
    if (typeof maxItems === 'number' && maxItems > 0) {
        cards = cards.slice(0, maxItems);
    }
    return cards;
}
function getCatalogMeta() {
    // Use first catalog's meta for now
    return catalogs[0].meta;
}
