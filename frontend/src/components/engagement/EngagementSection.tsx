import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  BestNextActionCard,
  AlternativeActionCard,
  ActionToast,
  StreakRing,
  WeeklyRecapCard,
  ShareComposer,
  BucketList,
  DetailsPanel,
} from './index';
import { BucketIcon } from './icons/BucketIcon';
import {
  getNextActions,
  markActionDone,
  getWeeklyRecap,
  getBucketList,
  type NextActionsResponse,
  type ActionDoneResponse,
  type WeeklyRecap,
} from '@/services/engagementService';

// Module-level singleton to prevent duplicate API calls across multiple component instances
const globalLoadingState = {
  isLoading: false,
  isBucketLoading: false,
  isRecapLoading: false,
};

export const EngagementSection: React.FC = () => {
  const [nextActions, setNextActions] = useState<NextActionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toastResult, setToastResult] = useState<ActionDoneResponse | null>(null);
  const [streak, setStreak] = useState<{ current: number; longest: number } | null>(null);
  const [weeklyRecap, setWeeklyRecap] = useState<WeeklyRecap | null>(null);
  const [showShareComposer, setShowShareComposer] = useState(false);
  const [showBucketList, setShowBucketList] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bucketSummary, setBucketSummary] = useState<{
    total: number;
    done: number;
    snoozed: number;
  } | null>(null);
  
  // Use module-level singleton to prevent duplicate calls across component instances
  // This ensures only one set of API calls happens even if multiple EngagementSection components are rendered

  const hasBucketStats = Boolean(bucketSummary && bucketSummary.total > 0);
  
  // Calculate ratios based on Done + Later total (not including other items)
  const doneCount = bucketSummary?.done || 0;
  const laterCount = bucketSummary?.snoozed || 0;
  const totalCount = doneCount + laterCount;
  
  // If there are items, calculate proportions; otherwise show empty ring
  const doneRatio = totalCount > 0 ? doneCount / totalCount : 0;
  const laterRatio = totalCount > 0 ? laterCount / totalCount : 0;
  
  // Single ring configuration
  const ringRadius = 46;
  const ringCircumference = 2 * Math.PI * ringRadius;
  
  // Calculate segment lengths - these will fill the entire ring
  const doneLength = ringCircumference * doneRatio;
  const laterLength = ringCircumference * laterRatio;
  
  // Calculate offsets for proper positioning
  // After -90 rotation, the circle starts at the top (12 o'clock)
  // strokeDasharray pattern: [visibleLength] [gapLength] repeats
  // strokeDashoffset shifts where the pattern starts
  
  // Done segment: show doneLength starting from top
  // Pattern: [doneLength visible] [ringCircumference gap]
  // Offset: ringCircumference - doneLength positions visible part at top (position 0)
  const doneOffset = ringCircumference - doneLength;
  
  // Later segment: show laterLength starting right after done ends
  // Pattern: [laterLength visible] [ringCircumference gap]  
  // We want visible part to start at position doneLength around the circle
  // Offset calculation: shift pattern so visible part starts at doneLength
  // Since pattern repeats every (laterLength + ringCircumference), we need:
  // offset = ringCircumference - doneLength - laterLength
  const laterOffset = ringCircumference - doneLength - laterLength;
  
  // Debug logging to help diagnose ring rendering
  console.log('[Ring Debug]', {
    doneCount,
    laterCount,
    totalCount,
    doneRatio: doneRatio.toFixed(3),
    laterRatio: laterRatio.toFixed(3),
    doneLength: doneLength.toFixed(2),
    laterLength: laterLength.toFixed(2),
    ringCircumference: ringCircumference.toFixed(2),
    doneOffset: doneOffset.toFixed(2),
    laterOffset: laterOffset.toFixed(2),
    willRenderLater: laterRatio > 0 && laterLength > 0,
  });

  const refreshBucketSummary = useCallback(async () => {
    // Prevent duplicate calls using module-level singleton
    if (globalLoadingState.isBucketLoading) {
      console.log('[Engagement] Bucket list already loading, skipping duplicate call');
      return;
    }

    try {
      globalLoadingState.isBucketLoading = true;
      const bucket = await getBucketList();
      setBucketSummary({
        total: bucket.total,
        done: bucket.doneCount,
        snoozed: bucket.snoozedCount,
      });
    } catch (err) {
      console.warn('[Engagement] Unable to refresh bucket summary:', err);
    } finally {
      globalLoadingState.isBucketLoading = false;
    }
  }, []);

  // Load next actions and weekly recap
  useEffect(() => {
    // Use module-level singleton to prevent duplicate calls across component instances
    if (globalLoadingState.isLoading || globalLoadingState.isRecapLoading || globalLoadingState.isBucketLoading) {
      console.log('[Engagement] Already loading, skipping duplicate call');
      return;
    }

    // Set all flags immediately before any async operations (atomic check-and-set)
    globalLoadingState.isLoading = true;
    globalLoadingState.isRecapLoading = true;
    globalLoadingState.isBucketLoading = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null); // Clear previous errors
        console.log('[Engagement] Loading next actions and weekly recap...');
        
        // Load next actions and weekly recap independently (don't fail one if other fails)
        const actionsPromise = getNextActions().catch((err) => {
          console.error('[Engagement] Error loading next actions:', err);
          // Don't set error state here - we'll handle it gracefully below
          return null;
        });
        
        const recapPromise = getWeeklyRecap()
          .catch((err) => {
            console.warn('[Engagement] Error loading weekly recap (may not have data yet):', err);
            // This is expected for new users, so just return null
            return null;
          });

        const [actions, recap] = await Promise.all([actionsPromise, recapPromise]);

        // Handle next actions
        if (actions) {
          console.log('[Engagement] Next actions loaded:', actions);
          setNextActions(actions);
          setError(null); // Clear any previous errors
        } else {
          console.warn('[Engagement] No next actions received');
          // Don't set a harsh error - just show empty state
          setNextActions(null);
        }
        
        // Handle weekly recap (optional, so null is fine)
        if (recap) {
          console.log('[Engagement] Weekly recap loaded:', recap);
          setWeeklyRecap(recap);
        } else {
          // Weekly recap is optional - set to null but don't show error
          setWeeklyRecap(null);
        }
      } catch (error) {
        console.error('[Engagement] Unexpected error loading engagement data:', error);
        // Only set error for truly unexpected errors
        if (error instanceof Error && !error.message.includes('fetch')) {
          setError('An unexpected error occurred. Please try refreshing the page.');
        }
      } finally {
        setLoading(false);
        globalLoadingState.isLoading = false;
        globalLoadingState.isRecapLoading = false;
      }
    };

    const loadBucket = async () => {
      try {
        const bucket = await getBucketList();
        setBucketSummary({
          total: bucket.total,
          done: bucket.doneCount,
          snoozed: bucket.snoozedCount,
        });
      } catch (err) {
        console.warn('[Engagement] Unable to refresh bucket summary:', err);
      } finally {
        globalLoadingState.isBucketLoading = false;
      }
    };

    loadData();
    loadBucket();

    // Cleanup function to reset the flags if component unmounts during loading
    return () => {
      // Only reset if this component was the one loading (to avoid race conditions)
      // In practice, the finally blocks handle this, but this is a safety net
      if (globalLoadingState.isLoading || globalLoadingState.isRecapLoading || globalLoadingState.isBucketLoading) {
        // Don't reset here - let the async operations finish and reset themselves
        // This prevents one component unmounting from canceling another component's loading
      }
    };
  }, [refreshBucketSummary]);

  const handleAction = async (recommendationId: string, outcome: 'done' | 'snooze' | 'dismiss') => {
    try {
      setActionLoading(recommendationId);
      console.log('[Engagement] Processing action:', { recommendationId, outcome });
      
      const result = await markActionDone(recommendationId, outcome, { surface: 'web' });
      console.log('[Engagement] Action processed, result:', result);

      // Only show toast and update streak for "done" actions
      if (outcome === 'done') {
        setToastResult(result);
        setStreak(result.streak);
      }

      // Refresh next actions (especially for "done" and "dismiss" to remove them)
      if (outcome === 'done' || outcome === 'dismiss') {
        console.log('[Engagement] Refreshing next actions...');
        const updatedActions = await getNextActions().catch((err) => {
          console.error('[Engagement] Error refreshing next actions:', err);
          return null;
        });
        
        if (updatedActions) {
          console.log('[Engagement] Next actions refreshed:', updatedActions);
          setNextActions(updatedActions);
        }
      }

      if (outcome === 'done' || outcome === 'snooze') {
        refreshBucketSummary();
      }
    } catch (error) {
      console.error('[Engagement] Error processing action:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to process action. Please try again.';
      
      // Handle authentication errors gracefully
      if (errorMessage.includes('Unauthorized') || errorMessage.includes('log in') || errorMessage.includes('session')) {
        // Show user-friendly message instead of alert
        setError('Please log in to save your actions. Your session may have expired.');
        
        // Optionally redirect to login or refresh the page
        // You could also trigger a login modal here
      } else {
        // For other errors, show alert
        alert(errorMessage);
      }
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-teal mx-auto mb-4"></div>
        <p className="text-slate-600">Loading your next actions...</p>
      </div>
    );
  }

  if (!nextActions && !loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">You're all caught up!</h3>
        <p className="text-slate-600 mb-4">
          Check back tomorrow for more personalized actions
        </p>
        <p className="text-sm text-slate-500 mb-6">
          Or explore your bucket list to see actions you've saved for later
        </p>
        
        {error && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-left max-w-md mx-auto">
            <p className="text-sm text-amber-800 font-medium mb-2">Note:</p>
            <p className="text-xs text-amber-700">{error}</p>
          </div>
        )}
        
        <button
          onClick={() => {
            setError(null);
            setLoading(true);
            // Reload data
            const loadData = async () => {
              try {
                const actions = await getNextActions().catch((err) => {
                  console.error('[Engagement] Retry error:', err);
                  return null;
                });
                if (actions) {
                  setNextActions(actions);
                  setError(null);
                }
              } catch (err) {
                console.error('[Engagement] Unexpected retry error:', err);
              } finally {
                setLoading(false);
              }
            };
            loadData();
          }}
          className="mt-4 px-6 py-2 bg-brand-teal text-white rounded-lg hover:bg-brand-emerald transition-colors font-medium"
        >
          Refresh Recommendations
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-12 pt-10 md:pt-16">
      {/* Engagement Header with Streak and Bucket List Icon */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div className="flex-1">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-brand-teal to-brand-emerald bg-clip-text text-transparent">
            Your Best Next Action
          </h2>
          <p className="text-slate-600 mt-2 font-medium">— or choose your own win —</p>
        </div>
        <div className="flex items-center justify-end gap-5 pr-4 md:pr-8">
          {streak && (
            <div className="hidden md:block">
              <StreakRing currentStreak={streak.current} longestStreak={streak.longest} />
            </div>
          )}
          <div className="flex items-center gap-4">
            <div className="relative">
              <svg width="132" height="132" viewBox="0 0 132 132">
                <g transform="translate(6,6)">
                  <defs>
                    <linearGradient id="doneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0f766e" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                    <linearGradient id="laterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fbbf24" />
                      <stop offset="100%" stopColor="#eab308" />
                    </linearGradient>
                  </defs>

                  {/* Background ring (light gray) - only visible if no items */}
                  {totalCount === 0 && (
                    <circle
                      cx="60"
                      cy="60"
                      r={ringRadius}
                      stroke="rgba(0,0,0,0.08)"
                      strokeWidth="10"
                      fill="none"
                    />
                  )}

                  {/* Done segment (green) - starts from top, shows what's completed */}
                  {doneRatio > 0 && (
                    <circle
                      cx="60"
                      cy="60"
                      r={ringRadius}
                      stroke="url(#doneGradient)"
                      strokeWidth="10"
                      fill="none"
                      strokeLinecap={laterRatio > 0 ? "butt" : "round"}
                      strokeDasharray={`${doneLength} ${ringCircumference}`}
                      strokeDashoffset={ringCircumference - doneLength}
                      transform="rotate(-90 60 60)"
                    />
                  )}
                  
                  {/* Later segment (yellow) - continues immediately after done, shows what's to do */}
                  {laterRatio > 0 && laterLength > 0 && (
                    <circle
                      cx="60"
                      cy="60"
                      r={ringRadius}
                      stroke="#fbbf24"
                      strokeWidth="10"
                      fill="none"
                      strokeLinecap={doneRatio > 0 ? "butt" : "round"}
                      strokeDasharray={`${laterLength} ${ringCircumference - laterLength}`}
                      strokeDashoffset={ringCircumference - doneLength}
                      transform="rotate(-90 60 60)"
                      style={{ opacity: 1 }}
                    />
                  )}

                  {/* Center circles for depth */}
                  <circle cx="60" cy="60" r="32" fill="rgba(15,118,110,0.12)" />
                  <circle cx="60" cy="60" r="28" fill="rgba(15,118,110,0.18)" />
                </g>
              </svg>

              <button
                onClick={() => setShowBucketList(true)}
                className="absolute inset-0 m-auto h-14 w-14 rounded-full bg-gradient-to-br from-brand-teal via-brand-emerald to-brand-teal text-white flex items-center justify-center shadow-lg hover:shadow-emerald-500/40 hover:shadow-2xl transition-all duration-300 hover:scale-110 group border border-white/30"
                title="View my bucket list"
                aria-label="View my bucket list"
              >
                <div className="absolute inset-[3px] rounded-full bg-white/15 blur-sm" />
                <BucketIcon className="w-6 h-6 text-white relative z-10" strokeWidth={1.8} />
                <span className="absolute -bottom-11 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg">
                  My Bucket List
                </span>
              </button>
            </div>
            {hasBucketStats && bucketSummary && (
              <div className="hidden md:flex flex-col gap-2 text-right">
                <div className="flex items-center justify-end gap-2 text-sm font-semibold text-emerald-600">
                  <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
                  <span>Done</span>
                  <span className="text-slate-500 font-medium">{bucketSummary.done}</span>
                </div>
                <div className="flex items-center justify-end gap-2 text-sm font-semibold text-yellow-600">
                  <span className="inline-flex h-2 w-2 rounded-full bg-yellow-500" aria-hidden="true" />
                  <span>Later</span>
                  <span className="text-slate-500 font-medium">{bucketSummary.snoozed}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Primary Action */}
      {nextActions.primary ? (
        <BestNextActionCard
          action={nextActions.primary}
          onAction={(outcome) => handleAction(nextActions.primary!.id, outcome)}
          isLoading={actionLoading === nextActions.primary.id}
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">You're all caught up!</h3>
          <p className="text-slate-600 mb-4">
            Check back tomorrow for more personalized actions
          </p>
          <p className="text-sm text-slate-500 mb-4">
            Or explore your bucket list to see actions you've saved for later
          </p>
          <button
            onClick={() => setShowBucketList(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-teal text-white rounded-lg hover:bg-brand-emerald transition-colors text-sm font-medium"
          >
            <BucketIcon className="w-4 h-4 text-white" strokeWidth={1.7} />
            View My Bucket List
          </button>
        </div>
      )}

      {/* Alternative Actions */}
      {nextActions.alternatives.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nextActions.alternatives.map((alt) => (
            <AlternativeActionCard
              key={alt.id}
              action={alt}
              onAction={(outcome) => handleAction(alt.id, outcome)}
              isLoading={actionLoading === alt.id}
            />
          ))}
        </div>
      )}

      {/* Weekly Recap */}
      {weeklyRecap ? (
        <WeeklyRecapCard
          recap={weeklyRecap}
          onShare={() => setShowShareComposer(true)}
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 md:p-8">
          <div className="mb-2 text-slate-800 font-bold text-lg">Your Week</div>
          <p className="text-slate-600 text-sm">
            Your first weekly recap will appear after your first action. Mark any Next Action as done to start your streak.
          </p>
        </div>
      )}

      {/* Toast */}
      {toastResult && (
        <ActionToast
          result={toastResult}
          onDismiss={() => setToastResult(null)}
        />
      )}

      {/* Share Composer */}
      {showShareComposer && weeklyRecap && (
        <ShareComposer
          recap={weeklyRecap}
          onClose={() => setShowShareComposer(false)}
        />
      )}

      {/* Bucket List Modal */}
      {showBucketList && (
        <BucketList onClose={() => setShowBucketList(false)} />
      )}
    </div>
  );
};

