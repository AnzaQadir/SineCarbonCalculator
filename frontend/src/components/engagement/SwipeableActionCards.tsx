import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, TrendingUp, Zap, ArrowRight } from 'lucide-react';
import { NextAction } from '@/services/engagementApi';
import { ActionToast, ToastData } from './ActionToast';

interface SwipeableActionCardsProps {
  primary: NextAction;
  alternatives: NextAction[];
  onActionDone: (actionId: string) => Promise<void>;
  toastData: ToastData | null;
}

export const SwipeableActionCards: React.FC<SwipeableActionCardsProps> = ({
  primary,
  alternatives,
  onActionDone,
  toastData,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);

  const allActions = [primary, ...alternatives];

  const handleSwipe = (direction: string) => {
    if (direction === 'left' && currentIndex < allActions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (direction === 'right' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleActionDone = async (actionId: string) => {
    if (isProcessing || completed.has(actionId)) return;
    
    setIsProcessing(true);
    await onActionDone(actionId);
    setCompleted(new Set([...completed, actionId]));
    setIsProcessing(false);
  };

  const getCardType = (type: NextAction['type']) => {
    switch (type) {
      case 'best':
        return { label: 'Best Next Action', icon: TrendingUp, color: 'from-blue-500 to-cyan-500' };
      case 'quick_win':
        return { label: 'Quick Win', icon: Zap, color: 'from-green-500 to-emerald-500' };
      case 'level_up':
        return { label: 'Level Up', icon: TrendingUp, color: 'from-purple-500 to-pink-500' };
      default:
        return { label: 'Action', icon: TrendingUp, color: 'from-gray-500 to-gray-600' };
    }
  };

  const renderCard = (action: NextAction, index: number, isActive: boolean) => {
    const typeInfo = getCardType(action.type);
    const Icon = typeInfo.icon;
    const isCompleted = completed.has(action.id);

    return (
      <motion.div
        key={action.id}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ 
          opacity: isActive ? 1 : 0.5, 
          scale: isActive ? 1 : 0.95,
          x: isActive ? 0 : (index - currentIndex) * 20
        }}
        transition={{ duration: 0.3 }}
        className={`relative ${isActive ? 'z-10' : 'z-0'}`}
      >
        <div className={`bg-gradient-to-br ${typeInfo.color} rounded-3xl p-6 shadow-lg ${!isActive ? 'h-full' : ''}`}>
          {/* Type Badge */}
          <div className="flex items-center gap-2 mb-4">
            <Icon className="w-5 h-5 text-white" />
            <span className="text-sm font-semibold text-white/90">{typeInfo.label}</span>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-white mb-3">{action.title}</h3>

          {/* Impact */}
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-white/80">Save per year</div>
                <div className="text-2xl font-bold text-white">₹{action.impact.rupees}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-white/80">CO₂ Saved</div>
                <div className="text-xl font-bold text-white">{action.impact.co2_kg} kg</div>
              </div>
            </div>
          </div>

          {/* Why Shown */}
          {action.whyShown && (
            <div className="text-sm text-white/80 mb-4 italic">{action.whyShown}</div>
          )}

          {/* Action Button */}
          {!isCompleted ? (
            <button
              onClick={() => handleActionDone(action.id)}
              disabled={isProcessing}
              className="w-full bg-white text-gray-900 font-semibold py-3 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                'Processing...'
              ) : (
                <>
                  Mark Done
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          ) : (
            <div className="w-full bg-green-500 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Done Today
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Carousel */}
      <div className="relative">
        {/* Card Display */}
        <div className="overflow-hidden">
          <div className="flex transition-transform duration-300" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {allActions.map((action, index) => (
              <div key={action.id} className="w-full flex-shrink-0 px-2">
                {renderCard(action, index, index === currentIndex)}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {allActions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-gray-900 w-6' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Swipe Indicators */}
        {currentIndex > 0 && (
          <button
            onClick={() => setCurrentIndex(currentIndex - 1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg rounded-full p-2 transition-all"
          >
            <ArrowRight className="w-5 h-5 rotate-180 text-gray-900" />
          </button>
        )}
        {currentIndex < allActions.length - 1 && (
          <button
            onClick={() => setCurrentIndex(currentIndex + 1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg rounded-full p-2 transition-all"
          >
            <ArrowRight className="w-5 h-5 text-gray-900" />
          </button>
        )}
      </div>

      {/* Toast Notification */}
      {toastData && (
        <ActionToast
          rupees={toastData.rupees}
          co2_kg={toastData.co2_kg}
          streak={toastData.streak}
          bonus={toastData.bonus}
          onClose={() => {}}
        />
      )}
    </div>
  );
};
