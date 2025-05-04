import React from 'react';
import SpotifyLogo from './SpotifyLogo';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';

interface WrappedStoryCardProps {
  personality: string;
  name: string;
  co2Saved: string;
  topCategory: string;
  nextStep: string;
  badge: string;
  mainImage: string;
  color: string;
  shareText: string;
}

export const WrappedStoryCard: React.FC<WrappedStoryCardProps> = ({
  personality,
  name,
  co2Saved,
  topCategory,
  nextStep,
  badge,
  mainImage,
  color,
  shareText,
}) => {
  const cardId = `story-card-${personality.replace(/\s+/g, '-')}`;

  const handleDownload = async () => {
    const card = document.getElementById(cardId);
    if (card) {
      const canvas = await html2canvas(card, {
        useCORS: true,
        scale: 2,
        backgroundColor: null,
      });
      const link = document.createElement('a');
      link.download = `${personality}-eco-story.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div
      id={cardId}
      className="rounded-3xl shadow-xl p-8 max-w-md mx-auto relative flex flex-col items-center"
      style={{ background: color, minHeight: 600 }}
    >
      <div className="text-3xl font-bold mb-4 text-white text-center">{personality}</div>
      <img src={mainImage} alt={personality} crossOrigin="anonymous" className="w-40 h-40 mx-auto rounded-full mb-6 bg-white object-cover" />
      <div className="text-2xl font-semibold text-white mb-2">{co2Saved} CO₂ saved</div>
      <div className="text-lg text-white mb-4">Top Category: {topCategory}</div>
      <div className="bg-white text-black rounded-lg px-4 py-2 mb-6 font-semibold text-center">
        Next Step: {nextStep}
      </div>
      <div className="text-white mb-4">🏅 Badge: {badge}</div>
      <div className="flex items-center justify-between w-full mt-auto gap-4">
        <SpotifyLogo className="h-8 w-8" />
        <Button
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: 'My Eco Story', text: shareText, url: window.location.href });
            } else {
              navigator.clipboard.writeText(shareText);
              alert('Story copied to clipboard!');
            }
          }}
          className="bg-green-500 text-white px-4 py-2 rounded-lg"
        >
          Share
        </Button>
        <Button
          onClick={handleDownload}
          className="bg-purple-500 text-white px-4 py-2 rounded-lg"
        >
          Download
        </Button>
      </div>
    </div>
  );
};

export default WrappedStoryCard; 