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
import JourneyMap from '@/components/methodology/JourneyMap';
import PremiumFooterCTA from '@/components/methodology/PremiumFooterCTA';

// Chapter 3 components
import Chapter3Hero from '@/components/methodology/chapter3/Chapter3Hero';
import FiveLifestyleAreas from '@/components/methodology/chapter3/FiveLifestyleAreas';
import EmissionFactors from '@/components/methodology/chapter3/EmissionFactors';
import CalculationFlow from '@/components/methodology/chapter3/CalculationFlow';
import HumanEquivalences from '@/components/methodology/chapter3/HumanEquivalences';
import ImpactAvoided from '@/components/methodology/chapter3/ImpactAvoided';
import TotalFootprint from '@/components/methodology/chapter3/TotalFootprint';
import Chapter3Closing from '@/components/methodology/chapter3/Chapter3Closing';

// Chapter 2 components
import Chapter2Hero from '@/components/methodology/chapter2/Chapter2Hero';
import SimpleQuizSection from '@/components/methodology/chapter2/SimpleQuizSection';
import PersonalityMappingSection from '@/components/methodology/chapter2/PersonalityMappingSection';
import NudgeTheorySection from '@/components/methodology/chapter2/NudgeTheorySection';
import FoggModelSection from '@/components/methodology/chapter2/FoggModelSection';
import AdaptiveSystemSection from '@/components/methodology/chapter2/AdaptiveSystemSection';
import Chapter2Closing from '@/components/methodology/chapter2/Chapter2Closing';

// Chapter 1 components
import Chapter1Hero from '@/components/methodology/chapter1/Chapter1Hero';
import CoreDimensionsSection from '@/components/methodology/chapter1/CoreDimensionsSection';
import Chapter1BehavioralScienceSection from '@/components/methodology/chapter1/Chapter1BehavioralScienceSection';
import NineArchetypesSection from '@/components/methodology/chapter1/NineArchetypesSection';
import SampleArchetypeCards from '@/components/methodology/chapter1/SampleArchetypeCards';
import ToneRelevanceSection from '@/components/methodology/chapter1/ToneRelevanceSection';
import Chapter1WhyMatters from '@/components/methodology/chapter1/Chapter1WhyMatters';

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
        <section id="chapter1" className="min-h-screen" />

        {/* Chapter 1 Hero */}
        <Chapter1Hero />

        {/* Framing the Core Dimensions */}
        <CoreDimensionsSection />

        {/* Rooted in Behavioral Science */}
        <Chapter1BehavioralScienceSection />

        {/* Building the 9 Archetypes */}
        <NineArchetypesSection />

        {/* Sample Archetype Cards */}
        <SampleArchetypeCards />

        {/* Tone & Relevance */}
        <ToneRelevanceSection />

        {/* Why This Matters */}
        <Chapter1WhyMatters />

        {/* Chapter 2: How Zerrah tailors recommendations */}
        <section id="chapter2" className="min-h-screen" />

        {/* Chapter 2 Hero */}
        <Chapter2Hero />

        {/* Simple Quiz With Real Science */}
        <SimpleQuizSection />

        {/* Mapping Your Personality */}
        <PersonalityMappingSection />

        {/* Nudge Theory */}
        <NudgeTheorySection />

        {/* Fogg Behavior Model */}
        <FoggModelSection />

        {/* Adaptive System */}
        <AdaptiveSystemSection />

        {/* Chapter 2 Closing */}
        <Chapter2Closing />

        {/* Chapter 3: How the Zerrah dashboard works */}
        <section id="chapter3" className="min-h-screen" /> {/* Placeholder for nav */}

        {/* Chapter 3 Hero */}
        <Chapter3Hero />

        {/* Five Lifestyle Areas */}
        <FiveLifestyleAreas />

        {/* Emission Factors */}
        <EmissionFactors />

        {/* Calculation Flow */}
        <CalculationFlow />

        {/* Human Equivalences */}
        <HumanEquivalences />

        {/* Impact Avoided */}
        <ImpactAvoided />

        {/* Total Footprint */}
        <TotalFootprint />

        {/* Chapter 3 Closing */}
        <Chapter3Closing />

        {/* Journey Map */}
        <JourneyMap />

        {/* Footer CTA */}
        <PremiumFooterCTA />
      </main>
    </Layout>
  );
}
