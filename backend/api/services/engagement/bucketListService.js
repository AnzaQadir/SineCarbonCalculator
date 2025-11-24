"use strict";
/**
 * Bucket List Service
 * Returns all recommendations that user has marked as DONE or SNOOZE
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBucketList = getBucketList;
const models_1 = require("../../models");
const RecommendationCatalog_1 = __importDefault(require("../../models/RecommendationCatalog"));
const recommendationCatalogService_1 = require("../recommendationCatalogService");
const sequelize_1 = require("sequelize");
/**
 * Generate fallback steps for a recommendation
 */
function generateFallbackSteps(category, title, subtitle, why, requiresPurchase) {
    const categoryLower = category.toLowerCase();
    const actionContext = subtitle || why || title;
    switch (categoryLower) {
        case 'transport':
            return [
                `Pick the trip you will shift: ${actionContext}`,
                requiresPurchase
                    ? 'Book the ticket or reserve the seat and note departure details.'
                    : 'Plan the route and timings so the swap feels easy.',
                'Take the trip and reflect on how the change felt.',
            ];
        case 'food':
            return [
                `Choose the meal or moment to try: ${actionContext}`,
                requiresPurchase
                    ? 'Shop or prep the ingredients and set them where you will see them.'
                    : 'Prep what you already have so the swap is ready to go.',
                'Cook or assemble it and note how it went for next time.',
            ];
        case 'home':
            return [
                `Decide which spot or habit to tackle first: ${actionContext}`,
                requiresPurchase
                    ? 'Pick up any supplies or tools you need before you start.'
                    : 'Gather the tools you already own and set a start time.',
                'Make the change and do a quick reset afterward.',
            ];
        case 'waste':
            return [
                `Identify where the waste shows up: ${actionContext}`,
                requiresPurchase
                    ? 'Collect any containers or gear you need to support the new habit.'
                    : 'Set up bins or reminders with what you already have.',
                'Put the new routine into practice and review at week end.',
            ];
        case 'clothing':
        case 'clothes':
            return [
                `Choose the item or purchase you will shift: ${actionContext}`,
                requiresPurchase
                    ? 'Line up the resale/borrow options and set alerts or bookmarks.'
                    : 'Open your preferred resale or swap source and save a search.',
                'Follow through on your next purchase moment and log the win.',
            ];
        default:
            return [
                `Plan when you'll do this: ${actionContext}`,
                requiresPurchase
                    ? 'Gather any supplies or tools you need.'
                    : 'Use what you already have to get started.',
                'Take action and track your progress.',
            ];
    }
}
/**
 * Build full recommendation details from catalog record and card
 */
function buildRecommendationDetails(record, card) {
    const metadata = record?.metadata || {};
    const metrics = record?.metrics || {};
    const effort = record?.effort || {};
    const tags = Array.isArray(record?.tags) && record.tags.length > 0
        ? record.tags
        : card
            ? [...(card.chips || []), ...(card.accessTags || [])]
            : [];
    const regions = Array.isArray(record?.regions) ? record.regions : [];
    const fallbackUtility = {};
    if (typeof metrics.pkrMonth === 'number')
        fallbackUtility.pkr_month = metrics.pkrMonth;
    if (typeof metrics.minutes === 'number')
        fallbackUtility.minutes = metrics.minutes;
    if (typeof metrics.kgco2eMonth === 'number')
        fallbackUtility.kgco2e_month = metrics.kgco2eMonth;
    const existingHow = Array.isArray(metadata?.how) ? metadata.how : [];
    const title = record?.title || card?.action || record?.id || '';
    const subtitle = record?.subtitle || (card?.levels?.start ? card.levels.start : card?.why) || null;
    const why = metadata?.why ?? card?.why ?? null;
    const requiresPurchase = typeof effort.requiresPurchase === 'boolean' ? effort.requiresPurchase : false;
    const category = record?.category || card?.domain || '';
    const howSteps = existingHow.length > 0
        ? existingHow
        : generateFallbackSteps(category, title, subtitle, why, requiresPurchase);
    return {
        id: record?.id || card?.id || '',
        category: record?.category || card?.domain || '',
        title: record?.title || card?.action || '',
        subtitle: record?.subtitle || (card?.levels?.start ? card.levels.start : card?.why) || null,
        metrics: metrics,
        effort: effort,
        tags,
        regions,
        why: metadata?.why ?? card?.why ?? null,
        how: howSteps,
        context_requirements: Array.isArray(metadata?.contextRequirements)
            ? metadata.contextRequirements
            : [],
        triggers: Array.isArray(metadata?.triggers) ? metadata.triggers : [],
        utility_model: metadata?.utilityModel && Object.keys(metadata.utilityModel).length > 0
            ? metadata.utilityModel
            : Object.keys(fallbackUtility).length > 0
                ? fallbackUtility
                : undefined,
        fit_rules: Array.isArray(metadata?.fitRules) ? metadata.fitRules : [],
        verify: Array.isArray(metadata?.verify) ? metadata.verify : [],
        rewards: metadata?.rewards || {},
        messages: metadata?.messages || {},
        empathy_note: typeof metadata?.empathyNote === 'string' ? metadata.empathyNote : metadata?.empathyNote ?? null,
        cta: metadata?.cta ?? null,
        story_snippet: typeof metadata?.storySnippet === 'string'
            ? metadata.storySnippet
            : metadata?.storySnippet ?? null,
        metadata: metadata || null,
    };
}
/**
 * Get user's bucket list (all DONE and SNOOZE events with recommendation details)
 */
