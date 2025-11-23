import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronDown, ChevronUp, Zap, TrendingUp, Clock, X } from 'lucide-react';
import { NextAction } from '@/services/engagementService';
import { EffortMeter } from './EffortMeter';
import { DetailsPanel } from './DetailsPanel';

interface AlternativeActionCardProps {
  action: NextAction;
  onAction: (outcome: 'done' | 'snooze' | 'dismiss') => void;
  isLoading?: boolean;
}

export const AlternativeActionCard: React.FC<AlternativeActionCardProps> = ({
  action,
  onAction,
  isLoading = false,
}) => {
  const [showDetails, setShowDetails] = useState(false);

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
      <div className="flex items-start justify-between gap-4 mb-4">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
          <BadgeIcon className="w-3 h-3" />
          {badgeConfig.label}
        </p>
        <EffortMeter effort={action.recommendation?.effort} />
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

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 mb-3">
        {/* Do it now */}
        <button
          onClick={() => onAction('done')}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-brand-teal to-brand-emerald text-white font-medium py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
        >
          {isLoading ? (
            <>
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Do it now</span>
            </>
          )}
        </button>

        <div className="flex gap-2">
          {/* Save for later */}
          <button
            onClick={() => onAction('snooze')}
            disabled={isLoading}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 text-xs border border-slate-200"
          >
            <Clock className="w-3 h-3" />
            <span>Save for later</span>
          </button>

          {/* Not useful */}
          <button
            onClick={() => onAction('dismiss')}
            disabled={isLoading}
            className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 font-medium py-2 px-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 text-xs border border-red-200"
          >
            <X className="w-3 h-3" />
            <span>Not useful</span>
          </button>
        </div>
      </div>

      {/* Details Toggle */}
      <div className="mt-4">
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
    </motion.div>
  );
};

