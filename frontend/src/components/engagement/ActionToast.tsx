import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Sparkles, TrendingUp } from 'lucide-react';
import { ActionDoneResponse } from '@/services/engagementService';

interface ActionToastProps {
  result: ActionDoneResponse;
  onDismiss: () => void;
  autoHideMs?: number;
}

export const ActionToast: React.FC<ActionToastProps> = ({
  result,
  onDismiss,
  autoHideMs = 3000,
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

  const rupees = Math.round(result.verifiedImpact.rupees);
  const co2 = result.verifiedImpact.co2_kg.toFixed(2);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 max-w-sm w-full mx-4"
      >
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-white to-cream-50 shadow-2xl border border-slate-100">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-teal/5 via-transparent to-brand-emerald/5 pointer-events-none" />
          
          {/* Close button */}
          <button
            onClick={onDismiss}
            className="absolute top-3 right-3 z-10 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100/50 transition-all"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="relative p-6">
            {/* Success icon with animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', delay: 0.1, damping: 15 }}
              className="flex justify-center mb-4"
            >
              <div className="relative">
                <CheckCircle2 className="w-12 h-12 text-brand-emerald" strokeWidth={2.5} />
                <motion.div
                  animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Sparkles className="w-6 h-6 text-brand-amber opacity-60" />
                </motion.div>
              </div>
            </motion.div>

            {/* Main message */}
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center text-xl font-bold text-slate-800 mb-6"
            >
              Action completed! ✨
            </motion.h3>

            {/* Impact metrics - clean and minimal */}
            <div className="space-y-4 mb-5">
              {/* CO₂ Impact - Hero metric */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-brand-teal/10 to-brand-emerald/10 border border-brand-teal/20">
                  <TrendingUp className="w-5 h-5 text-brand-emerald" />
                  <div>
                    <div className="text-2xl font-bold text-brand-teal">
                      {co2} kg
                    </div>
                    <div className="text-xs text-slate-500 font-medium">CO₂ saved</div>
                  </div>
                </div>
              </div>

              {/* Secondary metrics - compact */}
              <div className="flex items-center justify-center gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-slate-700">₨{rupees}</div>
                  <div className="text-xs text-slate-500">saved</div>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div className="text-center">
                  <div className="font-semibold text-brand-teal">{result.streak.current}</div>
                  <div className="text-xs text-slate-500">day streak</div>
                </div>
              </div>
            </div>

            {/* Bonus - if awarded */}
            {result.bonus?.awarded && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 pt-4 border-t border-slate-100"
              >
                <div className="flex items-center justify-center gap-2 text-sm">
                  <span className="text-xl">🎍</span>
                  <span className="font-semibold text-brand-amber">
                    {result.bonus.label}
                  </span>
                  <span className="text-brand-amber/80">+{result.bonus.xp} XP</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

