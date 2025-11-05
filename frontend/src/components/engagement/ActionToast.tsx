import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2 } from 'lucide-react';
import { ActionDoneResponse } from '@/services/engagementService';

interface ActionToastProps {
  result: ActionDoneResponse;
  onDismiss: () => void;
  autoHideMs?: number;
}

export const ActionToast: React.FC<ActionToastProps> = ({
  result,
  onDismiss,
  autoHideMs = 2600,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, autoHideMs);

    return () => clearTimeout(timer);
  }, [onDismiss, autoHideMs]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onDismiss();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onDismiss]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        transition={{ type: 'spring', damping: 20 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-full mx-4"
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 relative">
          <button
            onClick={onDismiss}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-lg text-slate-800 mb-2">Nice!</h4>
              <div className="space-y-1 text-sm">
                <div className="text-slate-700">
                  Verified: <span className="font-semibold text-red-600">–₨{Math.round(result.verifiedImpact.rupees)}</span>
                  {' • '}
                  <span className="font-semibold text-green-600">
                    –{result.verifiedImpact.co2_kg.toFixed(2)} kg CO₂
                  </span>
                </div>
                <div className="text-slate-600">
                  Streak: <span className="font-semibold text-brand-teal">{result.streak.current} days</span>
                </div>
                {result.bonus?.awarded && (
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-200">
                    <span className="text-2xl">🎍</span>
                    <span className="text-sm font-semibold text-amber-600">
                      {result.bonus.label} +{result.bonus.xp} XP
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