async function getBucketList(userId) {
    // Get all DONE and SNOOZE events for this user
    const events = await models_1.UserActionEvent.findAll({
        where: {
            userId,
            eventType: {
                [sequelize_1.Op.in]: ['DONE', 'SNOOZE'],
            },
        },
        order: [['occurredAt', 'DESC']],
        attributes: ['recommendationId', 'eventType', 'occurredAt'],
    });
    if (events.length === 0) {
        return {
            items: [],
            total: 0,
            doneCount: 0,
            snoozedCount: 0,
        };
    }
    // Group by recommendation ID to get latest status
    const recommendationMap = new Map();
    for (const event of events) {
        const recId = event.recommendationId;
        const existing = recommendationMap.get(recId);
        // Keep the most recent event (already sorted DESC)
        if (!existing || event.occurredAt > existing.occurredAt) {
            recommendationMap.set(recId, {
                eventType: event.eventType,
                occurredAt: event.occurredAt,
            });
        }
    }
    // Get all unique recommendation IDs
    const recommendationIds = Array.from(recommendationMap.keys());
    // Try to get from RecommendationCatalog first (new catalog)
    const catalogItems = await RecommendationCatalog_1.default.findAll({
        where: {
            id: {
                [sequelize_1.Op.in]: recommendationIds,
            },
            active: true,
        },
    });
    // Fallback to queryCatalog for items not in new catalog
    const catalogMap = new Map(catalogItems.map((item) => [item.id, item]));
    const missingIds = recommendationIds.filter((id) => !catalogMap.has(id));
    // Get from old catalog for missing items
    const oldCatalog = (0, recommendationCatalogService_1.queryCatalog)({});
    const oldCatalogMap = new Map(oldCatalog.map((card) => [card.id, card]));
    // Build bucket list items
    const items = [];
    for (const recId of recommendationIds) {
        const eventInfo = recommendationMap.get(recId);
        const status = eventInfo.eventType === 'DONE' ? 'done' : 'snoozed';
        // Try new catalog first
        let catalogItem = catalogMap.get(recId);
        let title;
        let subtitle;
        let category;
        let metrics;
        if (catalogItem) {
            title = catalogItem.title;
            subtitle = catalogItem.subtitle || undefined;
            category = catalogItem.category;
            metrics = catalogItem.metrics;
        }
        else {
            // Fallback to old catalog
            const oldCard = oldCatalogMap.get(recId);
            if (!oldCard)
                continue; // Skip if not found in either catalog
            title = oldCard.action;
            subtitle = oldCard.levels?.start || oldCard.why || undefined;
            category = oldCard.domain;
            // Estimate metrics from old catalog
            const weeklyCo2 = oldCard.estImpactKgPerYear / 52;
            metrics = {
                pkrMonth: Math.round(weeklyCo2 * 75),
                minutes: 0,
                kgco2eMonth: weeklyCo2,
            };
        }
        // Calculate impact
        const pkrMonth = metrics.pkrMonth || 0;
        const kgco2eMonth = metrics.kgco2eMonth || 0;
        // Get all events for this recommendation to track history
        const allEvents = events.filter((e) => e.recommendationId === recId);
        const firstEvent = allEvents[allEvents.length - 1]; // Oldest (first added)
        const lastEvent = allEvents[0]; // Most recent
        // Build full recommendation details
        const oldCard = oldCatalogMap.get(recId);
        const recommendation = buildRecommendationDetails(catalogItem, oldCard);
        items.push({
            id: recId,
            title,
            subtitle,
            category,
            previewImpact: {
                rupees: Math.round(pkrMonth),
                co2_kg: Number(kgco2eMonth.toFixed(3)),
            },
            status,
            addedAt: firstEvent.occurredAt,
            lastUpdatedAt: lastEvent.occurredAt,
            recommendation,
        });
    }
    // Sort by last updated (most recent first)
    items.sort((a, b) => b.lastUpdatedAt.getTime() - a.lastUpdatedAt.getTime());
    const doneCount = items.filter((item) => item.status === 'done').length;
    const snoozedCount = items.filter((item) => item.status === 'snoozed').length;
    return {
        items,
        total: items.length,
        doneCount,
        snoozedCount,
    };
}
