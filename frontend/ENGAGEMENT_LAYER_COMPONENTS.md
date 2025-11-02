# Zerrah Engagement Layer - Frontend Components

## Overview

Frontend implementation of the Engagement Layer that provides the UI for the recommendation engine. Built with React, TypeScript, Tailwind CSS, and Framer Motion.

## Components

### 1. `BestNextActionCard`
**Location:** `frontend/src/components/engagement/BestNextActionCard.tsx`

Displays the user's single best next action with:
- Impact preview (₹ saved, CO₂ reduced)
- Primary CTA button ("Mark Done")
- Collapsible "Learn More" section
- Source attribution
- Completion state

**Props:**
```typescript
interface BestNextActionCardProps {
  action: BestNextAction;
  onActionDone: (actionId: string) => void;
  isCompleted?: boolean;
}
```

**Features:**
- Gradient background (green theme)
- Animated entry (Framer Motion)
- Collapsible details
- Source footer with last updated date

### 2. `ActionToast`
**Location:** `frontend/src/components/engagement/ActionToast.tsx`

Toast notification shown after completing an action:
- Impact confirmation (₹ and CO₂)
- Current streak display
- Bonus notification (if awarded)
- Auto-dismiss after 5 seconds
- Progress bar

**Props:**
```typescript
interface ActionToastProps {
  data: ToastData | null;
  onClose: () => void;
}
```

**Features:**
- Bottom-center positioning
- Slide-in animation
- Manual close button
- Bonus highlight with trophy icon

### 3. `StreakRing`
**Location:** `frontend/src/components/engagement/StreakRing.tsx`

Circular progress ring showing streak around avatar:
- Animated progress fill
- Streak badge (top-right)
- Trophy for longest streak
- Color changes by streak level

**Props:**
```typescript
interface StreakRingProps {
  streak: number;
  longestStreak?: number;
  profileImage?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
```

**Features:**
- SVG-based circle animation
- Size variants (sm, md, lg)
- Color-coded progress (yellow → amber → orange)
- Responsive to profile image

### 4. `EngagementDashboard`
**Location:** `frontend/src/components/engagement/EngagementDashboard.tsx`

Main container component that orchestrates all engagement features:
- Fetches best next action
- Handles action completion
- Manages streak state
- Shows toast notifications

**Props:**
```typescript
interface EngagementDashboardProps {
  profileImage?: string;
}
```

**Features:**
- Loading state
- Empty state ("all caught up")
- Auto-refresh after action completion
- Streak summary cards

## API Service

### `engagementApi.ts`
**Location:** `frontend/src/services/engagementApi.ts`

Centralized API client for all engagement endpoints:

```typescript
// Get best next action
getBestNextAction(): Promise<BestNextAction | null>

// Record action as done
recordActionDone(recommendationId, context?): Promise<ActionDoneResponse | null>

// Get home feed
getHomeFeed(): Promise<HomeFeed | null>

// Get weekly recap
getWeeklyRecap(): Promise<WeeklyRecap | null>
```

**Base URL:** `${API_BASE_URL}/v1/engagement`

## Integration Example

```tsx
import { EngagementDashboard } from '@/components/engagement/EngagementDashboard';

function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <EngagementDashboard profileImage="/avatar.jpg" />
    </div>
  );
}
```

## Styling

All components use:
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons
- Consistent green/emerald theme
- Responsive design

## State Management

Components use React hooks for state:
- `useState` for local state
- `useEffect` for side effects (API calls)
- Props for parent-child communication

No global state management needed for MVP.

## Accessibility

- Semantic HTML elements
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus states on buttons
- Motion preferences respected (TODO)

## Testing

Recommended testing strategy:
1. Unit tests for individual components
2. Integration tests for API calls
3. E2E tests for complete user flows

## Future Enhancements

- [ ] Weekly recap card component
- [ ] Share card image generation (canvas)
- [ ] WhatsApp deep-link handling
- [ ] Home feed sections display
- [ ] Analytics event tracking
- [ ] Offline support
- [ ] Push notifications

## Usage

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Dependencies

```json
{
  "react": "^18.x",
  "typescript": "^5.x",
  "framer-motion": "^10.x",
  "lucide-react": "^0.x",
  "tailwindcss": "^3.x"
}
```

## File Structure

```
frontend/src/
├── components/
│   └── engagement/
│       ├── BestNextActionCard.tsx
│       ├── ActionToast.tsx
│       ├── StreakRing.tsx
│       └── EngagementDashboard.tsx
└── services/
    └── engagementApi.ts
```

---

**Status:** MVP complete ✅  
**Last Updated:** 2025-01-XX
