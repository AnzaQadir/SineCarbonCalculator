# Seed Recommendation Catalog

This guide explains how to seed the recommendation catalog with the full set of recommendations.

## Overview

The catalog contains **59 recommendations** across 5 categories:
- **Transport**: 10 recommendations
- **Food**: 10 recommendations  
- **Clothes**: 10 recommendations
- **Home**: 10 recommendations
- **Waste**: 11 recommendations

## Running the Seed Script

### Option 1: Using TypeScript directly

```bash
cd backend
npx ts-node scripts/seed-catalog.ts
```

### Option 2: Using compiled JavaScript

```bash
cd backend
npm run build
node api/scripts/seed-catalog.js
```

### Option 3: Programmatically (from your app)

```typescript
import { initializeDatabase } from './src/models';
import { seedFullCatalog } from './src/services/engagement/seedCatalog';

await initializeDatabase();
await seedFullCatalog();
```

## What Gets Seeded

Each recommendation includes:

- **id**: Unique identifier (e.g., `transport.tyre_pressure.monthly`)
- **category**: One of: transport, food, clothes, home, waste
- **title**: Display title
- **subtitle**: From `messages.web_subtitle`
- **metrics**: 
  - `pkrMonth`: Monthly savings in PKR
  - `minutes`: Time required
  - `kgco2eMonth`: Monthly CO₂ savings in kg
- **effort**:
  - `steps`: 1-3 based on effort level
  - `avgMinutesToDo`: Estimated completion time
  - `requiresPurchase`: Detected from keywords
- **tags**: Extracted from category, effort, context, and keywords
- **regions**: Default to `['PK']`
- **active**: `true`

## Data Mapping

### Effort Mapping
- **Effort 1**: 1 step, 5 minutes
- **Effort 2**: 2 steps, 15 minutes  
- **Effort 3**: 3 steps, 30 minutes

### Purchase Detection
Keywords that trigger `requiresPurchase: true`:
- buy, purchase, replace, swap, bulb, led, strip, smart

### Tags Extraction
Tags are automatically generated from:
- Category name
- Effort level (quick/moderate/involved)
- Context requirements (maps, planning, freezer, social)
- Keywords from title

## Verification

After seeding, verify the data:

```sql
-- Count recommendations by category
SELECT category, COUNT(*) as count 
FROM recommendation_catalog 
GROUP BY category;

-- Check sample records
SELECT id, title, category, 
       metrics->>'pkrMonth' as pkr_month,
       metrics->>'kgco2eMonth' as co2_month
FROM recommendation_catalog 
LIMIT 10;
```

## Re-running the Seed

The seed script uses `upsert`, so it's safe to re-run. It will:
- Update existing records if they exist
- Create new records if they don't exist

## Integration with Scoring System

Once seeded, the recommendations are available for:
- Enhanced scoring pipeline
- MMR ranking
- Personality-based filtering
- Learning system

The catalog integrates with the existing Card-based system and can be used alongside it.

## Troubleshooting

### Error: Table doesn't exist
Make sure the database is synced:
```typescript
await initializeDatabase(); // This runs sequelize.sync({ alter: true })
```

### Error: Duplicate key
This is normal - the script uses `upsert` to handle duplicates.

### Error: Type mismatch
Check that the JSON structure matches the expected format. The script automatically converts:
- `utility_model.pkr_month` → `metrics.pkrMonth`
- `utility_model.kgco2e_month` → `metrics.kgco2eMonth`
- `utility_model.minutes` → `metrics.minutes`

## Next Steps

After seeding:
1. Test the enhanced scoring system with `GET /api/v1/engagement/next-actions`
2. Verify recommendations appear in the catalog
3. Test action completion with `POST /api/v1/engagement/action-done`
4. Monitor scoring and learning behavior




