import React, { useState, useEffect, useRef } from 'react';
import { BestNextActionCard, BestNextAction } from './BestNextActionCard';
import { ActionToast, ToastData } from './ActionToast';
import { StreakRing } from './StreakRing';
import { WeeklyRecapCard } from './WeeklyRecapCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Leaf, TrendingUp, Loader2 } from 'lucide-react';
import { 
  getBestNextAction, 
  recordActionDone, 
  ActionDoneResponse,
  getWeeklyRecap,
  WeeklyRecap 
} from '@/services/engagementApi';

interface EngagementDashboardProps {
  profileImage?: string;
}

export const EngagementDashboard: React.FC<EngagementDashboardProps> = ({ 
  profileImage 
}) => {
  const [bestAction, setBestAction] = useState<BestNextAction | null>(null);
  const [loading, setLoading] = useState(true);
  const [toastData, setToastData] = useState<ToastData | null>(null);
  const [streak, setStreak] = useState({ current: 0, longest: 0 });
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());
  const [weeklyRecap, setWeeklyRecap] = useState<WeeklyRecap | null>(null);
  const [showRecap, setShowRecap] = useState(false);
  const hasFetched = useRef(false);

  // Fetch best next action and weekly recap (only once, even in StrictMode)
  useEffect(() => {
    if (hasFetched.current) return;
    
    hasFetched.current = true;
    
    const fetchData = async () => {
      try {
        const [action, recap] = await Promise.all([
          getBestNextAction(),
          getWeeklyRecap()
        ]);
        setBestAction(action);
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
        variant: 'A' 
      });

      if (result) {
        // Mark action as completed
        setCompletedActions(prev => new Set(prev).add(actionId));
        
        // Update streak
        setStreak(result.streak);

        // Show toast
        setToastData({
          rupees: result.verifiedImpact.rupees,
          co2_kg: result.verifiedImpact.co2_kg,
          streak: result.streak,
          bonus: result.bonus,
        });

        // Refresh best action after a delay to allow backend to process
        // Retry if no action is returned initially
        setTimeout(async () => {
          const newAction = await getBestNextAction();
          if (newAction) {
            setBestAction(newAction);
          } else {
            // Retry once more after additional delay
            setTimeout(async () => {
              const retryAction = await getBestNextAction();
              if (retryAction) {
                setBestAction(retryAction);
              }
              // If still null, keep previous state (don't set to null to avoid showing "all caught up" prematurely)
            }, 1000);
          }
        }, 500);
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
          <p className="text-gray-600">Loading your best next action...</p>
        </div>
      </div>
    );
  }

  if (!bestAction) {
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

  const isCompleted = completedActions.has(bestAction.id);

  return (
    <div className="space-y-6">
      {/* Header with Streak */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Your Best Next Action
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            One small step, big impact
          </p>
        </div>
        <StreakRing 
          streak={streak.current}
          longestStreak={streak.longest}
          profileImage={profileImage}
          size="lg"
        />
      </div>

      {/* Best Next Action Card */}
      <BestNextActionCard
        action={bestAction}
        onActionDone={handleActionDone}
        isCompleted={isCompleted}
      />

      {/* Stats Summary */}
      {streak.current > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-4"
        >
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-700">
                {streak.current}
              </div>
              <div className="text-sm text-green-600 mt-1">
                Day Streak 🔥
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-amber-700">
                {streak.longest}
              </div>
              <div className="text-sm text-amber-600 mt-1">
                Best Streak ⭐
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Weekly Recap Section */}
      {weeklyRecap && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Your Weekly Recap
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRecap(!showRecap)}
            >
              {showRecap ? 'Hide' : 'Show'} Recap
            </Button>
          </div>

          {showRecap && (
            <WeeklyRecapCard
              data={weeklyRecap}
              onShare={() => console.log('Recap shared')}
            />
          )}
        </motion.div>
      )}

      {/* Toast Notification */}
      <ActionToast 
        data={toastData}
        onClose={() => setToastData(null)}
      />
    </div>
  );
};
