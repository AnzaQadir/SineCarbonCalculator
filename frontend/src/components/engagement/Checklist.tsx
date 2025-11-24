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
    <div className={`space-y-4 ${className}`}>
      {steps.map((step, index) => {
        const isCompleted = completedSteps.has(index);
        return (
          <motion.button
            key={index}
            onClick={() => toggleStep(index)}
            className="w-full text-left flex items-start gap-4 p-4 rounded-xl transition-all duration-200 group"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {/* Number badge */}
            <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm transition-all duration-200"
              style={{
                backgroundColor: isCompleted ? 'rgba(24, 160, 122, 0.1)' : 'rgba(226, 232, 240, 0.5)',
                color: isCompleted ? '#18A07A' : '#64748B',
                border: isCompleted ? '2px solid rgba(24, 160, 122, 0.2)' : '2px solid rgba(226, 232, 240, 0.8)',
              }}
            >
              {isCompleted ? '✓' : index + 1}
            </div>
            <span
              className={`flex-1 text-base leading-relaxed transition-all duration-200 ${
                isCompleted 
                  ? 'text-slate-400 line-through' 
                  : 'text-slate-700 group-hover:text-slate-900'
              }`}
            >
              {step}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};

