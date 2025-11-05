import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronDown, ChevronUp, Leaf } from 'lucide-react';
import { NextAction } from '@/services/engagementService';

interface BestNextActionCardProps {
  action: NextAction;
  onDone: () => void;
  isLoading?: boolean;
}

export const BestNextActionCard: React.FC<BestNextActionCardProps> = ({
  action,
  onDone,
  isLoading = false,
}) => {
  const [showLearn, setShowLearn] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl border border-slate-200/40 p-6 md:p-8"
    >
      {/* Badge */}
      <div className="flex items-center justify-between mb-4">
        <span className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-brand-teal to-brand-emerald text-white text-xs font-semibold rounded-full">
          <Leaf className="w-3 h-3" />
          {action.previewImpact.label || 'Next ₹ win'}
        </span>
      </div>

      {/* Title & Subtitle */}
      <div className="mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">
          {action.title}
        </h3>
        {action.subtitle && (
          <p className="text-sm md:text-base text-slate-600">{action.subtitle}</p>
        )}
      </div>

      {/* Impact Chips */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-xl">
          <span className="text-red-700 font-semibold text-sm">
            –₨{Math.round(action.previewImpact.rupees)}
          </span>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-xl">
          <span className="text-green-700 font-semibold text-sm">
            –{action.previewImpact.co2_kg.toFixed(2)} kg CO₂
          </span>
        </div>
      </div>

      {/* Primary CTA */}
      <button
        onClick={onDone}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-brand-teal to-brand-emerald text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Marking Done...</span>
          </>
        ) : (
          <>
            <CheckCircle2 className="w-5 h-5" />
            <span>Mark Done</span>
          </>
        )}
      </button>

      {/* Learn More Toggle */}
      {action.learn && (
        <div className="mb-4">
          <button
            onClick={() => setShowLearn(!showLearn)}
            className="w-full flex items-center justify-between text-sm text-brand-teal hover:text-brand-emerald transition-colors"
          >
            <span>{showLearn ? 'Hide details' : 'Curious? Open details'}</span>
            {showLearn ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          <AnimatePresence>
            {showLearn && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <p className="text-sm text-slate-600 mb-2">{action.learn.summary}</p>
                  {action.learn.url && (
                    <a
                      href={action.learn.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-brand-teal hover:underline"
                    >
                      Learn more →
                    </a>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Footer: Source • Last updated • Why shown */}
      <div className="pt-4 border-t border-slate-200">
        <p className="text-xs text-slate-500 space-y-1">
          <div>{action.source}</div>
          <div className="text-slate-400">{action.whyShown}</div>
        </p>
      </div>
    </motion.div>
  );
};

