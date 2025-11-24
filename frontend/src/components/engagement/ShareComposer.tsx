import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { WeeklyRecap } from '@/services/engagementService';

interface ShareComposerProps {
  recap: WeeklyRecap;
  onClose: () => void;
}

export const ShareComposer: React.FC<ShareComposerProps> = ({ recap, onClose }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const exportAsPNG = async () => {
    if (!canvasRef.current) return;

    setIsExporting(true);
    try {
      const canvas = await html2canvas(canvasRef.current, {
        width: 1080,
        height: 1920,
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      // Create download link
      const link = document.createElement('a');
      link.download = `zerrah-weekly-recap-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error exporting image:', error);
      alert('Failed to export image. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const shareText = `I saved ₨${Math.round(recap.rupeesSaved)} & ${recap.co2SavedKg.toFixed(2)} kg CO₂ this week 🌱 #Zerrah`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          text: shareText,
        });
      } catch (error) {
        // User cancelled or error
        console.error('Share failed:', error);
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(shareText);
      alert('Share text copied to clipboard!');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h3 className="text-xl font-bold text-slate-800">Share Your Weekly Win</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Preview */}
          <div className="p-6">
            <div
              ref={canvasRef}
              className="bg-gradient-to-br from-brand-teal via-brand-emerald to-teal-600 rounded-2xl p-8 text-white mx-auto"
              style={{ width: '540px', maxWidth: '100%' }}
            >
              <div className="text-center space-y-6">
                {/* Logo/Brand */}
                <div className="text-4xl font-bold mb-4">ZERRAH</div>

                {/* Story */}
                <div className="text-2xl font-bold">{recap.storyText}</div>

                {/* Impact Numbers */}
                <div className="grid grid-cols-2 gap-4 my-8">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                    <div className="text-sm opacity-90 mb-2">Rupees Saved</div>
                    <div className="text-4xl font-bold">₨{Math.round(recap.rupeesSaved)}</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                    <div className="text-sm opacity-90 mb-2">CO₂ Saved</div>
                    <div className="text-4xl font-bold">{recap.co2SavedKg.toFixed(2)} kg</div>
                  </div>
                </div>

                {/* Actions Count */}
                <div className="text-lg opacity-90">
                  {recap.actionsCount} actions this week
                </div>

                {/* Footer */}
                <div className="text-sm opacity-75 mt-8 pt-6 border-t border-white/20">
                  #Zerrah • Join the movement
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-slate-200 flex flex-col sm:flex-row gap-3">
            <button
              onClick={exportAsPNG}
              disabled={isExporting}
              className="flex-1 bg-gradient-to-r from-brand-teal to-brand-emerald text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isExporting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Export PNG</span>
                </>
              )}
            </button>
            <button
              onClick={handleShare}
              className="flex-1 bg-white border-2 border-brand-teal text-brand-teal font-semibold py-3 px-6 rounded-xl hover:bg-brand-teal/5 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

