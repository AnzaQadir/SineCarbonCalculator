import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X, Sparkles } from 'lucide-react';

interface SnoozeToastProps {
  onDismiss: () => void;
  onSelectTime?: (time: 'evening' | 'weekend' | 'no_reminders') => void;
  tone?: 'friendly' | 'professional' | 'premium';
}

export const SnoozeToast: React.FC<SnoozeToastProps> = ({
  onDismiss,
  onSelectTime,
  tone = 'friendly',
}) => {
  const [showTimeOptions, setShowTimeOptions] = useState(false);

  const toneVariants = {
    friendly: {
      message: "Got you - I'll bring this back at the right time",
      emoji: '👍',
    },
    professional: {
      message: "Saved. I'll resurface this when suitable.",
      emoji: '',
    },
    premium: {
      message: 'Queued for a better moment.',
      emoji: '',
    },
  };

  const variant = toneVariants[tone];

  const handleTimeSelect = (time: 'evening' | 'weekend' | 'no_reminders') => {
    if (onSelectTime) {
      onSelectTime(time);
    }
    setTimeout(() => onDismiss(), 300);
  };

  const timeOptions = [
    { value: 'evening' as const, label: 'This evening', icon: '🌆' },
    { value: 'weekend' as const, label: 'This weekend', icon: '🌅' },
    { value: 'no_reminders' as const, label: 'No reminders', icon: '🔕' },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 20, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 max-w-sm w-full mx-4"
      >
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-white to-cream-50 shadow-2xl border border-slate-100">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-zerrah-blue/5 via-transparent to-zerrah-deepblue/5 pointer-events-none" />
          
          {/* Close button */}
          <button
            onClick={onDismiss}
            className="absolute top-3 right-3 z-10 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100/50 transition-all"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="relative p-6">
            {/* Animated clock icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', delay: 0.1, damping: 15 }}
              className="flex justify-center mb-4"
            >
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-zerrah-blue/20 to-zerrah-deepblue/20 flex items-center justify-center border border-zerrah-blue/30">
                  <Clock className="w-7 h-7" strokeWidth={2} style={{ color: '#4A90C2' }} />
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="absolute -inset-1 flex items-center justify-center"
                >
                  <Sparkles className="w-5 h-5 text-brand-amber opacity-50" />
                </motion.div>
              </div>
            </motion.div>

            {/* Message */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-5"
            >
              <p className="text-slate-800 font-semibold text-base leading-relaxed">
                {variant.emoji && <span className="text-xl mr-2">{variant.emoji}</span>}
                {variant.message}
              </p>
            </motion.div>

            {/* Time selection options */}
            {!showTimeOptions && onSelectTime && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                onClick={() => setShowTimeOptions(true)}
                className="w-full py-2.5 px-4 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: 'rgba(74, 144, 194, 0.1)',
                  borderColor: 'rgba(74, 144, 194, 0.3)',
                  color: '#4A90C2',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(74, 144, 194, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(74, 144, 194, 0.1)';
                }}
              >
                <span>Choose when</span>
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </motion.button>
            )}

            <AnimatePresence>
              {showTimeOptions && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden space-y-2 mt-4"
                >
                  {timeOptions.map((option, index) => (
                    <motion.button
                      key={option.value}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleTimeSelect(option.value)}
                      className="w-full text-left px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-medium text-sm transition-all duration-200 flex items-center gap-3 group"
                      style={{
                        borderColor: 'rgba(226, 232, 240, 1)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(74, 144, 194, 0.08)';
                        e.currentTarget.style.borderColor = 'rgba(74, 144, 194, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 1)';
                      }}
                    >
                      <span className="text-lg">{option.icon}</span>
                      <span className="flex-1">{option.label}</span>
                      <motion.span
                        className="opacity-0 group-hover:opacity-100"
                        style={{ color: '#4A90C2' }}
                        initial={{ x: -10 }}
                        whileHover={{ x: 0 }}
                      >
                        →
                      </motion.span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

