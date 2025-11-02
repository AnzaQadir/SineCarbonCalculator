import React, { useState, useEffect, useRef } from 'react';
import { SwipeableActionCards } from './SwipeableActionCards';
import { ToastData } from './ActionToast';
import { StreakRing } from './StreakRing';
import { WeeklyRecapCard } from './WeeklyRecapCard';
import { motion } from 'framer-motion';
import { Leaf, Loader2 } from 'lucide-react';
import { 
  getNextActions, 
  recordActionDone, 
  getWeeklyRecap,
  WeeklyRecap,
  NextActionsResponse 
} from '@/services/engagementApi';

interface MultiCardEngagementDashboardProps {
  profileImage?: string;
}

export const MultiCardEngagementDashboard: React.FC<MultiCardEngagementDashboardProps> = ({ 
  profileImage 
}) => {
  const [actions, setActions] = useState<NextActionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [toastData, setToastData] = useState<ToastData | null>(null);
  const [streak, setStreak] = useState({ current: 0, longest: 0 });
  const [weeklyRecap, setWeeklyRecap] = useState<WeeklyRecap | null>(null);
  const [showRecap, setShowRecap] = useState(false);
  const hasFetched = useRef(false);

  // Fetch next actions and weekly recap (only once, even in StrictMode)
  useEffect(() => {
    if (hasFetched.current) return;
    
    hasFetched.current = true;
    
    const fetchData = async () => {
      try {
        const [actionsData, recap] = await Promise.all([
          getNextActions(),
          getWeeklyRecap()
        ]);
        setActions(actionsData);
        setWeeklyRecap(recap);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle action done
  const handleActionDone = async (actionId: string) => {
    try {
      const result = await recordActionDone(actionId, { 
        surface: 'web',
        variant: 'B' // Mark as multi-card variant
      });

      if (result) {
        // Update streak
        setStreak(result.streak);

        // Show toast
        setToastData({
          rupees: result.verifiedImpact.rupees,
          co2_kg: result.verifiedImpact.co2_kg,
          streak: result.streak,
          bonus: result.bonus,
        });

        // Refresh actions after 2 seconds
        setTimeout(async () => {
          const newActions = await getNextActions();
          setActions(newActions);
        }, 2000);
      }
    } catch (error) {
      console.error('Error recording action:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-2" />
          <p className="text-gray-600">Loading your actions...</p>
        </div>
      </div>
    );
  }

  if (!actions) {
    return (
      <div className="text-center py-12">
        <Leaf className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          You're all caught up! 🎉
        </h3>
        <p className="text-gray-600">
          Check back tomorrow for more actions
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Streak */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Your Best Next Actions
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Swipe to explore options
          </p>
        </div>
        <StreakRing 
          streak={streak.current}
          longestStreak={streak.longest}
          profileImage={profileImage}
        />
      </div>

      {/* Swipeable Action Cards */}
      <div className="max-w-2xl mx-auto">
        <SwipeableActionCards
          primary={actions.primary}
          alternatives={actions.alternatives}
          onActionDone={handleActionDone}
          toastData={toastData}
        />
      </div>

      {/* Weekly Recap Toggle */}
      {weeklyRecap && (
        <div className="mt-8">
          <button
            onClick={() => setShowRecap(!showRecap)}
            className="text-sm text-green-600 hover:text-green-700 font-medium"
          >
            {showRecap ? 'Hide' : 'Show'} Weekly Recap
          </button>
          {showRecap && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
            >
              <WeeklyRecapCard
                rupeesSaved={weeklyRecap.rupeesSaved}
                co2SavedKg={weeklyRecap.co2SavedKg}
                actionsCount={weeklyRecap.actionsCount}
                cityCommunity={weeklyRecap.cityCommunity}
                storyText={weeklyRecap.storyText}
              />
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};
