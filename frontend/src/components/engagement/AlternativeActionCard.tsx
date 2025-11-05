import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronDown, ChevronUp, Zap, TrendingUp } from 'lucide-react';
import { NextAction } from '@/services/engagementService';

interface AlternativeActionCardProps {
  action: NextAction;
  onDone: () => void;
  isLoading?: boolean;
}

export const AlternativeActionCard: React.FC<AlternativeActionCardProps> = ({
  action,
  onDone,
  isLoading = false,
}) => {
  const [showLearn, setShowLearn] = useState(false);

  const badgeConfig =
    action.type === 'quick_win'
      ? {
          icon: Zap,
          label: 'Quick Win',
          bgColor: 'bg-sky-100',
          textColor: 'text-sky-700',
          borderColor: 'border-sky-200',
        }
      : {
          icon: TrendingUp,
          label: 'Level Up',
          bgColor: 'bg-amber-100',
          textColor: 'text-amber-700',
          borderColor: 'border-amber-200',
        };

  const BadgeIcon = badgeConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-slate-200/40 p-5 md:p-6"
    >
      {/* Badge */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={`inline-flex items-center gap-2 px-3 py-1 ${badgeConfig.bgColor} ${badgeConfig.textColor} text-xs font-semibold rounded-full border ${badgeConfig.borderColor}`}
        >
          <BadgeIcon className="w-3 h-3" />
          {badgeConfig.label}
        </span>
      </div>

      {/* Title & Subtitle */}
      <div className="mb-4">
        <h4 className="text-lg md:text-xl font-bold text-slate-800 mb-1">
          {action.title}
        </h4>
        {action.subtitle && (
          <p className="text-sm text-slate-600 line-clamp-2">{action.subtitle}</p>
        )}
      </div>

      {/* Impact Chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg">
          <span className="text-red-700 font-semibold text-xs">
            –₨{Math.round(action.previewImpact.rupees)}
          </span>
        </div>
        <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
          <span className="text-green-700 font-semibold text-xs">
            –{action.previewImpact.co2_kg.toFixed(2)} kg CO₂
          </span>
        </div>
      </div>

      {/* Primary CTA */}
      <button
        onClick={onDone}
        disabled={isLoading}
        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-3 text-sm"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
            <span>Marking Done...</span>
          </>
        ) : (
          <>
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark Done</span>
          </>
        )}
      </button>

      {/* Learn More Toggle */}
      {action.learn && (
        <div className="mb-3">
          <button
            onClick={() => setShowLearn(!showLearn)}
            className="w-full flex items-center justify-between text-xs text-brand-teal hover:text-brand-emerald transition-colors"
          >
            <span>{showLearn ? 'Hide details' : 'Curious? Open details'}</span>
            {showLearn ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
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
                <div className="mt-2 pt-2 border-t border-slate-200">
                  <p className="text-xs text-slate-600 mb-1">{action.learn.summary}</p>
                  {action.learn.url && (
                    <a
                      href={action.learn.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-brand-teal hover:underline"
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
      <div className="pt-3 border-t border-slate-200">
        <p className="text-xs text-slate-500 space-y-0.5">
          <div>{action.source}</div>
          <div className="text-slate-400">{action.whyShown}</div>
        </p>
      </div>
    </motion.div>
  );
};

