import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronDown, ChevronUp, Clock, X } from 'lucide-react';
import { NextAction, recordIntendedAction } from '@/services/engagementService';
import { DetailsPanel } from './DetailsPanel';
import { DoItNowFlow } from './DoItNowFlow';
import { SnoozeToast } from './SnoozeToast';
import { NotUsefulSheet } from './NotUsefulSheet';
import { StreakCelebration } from './StreakCelebration';

interface BestNextActionCardProps {
  action: NextAction;
  onAction: (outcome: 'done' | 'snooze' | 'dismiss', reason?: string) => void;
  isLoading?: boolean;
  tone?: 'friendly' | 'professional' | 'premium';
}

export const BestNextActionCard: React.FC<BestNextActionCardProps> = ({
  action,
  onAction,
  isLoading = false,
  tone = 'friendly',
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showDoItNowFlow, setShowDoItNowFlow] = useState(false);
  const [showSnoozeToast, setShowSnoozeToast] = useState(false);
  const [showNotUsefulSheet, setShowNotUsefulSheet] = useState(false);
  const [showStreakCelebration, setShowStreakCelebration] = useState(false);
  const [streakData, setStreakData] = useState<{ streak: number; points?: number } | null>(null);

  // Record "intended" event when DoItNowFlow opens
  useEffect(() => {
    if (showDoItNowFlow) {
      recordIntendedAction(action.id, {
        device: 'web',
        time_of_day: new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening',
      });
    }
  }, [showDoItNowFlow, action.id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl border border-slate-200/40 p-6 md:p-8"
    >
      <div className="mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">
          {action.title}
        </h3>
        {action.subtitle && (
          <p className="text-sm md:text-base text-slate-600">{action.subtitle}</p>
        )}
      </div>

      {/* Soft Segmented Control - Premium Action Zone */}
      <div className="mb-6 rounded-3xl p-1.5 shadow-sm bg-cream-50 border border-slate-200">
        <div className="flex gap-1.5">
          {/* Do it now - Primary */}
          <motion.button
            onClick={() => {
              if (!isLoading) {
                setShowDoItNowFlow(true);
              }
            }}
            disabled={isLoading}
            className="relative flex-1 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-teal to-brand-emerald py-3.5 px-4 text-sm font-semibold text-white transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 shadow-md hover:shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Processing...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Do it now
              </span>
            )}
          </motion.button>

          {/* Will do it later - Secondary */}
          <button
            onClick={() => {
              if (!isLoading) {
                setShowSnoozeToast(true);
              }
            }}
            disabled={isLoading}
            className="flex-1 rounded-2xl border border-sky-300 bg-transparent py-3 px-4 text-sm font-medium text-sky-600 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-sky-50 hover:border-sky-400"
          >
            <span className="flex items-center justify-center gap-2">
              <Clock className="h-4 w-4" />
              Will do it later
            </span>
          </button>

          {/* Not useful - Muted */}
          <button
            onClick={() => {
              if (!isLoading) {
                setShowNotUsefulSheet(true);
              }
            }}
            disabled={isLoading}
            className="flex-1 rounded-2xl border border-pink-300 bg-transparent py-3 px-4 text-sm font-medium text-pink-400 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-pink-50 hover:border-pink-400"
          >
            <span className="flex items-center justify-center gap-2">
              <X className="h-4 w-4" />
              Not useful
            </span>
          </button>
        </div>
      </div>

      {/* Learn More Toggle */}
      <div className="mb-2">
        <button
          onClick={() => setShowDetails((prev) => !prev)}
          className="flex w-full items-center justify-between rounded-xl bg-white px-4 py-3 text-sm font-semibold text-brand-teal transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
        >
          <span>{showDetails ? 'Hide details' : 'Curious? Open details'}</span>
          {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden pt-4"
          >
            <DetailsPanel item={action} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Do It Now Flow */}
      <AnimatePresence>
        {showDoItNowFlow && action.recommendation && (
          <DoItNowFlow
            recommendation={action.recommendation}
            onDone={() => {
              setShowDoItNowFlow(false);
              // Small delay to allow modal to close smoothly before action
              setTimeout(() => {
                onAction('done');
              }, 200);
            }}
            onExit={() => setShowDoItNowFlow(false)}
            tone={tone}
          />
        )}
      </AnimatePresence>

      {/* Snooze Toast */}
      <AnimatePresence>
        {showSnoozeToast && (
          <SnoozeToast
            onDismiss={() => {
              setShowSnoozeToast(false);
              // Small delay to allow toast to close smoothly before action
              setTimeout(() => {
                onAction('snooze');
              }, 200);
            }}
            onSelectTime={(time) => {
              setShowSnoozeToast(false);
              // Small delay to allow toast to close smoothly before action
              setTimeout(() => {
                onAction('snooze', time);
              }, 200);
            }}
            tone={tone}
          />
        )}
      </AnimatePresence>

      {/* Not Useful Sheet */}
      <AnimatePresence>
        {showNotUsefulSheet && (
          <NotUsefulSheet
            onSelectReason={(reason) => {
              setShowNotUsefulSheet(false);
              // Small delay to allow sheet to close smoothly before action
              setTimeout(() => {
                onAction('dismiss', reason);
              }, 200);
            }}
            onDismiss={() => setShowNotUsefulSheet(false)}
            tone={tone}
          />
        )}
      </AnimatePresence>

      {/* Streak Celebration */}
      <AnimatePresence>
        {showStreakCelebration && streakData && (
          <StreakCelebration
            streak={streakData.streak}
            points={streakData.points}
            onComplete={() => {
              setShowStreakCelebration(false);
              setStreakData(null);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

