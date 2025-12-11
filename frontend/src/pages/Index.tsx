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

// Use PROMOVA Semibold from OnlineWebFonts
const defaultStyles = {
  fontFamily: "'PROMOVA', sans-serif",
  fontWeight: 600,
};
const fontClass = "font-semibold antialiased";

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
const howItWorksStepNumbers = ['1','2','3','4'];

function HowItWorksSection({ steps }: { steps: { title: string; desc: string; img: string; alt: string }[] }) {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ 
    target: sectionRef, 
    offset: ["start end", "end start"],
    layoutEffect: false // Prevent layout effect flickering
  });
  
  const stepRefs = steps.map(() => useRef<HTMLDivElement>(null));
  
  // Use a more stable viewport margin and reduce sensitivity
  const stepInViews = stepRefs.map(ref => useInView(ref, { 
    margin: '-20% 0px -20% 0px', 
    amount: 0.5,
    once: false
  }));
  
  const stepProgresses = stepRefs.map(ref => useInView(ref, { 
    margin: '-20% 0px -20% 0px', 
    amount: 0.5,
    once: false
  }));
  
  const [cardHeights, setCardHeights] = useState<number[]>(Array(steps.length).fill(0));
  const activeIdx = stepProgresses.lastIndexOf(true);
  const pastelBg = ["bg-amber-50", "bg-amber-50", "bg-amber-50", "bg-amber-50"];

  // Optimize height calculations with ResizeObserver
  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return;

    const observers = stepRefs.map((ref, index) => {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setCardHeights(prev => {
            const newHeights = [...prev];
            newHeights[index] = entry.contentRect.height;
            return newHeights;
          });
        }
      });

      if (ref.current) {
        observer.observe(ref.current);
      }

      return observer;
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="w-full py-32 px-2 relative overflow-hidden font-['Inter']" 
      style={{ 
        background: 'linear-gradient(to right, #FEF3C7, #FFFBEB)',
        backgroundSize: '200% 200%',
        animation: 'gradientShift 15s ease infinite',
        willChange: 'transform, background',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        transform: 'translateZ(0)',
        WebkitTransform: 'translateZ(0)'
      }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-0 left-1/4 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl transform -translate-x-1/2"
          initial={{ scale: 1, opacity: 0.3 }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "reverse"
          }}
          style={{
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}
        />
        <motion.div 
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl transform translate-x-1/2"
          initial={{ scale: 1.2, opacity: 0.5 }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "reverse"
          }}
          style={{
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}
        />
      </div>

      <div className="flex flex-col items-center mb-20 relative">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.6, 
            ease: 'easeOut',
            layout: false 
          }}
          viewport={{ 
            once: false, 
            margin: "-10% 0px -10% 0px",
            amount: 0.5
          }}
          className="text-5xl md:text-6xl font-extrabold text-center text-gray-900 mb-10 tracking-tight"
          style={{
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}
        >
          How Zerrah Works
        </motion.h2>
      </div>

      <div className="mx-auto flex flex-col gap-32 relative" style={{ maxWidth: '80vw' }}>
        {steps.map((step, idx) => {
          const isEven = idx % 2 === 0;
          const notLast = idx < steps.length - 1;
          const isStepVisible = stepInViews[idx];
          const isStepActive = activeIdx >= idx;
          
          return (
            <div key={step.title} className="flex flex-row items-center w-full relative">
              <div className="flex flex-col items-center w-[140px] relative z-10">
                <motion.div
                  className={`w-[104px] h-[104px] flex items-center justify-center rounded-full border-2 shadow-lg text-4xl font-bold ${pastelBg[idx % pastelBg.length]} ${
                    isStepActive 
                      ? 'border-amber-400 text-amber-600' 
                      : activeIdx === idx 
                        ? 'border-amber-400 text-amber-700' 
                        : 'border-amber-100 text-amber-300'
                  }`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={isStepActive 
                    ? { 
                        scale: 1.1,
                        opacity: 1,
                        boxShadow: '0 0 0 16px rgba(217,119,6,0.10)',
                      } 
                    : { 
                        scale: isStepActive ? 1.1 : 1,
                        opacity: 1,
                        boxShadow: '0 2px 8px 0 rgba(217,119,6,0.05)',
                      }
                  }
                  transition={{
                    duration: 0.6,
                    ease: "easeOut",
                    layout: false
                  }}
                  style={{
                    willChange: 'transform, opacity, box-shadow',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden'
                  }}
                >
                  {isStepActive ? (
                    <motion.svg 
                      className="w-14 h-14 text-amber-500" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="3" 
                      viewBox="0 0 24 24"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ 
                        scale: 1,
                        opacity: 1,
                      }}
                      transition={{ 
                        duration: 0.4,
                        ease: "easeOut",
                        layout: false
                      }}
                      style={{
                        willChange: 'transform, opacity',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden'
                      }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l6 6L19 7" />
                    </motion.svg>
                  ) : (
                    <motion.span
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ 
                        scale: 1,
                        opacity: 1
                      }}
                      transition={{ 
                        duration: 0.4,
                        ease: "easeOut",
                        layout: false
                      }}
                      style={{
                        willChange: 'transform, opacity',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden'
                      }}
                    >
                      {howItWorksStepNumbers[idx]}
                    </motion.span>
                  )}
                </motion.div>
                {notLast && (
                  <svg height={cardHeights[idx] ? cardHeights[idx] : 180} width="8" className="block mx-auto z-0" style={{ marginTop: 0 }}>
                    <motion.line
                      x1="4" y1="0" x2="4" y2={cardHeights[idx] ? cardHeights[idx] : 180}
                      stroke="#FDE68A"
                      strokeWidth="10"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ 
                        pathLength: isStepActive ? 1 : activeIdx === idx ? scrollYProgress.get() : 0
                      }}
                      transition={{ 
                        duration: 0.4,
                        ease: 'easeOut',
                        layout: false
                      }}
                      style={{ 
                        filter: 'drop-shadow(0 2px 8px #FDE68A33)',
                        willChange: 'stroke-dashoffset',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden'
                      }}
                    />
                  </svg>
                )}
              </div>
              <motion.div
                layout="position"
                layoutId={`step-${idx}`}
                transition={{ 
                  type: 'spring', 
                  stiffness: 300, 
                  damping: 30,
                  layout: false
                }}
                className={`flex-1 flex ${isEven ? 'flex-row' : 'flex-row-reverse'} items-stretch gap-10 h-[260px]`}
                style={{
                  willChange: 'transform',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden'
                }}
              >
                <motion.div
                  layout="position"
                  layoutId={`card-${idx}`}
                  ref={stepRefs[idx]}
                  className={`flex-[2] flex flex-col justify-center bg-white/90 rounded-3xl shadow-2xl p-12 z-10 border border-amber-50/50 card-box h-full`}
                  initial={{ opacity: 0, y: 64, x: isEven ? 32 : -32 }}
                  animate={isStepVisible ? { 
                    opacity: 1, 
                    y: 0, 
                    x: 0
                  } : {}}
                  transition={{ 
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                    duration: 0.6,
                    delay: idx * 0.1,
                    layout: false
                  }}
                  style={{
                    willChange: 'transform, opacity',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden'
                  }}
                >
                  <motion.h3 
                    className="text-3xl font-bold text-gray-900 mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isStepVisible ? { 
                      opacity: 1, 
                      y: 0,
                    } : {}}
                    transition={{ 
                      duration: 0.4, 
                      delay: 0.2 + idx * 0.1,
                      layout: false
                    }}
                    style={{
                      willChange: 'transform, opacity',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden'
                    }}
                  >
                    {step.title}
                  </motion.h3>
                  <motion.p
                    className="text-xl text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={isStepVisible ? { 
                      opacity: 1,
                    } : {}}
                    transition={{ 
                      duration: 0.4, 
                      delay: 0.3 + idx * 0.1,
                      layout: false
                    }}
                    style={{
                      willChange: 'opacity',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden'
                    }}
                  >
                    {step.desc}
                  </motion.p>
                </motion.div>
                <motion.div
                  layout="position"
                  layoutId={`icon-${idx}`}
                  initial={{ opacity: 0, y: 32 }}
                  animate={isStepVisible ? { 
                    opacity: 1, 
                    y: 0
                  } : {}}
                  transition={{ 
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                    delay: idx * 0.1,
                    layout: false
                  }}
                  className="icon-box flex items-center justify-center bg-white/90 rounded-3xl shadow-2xl border border-amber-50/50 p-12 h-full"
                  style={{
                    willChange: 'transform, opacity',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden'
                  }}
                >
                  <div className="rounded-2xl flex items-center justify-center h-full w-full">
                    <motion.img
                      src={step.img}
                      alt={step.alt}
                      className="h-32 w-40 object-contain drop-shadow-md"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={isStepVisible ? {
                        scale: 1,
                        opacity: 1
                      } : {}}
                      transition={{
                        duration: 0.4,
                        ease: "easeOut",
                        layout: false
                      }}
                      style={{
                        willChange: 'transform, opacity',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden'
                      }}
                    />
                  </div>
                </motion.div>
              </motion.div>
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
      desc: "Answer simple questions about your lifestyle and choices across energy, transport, food, clothing, and waste. We're here to understand you, not to test you.",
      img: "/images/image.png",
      alt: "Take the Quiz"
    },
    {
      title: "Discover Your Story",
      desc: "Meet your Zerrah Archetype and learn how you can approach climate action: your strengths, your patterns, and the shifts that fit your style.",
      img: "/images/color_story.png",
      alt: "Discover Your Story"
    },
    {
      title: "Reflect & Reimagine",
      desc: "See your personalized dashboard with clear, visual insights into your footprint and the small changes that make the biggest difference.",
      img: "/images/reflect.png",
      alt: "Reflect & Reimagine"
    },
    {
      title: "Share Your Story",
      desc: "Celebrate progress, spark conversations, and inspire others with changes that feel honest and doable.",
      img: "/images/share_story.png",
      alt: "Share Your Story"
    }
  ];

  return (
    <Layout>
      <div className={fontClass} style={defaultStyles}>
        <main className="flex flex-col items-center text-center relative bg-white">
          {/* Hero Section */}
          <div className="w-full aspect-[1536/1024] relative" style={{ backgroundImage: 'url(/images/bg_green.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
            <motion.div
              className="flex flex-col items-center justify-center min-h-[60vh] py-12 md:py-16 px-4 max-w-3xl mx-auto mt-8"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 animate-fade-in drop-shadow-lg leading-[2] whitespace-nowrap"
              >
                Small actions. Big climate impact.
              </motion.h1>
              <motion.h2
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
                className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-gray-500 mb-10 leading-[2] animate-fade-in drop-shadow"
                style={{ animationDelay: '0.2s' }}
              >
                Discover your story.
              </motion.h2>
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
                whileHover={{ scale: 1.08, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.10)' }}
                onClick={handleStartQuiz}
                className="text-white rounded-full px-8 py-3 font-bold text-lg md:text-xl shadow-lg border hover:scale-105 transition-all duration-150 mt-8"
                style={{ backgroundColor: '#5E1614', borderColor: '#5E1614' }}
              >
                Take the Quiz
              </motion.button>
            </motion.div>
            {/* Soft gradient fade at section bottom for closure */}
            <div className="absolute left-0 right-0 bottom-0 h-16 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, #F3FDF8 80%)' }} />
          </div>

          {/* Climate Communication Problem Section */}
          <section className="relative w-full py-32 md:py-48 px-4 md:px-12 lg:px-20 overflow-hidden">
            {/* Warm gradient background */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, #FEF9F3 0%, #FFF5F0 50%, #FEF3E8 100%)'
              }}
            />
            
            {/* Dotted grid pattern for behavioral science feel */}
            <div 
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage: 'radial-gradient(circle, #16626D 1px, transparent 1px)',
                backgroundSize: '32px 32px',
                backgroundPosition: '0 0, 16px 16px'
              }}
            />

            {/* Subtle depth orbs */}
            <motion.div
              className="absolute top-32 right-1/3 w-96 h-96 bg-[#16626D]/5 rounded-full blur-3xl"
              animate={{
                y: [0, -30, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute bottom-32 left-1/4 w-72 h-72 bg-[#E9839D]/8 rounded-full blur-3xl"
              animate={{
                y: [0, 30, 0],
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 14,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5
              }}
            />

            <div className="relative max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                {/* Left side: Text content - left-aligned */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="space-y-10 text-left"
                >
                  {/* Main heading - left-aligned serif */}
                  <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-gray-900 leading-[1.1] tracking-tight">
                    Climate change has a communication problem.
                  </h2>

                  {/* Short paragraph with generous spacing */}
                  <div className="pt-4 space-y-4">
                    <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-light">
                      For years, most climate messaging has sounded the same: catastrophe, deadlines, doom.It overwhelms people, and being overwhelmed shuts them down.
                    </p>
                    <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-light">
                      
                    </p>
                  </div>

                  {/* Highlight block with key quote */}
                  <div className="relative pt-8 pb-8">
                    {/* Glass-like translucent highlight background */}
                    <div 
                      className="absolute inset-0 rounded-2xl backdrop-blur-sm"
                      style={{
                        background: 'linear-gradient(135deg, rgba(22, 98, 109, 0.08) 0%, rgba(233, 131, 157, 0.08) 100%)',
                        border: '1px solid rgba(22, 98, 109, 0.15)'
                      }}
                    />
                    {/* Content */}
                    <div className="relative px-6 py-5">
                      <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900 leading-relaxed">
                        But people don't change because they're scared. They change when they see that their actions matter.
                      </p>
                      {/* Handwritten-style underline */}
                      <motion.svg
                        className="absolute bottom-2 left-6 right-6 h-1"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                      >
                        <path
                          d="M 0 0 Q 50 3 100 0 T 200 0"
                          stroke="#E9839D"
                          strokeWidth="2"
                          fill="none"
                          opacity="0.4"
                          strokeLinecap="round"
                        />
                      </motion.svg>
                    </div>
                  </div>

                  {/* Spacing divider */}
                  <div className="pt-12"></div>

                  {/* Second mini-heading with left border accent */}
                  <div className="relative pl-6 border-l-4 border-[#16626D]/30">
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold text-gray-900 leading-tight mb-6">
                      A new way to talk about climate change
                    </h3>
                    
                    {/* Text underneath in warm sans-serif */}
                    <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-light">
                      Zerrah doesn't create panic or demand perfection. Instead, we help you understand your impact by turning behavioral science into stories — your stories — so climate action feels natural and meaningful.
                    </p>
                  </div>
                </motion.div>

                {/* Right side: Illustration - transformation narrative */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                  className="relative h-[600px] md:h-[700px] lg:h-[800px] flex items-center justify-center"
                >
                  {/* Glass-like accent overlay */}
                  <div 
                    className="absolute inset-0 rounded-3xl backdrop-blur-[2px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                      border: '1px solid rgba(22, 98, 109, 0.1)'
                    }}
                  />

                  {/* Transformation illustration */}
                  <svg className="relative w-full h-full" viewBox="0 0 600 800" preserveAspectRatio="xMidYMid meet">
                    <defs>
                      <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#16626D" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#16626D" stopOpacity="0.1" />
                      </linearGradient>
                      <linearGradient id="coralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#E9839D" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#E9839D" stopOpacity="0.1" />
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Top-left: Chaotic, desaturated scribbles (fear-based messaging) */}
                    <motion.g
                      initial={{ opacity: 0.4 }}
                      animate={{ 
                        opacity: [0.4, 0.6, 0.4],
                        x: [0, -3, 0],
                        y: [0, -2, 0]
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      style={{ filter: 'grayscale(60%)' }}
                    >
                      {/* Chaotic scribbles */}
                      <path d="M80,120 Q100,100 120,130 Q140,110 160,125 Q180,105 200,140" 
                        stroke="#666" strokeWidth="2.5" fill="none" opacity="0.3" strokeLinecap="round" />
                      <path d="M60,180 Q85,160 110,200 Q135,175 160,210 Q185,190 210,220" 
                        stroke="#666" strokeWidth="2" fill="none" opacity="0.25" strokeLinecap="round" />
                      <path d="M90,250 Q110,230 130,260 Q150,240 170,270" 
                        stroke="#666" strokeWidth="2" fill="none" opacity="0.3" strokeLinecap="round" />
                      
                      {/* Jagged, disconnected shapes */}
                      <polyline points="100,150 115,140 120,160 135,150 140,170" 
                        stroke="#999" strokeWidth="1.5" fill="none" opacity="0.2" strokeLinecap="round" />
                      <polyline points="70,200 90,190 95,210 110,200 115,220" 
                        stroke="#999" strokeWidth="1.5" fill="none" opacity="0.2" strokeLinecap="round" />
                    </motion.g>

                    {/* Transformation flow - connection lines */}
                    <motion.g
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.6, 0] }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <path
                        d="M200,200 Q300,150 400,200 Q450,180 500,200"
                        stroke="url(#tealGrad)"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray="8,4"
                        opacity="0.4"
                      />
                      <path
                        d="M180,280 Q350,250 420,300"
                        stroke="url(#coralGrad)"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray="6,3"
                        opacity="0.3"
                      />
                    </motion.g>

                    {/* Right side: Warm, calm, flowing shapes (clarity & empowerment) */}
                    <motion.g
                      initial={{ opacity: 0.7 }}
                      animate={{ 
                        opacity: [0.7, 0.95, 0.7],
                        x: [0, 3, 0],
                        y: [0, -2, 0]
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5
                      }}
                    >
                      {/* Flowing curves representing understanding */}
                      <path d="M350,150 Q380,130 420,150 Q450,135 480,150 Q510,130 550,150" 
                        stroke="#16626D" strokeWidth="3" fill="none" opacity="0.5" strokeLinecap="round" filter="url(#glow)" />
                      <path d="M360,250 Q400,230 440,250 Q470,235 500,250 Q530,230 560,250" 
                        stroke="#E9839D" strokeWidth="3" fill="none" opacity="0.5" strokeLinecap="round" filter="url(#glow)" />
                      <path d="M340,350 Q370,330 400,350 Q430,335 460,350 Q490,330 520,350" 
                        stroke="#16626D" strokeWidth="2.5" fill="none" opacity="0.4" strokeLinecap="round" />

                      {/* Speech bubbles representing communication */}
                      <motion.ellipse
                        cx="420"
                        cy="200"
                        rx="35"
                        ry="25"
                        fill="#16626D"
                        opacity="0.15"
                        animate={{ 
                          scale: [1, 1.1, 1],
                          opacity: [0.15, 0.25, 0.15]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <motion.path
                        d="M405,220 L410,235 L400,230 Z"
                        fill="#16626D"
                        opacity="0.15"
                        animate={{ opacity: [0.15, 0.25, 0.15] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      />

                      <motion.ellipse
                        cx="480"
                        cy="300"
                        rx="30"
                        ry="20"
                        fill="#E9839D"
                        opacity="0.15"
                        animate={{ 
                          scale: [1, 1.15, 1],
                          opacity: [0.15, 0.25, 0.15]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                      />
                      <motion.path
                        d="M465,315 L470,330 L460,325 Z"
                        fill="#E9839D"
                        opacity="0.15"
                        animate={{ opacity: [0.15, 0.25, 0.15] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                      />

                      {/* Connected circles representing relationships and behavior */}
                      <motion.circle
                        cx="400"
                        cy="400"
                        r="20"
                        fill="#16626D"
                        opacity="0.25"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        filter="url(#glow)"
                      />
                      <motion.circle
                        cx="460"
                        cy="450"
                        r="18"
                        fill="#E9839D"
                        opacity="0.25"
                        animate={{ scale: [1, 1.25, 1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        filter="url(#glow)"
                      />
                      <motion.circle
                        cx="520"
                        cy="420"
                        r="15"
                        fill="#16626D"
                        opacity="0.2"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        filter="url(#glow)"
                      />

                      {/* Connection lines showing emotional clarity */}
                      <motion.line
                        x1="400" y1="400" x2="460" y2="450"
                        stroke="#16626D" strokeWidth="2" opacity="0.3"
                        animate={{ opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <motion.line
                        x1="460" y1="450" x2="520" y2="420"
                        stroke="#E9839D" strokeWidth="2" opacity="0.3"
                        animate={{ opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                      />
                      <motion.line
                        x1="400" y1="400" x2="520" y2="420"
                        stroke="#16626D" strokeWidth="1.5" opacity="0.2"
                        strokeDasharray="4,2"
                        animate={{ opacity: [0.2, 0.4, 0.2] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                      />
                    </motion.g>

                    {/* Gentle floating particles for depth */}
                    {[...Array(8)].map((_, i) => (
                      <motion.circle
                        key={i}
                        cx={250 + (i % 3) * 100}
                        cy={500 + (i % 2) * 80}
                        r="4"
                        fill={i % 2 === 0 ? "#16626D" : "#E9839D"}
                        opacity="0.15"
                        animate={{
                          y: [0, -20, 0],
                          opacity: [0.15, 0.3, 0.15],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{
                          duration: 4 + i * 0.3,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 0.4
                        }}
                      />
                    ))}
                  </svg>
                </motion.div>
              </div>
            </div>
          </section>

          <HowItWorksSection steps={howItWorksSteps} />

          {/* Impact at a Glance Section */}
          <section className="relative w-full max-w-screen-2xl mx-auto my-32 px-2 overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-100/20 rounded-full blur-3xl transform -translate-x-1/2" />
              <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-yellow-100/20 rounded-full blur-3xl transform translate-x-1/2" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              viewport={{ once: true }}
              className="relative"
            >
              <h2 className="text-5xl md:text-6xl font-serif font-extrabold text-center text-gray-900 mb-10 tracking-tight">Why Zerrah?</h2>
              <div className="text-2xl md:text-3xl font-medium text-gray-500 text-center mb-8 leading-relaxed">Because climate change isn't just a science problem, it's a <em>story</em> problem.</div>
              <div className="text-2xl md:text-3xl text-gray-400 text-center mb-16 max-w-5xl mx-auto italic leading-loose">We're rewriting that story in a way that creates momentum</div>
            </motion.div>

            {/* Headings row above columns */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
              viewport={{ once: true }}
              className="flex flex-row gap-12 justify-center items-center max-w-5xl mx-auto mb-8"
            >
              <div className="flex-1 flex justify-center">
                <div className="text-2xl md:text-3xl font-bold text-gray-900 text-center relative group bg-gray-100/50 px-4 py-2 rounded-lg">
                  With Zerrah
                  <motion.div 
                    className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#5E1614] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                    initial={false}
                    whileHover={{ scaleX: 1 }}
                  />
                </div>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="text-2xl md:text-3xl font-bold text-gray-400 text-center relative group">
                  Without Zerrah
                  <motion.div 
                    className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gray-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                    initial={false}
                    whileHover={{ scaleX: 1 }}
                  />
                </div>
              </div>
            </motion.div>

            <div className="flex flex-col md:flex-row gap-12 justify-center items-start max-w-5xl mx-auto mb-20">
              {/* With Zerrah */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' }}
                viewport={{ once: true }}
                className="flex-1 bg-white/80 backdrop-blur-sm rounded-3xl p-10 md:p-14 shadow-xl flex items-center justify-center relative flex-col mt-8 border border-amber-50/50 hover:shadow-2xl transition-all duration-300"
              >
                <div className="w-[450px] mx-auto">
                  <PillsColumn pills={zerrahPills} />
                </div>
              </motion.div>

              {/* Without Zerrah */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7, ease: 'easeOut' }}
                viewport={{ once: true }}
                className="flex-1 bg-white/80 backdrop-blur-sm rounded-3xl p-10 md:p-14 shadow-xl flex items-center justify-center relative flex-col mt-8 border border-gray-100/50 hover:shadow-2xl transition-all duration-300"
              >
                <div className="w-[450px] mx-auto">
                  <PillsColumn pills={withoutPills} delay={0.2} />
                </div>
              </motion.div>
            </div>

            {/* Section closure */}
            <motion.div 
              className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
              style={{ 
                background: 'linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.8))'
              }}
            />
          </section>
          
          {/* Action Spotlight & Reflections Archive Section */}
          <section className="relative w-full py-24 px-2 md:px-8 bg-[#FAFAF6]">
            <div className="max-w-[2200px] mx-auto rounded-3xl shadow-lg p-10 md:p-20 bg-white/80">
            {/* Decorative background/gradient for polish */}
            <div className="absolute inset-0 pointer-events-none -z-10">
              <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-amber-100/30 rounded-full blur-3xl -translate-x-1/2" />
              <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] bg-yellow-100/20 rounded-full blur-3xl translate-x-1/2" />
              </div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-6xl font-serif font-extrabold text-center text-gray-900 mb-10 tracking-tight">Action Spotlight</h2>
              <div className="text-2xl md:text-3xl font-medium text-gray-500 text-center mb-8 leading-relaxed">Real people. Small shifts. Lasting change.</div>
            </motion.div>
            <ActionSpotlightCards />
            {/* Section closure: soft gradient fade at bottom */}
            <motion.div 
              className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              viewport={{ once: true }}
              style={{ background: 'linear-gradient(to bottom, transparent, #f0fdf4 80%)' }}
            />
            </div>
          </section>

          {/* Reflections Archive */}
          <section className="relative w-full max-w-[2200px] mx-auto py-12 md:py-24 px-2 md:px-8 rounded-3xl shadow-lg border border-gray-100/60 mb-24 overflow-hidden bg-gradient-to-b from-white via-emerald-50 to-white">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-6xl font-serif font-extrabold text-center text-gray-900 mb-10 tracking-tight">Reflections Archive</h2>
              <div className="flex justify-center mb-12">
                <SocialRippleDiagram large />
              </div>
              <div className="text-center text-gray-500 text-2xl md:text-3xl font-semibold mb-8">Your story matters.</div>
              <div className="text-center text-[#5E1614] text-xl md:text-2xl font-bold mb-6">Ready to begin yours?</div>
              <div className="text-center mb-6">
                <h3 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">Take the Quiz</h3>
                <p className="text-lg md:text-xl text-gray-600 italic">Let's shift the story one person, one choice, one moment at a time.</p>
              </div>
            </motion.div>
            <div className="absolute left-0 right-0 bottom-0 h-24 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, #f0fdf4 80%)' }} />
          </section>
          <div className="border-t border-gray-100 my-12"></div>
          <section className="relative w-full max-w-[1800px] mx-auto py-16 md:py-24 px-2 md:px-8 rounded-3xl shadow-lg border border-gray-100/60 mb-0 pb-0 overflow-hidden bg-gradient-to-b from-white via-emerald-50 to-white">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-6xl font-serif font-extrabold text-center text-gray-900 mb-10 tracking-tight">Meet the Founders</h2>
              <div className="text-2xl md:text-3xl font-medium text-gray-500 text-center mb-8 leading-relaxed">Anza and Salma believe storytelling can turn climate worry into climate action.</div>
              <div className="text-2xl md:text-3xl text-gray-400 text-center mb-12 max-w-5xl mx-auto italic leading-loose">
                Reach out with feedback, connect on LinkedIn, or share your reflections. Your story shapes Zerrah.
              </div>
              <div className="flex flex-col md:flex-row gap-10 md:gap-20 justify-center items-center mb-10">
                {/* Founder 1 */}
                <motion.div
                  whileHover={{ scale: 1.05, boxShadow: '0 8px 32px 0 rgba(16,185,129,0.18)' }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center"
                >
                  <img src="/Personality Avatars/Builder Male.png" alt="Anza Qadir"
                    className="h-36 w-36 md:h-44 md:w-44 rounded-full border-4 border-white shadow-lg object-contain bg-white px-1 py-1.5 mb-4 transition-all duration-200" />
                  <div className="text-2xl md:text-3xl font-bold text-gray-900">Anza Qadir</div>
                  <div className="text-base md:text-lg text-gray-400 mb-2">Co-Founder</div>
                  <a href="https://www.linkedin.com/in/anza-qadir/" target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-2 text-white hover:text-white font-medium mt-2 px-4 py-2 rounded-full shadow transition-all duration-150 hover:-translate-y-0.5" style={{ backgroundColor: '#5E1614' }}>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z"/></svg>
                    LinkedIn
                  </a>
                </motion.div>
                {/* Founder 2 */}
                <motion.div
                  whileHover={{ scale: 1.05, boxShadow: '0 8px 32px 0 rgba(16,185,129,0.18)' }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center"
                >
                  <img src="/Personality Avatars/Networker Female.png" alt="Salma Zahra"
                    className="h-36 w-36 md:h-44 md:w-44 rounded-full border-4 border-white shadow-lg object-contain bg-white px-1 py-1.5 mb-4 transition-all duration-200" />
                  <div className="text-2xl md:text-3xl font-bold text-gray-900">Salma Zahra</div>
                  <div className="text-base md:text-lg text-gray-400 mb-2">Co-Founder</div>
                  <a href="https://www.linkedin.com/in/salma-zahra-05285112b/" target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-2 text-white hover:text-white font-medium mt-2 px-4 py-2 rounded-full shadow transition-all duration-150 hover:-translate-y-0.5" style={{ backgroundColor: '#5E1614' }}>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z"/></svg>
                    LinkedIn
                  </a>
                </motion.div>
              </div>
              <div className="flex justify-center mt-16">
                <button className="text-white rounded-full px-8 py-3 font-bold text-lg md:text-xl shadow-lg hover:scale-105 transition-all duration-150" style={{ backgroundColor: '#5E1614' }}>
                  Contact Us
                </button>
              </div>
            </motion.div>
            <div className="absolute left-0 right-0 bottom-0 h-24 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, #f0fdf4 80%)' }} />
          </section>
        </main>
      </div>
    </Layout>
  );
};

// --- ActionSpotlightCards component ---
const actionSpotlightData = [
  {
    gif: '/gif/reversed_bike.gif',
    title: 'Biking instead of driving',
    impact: 'Saves 8kg CO₂, like skipping 1 car ride.',
    detail: 'Biking to work just once a week can save 8kg of CO₂ emissions, improve your health, and reduce traffic congestion. Small change, big impact!',
    icon: '🚲',
    color: 'from-blue-400 to-cyan-300',
    subtext: 'Cuts ~1kg CO₂ every 3 miles — and feels great.',
    impactStat: '🚴 1 ride = 8kg CO₂ saved = 1 full day\'s electricity for a fridge',
    whyItMatters: 'Transportation is the largest contributor to carbon emissions in most cities. Even one ride a week helps shift that.',
    cta: undefined,
  },
  {
    gif: '/gif/eco_friendly_market.gif',
    title: 'Buying local & seasonal',
    impact: 'Cuts food miles—like taking 3 cars off the road for a day.',
    detail: 'Choosing local or seasonal produce means your food travels less, slashing transport emissions and supporting nearby farmers. Every fresh, local bite helps the planet and your community thrive!',
    icon: '🥕',
    color: 'from-green-400 to-emerald-300',
    subtext: 'Supports nearby farmers while shrinking transport footprints.',
    impactStat: '🧺 Buying local cuts food miles by up to 90% — that\'s less packaging, refrigeration, and transport pollution.',
    whyItMatters: 'Most produce travels over 1,500 miles before reaching you. Local food travels fewer miles and supports nearby growers.',
    cta: undefined,
  },
  {
    gif: '/gif/solar_saving.gif',
    title: 'Switching to solar',
    impact: 'Saves 500kg CO₂, like a year of LEDs.',
    detail: 'Getting a home solar estimate is a big step, but it can save 500kg of CO₂ per year and lower your energy bills.',
    icon: '☀️',
    color: 'from-yellow-400 to-orange-300',
    subtext: 'Lowers bills and emissions with one long-term shift.',
    impactStat: '☀️ One home solar setup = 500kg CO₂ saved = the equivalent of planting 12 trees every year.',
    whyItMatters: 'Solar doesn\'t just save energy — it sends a signal. It shows you\'re investing in a cleaner grid for everyone.',
    cta: undefined,
  },
];

function ActionSpotlightCards() {
  const [flipped, setFlipped] = useState([false, false, false]);
  const [hovered, setHovered] = useState<number | null>(null);
  const [heartPulse, setHeartPulse] = useState([false, false, false]);
  const [modalOpen, setModalOpen] = useState(false);
  type SpotlightCard = typeof actionSpotlightData[number];
  const [modalCard, setModalCard] = useState<SpotlightCard | null>(null);
  const modalRef = useRef(null);

  const handleFlip = (idx: number) => {
    setFlipped(f => f.map((v, i) => (i === idx ? !v : v)));
  };
  const handleHeartClick = (idx: number) => {
    setHeartPulse(p => p.map((v, i) => (i === idx ? true : v)));
    setTimeout(() => {
      setHeartPulse(p => p.map((v, i) => (i === idx ? false : v)));
    }, 400);
  };
  const handleGifClick = (card: SpotlightCard) => {
    setModalCard(card);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setModalCard(null);
  };
  useEffect(() => {
    if (!modalOpen) return;
    function onKeyDown(e: any) {
      if (e.key === 'Escape') closeModal();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [modalOpen]);

  return (
    <>
      {/* Mobile: horizontal scroll with snapping */}
      <div className="md:hidden overflow-x-auto snap-x snap-mandatory px-4">
        <div className="inline-flex gap-4">
          {actionSpotlightData.map((card, idx) => (
            <motion.div
              key={`m-${card.title}`}
              className="w-[18rem] shrink-0 snap-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              viewport={{ once: true }}
              onHoverStart={() => setHovered(idx)}
              onHoverEnd={() => setHovered(null)}
            >
              <div className="w-full flex flex-col items-center mb-6">
                <div className="text-3xl mb-2 flex justify-center">{card.icon}</div>
                <h3 className="text-xl font-extrabold text-amber-800 tracking-tight text-center">{card.title}</h3>
                {card.subtext && (
                  <div className="text-sm text-gray-600 font-medium mt-1 text-center">{card.subtext}</div>
                )}
              </div>
              <motion.div
                className={`relative bg-white rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 aspect-[4/5] h-[clamp(20rem,55vw,37.5rem)]`}
                onClick={() => handleGifClick(card)}
                whileHover={{ y: -2 }}
              >
                <motion.img
                  src={card.gif}
                  alt={card.title}
                  className="w-full h-full object-cover transition-all duration-300"
                  whileHover={flipped[idx] ? {} : { scale: 1.02 }}
                  whileTap={flipped[idx] ? {} : { scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                />
                <div className="absolute inset-0 bg-white/10 pointer-events-none rounded-3xl" />
                <motion.div 
                  className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-2 cursor-pointer"
                  animate={heartPulse[idx] ? { scale: [1, 1.3, 1], color: ['#10b981', '#f43f5e', '#10b981'] } : { scale: 1 }}
                  transition={{ duration: 0.4 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e: React.MouseEvent<HTMLDivElement>) => { e.stopPropagation(); handleHeartClick(idx); }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Desktop/Tablet: fluid auto-fit grid */}
      <div className="hidden md:grid [grid-template-columns:repeat(auto-fit,minmax(18rem,1fr))] gap-x-8 gap-y-12 px-4 font-['Inter']">
        {actionSpotlightData.map((card, idx) => (
          <motion.div
            key={card.title}
            className="group relative cursor-pointer mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            viewport={{ once: true }}
            onHoverStart={() => setHovered(idx)}
            onHoverEnd={() => setHovered(null)}
          >
            <div className="w-full flex flex-col items-center mb-8">
              <div className="text-4xl mb-2 flex justify-center">{card.icon}</div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-amber-800 tracking-tight text-center">{card.title}</h3>
              {card.subtext && (
                <div className="text-base md:text-lg text-gray-600 font-medium mt-2 text-center">{card.subtext}</div>
              )}
            </div>
            <div className="mb-8" />
            <motion.div
              className={`relative bg-white rounded-[2.5rem] overflow-hidden cursor-pointer transition-all duration-500 aspect-[4/5] md:aspect-[3/4] h-[clamp(20rem,55vw,37.5rem)]`}
              onClick={() => handleGifClick(card)}
              whileHover={{ y: -4 }}
            >
              <motion.img
                src={card.gif}
                alt={card.title}
                className="w-full h-full object-cover transition-all duration-300"
                whileHover={flipped[idx] ? {} : { scale: 1.02 }}
                whileTap={flipped[idx] ? {} : { scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              />
              <div className="absolute inset-0 bg-white/10 pointer-events-none rounded-[2.5rem]" />
              <motion.div 
                className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-2 cursor-pointer"
                animate={heartPulse[idx] ? { scale: [1, 1.3, 1], color: ['#10b981', '#f43f5e', '#10b981'] } : { scale: 1 }}
                transition={{ duration: 0.4 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e: React.MouseEvent<HTMLDivElement>) => { e.stopPropagation(); handleHeartClick(idx); }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </motion.div>
            </motion.div>
          </motion.div>
        ))}
      </div>
      {/* Modal overlay for impact content */}
      {modalOpen && modalCard && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={closeModal}
        >
          <motion.div
            ref={modalRef}
            className="bg-white rounded-3xl shadow-2xl max-w-xl w-full mx-4 overflow-hidden flex flex-col"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
            tabIndex={-1}
          >
            {/* Hero image with floating icon and close button */}
            <div className="relative w-full h-64 md:h-80 bg-gray-100">
              <img src={modalCard.gif} alt={modalCard.title} className="w-full h-full object-cover rounded-t-3xl" />
              <span className="absolute top-4 left-4 text-4xl bg-white/80 rounded-full p-2 shadow">{modalCard.icon}</span>
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-amber-600 text-3xl font-bold focus:outline-none"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); closeModal(); }}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
            {/* Content block */}
            <div className="bg-white/95 p-8 flex flex-col gap-6">
              <div className="text-amber-600 text-lg font-semibold uppercase tracking-wide">Real people. Small shifts. Lasting change.</div>
              <div className="text-2xl md:text-3xl font-extrabold text-amber-800">{modalCard.title}</div>
              {modalCard.impactStat && (
                <div className="text-lg md:text-xl font-semibold text-amber-700">{modalCard.impactStat}</div>
              )}
              {modalCard.whyItMatters && (
                <div className="italic text-gray-700">{modalCard.whyItMatters}</div>
              )}
              {modalCard.cta && (
                <div className="bg-amber-100 text-amber-800 font-bold rounded-full px-6 py-3 text-center">{modalCard.cta}</div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

function SocialRippleDiagram({ large = false }: { large?: boolean }): React.ReactNode {
  const icons = [
    { icon: <FaInstagram className="text-pink-500 w-14 h-14" />, style: "top-2 left-2" },
    { icon: <FaFacebook className="text-blue-600 w-14 h-14" />, style: "bottom-4 right-8" },
    { icon: <FaTiktok className="text-black w-14 h-14" />, style: "bottom-2 left-8" },
    { icon: <FaSlack className="text-[#611f69] w-14 h-14" />, style: "top-4 right-8" },
  ];
  const avatars = [
    { src: "/Personality Avatars/Builder Female.png", style: "top-8 left-1/2 -translate-x-1/2" },
    { src: "/Personality Avatars/Catalyst Male.png", style: "left-8 top-1/2 -translate-y-1/2" },
    { src: "/Personality Avatars/Networker Female.png", style: "bottom-8 left-1/2 -translate-x-1/2" },
    { src: "/Personality Avatars/Seed Male.png", style: "right-8 top-1/2 -translate-y-1/2" },
  ];
  return (
    <div className={`relative ${large ? 'w-[650px] h-[650px]' : 'w-[400px] h-[400px]'} mx-auto bg-gradient-to-br from-emerald-50 to-white rounded-3xl shadow-lg mb-12 font-['Inter']`}>
      {/* Central personality image */}
      <motion.img
        src="/profile.jpg"
        alt="Personality"
        className="absolute left-1/2 top-1/2 w-24 h-24 rounded-full object-contain border-4 border-white shadow-xl z-10 -translate-x-1/2 -translate-y-1/2 px-1 py-1.5 bg-white"
        whileHover={{ scale: 1.08 }}
      />
      {/* Social icons */}
      {icons.map((item, i) => (
        <motion.div
          key={i}
          className={`absolute w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-lg ${item.style}`}
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
          className={`absolute w-16 h-16 rounded-full object-contain border-2 border-white shadow px-1 py-1.5 bg-white ${item.style}`}
          initial={{ scale: 0.9, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1, y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
    </div>
  );
}

const zerrahPills = [
  { text: "Curiosity", color: "bg-[#D33B48] text-white", rotate: -8 },
  { text: "Compassion", color: "bg-[#FB864A] text-white", rotate: 6 },
  { text: "Story", color: "bg-[#FEDF88] text-[#D33B48]", rotate: -4 },
  { text: "Clarity", color: "bg-[#EBF68D] text-[#D33B48]", rotate: 8 },
  { text: "Momentum", color: "bg-[#9BD290] text-[#D33B48]", rotate: -6 },
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
    <div className="flex flex-col items-center justify-center h-[420px] font-['Inter']">
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
