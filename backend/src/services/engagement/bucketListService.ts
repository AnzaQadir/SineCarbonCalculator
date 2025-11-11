/**
 * Bucket List Service
 * Returns all recommendations that user has marked as DONE or SNOOZE
 */

import { UserActionEvent } from '../../models';
import RecommendationCatalog from '../../models/RecommendationCatalog';
import { queryCatalog } from '../recommendationCatalogService';
import { NextAction } from '../../types/engagement';
import { Op } from 'sequelize';

export interface BucketListItem {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  previewImpact: {
    rupees: number;
    co2_kg: number;
  };
  status: 'done' | 'snoozed';
  addedAt: Date;
  lastUpdatedAt: Date;
}

export interface BucketListResponse {
  items: BucketListItem[];
  total: number;
  doneCount: number;
  snoozedCount: number;
}

/**
 * Get user's bucket list (all DONE and SNOOZE events with recommendation details)
 */
export async function getBucketList(userId: string): Promise<BucketListResponse> {
  // Get all DONE and SNOOZE events for this user
  const events = await UserActionEvent.findAll({
    where: {
      userId,
      eventType: {
        [Op.in]: ['DONE', 'SNOOZE'],
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
  const recommendationMap = new Map<string, { eventType: 'DONE' | 'SNOOZE'; occurredAt: Date }>();
  
  for (const event of events) {
    const recId = event.recommendationId;
    const existing = recommendationMap.get(recId);
    
    // Keep the most recent event (already sorted DESC)
    if (!existing || event.occurredAt > existing.occurredAt) {
      recommendationMap.set(recId, {
        eventType: event.eventType as 'DONE' | 'SNOOZE',
        occurredAt: event.occurredAt,
      });
    }
  }

  // Get all unique recommendation IDs
  const recommendationIds = Array.from(recommendationMap.keys());

  // Try to get from RecommendationCatalog first (new catalog)
  const catalogItems = await RecommendationCatalog.findAll({
    where: {
      id: {
        [Op.in]: recommendationIds,
      },
      active: true,
    },
  });

  // Fallback to queryCatalog for items not in new catalog
  const catalogMap = new Map(catalogItems.map((item) => [item.id, item]));
  const missingIds = recommendationIds.filter((id) => !catalogMap.has(id));

  // Get from old catalog for missing items
  const oldCatalog = queryCatalog({});
  const oldCatalogMap = new Map(oldCatalog.map((card) => [card.id, card]));

  // Build bucket list items
  const items: BucketListItem[] = [];

  for (const recId of recommendationIds) {
    const eventInfo = recommendationMap.get(recId)!;
    const status = eventInfo.eventType === 'DONE' ? 'done' : 'snoozed';

    // Try new catalog first
    let catalogItem = catalogMap.get(recId);
    let title: string;
    let subtitle: string | undefined;
    let category: string;
    let metrics: { pkrMonth?: number; minutes?: number; kgco2eMonth?: number };

    if (catalogItem) {
      title = catalogItem.title;
      subtitle = catalogItem.subtitle || undefined;
      category = catalogItem.category;
      metrics = catalogItem.metrics;
    } else {
      // Fallback to old catalog
      const oldCard = oldCatalogMap.get(recId);
      if (!oldCard) continue; // Skip if not found in either catalog

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

