import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import { FaInstagram, FaWhatsapp, FaLink } from 'react-icons/fa';

export interface SocialShareCardProps {
  headline?: string;
  subheadline?: string;
  illustrationSrc: string;
  mascotSrc: string;
  logoSrc: string;
  backgroundColors?: [string, string];
  onCtaClick?: () => void;
  ctaHref?: string;
  onClose?: () => void;
  userName?: string;
}

const SocialShareCard: React.FC<SocialShareCardProps> = ({
  headline = 'Reflect now, act brighter.',
  subheadline = 'Your unique climate hook—shine with your strengths.',
  illustrationSrc,
  mascotSrc,
  logoSrc,
  backgroundColors = ['#F75B5B', '#F79292'],
  onCtaClick,
  ctaHref,
  onClose,
  userName,
}) => {
  const [theme, setTheme] = useState<'red' | 'warm' | 'yellow' | 'green' | 'blue' | 'custom'>('red');
  const [flip, setFlip] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const getThemeSpec = () => {
    switch (theme) {
      case 'red':
        return { colors: ['#EF476F', '#F78CA0'], dot: '#ffffff20' };
      case 'warm':
        return { colors: ['#F79256', '#FBC4A2'], dot: '#ffffff20' };
      case 'yellow':
        return { colors: ['#FFD166', '#FFE599'], dot: '#00000015' };
      case 'green':
        return { colors: ['#06D6A0', '#9FFFCB'], dot: '#ffffff20' };
      case 'blue':
        return { colors: ['#118AB2', '#82CFFF'], dot: '#ffffff20' };
      default:
        return { colors: backgroundColors, dot: '#ffffff20' };
    }
  };
  const spec = getThemeSpec();
  const gradient = flip ? [spec.colors[1], spec.colors[0]] : spec.colors;
  const cardRef = useRef<HTMLDivElement | null>(null);

  const captureCardToFile = async (): Promise<File> => {
    const node = cardRef.current;
    if (!node) throw new Error('Card not ready');
    const canvas = await html2canvas(node, { backgroundColor: null, scale: 2 });
    return new Promise<File>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error('Failed to create image blob'));
        resolve(new File([blob], 'zerrah-card.png', { type: 'image/png' }));
      }, 'image/png');
    });
  };

  const ensureShare = async (): Promise<string> => {
    if (shareUrl) return shareUrl;
    const envBase = (import.meta as any).env?.VITE_API_BASE || (import.meta as any).env?.VITE_BACKEND_URL;
    // Force local backend when env is not provided
    const apiBase = envBase || 'http://localhost:3000/api';
    const payload = {
      headline,
      subheadline,
      profileImage: illustrationSrc,
      theme,
      colors: gradient,
      userName,
    };
    // Pre-generate a UUID client-side so link creation cannot fail due to DB
    const clientId = (globalThis.crypto?.randomUUID && globalThis.crypto.randomUUID()) || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const res = await fetch(`${apiBase}/share`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: clientId, contentType: 'personality', payload }),
    });
    const json = await res.json();
    if (!json?.success || !json?.url) throw new Error(json?.error || 'Failed to create share');
    setShareUrl(json.url);
    return json.url as string;
  };

  const handleShare = async () => {
    try {
      const file = await captureCardToFile();
      const text = 'My sustainability vibe with Zerrah ✨';
      const nav: any = navigator;
      if (nav?.canShare && nav.canShare({ files: [file] })) {
        await nav.share({ files: [file], text, title: 'Zerrah' });
        return;
      }
      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'zerrah-card.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      alert('Image downloaded. Share it on Instagram/WhatsApp from your gallery.');
    } catch (e) {
      console.error(e);
      alert('Could not prepare the share. Please try again.');
    }
  };

  const shareToWhatsAppText = () => {
    (async () => {
      const url = await ensureShare();
      const text = 'Check out my climate vibe on Zerrah ✨ ' + url;
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    })();
  };

  const shareToInstagram = async () => {
    try {
      const url = await ensureShare();
      const file = await captureCardToFile();
      const nav: any = navigator;
      if (nav?.canShare && nav.canShare({ files: [file] })) {
        await nav.share({ files: [file], title: 'Zerrah', text: url });
        return;
      }
      // Fallback: download
      const blobUrl = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = blobUrl; a.download = 'zerrah-card.png';
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(blobUrl);
      alert('Image downloaded. Open Instagram and post from your gallery.');
    } catch (e) {
      console.error(e);
    }
  };

  const copyLink = async () => {
    try {
      const url = await ensureShare();
      await navigator.clipboard.writeText(url);
      alert('Link copied!');
    } catch (e) {
      console.error('Failed to create share link', e);
      alert('Could not create a unique link right now. Please try again.');
    }
  };

  const [showShareOptions, setShowShareOptions] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-[420px] flex items-start justify-center"
      >
        <div
          style={{ width: 350, transform: 'scale(1.0)', transformOrigin: 'center' }}
        >
        <div
          className="rounded-2xl shadow-2xl overflow-hidden relative"
          style={{
            backgroundImage: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
          }}
          ref={cardRef}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle, ${spec.dot} 1px, transparent 1px)`,
              backgroundSize: '20px 20px',
              opacity: 0.3,
            }}
          />
          <div className="relative flex flex-col items-center text-center px-6 sm:px-10 pt-2 sm:pt-3 pb-0">
            {/* Magnetic theme chips + flip toggle */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-slate-700 shadow-md flex items-center gap-2">
              {([
                { key: 'red',   colors: ['#EF476F','#F78CA0'],    dot: '#ffffff20' },
                { key: 'warm',  colors: ['#F79256','#FBC4A2'],    dot: '#ffffff20' },
                { key: 'yellow',colors: ['#FFD166','#FFE599'],    dot: '#00000015' },
                { key: 'green', colors: ['#06D6A0','#9FFFCB'],    dot: '#ffffff20' },
                { key: 'blue',  colors: ['#118AB2','#82CFFF'],    dot: '#ffffff20' },
              ] as const).map(({ key, colors, dot }) => (
                <button
                  key={key}
                  onClick={() => setTheme(key as typeof theme)}
                  className={`relative w-7 h-7 rounded-full shadow transition-transform active:scale-95 ${theme===key ? 'ring-2 ring-emerald-600 ring-offset-2 ring-offset-white/70' : 'ring-1 ring-white/60'}`}
                  aria-label={key}
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
                  }}
                >
                  <span
                    className="absolute inset-0 rounded-full"
                    style={{
                      backgroundImage: `radial-gradient(circle, ${dot} 1px, transparent 1px)`,
                      backgroundSize: '16px 16px',
                      opacity: 0.35,
                    }}
                  />
                </button>
              ))}
              {/* Flip toggle removed per request */}
            </div>
            {/* Close button */}
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="absolute top-3 right-3 bg-white/90 hover:bg-white text-red-600 hover:text-red-700 rounded-full w-9 h-9 flex items-center justify-center shadow-md transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* Logo */}
            <motion.img
              src={logoSrc}
              alt="Zerrah"
              className="h-24 sm:h-28 mb-2"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
            />

            {/* Headline */}
            <div className="text-white/90 text-base sm:text-lg mt-1 mb-1 font-semibold">
              {`Hey ${userName || 'friend'} !!!`}
            </div>
            <h1 className="text-white font-extrabold tracking-tight leading-tight text-2xl sm:text-3xl md:text-4xl">
              {headline}
            </h1>
            {/* Subheadline */}
            <p className="text-white/90 text-sm sm:text-base md:text-lg mt-3 max-w-2xl">
              {subheadline}
            </p>

            {/* Illustration framed to harmonize with all themes */}
            <motion.div
              className="my-6 sm:my-8 w-full max-w-sm"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <div className="rounded-2xl shadow-none p-0 mx-auto">
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden">
                  <img
                    src={illustrationSrc}
                    alt="Illustration"
                    className="absolute inset-0 w-full h-full object-contain filter saturate-[0.9] contrast-[1.05]"
                  />
                  <div className="absolute inset-0 bg-white/5 mix-blend-soft-light pointer-events-none" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(0,0,0,0.06),transparent_60%)] pointer-events-none" />
                </div>
              </div>
            </motion.div>

            {/* CTA with Bobo cuddling on the right */}
            <div className="relative flex items-center justify-center gap-2 mt-2">
              {!showShareOptions ? (
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowShareOptions(true)}
                  className="inline-flex items-center justify-center rounded-full bg-black text-white font-bold px-6 sm:px-8 py-3 sm:py-3.5 shadow-lg mb-0"
                >
                  Share it
                </motion.button>
              ) : (
                <div className="flex flex-col items-stretch gap-2">
                  <button
                    onClick={shareToInstagram}
                    className="text-xs font-semibold px-3 py-2 rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white shadow hover:from-pink-600 hover:to-fuchsia-700 inline-flex items-center gap-2"
                  >
                    <FaInstagram className="w-4 h-4" />
                    <span>Instagram</span>
                  </button>
                  <button
                    onClick={shareToWhatsAppText}
                    className="text-xs font-semibold px-3 py-2 rounded-full bg-green-500 text-white shadow hover:bg-green-600 inline-flex items-center gap-2"
                  >
                    <FaWhatsapp className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    onClick={copyLink}
                    className="text-xs font-semibold px-3 py-2 rounded-full bg-gray-800 text-white shadow hover:bg-black inline-flex items-center gap-2"
                  >
                    <FaLink className="w-4 h-4" />
                    <span>Copy link</span>
                  </button>
                  <button
                    onClick={() => setShowShareOptions(false)}
                    className="text-xs font-semibold px-3 py-2 rounded-full bg-white/70 text-slate-700 shadow hover:bg-white"
                  >
                    Close
                  </button>
                </div>
              )}
              <motion.img
                src={mascotSrc}
                alt="Bobo"
                className="w-20 sm:w-24 md:w-28 ml-4 -mr-2 mb-0 select-none"
                whileHover={{ scale: 1.06 }}
              />
            </div>

            {/* Mascot removed to eliminate extra bottom space */}
          </div>
        </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SocialShareCard;


