import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trophy, Share2, Download, Leaf } from 'lucide-react';
import html2canvas from 'html2canvas';
import { WeeklyRecap } from '@/services/engagementApi';

interface WeeklyRecapCardProps {
  data: WeeklyRecap;
  onShare?: () => void;
}

export const WeeklyRecapCard: React.FC<WeeklyRecapCardProps> = ({ data, onShare }) => {
  const [isSharing, setIsSharing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    if (!cardRef.current) return;
    
    setIsSharing(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
      });

      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Failed to create image blob');
          setIsSharing(false);
          return;
        }

        const file = new File([blob], 'zerrah-weekly-recap.png', { type: 'image/png' });
        
        // Use Web Share API if available
        if (navigator.share && navigator.canShare({ files: [file] })) {
          navigator.share({
            title: 'My Zerrah Weekly Recap',
            text: data.storyText,
            files: [file],
          }).catch(console.error);
        } else {
          // Fallback: Download the image
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'zerrah-weekly-recap.png';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
        
        onShare?.();
      }, 'image/png');
    } catch (error) {
      console.error('Error sharing recap:', error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Shareable Card */}
      <div
        ref={cardRef}
        className="relative p-8 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-lg shadow-2xl"
        style={{ minHeight: '500px' }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between text-white">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Leaf className="h-8 w-8" />
              <h3 className="text-2xl font-bold">Your Zerrah Week</h3>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                <div className="text-4xl font-bold mb-2">₹{data.rupeesSaved}</div>
                <div className="text-sm text-white/80">Saved</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                <div className="text-4xl font-bold mb-2">{data.co2SavedKg} kg</div>
                <div className="text-sm text-white/80">CO₂ Saved</div>
              </div>
            </div>

            {/* Actions Count */}
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30 mb-8">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                <span className="text-lg font-semibold">
                  {data.actionsCount} actions completed
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-white/30 pt-6">
            {data.cityCommunity && (
              <div className="text-center mb-4">
                <p className="text-lg font-semibold">{data.cityCommunity}</p>
              </div>
            )}
            <div className="text-center">
              <p className="text-2xl font-bold">{data.storyText}</p>
              <p className="text-sm text-white/80 mt-2">Powered by Zerrah</p>
            </div>
          </div>
        </div>
      </div>

      {/* Share Button */}
      <Button
        onClick={handleShare}
        disabled={isSharing}
        className="w-full bg-green-600 hover:bg-green-700 text-white"
        size="lg"
      >
        {isSharing ? (
          <>
            <Download className="h-4 w-4 mr-2 animate-spin" />
            Preparing...
          </>
        ) : (
          <>
            <Share2 className="h-4 w-4 mr-2" />
            Share Your Progress
          </>
        )}
      </Button>

      {/* Legend */}
      <div className="text-center text-sm text-gray-600">
        <p>Download or share your weekly recap on Instagram, WhatsApp, or Twitter</p>
      </div>
    </div>
  );
};
