import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import Calculator from '@/components/Calculator';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LeafyGreen, Droplets, Wind, Trees, FileText, BarChart4, Map, Users, CheckCircle, Smile, Heart, Check, Globe, Hexagon, Star, Zap, Share2, PauseCircle, Medal, Lightbulb, Leaf, Sun, Recycle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { motion, useScroll, useInView } from 'framer-motion';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { FaInstagram, FaFacebook, FaTiktok, FaSlack } from "react-icons/fa";

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: 'easeOut',
    },
  }),
};

const iconVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.08, transition: { type: 'spring', stiffness: 300 } },
};

const iconHoverVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.18, rotate: -6, transition: { type: 'spring', stiffness: 300 } },
};

const values = [
  {
    icon: Zap,
    label: 'Reflective',
    tooltip: 'Pause and consider your impact—no rush, just reflection.'
  },
  {
    icon: Star,
    label: 'Guilt-Free',
    tooltip: 'No shame, no blame. Just positive, actionable steps.'
  },
  {
    icon: Hexagon,
    label: 'Story-Driven',
    tooltip: 'Your journey is a story—unique, evolving, and worth sharing.'
  },
  {
    icon: Globe,
    label: 'For Now',
    tooltip: 'Focus on what you can do today, not perfection.'
  },
  {
    icon: Smile,
    label: 'Calm Mood',
    tooltip: 'A gentle, welcoming vibe for every step.'
  },
  {
    icon: Heart,
    label: 'Gentle Icons',
    tooltip: 'Soft, friendly visuals to make the journey enjoyable.'
  },
  {
    icon: Share2,
    label: 'Share Ripple',
    tooltip: 'Your actions inspire others—spread the positive ripple.'
  },
  {
    icon: PauseCircle,
    label: 'Own Pace',
    tooltip: 'Go at your speed—no pressure, just progress.'
  },
];

const spotlightCards = [
  {
    title: 'Bike to work. Like skipping 1 car ride. Saves 8kg CO₂.',
    effort: 'Low Effort',
    sub: 'Quick Start',
    border: 'border-l-4 border-primary',
    tooltip: 'Biking is a fun, healthy way to cut emissions fast!'
  },
  {
    title: 'Meatless Monday. Like planting 2 trees. Saves 20L water.',
    effort: 'Medium Effort',
    sub: 'Feel-Good',
    border: 'border-l-4 border-yellow-400',
    tooltip: 'Skipping meat once a week saves water and reduces your footprint.'
  },
  {
    title: 'Home solar estimate. Like a year of LEDs. Saves 500kg CO₂.',
    effort: 'High Effort',
    sub: 'Long Haul',
    border: 'border-l-4 border-pink-400',
    tooltip: 'Solar is a big step, but pays off for you and the planet!'
  },
];

const cardMotion = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: 'easeOut',
    },
  }),
  hover: {
    scale: 1.04,
    boxShadow: '0 8px 32px 0 rgba(0,0,0,0.10)',
    transition: { type: 'spring', stiffness: 300 },
  },
};

