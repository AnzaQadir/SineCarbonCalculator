import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ChecklistProps {
  steps: string[];
  onComplete?: () => void;
  className?: string;
}

export const Checklist: React.FC<ChecklistProps> = ({ steps, onComplete, className = '' }) => {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (index: number) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(index)) {
      newCompleted.delete(index);
    } else {
      newCompleted.add(index);
      // Check if all steps are completed
      if (newCompleted.size === steps.length && onComplete) {
        setTimeout(() => onComplete(), 300);
      }
    }
    setCompletedSteps(newCompleted);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {steps.map((step, index) => {
        const isCompleted = completedSteps.has(index);
        return (
          <motion.button
            key={index}
            onClick={() => toggleStep(index)}
            className={`w-full text-left flex items-start gap-4 p-4 rounded-xl transition-all duration-200 group cursor-pointer ${
              isCompleted 
                ? 'bg-emerald-50/60 border-2 border-emerald-200/60' 
                : 'bg-white border-2 border-slate-200 hover:border-brand-teal/40 hover:bg-brand-teal/5'
            }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {/* Checkbox-style indicator */}
            <motion.div 
              className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center font-semibold text-sm transition-all duration-200 ${
                isCompleted 
                  ? 'bg-brand-teal border-2 border-brand-teal' 
                  : 'bg-white border-2 border-slate-300 group-hover:border-brand-teal/60'
              }`}
              animate={{
                scale: isCompleted ? [1, 1.15, 1] : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              {isCompleted ? (
                <motion.svg
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="w-4 h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </motion.svg>
              ) : (
                <motion.span
                  className="text-xs font-bold text-slate-400 group-hover:text-brand-teal/60"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {index + 1}
                </motion.span>
              )}
            </motion.div>
            <span
              className={`flex-1 text-sm leading-relaxed transition-all duration-200 ${
                isCompleted 
                  ? 'text-slate-500 line-through decoration-slate-400' 
                  : 'text-slate-700 group-hover:text-slate-900'
              }`}
            >
              {step}
            </span>
            {/* Subtle checkmark hint for uncompleted items */}
            {!isCompleted && (
              <motion.div
                className="flex-shrink-0 opacity-0 group-hover:opacity-30 transition-opacity"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.3 }}
              >
                <svg className="w-5 h-5 text-brand-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

