import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import SpotifyLogo from './SpotifyLogo';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';
import { Globe } from 'lucide-react';

interface WrappedStoryCardProps {
  personality: string;
  name: string;
  co2Saved: string;
  topCategory: string;
  nextStep: string;
  badge: string;
  mainImage?: string;
  color?: string;
  shareText: string;
  theme?: 'light' | 'dark' | 'mild';
}

const themeStyles = {
  light: {
    bg: 'bg-gradient-to-br from-[#f6ffd7] via-[#eaffd7] to-[#eafff7]',
    text: 'text-gray-900',
    heading: 'font-extrabold text-5xl md:text-6xl font-sans',
    subheading: 'font-semibold text-lg md:text-xl',
    number: 'text-6xl md:text-7xl font-extrabold text-gray-900',
    card: 'bg-[#f8fbe9] rounded-2xl p-6 border border-[#e0e8c8]',
    border: 'border-[#e0e8c8]',
    shadow: 'shadow-xl',
    icon: 'text-green-600',
    planet: 'text-green-600',
    buttonShare: 'bg-[#cde7c1] text-gray-900',
    buttonDownload: 'bg-white text-gray-900 border border-gray-900',
    font: 'font-sans',
  },
  dark: {
    bg: 'bg-gradient-to-br from-[#181622] via-[#23213a] to-[#181622]',
    text: 'text-yellow-200',
    heading: 'font-extrabold text-5xl md:text-6xl font-serif',
    subheading: 'font-semibold text-lg md:text-xl',
    number: 'text-6xl md:text-7xl font-extrabold text-yellow-200',
    card: 'bg-transparent rounded-2xl p-6 border border-yellow-600',
    border: 'border-yellow-600',
    shadow: 'shadow-2xl',
    icon: 'text-yellow-400',
    planet: 'text-yellow-400',
    buttonShare: 'bg-transparent border border-yellow-400 text-yellow-200',
    buttonDownload: 'bg-yellow-400 text-[#23213a] border border-yellow-400',
    font: 'font-serif',
  },
  mild: {
    bg: 'bg-gradient-to-br from-[#e6d6ce] via-[#e9bfa7] to-[#e6d6ce]',
    text: 'text-[#4b2e2b]',
    heading: 'font-extrabold text-5xl md:text-6xl font-sans',
    subheading: 'font-semibold text-lg md:text-xl',
    number: 'text-6xl md:text-7xl font-extrabold text-[#4b2e2b]',
    card: 'bg-[#f5e3d7] rounded-2xl p-6 border border-[#e9bfa7]',
    border: 'border-[#e9bfa7]',
    shadow: 'shadow-lg',
    icon: 'text-[#b85c38]',
    planet: 'text-[#b85c38]',
    buttonShare: 'bg-[#6fcf97] text-white',
    buttonDownload: 'bg-[#f2996e] text-white',
    font: 'font-sans',
  },
};

const WrappedStoryCard: React.FC<WrappedStoryCardProps> = ({
  personality,
  name,
  co2Saved,
  topCategory,
  nextStep,
  badge,
  mainImage,
  color = '#23213a',
  shareText,
  theme = 'light',
}) => {
  const cardId = `story-card-${personality.replace(/\s+/g, '-')}`;
  const styles = themeStyles[theme];

  return (
    <motion.div
      id={cardId}
      className={`relative w-[600px] h-[800px] rounded-[40px] overflow-hidden ${styles.bg} ${styles.shadow} ${styles.border} ${styles.font}`}
      style={theme === 'dark' ? { boxShadow: '0 0 0 4px #FFD700' } : {}}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
    >
      {/* Planet Icon */}
      <div className="absolute top-8 right-8 z-10">
        <Globe className={`w-8 h-8 ${styles.planet}`} />
      </div>
      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-full justify-between p-12">
        <div>
          <div className="mb-6">
            <div className={`inline-block px-6 py-2 mb-4 rounded-full font-medium ${theme === 'dark' ? 'bg-[#23213a] border border-yellow-600 text-yellow-400' : 'bg-white/80 text-gray-900'}`}>Eco Wrapped 2024</div>
            <h1 className={`${styles.heading} leading-tight mb-2`}>Your Climate Journey</h1>
            <div className={`${styles.subheading} mb-2`}>You saved</div>
            <div className={`${styles.number} mb-2`}>{co2Saved}</div>
            <div className={`${styles.subheading} mb-8`}>of CO₂ this year</div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className={`${styles.card} flex flex-col justify-center`}>
              <div className="mb-1 font-semibold text-sm">Top Category</div>
              <div className={`text-2xl font-bold ${styles.text}`}>{topCategory}</div>
            </div>
            <div className={`${styles.card} flex flex-col justify-center`}>
              <div className="mb-1 font-semibold text-sm">Badge</div>
              <div className={`text-2xl font-bold ${styles.text}`}>{badge}</div>
            </div>
          </div>
          <div className={`grid grid-cols-2 gap-4 items-center ${theme === 'light' ? 'mb-8' : 'mb-6'}`}>
            <div className={`${styles.card} flex flex-col justify-center col-span-1`}>
              <div className="mb-1 font-semibold text-sm">Your Eco-Personality</div>
              <div className={`text-xl md:text-2xl font-bold ${styles.text}`}>{personality}</div>
            </div>
            <div className="flex justify-center items-center col-span-1">
              {mainImage && (
                <img src={mainImage} alt={personality} className="w-32 h-32 rounded-2xl object-cover border-2 border-white" />
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between w-full gap-4 mt-8">
          <Button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: 'My Eco Story', text: shareText, url: window.location.href });
              } else {
                navigator.clipboard.writeText(shareText);
                alert('Story copied to clipboard!');
              }
            }}
            className={`px-8 py-2 rounded-lg font-semibold ${styles.buttonShare}`}
          >
            Share
          </Button>
          <Button
            onClick={async () => {
              const card = document.getElementById(cardId);
              if (card) {
                const html2canvas = (await import('html2canvas')).default;
                const canvas = await html2canvas(card, { useCORS: true, scale: 2, backgroundColor: null });
                const link = document.createElement('a');
                link.download = `${personality}-eco-story.png`;
                link.href = canvas.toDataURL();
                link.click();
              }
            }}
            className={`px-8 py-2 rounded-lg font-semibold ${styles.buttonDownload}`}
          >
            Download
          </Button>
        </div>
      </div>
      {/* Optional: Gold lines and accents for dark theme */}
      {theme === 'dark' && (
        <div className="absolute inset-0 pointer-events-none z-0">
          <svg width="100%" height="100%" viewBox="0 0 600 800" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute">
            <rect x="30" y="120" width="540" height="180" rx="32" stroke="#FFD700" strokeWidth="3" />
            <rect x="30" y="320" width="260" height="100" rx="24" stroke="#FFD700" strokeWidth="2" />
            <rect x="310" y="320" width="260" height="100" rx="24" stroke="#FFD700" strokeWidth="2" />
            <rect x="30" y="440" width="540" height="120" rx="24" stroke="#FFD700" strokeWidth="2" />
          </svg>
          {/* Subtle star pattern overlay */}
          <div className="absolute inset-0 bg-[url('/stars.png')] opacity-10" />
        </div>
      )}
    </motion.div>
  );
};

export default WrappedStoryCard; 