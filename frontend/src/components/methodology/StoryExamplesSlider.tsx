import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const stories = [
  {
    archetype: 'Strategist',
    name: 'Sarah',
    quote: 'I love having a clear plan. Zerrah helped me map out exactly which changes would have the biggest impact, and I could track my progress step by step.',
    illustration: '👩‍💼'
  },
  {
    archetype: 'Trailblazer',
    name: 'Marcus',
    quote: 'I\'m always trying new things. The app gave me data-driven experiments to try, and I could see what actually worked for my lifestyle.',
    illustration: '🧑‍🔬'
  },
  {
    archetype: 'Catalyst',
    name: 'Elena',
    quote: 'Climate action feels so much better when I\'m doing it with my community. Zerrah connected me with others who share my values.',
    illustration: '👩‍🎨'
  }
];

export default function StoryExamplesSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-24 bg-gradient-to-b from-white to-[#FDF7F0]">
      <div className="max-w-5xl w-full">
        <motion.h2
          className="font-serif text-5xl md:text-6xl font-light text-[#1C1B19] mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Meet Our Community
        </motion.h2>

        <div className="relative">
          {/* Slider container */}
          <div className="overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl shadow-2xl border border-white/40">
            <motion.div
              className="flex"
              animate={{ x: `-${currentIndex * 100}%` }}
              transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
            >
              {stories.map((story, index) => (
                <div key={index} className="min-w-full flex-shrink-0">
                  <div className="grid md:grid-cols-2 gap-12 p-12 md:p-16">
                    {/* Left: Illustration */}
                    <div className="flex items-center justify-center">
                      <motion.div
                        className="text-9xl"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        {story.illustration}
                      </motion.div>
                    </div>

                    {/* Right: Quote */}
                    <div className="flex flex-col justify-center">
                      <div className="text-sm font-semibold text-[#16626D] uppercase tracking-wider mb-4">
                        Meet A {story.archetype}
                      </div>
                      <h3 className="font-serif text-3xl font-light text-[#1C1B19] mb-6">
                        {story.name}
                      </h3>
                      <blockquote className="text-xl text-[#1C1B19]/70 leading-relaxed italic">
                        "{story.quote}"
                      </blockquote>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Navigation buttons */}
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm border border-white/40 shadow-lg flex items-center justify-center hover:bg-white transition-colors"
            aria-label="Previous story"
          >
            <ChevronLeft className="w-6 h-6 text-[#16626D]" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm border border-white/40 shadow-lg flex items-center justify-center hover:bg-white transition-colors"
            aria-label="Next story"
          >
            <ChevronRight className="w-6 h-6 text-[#16626D]" />
          </button>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {stories.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-[#16626D] w-8'
                    : 'bg-[#16626D]/30 hover:bg-[#16626D]/50'
                }`}
                aria-label={`Go to story ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

