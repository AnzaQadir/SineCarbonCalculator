import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Checklist } from './Checklist';
import { RecommendationDetails } from '@/services/engagementService';

interface DoItNowFlowProps {
  recommendation: RecommendationDetails;
  onDone: () => void;
  onExit: () => void;
  tone?: 'friendly' | 'professional' | 'premium';
}

export const DoItNowFlow: React.FC<DoItNowFlowProps> = ({
  recommendation,
  onDone,
  onExit,
  tone = 'friendly',
}) => {
  const [allStepsCompleted, setAllStepsCompleted] = useState(false);
  const steps = recommendation.how || [];

  const toneVariants = {
    friendly: {
      title: "Let's do it - I'll guide you!",
    },
    professional: {
      title: 'Ready when you are - here are the steps.',
    },
    premium: {
      title: "I've opened your action panel.",
    },
  };

  const variant = toneVariants[tone];

  const helperActions = [
    { label: 'Open Maps', action: () => console.log('Open maps') },
    { label: 'Set Timer', action: () => console.log('Set timer') },
    { label: 'Quick Template', action: () => console.log('Open template') },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 pb-8 px-4 overflow-y-auto"
    >
      {/* Dimmed background with blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-md"
        onClick={onExit}
      />

      {/* Action card */}
      <motion.div
        initial={{ y: 20, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.96 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative bg-gradient-to-br from-white via-white to-cream-50 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-teal/5 via-transparent to-brand-emerald/5 pointer-events-none" />

        <div className="relative p-8 md:p-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex-1">
              <h3 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3 leading-tight">
                {variant.title}
              </h3>
              <div className="h-1 w-16 bg-gradient-to-r from-brand-teal to-brand-emerald rounded-full mb-4" />
              <p className="text-lg text-slate-600 leading-relaxed">
                {recommendation.title}
              </p>
            </div>
            <button
              onClick={onExit}
              className="flex-shrink-0 p-2 hover:bg-slate-100/50 rounded-lg transition-colors ml-4"
            >
              <X className="h-5 w-5 text-slate-400" />
            </button>
          </div>

          {/* Checklist */}
          {steps.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <h4 className="text-xs font-bold text-slate-500 mb-5 uppercase tracking-[0.15em]">
                How to do it
              </h4>
              <div className="bg-white/60 rounded-2xl p-6 border border-slate-200/50">
                <Checklist
                  steps={steps}
                  onComplete={() => setAllStepsCompleted(true)}
                />
              </div>
            </motion.div>
          )}

          {/* Helper actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h4 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-[0.15em]">
              Quick helpers
            </h4>
            <div className="flex flex-wrap gap-3">
              {helperActions.map((helper, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 + index * 0.05 }}
                  onClick={helper.action}
                  className="px-5 py-3 border-2 border-slate-200 rounded-2xl text-slate-700 font-medium text-sm transition-all duration-200 hover:border-brand-teal/30 hover:bg-brand-teal/5 hover:shadow-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {helper.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-4 pt-6 border-t border-slate-200/50"
          >
            <button
              onClick={onExit}
              className="flex-1 px-6 py-4 border-2 border-slate-200 rounded-2xl text-slate-700 font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
            >
              Exit
            </button>
            <motion.button
              onClick={onDone}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-brand-teal to-brand-emerald text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10">Done</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-brand-emerald to-brand-teal opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

