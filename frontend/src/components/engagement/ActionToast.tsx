import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X, Trophy } from 'lucide-react';

export interface ToastData {
  rupees: number;
  co2_kg: number;
  streak?: {
    current: number;
    longest: number;
  };
  bonus?: {
    awarded: boolean;
    xp?: number;
    label?: string;
  };
}

interface ActionToastProps {
  data: ToastData | null;
  onClose: () => void;
}

export const ActionToast: React.FC<ActionToastProps> = ({ data, onClose }) => {
  useEffect(() => {
    if (data) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Auto-dismiss after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [data, onClose]);

  return (
    <AnimatePresence>
      {data && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4"
        >
          <div className="bg-white rounded-lg shadow-2xl border-2 border-green-500 p-4 relative">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Success Icon */}
            <div className="flex items-start gap-3 mb-3">
              <div className="bg-green-100 rounded-full p-2">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">
                  Nice! Verified ✓
                </h4>
                
                {/* Impact */}
                <div className="flex items-center gap-3 text-sm mb-2">
                  <span className="text-green-600 font-semibold">
                    –₹{data.rupees}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="text-emerald-600 font-semibold">
                    –{data.co2_kg} kg CO₂
                  </span>
                </div>

                {/* Streak */}
                {data.streak && (
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <span className="font-medium">Day {data.streak.current} streak</span>
                    {data.streak.current > 5 && (
                      <span className="text-yellow-600">🔥</span>
                    )}
                    {data.streak.longest > data.streak.current && (
                      <span className="text-gray-400">
                        (Best: {data.streak.longest})
                      </span>
                    )}
                  </div>
                )}

                {/* Bonus */}
                {data.bonus?.awarded && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mt-2 flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-2 py-1"
                  >
                    <Trophy className="h-4 w-4 text-yellow-600" />
                    <span className="text-xs font-semibold text-yellow-800">
                      {data.bonus.label}: +{data.bonus.xp} XP
                    </span>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 5, ease: 'linear' }}
                className="h-full bg-green-500"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
