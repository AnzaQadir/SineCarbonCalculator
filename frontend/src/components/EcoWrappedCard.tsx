import React, { useState } from 'react';
import profileImg from '../assets/profile.jpg';
import { cn } from '@/lib/utils';

interface EcoWrappedCardProps {
  theme?: 'dark' | 'light' | 'pop';
  savedCO2?: string;
  topCategory?: string;
  badge?: string;
  personality?: string;
}

const themes = {
  dark: {
    bg: 'from-[#181622] via-[#23213a] to-[#181622]',
    text: 'text-green-300',
    accent: 'text-pink-400',
    card: 'bg-[#23213a]/80 backdrop-blur-sm border border-green-400/30',
    stat: 'bg-[#181622]/80 backdrop-blur-sm border border-pink-400/30',
    heading: 'text-5xl font-extrabold text-green-200',
    sub: 'text-pink-300',
    avatarRing: 'ring-4 ring-green-400/50',
    buttonShare: 'bg-green-400 text-[#23213a]',
    buttonDownload: 'bg-pink-400 text-[#23213a]',
    shadow: 'shadow-2xl shadow-green-400/30',
    font: 'font-sans',
    overlay: 'bg-[#181622]/40 backdrop-blur-sm',
  },
  light: {
    bg: 'from-[#f6ffd7] via-[#eaffd7] to-[#eafff7]',
    text: 'text-gray-900',
    accent: 'text-sky-500',
    card: 'bg-white/80 backdrop-blur-sm border border-green-200',
    stat: 'bg-[#eafff7]/80 backdrop-blur-sm border border-sky-200',
    heading: 'text-5xl font-extrabold text-green-700',
    sub: 'text-sky-500',
    avatarRing: 'ring-4 ring-sky-300/50',
    buttonShare: 'bg-green-200 text-green-900',
    buttonDownload: 'bg-sky-200 text-sky-900',
    shadow: 'shadow-xl shadow-green-200/30',
    font: 'font-sans',
    overlay: 'bg-white/40 backdrop-blur-sm',
  },
  pop: {
    bg: 'from-[#ffecb3] via-[#ffb3b3] to-[#b3ffd9]',
    text: 'text-[#222]',
    accent: 'text-[#ff2d55]',
    card: 'bg-[#fff]/80 backdrop-blur-sm border-2 border-[#ff2d55] rounded-[32px]',
    stat: 'bg-[#eaff00]/80 backdrop-blur-sm border-2 border-[#00eaff] rounded-[24px] shadow-lg',
    heading: 'text-5xl font-extrabold text-[#ff2d55] drop-shadow-[0_2px_8px_#00eaff]',
    sub: 'text-[#00eaff] font-bold',
    avatarRing: 'ring-4 ring-[#ff2d55]/50 ring-offset-2',
    buttonShare: 'bg-[#00eaff] text-white font-bold rounded-full',
    buttonDownload: 'bg-[#ff2d55] text-white font-bold rounded-full',
    shadow: 'shadow-2xl shadow-[#ff2d55]/30',
    font: 'font-sans',
    overlay: 'bg-white/40 backdrop-blur-sm',
  },
};

const EcoWrappedCard: React.FC<EcoWrappedCardProps> = ({
  theme = 'dark',
  savedCO2 = '-1079.5',
  topCategory = 'Waste',
  badge = 'First Green Step',
  personality = "Planet's Main Character",
}) => {
  const t = themes[theme];
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className={`w-[400px] mx-auto rounded-3xl overflow-hidden bg-gradient-to-br ${t.bg} p-8 ${t.shadow} ${t.font} relative`}>
      {/* Large Avatar Background */}
      <div className="absolute inset-0 z-0">
        {!imageError ? (
          <img 
            src={profileImg} 
            alt="avatar background" 
            className="w-full h-full object-cover opacity-20 scale-110 blur-sm"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 opacity-20" />
        )}
        <div className={`absolute inset-0 ${t.overlay}`} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-4">
          <span className={`rounded-full px-4 py-1 text-xs font-bold uppercase tracking-widest ${t.accent} ${t.card}`}>
            Eco Wrapped 2024
          </span>
          <span className="text-2xl">🌍</span>
        </div>

        {/* Main Avatar */}
        <div className="relative mb-6">
          {!imageError ? (
            <img 
              src={profileImg} 
              alt="avatar" 
              className={`w-32 h-32 object-cover rounded-2xl mx-auto ${t.avatarRing}`}
              onError={handleImageError}
            />
          ) : (
            <div className={`w-32 h-32 rounded-2xl mx-auto ${t.avatarRing} bg-gray-200 flex items-center justify-center text-4xl`}>
              👤
            </div>
          )}
          <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 ${t.card} px-3 py-1 rounded-full text-sm font-semibold ${t.text}`}>
            {personality}
          </div>
        </div>

        <h1 className={`mb-2 ${t.heading} text-center`}>Your Climate Journey</h1>
        <div className={`mb-4 text-lg font-semibold ${t.text} text-center`}>You saved</div>
        <div className={`mb-2 text-6xl font-extrabold ${t.text} text-center`}>
          {savedCO2} <span className="text-2xl">tons</span>
        </div>
        <div className={`mb-6 text-base ${t.text} text-center`}>of CO₂ this year</div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className={`p-4 rounded-xl ${t.stat}`}>
            <div className={`text-xs font-bold uppercase mb-1 ${t.text}`}>Top Category</div>
            <div className={`text-xl font-bold ${t.text}`}>{topCategory}</div>
          </div>
          <div className={`p-4 rounded-xl ${t.stat}`}>
            <div className={`text-xs font-bold uppercase mb-1 ${t.text}`}>Badge</div>
            <div className={`text-xl font-bold ${t.text}`}>{badge}</div>
          </div>
        </div>

        {/* Footer */}
        <div className={`mt-6 text-center ${t.card} py-2 px-4 rounded-full`}>
          <span className={`text-sm font-semibold ${t.text}`}>Eco Hero's Impact Story </span>
          <span className={`text-sm font-bold ${t.accent}`}>#EcoWrapped</span>
        </div>
      </div>

      {/* Pop theme: add funky shapes */}
      {theme === 'pop' && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
          <div className="absolute left-4 top-8 w-12 h-12 bg-[#00eaff] rounded-full opacity-30 blur-lg" />
          <div className="absolute right-8 top-24 w-16 h-8 bg-[#ff2d55] rounded-full rotate-12 opacity-30 blur-lg" />
          <div className="absolute left-16 bottom-8 w-20 h-10 bg-[#eaff00] rounded-full -rotate-12 opacity-30 blur-lg" />
        </div>
      )}
    </div>
  );
};

export default EcoWrappedCard; 