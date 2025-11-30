import { motion } from 'framer-motion';
import { type Chapter } from '@/data/methodology';

type Props = {
  chapters: Chapter[];
  activeId: Chapter['id'];
  onRequestScroll: (id: Chapter['id']) => void;
};

export default function PremiumSideNav({ chapters, activeId, onRequestScroll }: Props) {
  const items = chapters.map(c => ({ id: c.id, title: c.title }));
  const currentIndex = items.findIndex(i => i.id === activeId);
  const progress = ((currentIndex + 1) / items.length) * 100;

  return (
    <aside
      aria-label="Chapter navigation"
      className="fixed left-0 top-0 bottom-0 hidden lg:flex z-40 w-20 items-center"
    >
      <div className="flex flex-col items-center w-full h-full py-12 px-4">
        {/* Progress timeline */}
        <div className="relative flex-1 w-full flex flex-col items-center justify-center">
          {/* Vertical line */}
          <div className="absolute top-0 bottom-0 w-0.5 bg-[#1C1B19]/10" aria-hidden />
          
          {/* Progress fill */}
          <motion.div
            className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#16626D] to-[#E9839D] origin-top"
            style={{ scaleY: progress / 100 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            aria-hidden
          />

          {/* Chapter dots */}
          <div className="relative flex flex-col justify-between h-full py-8">
            {items.map((item, index) => {
              const isActive = item.id === activeId;
              const isPast = index < currentIndex;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => onRequestScroll(item.id)}
                  className="relative group flex items-center justify-center"
                  aria-label={item.title}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Glowing orb for active */}
                  {isActive && (
                    <motion.div
                      className="absolute w-8 h-8 rounded-full bg-[#16626D]/20 blur-md"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                  
                  {/* Dot */}
                  <div
                    className={`relative w-4 h-4 rounded-full transition-all duration-300 ${
                      isActive
                        ? 'bg-[#16626D] scale-125'
                        : isPast
                        ? 'bg-[#16626D]/60'
                        : 'bg-[#1C1B19]/20'
                    }`}
                  />

                  {/* Hover tooltip */}
                  <div className="absolute left-8 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-[#1C1B19] text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
                      {item.title}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Bottom section - Logo */}
        <div className="flex-shrink-0 mt-auto">
          <img 
            src="/images/new_logo.png" 
            alt="Zerrah Logo" 
            className="h-24 w-auto object-contain opacity-90"
          />
        </div>
      </div>
    </aside>
  );
}

