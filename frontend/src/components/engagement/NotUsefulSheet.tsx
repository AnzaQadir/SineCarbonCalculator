import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, XCircle, AlertCircle, CheckCircle2 } from 'lucide-react';

interface NotUsefulSheetProps {
  onSelectReason: (reason: 'not_relevant' | 'too_hard' | 'already_doing') => void;
  onDismiss: () => void;
  tone?: 'friendly' | 'professional' | 'premium';
}

export const NotUsefulSheet: React.FC<NotUsefulSheetProps> = ({
  onSelectReason,
  onDismiss,
  tone = 'friendly',
}) => {
  const toneVariants = {
    friendly: {
      title: "No worries - tuning your feed!",
      subtitle: "What didn't fit?",
    },
    professional: {
      title: 'Thanks. Which reason applies?',
      subtitle: '',
    },
    premium: {
      title: "Understood. I'll refine your recommendations.",
      subtitle: '',
    },
  };

  const variant = toneVariants[tone];

  const reasons = [
    { 
      id: 'not_relevant' as const, 
      label: 'Not relevant',
      icon: XCircle,
      color: '#D94B5A', // zerrah-red
      bgColor: 'rgba(217, 75, 90, 0.08)',
      borderColor: 'rgba(217, 75, 90, 0.2)',
      hoverBg: 'rgba(217, 75, 90, 0.12)',
      hoverBorder: 'rgba(217, 75, 90, 0.3)',
    },
    { 
      id: 'too_hard' as const, 
      label: 'Too hard right now',
      icon: AlertCircle,
      color: '#F89C4E', // zerrah-orange
      bgColor: 'rgba(248, 156, 78, 0.08)',
      borderColor: 'rgba(248, 156, 78, 0.2)',
      hoverBg: 'rgba(248, 156, 78, 0.12)',
      hoverBorder: 'rgba(248, 156, 78, 0.3)',
    },
    { 
      id: 'already_doing' as const, 
      label: 'Already doing this',
      icon: CheckCircle2,
      color: '#8FD19E', // zerrah-green
      bgColor: 'rgba(143, 209, 158, 0.08)',
      borderColor: 'rgba(143, 209, 158, 0.2)',
      hoverBg: 'rgba(143, 209, 158, 0.12)',
      hoverBorder: 'rgba(143, 209, 158, 0.3)',
    },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end justify-center pb-20"
        onClick={onDismiss}
      >
        {/* Dimmed background with blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        />

        {/* Sheet */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-gradient-to-b from-white via-white to-cream-50 rounded-t-3xl shadow-2xl w-full max-w-md overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-zerrah-red/5 via-transparent to-zerrah-orange/5 pointer-events-none" />
          
          {/* Handle bar */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1.5 rounded-full bg-slate-300" />
          </div>

          <div className="relative px-6 pb-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-800 mb-1">
                  {variant.title}
                </h3>
                {variant.subtitle && (
                  <p className="text-sm text-slate-500">{variant.subtitle}</p>
                )}
              </div>
              <button
                onClick={onDismiss}
                className="flex-shrink-0 p-2 hover:bg-slate-100 rounded-lg transition-colors ml-4"
              >
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            {/* Reason options */}
            <div className="space-y-3">
              {reasons.map((reason, index) => {
                const Icon = reason.icon;
                return (
                  <motion.button
                    key={reason.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => {
                      onSelectReason(reason.id);
                      onDismiss();
                    }}
                    style={{
                      backgroundColor: reason.bgColor,
                      borderColor: reason.borderColor,
                    }}
                    className="w-full text-left px-5 py-4 rounded-2xl border-2 transition-all duration-200 group"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = reason.hoverBg;
                      e.currentTarget.style.borderColor = reason.hoverBorder;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = reason.bgColor;
                      e.currentTarget.style.borderColor = reason.borderColor;
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className="flex-shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center group-hover:scale-110 transition-transform"
                        style={{
                          backgroundColor: reason.bgColor,
                          borderColor: reason.borderColor,
                        }}
                      >
                        <Icon className="w-5 h-5" strokeWidth={2} style={{ color: reason.color }} />
                      </div>
                      <span className="flex-1 font-semibold text-slate-700 text-base">
                        {reason.label}
                      </span>
                      <motion.span
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: reason.color }}
                        initial={{ x: -10 }}
                        whileHover={{ x: 0 }}
                      >
                        →
                      </motion.span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

