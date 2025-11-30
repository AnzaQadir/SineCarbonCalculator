import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { METHODOLOGY, ARCHETYPES_3x3, type Chapter } from '@/data/methodology';

// Premium components
import PremiumHero from '@/components/methodology/PremiumHero';
import PremiumSideNav from '@/components/methodology/PremiumSideNav';
import PremiumChapterCard from '@/components/methodology/PremiumChapterCard';
import BehavioralScienceSection from '@/components/methodology/BehavioralScienceSection';
import PremiumGridDiagram from '@/components/methodology/PremiumGridDiagram';
import PremiumArchetypeGrid from '@/components/methodology/PremiumArchetypeGrid';
import StoryExamplesSlider from '@/components/methodology/StoryExamplesSlider';
import WhyThisMattersSection from '@/components/methodology/WhyThisMattersSection';
import JourneyMap from '@/components/methodology/JourneyMap';
import PremiumFooterCTA from '@/components/methodology/PremiumFooterCTA';

function useActiveSection(ids: string[]) {
  const [activeId, setActiveId] = useState<string>(ids[0] || 'hero');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    const options: IntersectionObserverInit = { 
      root: null, 
      rootMargin: '0px 0px -60% 0px', 
      threshold: [0, 1] 
    };
    const io = new IntersectionObserver((entries) => {
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => (a.boundingClientRect.top) - (b.boundingClientRect.top));
      if (visible[0]?.target?.id) setActiveId(visible[0].target.id);
    }, options);
    observerRef.current = io;
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [ids]);

  return { activeId, setActiveId } as const;
}

export default function Methodology() {
  const chapters = useMemo(() => METHODOLOGY, []);
  const ids = useMemo(() => chapters.map(c => c.id), [chapters]);
  const { activeId, setActiveId } = useActiveSection(ids);

  // Scroll to section
  const scrollToId = useCallback((id: Chapter['id']) => {
    const el = document.getElementById(id);
    if (!el) return;
    const headerOffset = 100;
    const elementPosition = el.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }, []);

  // Deep link handling
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
      }
    }
  }, []);

  return (
    <Layout>
      <main className="relative bg-[#FEFCF9] text-[#1C1B19] overflow-x-hidden">
        {/* Side Navigation */}
        <PremiumSideNav 
          chapters={chapters} 
          activeId={activeId as Chapter['id']} 
          onRequestScroll={scrollToId} 
        />

        {/* Hero Section */}
        <PremiumHero />

        {/* Chapter 1: How we designed the Zerrah personality types */}
        <PremiumChapterCard
          chapterNumber={1}
          title="How we designed the Zerrah personality types"
          summary="A framework rooted in behavioral science and practical observation, creating nine unique archetypes that capture the diversity of climate mindsets."
          id="chapter1"
        />

        {/* Behavioral Science Section */}
        <BehavioralScienceSection />

        {/* Decision × Action Grid */}
        <PremiumGridDiagram
          decisionAxis={['Analyst', 'Intuitive', 'Connector']}
          actionAxis={['Planner', 'Experimenter', 'Collaborator']}
        />

        {/* The Nine Archetypes */}
        <PremiumArchetypeGrid cells={ARCHETYPES_3x3} />

        {/* Chapter 2: How Zerrah tailors recommendations */}
        <PremiumChapterCard
          chapterNumber={2}
          title="How Zerrah tailors climate action recommendations for you"
          summary="Personalized recommendations that adapt to your unique decision-making and action-taking style, making climate action feel natural and achievable."
          id="chapter2"
        />

        {/* Story Examples */}
        <StoryExamplesSlider />

        {/* Why This Matters */}
        <WhyThisMattersSection />

        {/* Chapter 3: How the dashboard works */}
        <PremiumChapterCard
          chapterNumber={3}
          title="How the Zerrah dashboard works"
          summary="A comprehensive view of your carbon footprint across lifestyle areas, translated into relatable equivalents and positive impact tracking."
          id="chapter3"
        />

        {/* Journey Map */}
        <JourneyMap />

        {/* Footer CTA */}
        <PremiumFooterCTA />
      </main>
    </Layout>
  );
}
