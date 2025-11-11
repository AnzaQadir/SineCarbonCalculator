import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronDown, ChevronUp, Clock, X } from 'lucide-react';
import { NextAction } from '@/services/engagementService';
import { EffortMeter } from './EffortMeter';
import { DetailsPanel } from './DetailsPanel';

interface BestNextActionCardProps {
  action: NextAction;
  onAction: (outcome: 'done' | 'snooze' | 'dismiss') => void;
  isLoading?: boolean;
}

export const BestNextActionCard: React.FC<BestNextActionCardProps> = ({
  action,
  onAction,
  isLoading = false,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl border border-slate-200/40 p-6 md:p-8"
    >
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400 mb-2">Featured Action</p>
          <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">
            {action.title}
          </h3>
          {action.subtitle && (
            <p className="text-sm md:text-base text-slate-600">{action.subtitle}</p>
          )}
        </div>
        <EffortMeter effort={action.recommendation?.effort} />
      </div>

      {/* Action Buttons */}
      <div className="mb-6 rounded-2xl bg-slate-50/60 p-3 shadow-inner">
        <p className="px-2 pb-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400">
          Choose your move
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          {/* Do it now */}
          <button
            onClick={() => onAction('done')}
            disabled={isLoading}
            className="relative flex-1 overflow-hidden rounded-xl bg-gradient-to-r from-brand-teal to-brand-emerald py-3.5 px-4 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-emerald-400/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="absolute inset-0 -z-10 rounded-xl bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
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
          </button>

          {/* Save for later */}
          <button
            onClick={() => onAction('snooze')}
            disabled={isLoading}
            className="flex-1 rounded-xl border border-slate-200 bg-white py-3 px-4 text-sm font-medium text-slate-700 transition-colors duration-300 hover:border-brand-teal/60 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="flex items-center justify-center gap-2">
              <Clock className="h-4 w-4" />
              Save for later
            </span>
          </button>

          {/* Not useful */}
          <button
            onClick={() => onAction('dismiss')}
            disabled={isLoading}
            className="flex-1 rounded-xl border border-red-200 bg-red-50 py-3 px-4 text-sm font-medium text-red-700 transition-colors duration-300 hover:border-red-400 hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 disabled:cursor-not-allowed disabled:opacity-60"
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

      {/* Footer: Source • Last updated • Why shown */}
    </motion.div>
  );
};

