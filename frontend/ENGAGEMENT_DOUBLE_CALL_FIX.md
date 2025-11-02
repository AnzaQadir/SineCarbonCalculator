# Engagement Dashboard - Double API Call Fix

## Issue: Duplicate API Calls for `best-next-action` and `weekly-recap`

### Why This Happens

When you open the browser developer tools and check the Network tab, you'll see **two API calls** for:
- `best-next-action`
- `weekly-recap`

### Root Causes

#### 1. React StrictMode (Development Only)
**File**: `frontend/src/App.tsx`

The app is wrapped in `<StrictMode>` which intentionally double-invokes:
- Component render functions
- State updaters
- Effects (useEffect)

This helps detect side effects and is **development-only behavior**.

**How it works:**
```
1. Component mounts → useEffect runs → API call #1
2. React immediately unmounts (StrictMode behavior)
3. Component remounts → useEffect runs again → API call #2
```

#### 2. Component Remounting on Section Switch
The `EngagementDashboard` is conditionally rendered:

```tsx
{activeSection === 'take-action' && (
  <EngagementDashboard profileImage={...} />
)}
```

When switching sections in ResultsDisplay:
- Component unmounts
- Component remounts when section becomes active
- useEffect runs again → API call

### The Fix

**File**: `frontend/src/components/engagement/EngagementDashboard.tsx`

Added a `useRef` guard to prevent duplicate calls:

```tsx
const hasFetched = useRef(false);

useEffect(() => {
  if (hasFetched.current) return; // Prevent duplicate calls
  
  hasFetched.current = true;
  
  const fetchData = async () => {
    // ... API calls
  };
  
  fetchData();
}, []);
```

### How It Works

1. **First render**: `hasFetched.current = false` → API call executes
2. **StrictMode remount**: `hasFetched.current = true` → Early return, no API call
3. **Section switch**: `hasFetched.current` persists → No API call

### Production Behavior

- **Development**: `StrictMode` enabled → Double calls (now fixed)
- **Production**: `StrictMode` disabled → Single call
- **Your fix works in both environments**

### Benefits

✅ **No duplicate API calls** in development  
✅ **No duplicate API calls** in production  
✅ **No duplicate API calls** when switching sections  
✅ **Reduced server load**  
✅ **Faster UI** (no unnecessary loading states)

### Verification

After the fix:
- Check Network tab → Only **one** call to `best-next-action`
- Check Network tab → Only **one** call to `weekly-recap`
- Switch sections → No new API calls

---

**Date**: January 2025  
**Status**: ✅ Fixed  
**Impact**: Eliminates unnecessary API calls and improves performance
