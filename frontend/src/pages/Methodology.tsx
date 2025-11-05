import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import LeftRailNav from '@/components/methodology/LeftRailNav';
import SectionHero from '@/components/methodology/SectionHero';
import SectionChapter from '@/components/methodology/SectionChapter';
import ProgressBarTop from '@/components/methodology/ProgressBarTop';
import { BRAND_VARS, METHODOLOGY, ARCHETYPES_3x3, type Chapter } from '@/data/methodology';
import GridDiagram from '@/components/methodology/GridDiagram';
import ArchetypeGrid from '@/components/methodology/ArchetypeGrid';
import ResearchSplit from '@/components/methodology/ResearchSplit';
import QuizFlow from '@/components/methodology/chapter2/QuizFlow';
import PersonalityMatrix from '@/components/methodology/chapter2/PersonalityMatrix';
import NudgeCards from '@/components/methodology/chapter2/NudgeCards';
import FoggWheel from '@/components/methodology/chapter2/FoggWheel';
import LearningLoop from '@/components/methodology/chapter2/LearningLoop';
import Layout from '@/components/Layout';

function useActiveSection(ids: string[]) {
  const [activeId, setActiveId] = useState<string>(ids[0] || 'hero');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    const options: IntersectionObserverInit = { root: null, rootMargin: '0px 0px -60% 0px', threshold: [0, 1] };
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
  // Install CSS vars for palette
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--ink', BRAND_VARS.ink);
    root.style.setProperty('--canvas', BRAND_VARS.canvas);
    root.style.setProperty('--accent', BRAND_VARS.accent);
    root.style.setProperty('--muted', BRAND_VARS.muted);
    return () => {
      // No-op cleanup; keep brand vars available globally once set
    };
  }, []);

  const chapters = useMemo(() => METHODOLOGY, []);
  const ids = useMemo(() => chapters.map(c => c.id), [chapters]);
  const { activeId, setActiveId } = useActiveSection(ids);

  // scroll snap on nav request
  const scrollToId = useCallback((id: Chapter['id']) => {
    const el = document.getElementById(id);
    if (!el) return;
    // Account for any fixed headers with offset
    const headerOffset = 100;
    const elementPosition = el.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
    // Announce change for screen readers
    const live = document.getElementById('section-live');
    if (live) live.textContent = `Moved to ${id}`;
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

  // Background tint sweep on chapter transitions
  const [tintOn, setTintOn] = useState(false);
  const prevActive = useRef<string | null>(null);
  useEffect(() => {
    if (prevActive.current && prevActive.current !== activeId) {
      setTintOn(true);
      const t = setTimeout(() => setTintOn(false), 350);
      return () => clearTimeout(t);
    }
    prevActive.current = activeId;
  }, [activeId]);

  return (
    <Layout>
      <main className="relative bg-[color:var(--canvas)] text-[color:var(--ink)]">
        {/* Background vignette */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-x-0 bottom-[-10vh] h-[40vh] -z-10 md:hidden"
          style={{
            background:
              'radial-gradient(60% 60% at 50% 0%, rgba(0,0,0,0.06), rgba(0,0,0,0.02) 60%, rgba(0,0,0,0) 100%)',
            filter: 'blur(0.3px)'
          }}
        />
        {/* Stronger vignette for larger screens */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-x-0 bottom-[-12vh] h-[45vh] -z-10 hidden md:block"
          style={{
            background:
              'radial-gradient(60% 60% at 50% 0%, rgba(0,0,0,0.10), rgba(0,0,0,0.05) 60%, rgba(0,0,0,0) 100%)',
            filter: 'blur(0.3px)'
          }}
        />
        <ProgressBarTop />
        <div id="section-live" aria-live="polite" className="sr-only" />
        <LeftRailNav chapters={chapters} activeId={activeId as Chapter['id']} onRequestScroll={scrollToId} />

        {/* Hero */}
        <SectionHero title={chapters[0].title} lead={chapters[0].lead} />

        {/* Chapters */}
        <div className="relative">
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            animate={{ backgroundColor: tintOn ? 'rgba(234,230,223,0.35)' : 'rgba(0,0,0,0)' }}
            transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
          />
          {chapters.slice(1).map((c) => {
            if (c.id === 'chapter1') {
              return (
                <SectionChapter key={c.id} id={c.id} kicker={c.kicker} title={c.title} body={c.body}>
                  <GridDiagram
                    decisionAxis={["Analyst","Intuitive","Connector"]}
                    actionAxis={["Planner","Experimenter","Collaborator"]}
                    cells={[
                      { r:0,c:0,label: 'Strategist' },
                      { r:0,c:1,label: 'Trailblazer' },
                      { r:0,c:2,label: 'Coordinator' },
                      { r:1,c:0,label: 'Visionary' },
                      { r:1,c:1,label: 'Explorer' },
                      { r:1,c:2,label: 'Catalyst' },
                      { r:2,c:0,label: 'Builder' },
                      { r:2,c:1,label: 'Networker' },
                      { r:2,c:2,label: 'Steward' },
                    ]}
                  />
                  <div className="prose prose-neutral max-w-none text-[color:var(--ink)]/80">
                    <h3>Rooted in Behavioral Science & Practical Observation</h3>
                    <p>
                      Our framework draws inspiration from established models like the MBTI (which maps personality through binary traits), but adapts them to climate behavior. We also incorporated insights from:
                    </p>
                    <ul>
                      <li><strong>Behavioral science</strong> → showing that people vary in whether they seek structure, improvise, or rely on others to act.</li>
                      <li><strong>Climate psychology</strong> → highlighting that some people need data, others need inspiration, and many need community.</li>
                    </ul>
                  </div>
                  <ResearchSplit
                    leftTitle="Behavioral science"
                    leftPoints={["Structure vs improvise vs rely on others","Data, motivation, and prompts shape action"]}
                    rightTitle="Practical observation"
                    rightPoints={["Conversations, workshops, early user testing","Real habits, real barriers, real language"]}
                  />
                  <div className="prose prose-neutral max-w-none text-[color:var(--ink)]/80">
                    <h3>3. Building the 9 Archetypes</h3>
                    <p>From this matrix, each unique combination became one of the nine Zerrah archetypes.</p>
                  </div>
                  <ArchetypeGrid cells={ARCHETYPES_3x3} />
                </SectionChapter>
              );
            }
            if (c.id === 'chapter2') {
              return (
                <SectionChapter key={c.id} id={c.id} kicker={c.kicker} title={c.title} body={c.body}>
                  <QuizFlow />
                  <PersonalityMatrix />
                  <NudgeCards />
                  <FoggWheel />
                  <LearningLoop />
                </SectionChapter>
              );
            }
            return (
              <SectionChapter key={c.id} id={c.id} kicker={c.kicker} title={c.title} body={c.body} />
            );
          })}
        </div>
      </main>
    </Layout>
  );
}


