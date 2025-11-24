import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles } from 'lucide-react';

interface StreakCelebrationProps {
  streak: number;
  points?: number;
  onComplete: () => void;
}

export const StreakCelebration: React.FC<StreakCelebrationProps> = ({
  streak,
  points,
  onComplete,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: 'spring', damping: 15 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onComplete}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm mx-4 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{ duration: 0.6 }}
          className="mb-4 flex justify-center"
        >
          <div className="relative">
            <CheckCircle2 className="h-16 w-16 text-brand-emerald" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0"
            >
              <Sparkles className="h-16 w-16 text-amber-400 opacity-50" />
            </motion.div>
          </div>
        </motion.div>

        <h3 className="text-2xl font-bold text-slate-800 mb-2">Nice work! 🎉</h3>
        <p className="text-slate-600 mb-4">
          You're on a <span className="font-bold text-brand-teal">{streak} day</span> streak!
        </p>
        {points && (
          <p className="text-sm text-slate-500 mb-6">
            +{points} points earned
          </p>
        )}
        <button
          onClick={onComplete}
          className="w-full bg-gradient-to-r from-brand-teal to-brand-emerald text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all"
        >
          Continue
        </button>
      </motion.div>
    </motion.div>
  );
};

