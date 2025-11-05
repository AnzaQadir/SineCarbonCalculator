import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BestNextActionCard,
  AlternativeActionCard,
  ActionToast,
  StreakRing,
  WeeklyRecapCard,
  ShareComposer,
} from './index';
import {
  getNextActions,
  markActionDone,
  getWeeklyRecap,
  type NextActionsResponse,
  type ActionDoneResponse,
  type WeeklyRecap,
} from '@/services/engagementService';

export const EngagementSection: React.FC = () => {
  const [nextActions, setNextActions] = useState<NextActionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toastResult, setToastResult] = useState<ActionDoneResponse | null>(null);
  const [streak, setStreak] = useState<{ current: number; longest: number } | null>(null);
  const [weeklyRecap, setWeeklyRecap] = useState<WeeklyRecap | null>(null);
  const [showShareComposer, setShowShareComposer] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load next actions and weekly recap
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log('[Engagement] Loading next actions and weekly recap...');
        
        const [actions, recap] = await Promise.all([
          getNextActions().catch((err) => {
            console.error('[Engagement] Error loading next actions:', err);
            const errorMsg = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMsg);
            console.error('[Engagement] Full error:', err);
            return null;
          }),
          getWeeklyRecap().catch((err) => {
            console.warn('[Engagement] Error loading weekly recap (may not have data yet):', err);
            return null;
          }),
        ]);

        if (actions) {
          console.log('[Engagement] Next actions loaded:', actions);
          setNextActions(actions);
          setError(null); // Clear any previous errors
        } else {
          console.warn('[Engagement] No next actions received');
          if (!error) {
            setError('Unable to load next actions. Please ensure you are logged in and have completed the personality quiz.');
          }
        }
        
        if (recap) {
          console.log('[Engagement] Weekly recap loaded:', recap);
          setWeeklyRecap(recap);
        }
      } catch (error) {
        console.error('[Engagement] Unexpected error loading engagement data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleActionDone = async (recommendationId: string) => {
    try {
      setActionLoading(recommendationId);
      console.log('[Engagement] Marking action as done:', recommendationId);
      
      const result = await markActionDone(recommendationId, { surface: 'web' });
      console.log('[Engagement] Action marked done, result:', result);

      setToastResult(result);
      setStreak(result.streak);

      // Refresh next actions to exclude the done one
      console.log('[Engagement] Refreshing next actions...');
      const updatedActions = await getNextActions().catch((err) => {
        console.error('[Engagement] Error refreshing next actions:', err);
        return null;
      });
      
      if (updatedActions) {
        console.log('[Engagement] Next actions refreshed:', updatedActions);
        setNextActions(updatedActions);
      }
    } catch (error) {
      console.error('[Engagement] Error marking action done:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to mark action as done. Please try again.';
      alert(errorMessage);
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

  if (!nextActions) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
        <p className="text-slate-600 mb-4">
          {error || 'Unable to load next actions. Please try again later.'}
        </p>
        <div className="text-sm text-slate-500 space-y-1">
          <p>Possible issues:</p>
          <ul className="list-disc list-inside text-left max-w-md mx-auto space-y-1">
            <li>You may not be logged in. Please log in and try again.</li>
            <li>You may not have completed the personality quiz yet.</li>
            <li>The backend server may not be running.</li>
          </ul>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              // Reload data
              const loadData = async () => {
                try {
                  const actions = await getNextActions().catch((err) => {
                    console.error('[Engagement] Retry error:', err);
                    setError(err instanceof Error ? err.message : 'Unknown error');
                    return null;
                  });
                  if (actions) {
                    setNextActions(actions);
                    setError(null);
                  }
                } finally {
                  setLoading(false);
                }
              };
              loadData();
            }}
            className="mt-4 px-4 py-2 bg-brand-teal text-white rounded-lg hover:bg-brand-emerald transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-12">
      {/* Engagement Header with Streak */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-brand-teal to-brand-emerald bg-clip-text text-transparent">
            Your Best Next Action
          </h2>
          <p className="text-slate-600 mt-2 font-medium">— or choose your own win —</p>
        </div>
        {streak && (
          <div className="hidden md:block">
            <StreakRing currentStreak={streak.current} longestStreak={streak.longest} />
          </div>
        )}
      </div>

      {/* Primary Action */}
      <BestNextActionCard
        action={nextActions.primary}
        onDone={() => handleActionDone(nextActions.primary.id)}
        isLoading={actionLoading === nextActions.primary.id}
      />

      {/* Alternative Actions */}
      {nextActions.alternatives.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nextActions.alternatives.map((alt) => (
            <AlternativeActionCard
              key={alt.id}
              action={alt}
              onDone={() => handleActionDone(alt.id)}
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
    </div>
  );
};

