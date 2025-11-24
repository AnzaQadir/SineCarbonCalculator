# Scoring Pipeline Implementation

This document describes the enhanced personality-based scoring pipeline for the engagement layer.

## Overview

The enhanced scoring system maps user archetypes to a 4D persona vector (TimeSaver, MoneyMax, EcoGuardian, SocialSharer) and uses multi-factor scoring to rank recommendations. It includes:

- **Persona Mapping**: 10 archetypes → 4D persona vector
- **Multi-Factor Scoring**: Utility, Effort, Fit, Novelty, Recency, Diversity
- **MMR Ranking**: Maximal Marginal Relevance for diverse selection
- **Online Learning**: Weight updates based on user actions (DONE/DISMISS/SNOOZE)

## Architecture

### Database Models

1. **UserPersonalityExtended** (`user_personalities`)
   - Stores archetype scores, persona vector, and weight preferences
   - Evolves over time based on user actions

2. **RecommendationCatalog** (`recommendation_catalog`)
   - Stores recommendation metadata (metrics, effort, tags, regions)
   - Can be populated from existing Card catalog or separately

3. **UserActionEvent** (`user_action_events`)
   - Tracks SHOWN, DONE, DISMISS, SNOOZE events
   - Used for novelty, recency cooldown, and diversity calculations

### Services

1. **persona.ts**: Maps archetypes to 4D persona vector
2. **scoring.ts**: Scoring components (Utility, Effort, Fit, Novelty, Recency, Diversity)
3. **weights.ts**: Derives weight preferences from persona and context
4. **ranker.ts**: Final scoring and MMR ranking
5. **enhancedEngagementService.ts**: Main service using new scoring
6. **learning.ts**: Learning and weight evolution from actions

## Usage

### Feature Flags

Control via environment variables:

```bash
USE_ENHANCED_SCORING=true  # Use enhanced scoring (default: true)
USE_ENHANCED_LEARNING=true  # Use enhanced learning (default: true)
```

### API Endpoints

#### GET /api/v1/engagement/next-actions

Uses enhanced scoring by default. Returns 1 primary + 2 alternatives.

#### POST /api/v1/engagement/action-done

Supports `outcome` parameter for learning:
- `"done"`: Action completed → increases utility weight, decreases effort weight
- `"dismiss"`: Action dismissed → decreases fit/novelty, increases recency
- `"snooze"`: Action snoozed → increases recency weight

Example request:
```json
{
  "recommendationId": "transport.tyre_pressure.monthly",
  "context": { "surface": "web", "variant": "A" },
  "outcome": "done"
}
```

## Scoring Formula

```
score = utilityWeight * U - effortWeight * E + fitWeight * F + noveltyWeight * N + recencyWeight * RC + diversityWeight * D
```

Where:
- **U**: Utility (PKR, time, CO2 savings)
- **E**: Effort penalty (steps, time, purchase required)
- **F**: Fit (region, tags, channel preferences)
- **N**: Novelty (inverse frequency of recent shows)
- **RC**: Recency cooldown (time since last action)
- **D**: Diversity (category distribution)

## Persona Mapping

The system maps 10 archetypes to 4D persona vectors:

- **Strategist**: [0.45, 0.35, 0.15, 0.05] → TimeSaver/MoneyMax
- **Trailblazer**: [0.4, 0.25, 0.25, 0.1] → Balanced
- **Coordinator**: [0.25, 0.2, 0.2, 0.35] → SocialSharer
- **Visionary**: [0.2, 0.15, 0.55, 0.1] → EcoGuardian
- **Explorer**: [0.3, 0.15, 0.35, 0.2] → EcoGuardian/SocialSharer
- **Catalyst**: [0.25, 0.1, 0.25, 0.4] → SocialSharer
- **Builder**: [0.35, 0.3, 0.25, 0.1] → TimeSaver/MoneyMax
- **Networker**: [0.2, 0.2, 0.2, 0.4] → SocialSharer
- **Steward**: [0.1, 0.1, 0.75, 0.05] → EcoGuardian
- **Guardian**: [0.25, 0.25, 0.4, 0.1] → EcoGuardian

## Learning & Evolution

Weights evolve based on user actions:

- **DONE**: +0.05 to top utility dimension, -0.02 to effort
- **DISMISS**: -0.03 to fit, -0.02 to novelty, +0.05 to recency
- **SNOOZE**: +0.08 to recency

Weights are clamped to [0.5, 2.0] range.

## Seed Data

Run seed script to populate catalog:

```typescript
import { seedAll } from './services/engagement/seed';
await seedAll();
```

## Migration Notes

The enhanced system is backward compatible:
- Falls back to existing `getNextActions` if enhanced scoring fails
- Works with existing Card-based catalog
- Gradually migrates users to extended personality data

## Testing

Test with cURL:

```bash
# Get next actions (uses enhanced scoring)
curl --cookie "zerrah_token=<JWT>" \
  http://localhost:3000/api/v1/engagement/next-actions

# Mark action done with outcome
curl -X POST --cookie "zerrah_token=<JWT>" \
  -H "Content-Type: application/json" \
  -d '{"recommendationId":"transport.tyre_pressure.monthly","outcome":"done"}' \
  http://localhost:3000/api/v1/engagement/action-done
```

## Performance Considerations

- Scoring is cached per user for 60 seconds
- MMR ranking is O(n*k) where n=candidates, k=results
- Action events are indexed for fast lookups
- Consider adding Redis for hot paths in production

## Future Enhancements

1. **Contextual Bandits**: Replace simple weight nudges with bandit algorithms
2. **Persona Evolution**: Weekly job to recompute persona from observed behavior
3. **A/B Testing**: Compare enhanced vs. baseline scoring
4. **Telemetry**: Log scoring components for analysis
5. **Cold Start**: Better handling for new users without personality data




