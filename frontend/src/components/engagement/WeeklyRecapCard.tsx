import React from 'react';
import { motion } from 'framer-motion';
import { Share2, TrendingUp } from 'lucide-react';
import { WeeklyRecap } from '@/services/engagementService';

interface WeeklyRecapCardProps {
  recap: WeeklyRecap;
  onShare: () => void;
  onOpenDetails?: () => void;
}

export const WeeklyRecapCard: React.FC<WeeklyRecapCardProps> = ({
  recap,
  onShare,
  onOpenDetails,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-brand-teal/10 via-brand-emerald/5 to-white rounded-2xl shadow-xl border border-brand-teal/20 p-6 md:p-8"
    >
      {/* Headline */}
      <div className="mb-6">
        <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
          {recap.storyText}
        </h3>
        {recap.cityCommunity && (
          <p className="text-sm md:text-base text-slate-600">{recap.cityCommunity}</p>
        )}
      </div>

      {/* Impact Chips */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[120px] bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200">
          <div className="text-xs text-slate-500 mb-1">Saved</div>
          <div className="text-2xl font-bold text-red-600">
            ₨{Math.round(recap.rupeesSaved)}
          </div>
        </div>
        <div className="flex-1 min-w-[120px] bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200">
          <div className="text-xs text-slate-500 mb-1">CO₂ Saved</div>
          <div className="text-2xl font-bold text-green-600">
            –{recap.co2SavedKg.toFixed(2)} kg
          </div>
        </div>
        <div className="flex-1 min-w-[120px] bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200">
          <div className="text-xs text-slate-500 mb-1">Actions</div>
          <div className="text-2xl font-bold text-brand-teal">{recap.actionsCount}</div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onShare}
          className="flex-1 bg-gradient-to-r from-brand-teal to-brand-emerald text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Share2 className="w-5 h-5" />
          <span>Share Win</span>
        </button>
        {onOpenDetails && (
          <button
            onClick={onOpenDetails}
            className="flex-1 bg-white border-2 border-brand-teal text-brand-teal font-semibold py-3 px-6 rounded-xl hover:bg-brand-teal/5 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <TrendingUp className="w-5 h-5" />
            <span>Open Details</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};