// --- ContactForm component ---
const ContactForm = () => {
  const [fields, setFields] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
    setError('');
  };

  const validate = () => {
    if (!fields.name.trim() || !fields.email.trim() || !fields.message.trim()) {
      setError('Please fill in all fields.');
      return false;
    }
    if (!fields.email.includes('@') || !fields.email.includes('.')) {
      setError('Please enter a valid email address.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    if (!validate()) return;
    setSubmitting(true);
    setError('');
    // Simulate network request
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setFields({ name: '', email: '', message: '' });
      if (toast) {
        toast({ title: "Message sent!", description: "Thank you for reaching out. We'll be in touch soon." });
      }
    }, 1200);
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 w-full">
      <h2
        className="text-5xl md:text-6xl font-extrabold text-center mb-4"
        style={{ lineHeight: 1.1, letterSpacing: '-0.01em' }}
      >
        Contact Us
      </h2>
      <h3
        className="text-2xl md:text-3xl font-semibold text-gray-400 text-center mb-12"
        style={{ lineHeight: 1.4, letterSpacing: '0.01em' }}
      >
        We'd love to hear from you.
      </h3>
      <form className="w-full max-w-md mx-auto flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Jane Smith"
            className="w-full rounded-md bg-gray-100 px-4 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-60"
            value={fields.name}
            onChange={handleChange}
            disabled={submitting}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="jane@framer.com"
            className="w-full rounded-md bg-gray-100 px-4 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-60"
            value={fields.email}
            onChange={handleChange}
            disabled={submitting}
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
          <textarea
            id="message"
            name="message"
            rows={4}
            placeholder="Your message..."
            className="w-full rounded-md bg-gray-100 px-4 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-60"
            value={fields.message}
            onChange={handleChange}
            disabled={submitting}
          />
        </div>
        {error && <div className="text-red-500 text-sm text-center -mt-2">{error}</div>}
        <button
          type="submit"
          className="w-full bg-black text-white rounded-md py-2 font-semibold text-base mt-2 hover:bg-gray-800 transition disabled:opacity-60"
          disabled={submitting}
        >
          {submitting ? 'Sending...' : 'Submit'}
        </button>
        {success && (
          <div className="text-green-600 text-center mt-4">Message sent! Thank you for reaching out.</div>
        )}
      </form>
    </div>
  );
};

// --- How It Works Section ---
const howItWorksStepNumbers = ['①','②','③','④'];

