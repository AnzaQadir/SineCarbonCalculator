import { useEffect, useMemo, useRef } from 'react';
import { type Chapter } from '@/data/methodology';

type Props = {
  chapters: Chapter[];
  activeId: Chapter['id'];
  onRequestScroll: (id: Chapter['id']) => void;
};

export default function LeftRailNav({ chapters, activeId, onRequestScroll }: Props) {
  const listRef = useRef<HTMLUListElement | null>(null);

  const items = useMemo(() => chapters.map(c => ({ id: c.id, title: c.title })), [chapters]);
  const currentIndex = items.findIndex(i => i.id === activeId);
  const progress = ((currentIndex + 1) / items.length) * 100;

  useEffect(() => {
    const ul = listRef.current;
    if (!ul) return;
    const handleKey = (e: KeyboardEvent) => {
      const idx = items.findIndex(i => i.id === activeId);
      if (e.key === 'j' || e.key === 'ArrowDown') {
        const next = items[Math.min(items.length - 1, idx + 1)];
        if (next) onRequestScroll(next.id);
      } else if (e.key === 'k' || e.key === 'ArrowUp') {
        const prev = items[Math.max(0, idx - 1)];
        if (prev) onRequestScroll(prev.id);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeId, items, onRequestScroll]);

  return (
    <aside aria-label="Chapter navigation" className="fixed left-0 top-24 bottom-32 hidden md:flex z-40 w-28 bg-[#2a2a2a] text-white items-center shadow-[8px_0_24px_-12px_rgba(0,0,0,.35)] rounded-r-xl">
      <div className="flex flex-col items-center w-full h-full py-6">
        {/* Top Section */}
        <div className="flex flex-col items-center flex-shrink-0">
          {/* BROWSE SLIDES text - two-line stack, yellow-gold */}
          <div className="text-center mb-6">
            <div className="text-[#F4D03F] text-[10px] font-semibold tracking-[0.15em] uppercase leading-tight">
              <div>BROWSE</div>
              <div>SLIDES</div>
            </div>
          </div>
          
          {/* Circular Progress Indicator */}
          <div className="mb-8 relative">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
              {/* Background circle */}
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="3"
              />
              {/* Progress fill */}
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="rgba(255,255,255,0.6)"
                strokeWidth="3"
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            {/* Progress text inside circle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-xs font-semibold">
                {Math.max(1, currentIndex + 1)} / {items.length}
              </span>
            </div>
          </div>
        </div>
          
        {/* Rail with line + dots - takes remaining space */}
        <div className="relative flex-1 w-full px-3 min-h-0">
          <div className="absolute left-[34px] top-0 bottom-0 w-[2px] bg-white/35" aria-hidden />
          <ul ref={listRef} className="flex flex-col justify-between h-full py-1" role="list">
            {items.map(({ id, title }) => {
              const isActive = id === activeId;
              return (
                <li key={id} className="relative flex items-center gap-2 pl-4">
                  <button
                    aria-label={title}
                    title={title}
                    aria-current={isActive ? 'true' : undefined}
                    onClick={() => onRequestScroll(id)}
                    className="relative group"
                  >
                    {/* Active dot - red with dashed outline */}
                    {isActive ? (
                      <div className="relative">
                        <svg className="absolute -top-2.5 -left-2.5 w-8 h-8" viewBox="0 0 16 16">
                          <circle
                            cx="8"
                            cy="8"
                            r="7"
                            fill="none"
                            stroke="#EF4444"
                            strokeWidth="1.5"
                            strokeDasharray="2 2"
                          />
                        </svg>
                        <div className="relative h-3 w-3 rounded-full bg-[#EF4444] border-2 border-[#EF4444]" />
                      </div>
                    ) : (
                      <div className="h-3 w-3 rounded-full bg-white border-2 border-white/70 hover:bg-white/90 transition-all" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Bottom Section - Zerrah Logo */}
        <div className="flex flex-col items-center flex-shrink-0 mt-auto">
          <img 
            src="/images/new_logo.png" 
            alt="Zerrah Logo" 
            className="h-12 w-auto object-contain opacity-90"
          />
        </div>
      </div>
    </aside>
  );
}