function HowItWorksSection({ steps }: { steps: { title: string; desc: string; img: string; alt: string }[] }) {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  // For each step, track in-view state and card height
  const stepRefs = steps.map(() => useRef<HTMLDivElement>(null));
  const stepInViews = stepRefs.map(ref => useInView(ref, { margin: '-20% 0px -20% 0px', once: false }));
  const [cardHeights, setCardHeights] = useState<number[]>(Array(steps.length).fill(0));
  const activeIdx = stepInViews.lastIndexOf(true);
  const pastelBg = ["bg-emerald-50", "bg-blue-50", "bg-yellow-50", "bg-pink-50"];

  useEffect(() => {
    setCardHeights(stepRefs.map(ref => ref.current ? ref.current.offsetHeight : 0));
  }, [stepRefs.map(ref => ref.current ? ref.current.offsetHeight : 0).join(",")]);

  return (
    <section ref={sectionRef} className="w-full py-32 px-2" style={{ background: 'linear-gradient(to right, #F3FDF8, #FFFDF3)' }}>
      <div className="flex flex-col items-center mb-16">
        <h2 className="text-[24px] md:text-[32px] font-extrabold text-center text-gray-900 tracking-tight mb-12">How It Works</h2>
      </div>
      <div className="mx-auto flex flex-col gap-24" style={{ maxWidth: '80vw' }}>
        {steps.map((step, idx) => {
          const isEven = idx % 2 === 0;
          const notLast = idx < steps.length - 1;
          return (
            <div key={step.title} className="flex flex-row items-center w-full relative">
              {/* Step circle + connector */}
              <div className="flex flex-col items-center w-[140px] relative z-10">
                <motion.div
                  className={`w-[104px] h-[104px] flex items-center justify-center rounded-full border-2 border-emerald-200 shadow-lg text-4xl font-bold transition-all duration-300 ${pastelBg[idx % pastelBg.length]} ${activeIdx > idx ? 'ring-4 ring-emerald-100 border-emerald-400 text-emerald-600' : activeIdx === idx ? 'ring-4 ring-emerald-200 border-emerald-400 text-emerald-700' : 'border-emerald-100 text-emerald-300'}`}
                  animate={activeIdx === idx ? { scale: 1.18, boxShadow: '0 0 0 16px rgba(16,185,129,0.10)' } : { scale: 1, boxShadow: '0 2px 8px 0 rgba(16,185,129,0.05)' }}
                  transition={{ duration: 0.3 }}
                >
                  {activeIdx > idx ? (
                    <svg className="w-14 h-14 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l6 6L19 7" /></svg>
                  ) : (
                    howItWorksStepNumbers[idx]
                  )}
                </motion.div>
                {/* Connector line below (except last) */}
                {notLast && (
                  <svg height={cardHeights[idx] ? cardHeights[idx] : 180} width="8" className="block mx-auto z-0" style={{ marginTop: 0 }}>
                    <motion.line
                      x1="4" y1="0" x2="4" y2={cardHeights[idx] ? cardHeights[idx] : 180}
                      stroke="#A7F3D0"
                      strokeWidth="10"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: activeIdx > idx ? 1 : activeIdx === idx ? scrollYProgress.get() : 0 }}
                      style={{ filter: 'drop-shadow(0 2px 8px #A7F3D033)' }}
                    />
                  </svg>
                )}
              </div>
              {/* Step card (text + icon, alternating) */}
              <div className={`flex-1 flex ${isEven ? 'flex-row' : 'flex-row-reverse'} items-center`}>
                <motion.div
                  ref={stepRefs[idx]}
                  className={`flex-1 flex flex-col justify-center bg-[#FAFAF6] rounded-3xl shadow-2xl p-12 md:p-16 z-10 mx-8`}
                  initial={{ opacity: 0, y: 64 }}
                  animate={stepInViews[idx] ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: idx * 0.12, ease: 'easeOut' }}
                >
                  <h3 className="text-[24px] font-bold text-gray-900 mb-6">{step.title}</h3>
                  <motion.p
                    className="text-[#6B7280] text-2xl md:text-3xl leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={stepInViews[idx] ? { opacity: 1 } : {}}
                    transition={{ duration: 0.7, delay: 0.2 + idx * 0.1 }}
                  >
                    {step.desc.split(/(vibes-based)/gi).map((part: string, i: number) =>
                      part.toLowerCase() === 'vibes-based' ? (
                        <motion.span
                          key={i}
                          className="bg-emerald-50 px-3 py-1 rounded-md text-emerald-700 font-semibold"
                          initial={{ opacity: 0, y: 10 }}
                          animate={stepInViews[idx] ? { opacity: 1, y: 0, color: '#3BAF79' } : {}}
                          transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
                        >{part}</motion.span>
                      ) : part
                    )}
                  </motion.p>
                </motion.div>
                {/* Icon column */}
                <div className={`flex-1 flex items-center justify-center mt-12 md:mt-0`}>
                  <motion.div
                    className="rounded-2xl bg-[#FFFDF3] shadow-lg flex items-center justify-center p-12"
                    whileHover={{ scale: 1.15, boxShadow: '0 12px 48px 0 rgba(253, 224, 71, 0.18)' }}
                    animate={stepInViews[idx] ? { scale: 1.12, rotate: 2, boxShadow: '0 12px 48px 0 rgba(16,185,129,0.10)' } : { scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <img src={step.img} alt={step.alt} className="h-44 w-44 object-contain drop-shadow-md" />
                  </motion.div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const [contactOpen, setContactOpen] = useState(false);

  const handleCalculate = () => {
    // Handle calculation completion
    console.log('Calculating results...');
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentStep(prev => Math.min(5, prev + 1));
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const handleStartQuiz = () => {
    navigate('/quiz');
  };

  // How It Works Section
  const howItWorksSteps = [
    {
      title: "Take the Quiz",
      desc: "Answer questions across lifestyle areas that shape your environmental footprint — with no judgment, just vibes.",
      img: "/images/image.png",
      alt: "Take the Quiz"
    },
    {
      title: "Discover Your Story",
      desc: "Get a personalized profile with your sustainability \"style,\" strengths, and gentle steps to move forward.",
      img: "/images/color_story.png",
      alt: "Discover Your Story"
    },
    {
      title: "Reflect & Reimagine",
      desc: "Use our insights to rethink daily choices in a way that feels empowering — not overwhelming.",
      img: "/images/reflect.png",
      alt: "Reflect & Reimagine"
    },
    {
      title: "Share Your Story",
      desc: "Post your profile, swap notes with friends, or start a ripple. The smallest stories spark the biggest shifts.",
      img: "/images/share_story.png",
      alt: "Share Your Story"
    }
  ];

  return (
    <Layout>
      <main className="w-screen aspect-[1536/1024] flex flex-col items-center text-center px-0 relative bg-white" style={{ backgroundImage: 'url(/images/green_bg_short.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundColor: 'white' }}>
        <div className="mt-32">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-6xl md:text-7xl font-extrabold mb-6 leading-tight font-serif"
          style={{ fontFamily: 'Inter, Arial, sans-serif' }}
        >
          Small actions. Big climate impact.
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
          className="text-xl md:text-2xl font-medium text-gray-500 mb-10 leading-snug font-serif"
          style={{ fontFamily: 'Inter, Arial, sans-serif' }}
        >
          Discover your story in 3 minutes.
        </motion.h2>
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
          whileHover={{ scale: 1.08, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.10)' }}
          onClick={handleStartQuiz}
          className="bg-black text-white rounded-full px-8 py-3 font-bold text-lg md:text-xl shadow-lg hover:bg-gray-800 transition mt-6"
        >
          Take the Quiz
        </motion.button>
        </div>
      </main>

      <HowItWorksSection steps={howItWorksSteps} />

      {/* Impact at a Glance Section */}
      <section className="relative w-full max-w-screen-2xl mx-auto my-24 px-2">
        <h2 className="text-5xl md:text-6xl font-serif font-extrabold text-center mb-6 tracking-tighter">Why Zerrah?</h2>
        <div className="text-2xl md:text-3xl text-gray-500 text-center mb-3 leading-snug font-medium">
          Because climate change isn't just a data problem — it's a story problem.
          </div>
        <div className="text-lg md:text-xl text-gray-400 text-center mb-12 max-w-3xl mx-auto italic leading-relaxed">
          This is how the story shifts when Zerrah enters the picture.
        </div>
        {/* Headings row above columns */}
        <div className="flex flex-row gap-12 justify-center items-center max-w-5xl mx-auto mb-2">
          <div className="flex-1 flex justify-center">
            <div className="text-2xl md:text-3xl font-bold text-emerald-700 text-center">With Zerrah</div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="text-2xl md:text-3xl font-bold text-gray-400 text-center">Without Zerrah</div>
          </div>
                </div>
        <div className="flex flex-col md:flex-row gap-12 justify-center items-start max-w-5xl mx-auto mb-20">
          {/* With Zerrah */}
          <div className="flex-1 bg-emerald-50/80 rounded-3xl p-10 md:p-14 shadow-lg flex items-center justify-center relative flex-col mt-8">
            <div className="w-[450px] mx-auto">
              <PillsColumn pills={zerrahPills} />
                </div>
                </div>
          {/* Without Zerrah */}
          <div className="flex-1 bg-gray-50/80 rounded-3xl p-10 md:p-14 shadow-lg flex items-center justify-center relative flex-col mt-8">
            <div className="w-[450px] mx-auto">
              <PillsColumn pills={withoutPills} delay={0.2} />
                </div>
          </div>
        </div>
      </section>
      
      {/* Action Spotlight & Reflections Archive Section */}
      <section className="w-full max-w-screen-2xl mx-auto my-24 px-2">
        {/* Action Spotlight */}
        <h2 className="text-5xl md:text-6xl font-serif font-extrabold text-center mb-4 tracking-tight">Action Spotlight</h2>
        <div className="mx-auto mb-8 w-24 h-1 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 opacity-70" />
        <h3 className="text-2xl md:text-3xl font-bold text-gray-400 text-center mb-16 leading-relaxed">Real stories. Small shifts. Lasting change.</h3>
        <ActionSpotlightCards />
        {/* Reflections Archive */}
        <section className="w-full max-w-screen-2xl mx-auto my-24 px-2">
          <h2 className="text-5xl md:text-6xl font-serif font-extrabold text-center mb-4 tracking-tight">Reflections Archive</h2>
          <div className="mx-auto mb-8 w-24 h-1 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 opacity-70" />
          <div className="text-2xl md:text-3xl text-gray-500 text-center mb-6 leading-relaxed font-medium">
            Discover journeys, share your story, and see the ripple effect of climate action in our community.
          </div>
          <div className="text-lg md:text-xl text-gray-400 text-center mb-8 max-w-2xl mx-auto italic">
            Browse real eco-persona reflections, filter by topic or region, and inspire others with your unique perspective.
          </div>
          <div className="flex justify-center mb-12">
            <SocialRippleDiagram />
          </div>
          <div className="text-center text-gray-500 text-lg mb-8">Your story creates ripples.</div>
          <div className="flex justify-center">
            <button className="bg-emerald-600 text-white rounded-full px-6 py-2 font-bold shadow hover:bg-emerald-700 transition text-base md:text-lg">
              Share Your Story
            </button>
          </div>
        </section>
        <div className="border-t border-gray-100 my-8"></div>
        <section className="w-full max-w-screen-2xl mx-auto mb-0 px-2">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-10">Meet the Founders</h2>
          <div className="text-xl md:text-2xl text-gray-500 text-center leading-relaxed mb-6">
            Anza and Salma believe storytelling can turn climate worry into climate action.
                </div>
          <div className="text-base text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Each brings a love for gentle design, clear guidance, and true inclusivity.<br />
            Reach out with feedback, connect on LinkedIn, or share your reflections. Your story shapes Zerrah.
                </div>
          <div className="flex flex-col md:flex-row gap-12 justify-center items-center">
            {/* Founder 1 */}
            <div className="flex flex-col items-center bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg hover:shadow-2xl transition">
              <img src="/profile.jpg" alt="Anza Qadir" className="h-32 w-32 rounded-full border-4 border-white shadow-md object-cover mb-4" />
              <div className="mt-2 text-xl font-bold text-gray-900">Anza Qadir</div>
              <div className="text-sm text-gray-400 mb-2">Co-Founder</div>
              <a href="https://www.linkedin.com/in/anza-qadir/" target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-2 text-emerald-700 hover:text-emerald-900 font-medium mt-1">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z"/></svg>
                LinkedIn
              </a>
                </div>
            {/* Founder 2 */}
            <div className="flex flex-col items-center bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg hover:shadow-2xl transition">
              <img src="/images/Sustainability-Soft-Launch-Girl.png" alt="Salma" className="h-32 w-32 rounded-full border-4 border-white shadow-md object-cover mb-4" />
              <div className="mt-2 text-xl font-bold text-gray-900">Salma Zahra</div>
              <div className="text-sm text-gray-400 mb-2">Co-Founder</div>
              <a href="https://www.linkedin.com/in/salma-zahra-05285112b/" target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-2 text-emerald-700 hover:text-emerald-900 font-medium mt-1">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z"/></svg>
                LinkedIn
              </a>
                </div>
          </div>
        </section>
      </section>

      {/* Meet the Founders & Contact Us Section */}
      <section className="w-full max-w-screen-2xl mx-auto mt-0 mb-24 px-2">
        <Dialog open={contactOpen} onOpenChange={setContactOpen}>
          <DialogTrigger asChild>
            <button className="bg-emerald-600 text-white rounded-full px-6 py-2 font-bold shadow hover:bg-emerald-700 transition text-base md:text-lg">
              Contact Us
            </button>
          </DialogTrigger>
          <DialogContent>
            <ContactForm />
          </DialogContent>
        </Dialog>
      </section>
    </Layout>
  );
};

// --- ActionSpotlightCards component ---
const actionSpotlightData = [
  {
    gif: '/gif/reversed_bike.gif',
    title: 'Bike to work',
    impact: 'Saves 8kg CO₂, like skipping 1 car ride.',
    detail: 'Biking to work just once a week can save 8kg of CO₂ emissions, improve your health, and reduce traffic congestion. Small change, big impact!',
    icon: '🚲',
    color: 'from-blue-400 to-cyan-300'
  },
  {
    gif: '/gif/eco_friendly_market.gif',
    title: 'Buy Local & Seasonal',
    impact: 'Cuts food miles—like taking 3 cars off the road for a day.',
    detail: 'Choosing local or seasonal produce means your food travels less, slashing transport emissions and supporting nearby farmers. Every fresh, local bite helps the planet and your community thrive!',
    icon: '🥕',
    color: 'from-green-400 to-emerald-300'
  },
  {
    gif: '/gif/solar_saving.gif',
    title: 'Home solar estimate',
    impact: 'Saves 500kg CO₂, like a year of LEDs.',
    detail: 'Getting a home solar estimate is a big step, but it can save 500kg of CO₂ per year and lower your energy bills.',
    icon: '☀️',
    color: 'from-yellow-400 to-orange-300'
  },
];

function ActionSpotlightCards() {
  const [flipped, setFlipped] = useState([false, false, false]);
  const [hovered, setHovered] = useState<number | null>(null);

  const handleFlip = (idx: number) => {
    setFlipped(f => f.map((v, i) => (i === idx ? !v : v)));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {actionSpotlightData.map((card, idx) => (
        <motion.div
          key={card.title}
          className="group relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.2 }}
          viewport={{ once: true }}
          onHoverStart={() => setHovered(idx)}
          onHoverEnd={() => setHovered(null)}
        >
          <motion.div
            className={`relative bg-white rounded-[2.5rem] overflow-hidden cursor-pointer transition-all duration-500 aspect-[3/4] ${
              flipped[idx] ? 'scale-105' : 'hover:scale-105'
            }`}
            style={{ minHeight: 420, minWidth: 315, boxShadow: hovered === idx ? '0 20px 40px rgba(0,0,0,0.1)' : '0 10px 20px rgba(0,0,0,0.05)' }}
            onClick={() => handleFlip(idx)}
            whileHover={{ y: -5 }}
          >
            {/* GIF/Image */}
            <motion.img
              src={card.gif}
              alt={card.title}
              className="w-full h-full object-cover"
              whileHover={flipped[idx] ? {} : { scale: 1.06, rotate: -2 }}
              whileTap={flipped[idx] ? {} : { scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            />
            {/* Light overlay for glow effect */}
            <div className="absolute inset-0 bg-white/10 pointer-events-none rounded-[2.5rem]" />
            {/* Content overlay */}
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              <div className="bg-white/80 rounded-xl px-3 py-2 shadow-md inline-block w-full">
                <div className="text-2xl mb-1 flex justify-center">{card.icon}</div>
                <h3 className="text-lg font-bold text-emerald-800 mb-0.5 text-center">{card.title}</h3>
                <div className="flex flex-col items-center">
                  <span className="font-bold text-emerald-700 text-sm">{card.impact.split('—')[0]}</span>
                  <span className="text-gray-700 text-xs">{card.impact.split('—')[1]}</span>
                </div>
              </div>
            </div>

            {/* Heart icon */}
            <motion.div 
              className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </motion.div>
          </motion.div>

          {/* Card back */}
          <motion.div
            className={`absolute inset-0 bg-white p-8 rounded-[2.5rem] transition-opacity duration-500 ${
              flipped[idx] ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className="h-full flex flex-col">
              <div className="text-4xl mb-4">{card.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{card.title}</h3>
              <p className="text-gray-600 mb-6 flex-grow">{card.detail}</p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="font-medium">{card.impact}</span>
                </div>
                
                <motion.button
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 text-white rounded-full py-3 font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFlip(idx);
                  }}
                >
                  Take Action
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

function SocialRippleDiagram() {
  const icons = [
    { icon: <FaInstagram className="text-pink-500 w-7 h-7" />, style: "top-2 left-2" },
    { icon: <FaFacebook className="text-blue-600 w-7 h-7" />, style: "bottom-4 right-8" },
    { icon: <FaTiktok className="text-black w-7 h-7" />, style: "bottom-2 left-8" },
    { icon: <FaSlack className="text-[#611f69] w-7 h-7" />, style: "top-4 right-8" },
  ];
  const avatarSrc = "/images/Planets-Main-Character-Girl.png";
  const avatars = [
    { src: avatarSrc, style: "top-8 left-1/2 -translate-x-1/2" },
    { src: avatarSrc, style: "left-8 top-1/2 -translate-y-1/2" },
    { src: avatarSrc, style: "bottom-8 left-1/2 -translate-x-1/2" },
    { src: avatarSrc, style: "right-8 top-1/2 -translate-y-1/2" },
  ];
  return (
    <div className="relative w-[400px] h-[400px] mx-auto bg-gradient-to-br from-emerald-50 to-white rounded-3xl shadow-lg mb-12">
      {/* Central personality image */}
      <motion.img
        src={avatarSrc}
        alt="Personality"
        className="absolute left-1/2 top-1/2 w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl z-10 -translate-x-1/2 -translate-y-1/2"
        whileHover={{ scale: 1.08 }}
      />
      {/* Social icons */}
      {icons.map((item, i) => (
        <motion.div
          key={i}
          className={`absolute w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg ${item.style}`}
          initial={{ scale: 0.9, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1, y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
        >
          {item.icon}
        </motion.div>
      ))}
      {/* Avatars */}
      {avatars.map((item, i) => (
        <motion.img
          key={i}
          src={item.src}
          alt=""
          className={`absolute w-12 h-12 rounded-full object-cover border-2 border-white shadow ${item.style}`}
          initial={{ scale: 0.9, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1, y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
    </div>
  );
}

const zerrahPills = [
  { text: "Curiosity", color: "bg-emerald-200 text-emerald-900", rotate: -8 },
  { text: "Compassion", color: "bg-blue-200 text-blue-900", rotate: 6 },
  { text: "Story", color: "bg-white text-emerald-700 border border-emerald-100", rotate: -4 },
  { text: "Clarity", color: "bg-emerald-100 text-emerald-800", rotate: 8 },
  { text: "Momentum", color: "bg-blue-100 text-blue-800", rotate: -6 },
];
const withoutPills = [
  { text: "Panic", color: "bg-gray-200 text-gray-700", rotate: 7 },
  { text: "Shame", color: "bg-gray-100 text-gray-500", rotate: -5 },
  { text: "Noise", color: "bg-gray-200 text-gray-700", rotate: 4 },
  { text: "Overload", color: "bg-gray-100 text-gray-500", rotate: -7 },
  { text: "Stall", color: "bg-gray-200 text-gray-700", rotate: 5 },
];
function PillsColumn({ pills, delay = 0 }: { pills: { text: string; color: string; rotate: number }[]; delay?: number }) {
  const entranceDuration = 0.7;
  const entranceDelay = 0.35;
  const floatDuration = 2.5;
  const totalEntrance = delay + (pills.length - 1) * entranceDelay + entranceDuration;

  return (
    <div className="flex flex-col items-center justify-center h-[420px]">
      {pills.map((pill, i) => (
        <motion.div
          key={pill.text}
          className={`px-10 py-5 rounded-full font-bold shadow-lg my-3 ${pill.color}`}
          style={{
            rotate: pill.rotate,
            fontSize: "1.35rem",
            minWidth: 200,
            textAlign: "center",
          }}
          initial={{ opacity: 0, y: -60 }}
          animate={{
            opacity: 1,
            y: [-60, 0, -8, 0, 8, 0],
            rotate: [pill.rotate, pill.rotate, pill.rotate + 3, pill.rotate - 3, pill.rotate],
          }}
          transition={{
            times: [0, 0.2, 0.5, 0.7, 0.85, 1],
            delay: delay + i * entranceDelay,
            duration: totalEntrance + floatDuration,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
          whileHover={{
            scale: 1.08,
            boxShadow: "0 8px 32px 0 rgba(16,185,129,0.18)",
          }}
        >
          {pill.text}
        </motion.div>
      ))}
    </div>
  );
}

export default Index;
