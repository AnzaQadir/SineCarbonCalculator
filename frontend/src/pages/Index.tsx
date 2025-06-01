import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import Calculator from '@/components/Calculator';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LeafyGreen, Droplets, Wind, Trees, FileText, BarChart4, Map, Users, CheckCircle, Smile, Heart, Check, Globe, Hexagon, Star, Zap, Share2, PauseCircle, Medal, Lightbulb, Leaf, Sun, Recycle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';

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
      desc: "Answer quick, vibes-based questions about daily habits.",
      img: "/images/image.png",
      alt: "Take the Quiz"
    },
    {
      title: "Discover Your Story",
      desc: "Uncover your unique eco-persona and what makes you shine.",
      img: "/images/color_story.png",
      alt: "Discover Your Story"
    },
    {
      title: "Reflect & Reimagine",
      desc: "See gentle, clear tips for making a bigger impact.",
      img: "/images/reflect.png",
      alt: "Reflect & Reimagine"
    }
  ];

  useEffect(() => {
    if (!contactOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Backspace') setContactOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [contactOpen]);

  // --- Minimalist Hero Section ---
  return (
    <Layout>
      <main className="flex flex-col items-center justify-center flex-1 text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-5xl md:text-7xl font-extrabold mt-40 mb-8 leading-tight"
          style={{ fontFamily: 'Inter, Arial, sans-serif' }}
        >
          Small actions. Big climate impact.
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
          className="text-2xl md:text-4xl font-bold text-gray-400 mb-12 leading-snug"
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
          className="bg-black text-white rounded-full px-6 py-2 font-semibold text-base shadow hover:bg-gray-800 transition"
        >
          Take the Quiz
        </motion.button>
      </main>

      {/* How It Works Section */}
      <section className="w-full max-w-full mx-auto my-24 px-8 md:px-16 bg-white rounded-3xl shadow-sm min-h-[600px] py-24">
        <div className="flex flex-col items-center mb-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 tracking-tight mb-8">How It Works</h2>
        </div>
        <div className="mx-auto max-w-3xl my-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Row 1: Text left, Image right */}
            <motion.div
              className="flex flex-col justify-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              custom={0}
              variants={cardVariants}
            >
              <h3 className="text-2xl font-extrabold mb-1">Take the Quiz</h3>
              <p className="text-gray-400 text-lg">Answer quick, vibes-based questions about daily habits.</p>
            </motion.div>
            <motion.div
              className="flex items-center justify-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              custom={1}
              variants={cardVariants}
            >
              <div className="h-80 w-80 bg-gray-50 rounded-2xl shadow flex items-center justify-center">
                <img src="/images/image.png" alt="Take the Quiz" className="h-64 w-64 object-contain" />
              </div>
            </motion.div>
            {/* Row 2: Image left, Text right */}
            <motion.div
              className="flex items-center justify-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              custom={2}
              variants={cardVariants}
            >
              <div className="h-80 w-80 bg-gray-50 rounded-2xl shadow flex items-center justify-center">
                <img src="/images/color_story.png" alt="Discover Your Story" className="h-64 w-64 object-contain" />
              </div>
            </motion.div>
            <motion.div
              className="flex flex-col justify-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              custom={3}
              variants={cardVariants}
            >
              <h3 className="text-2xl font-extrabold mb-2">Discover Your Story</h3>
              <p className="text-gray-400 text-lg">Uncover your unique eco-persona and what makes you shine.</p>
            </motion.div>
          </div>
          {/* Row 3: Text left, Image right */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
            <motion.div
              className="flex flex-col justify-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              custom={4}
              variants={cardVariants}
            >
              <h3 className="text-2xl font-extrabold mb-2">Reflect & Reimagine</h3>
              <p className="text-gray-400 text-lg">See gentle, clear tips for making a bigger impact.</p>
            </motion.div>
            <motion.div
              className="flex items-center justify-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              custom={5}
              variants={cardVariants}
            >
              <div className="h-80 w-80 bg-gray-50 rounded-2xl shadow flex items-center justify-center">
                <img src="/images/reflect.png" alt="Reflect & Reimagine" className="h-64 w-64 object-contain" />
            </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Impact at a Glance Section */}
      <section className="relative w-full max-w-7xl mx-auto my-24 px-8 md:px-16">
        {/* Animated SVG background */}
        <svg className="absolute left-0 right-0 top-0 mx-auto z-0" width="100%" height="220" viewBox="0 0 1200 220" fill="none" style={{ pointerEvents: 'none' }}>
          <ellipse cx="600" cy="110" rx="550" ry="80" fill="url(#impactGradient)" opacity="0.12" />
          <defs>
            <linearGradient id="impactGradient" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6ee7b7" />
              <stop offset="1" stopColor="#38bdf8" />
            </linearGradient>
          </defs>
        </svg>
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 relative z-10">Your Impact at a Glance</h2>
        <div className="text-center text-lg text-gray-500 mb-10 max-w-2xl mx-auto relative z-10">See the values that shape your climate journey and your unique impact so far.</div>
        {/* Value Ribbon */}
        <motion.div
          className="flex flex-wrap justify-center gap-6 mb-16 relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
        >
          {[
            { icon: Zap, label: 'Reflective', desc: 'You pause and consider your impact.' },
            { icon: Star, label: 'Guilt-Free', desc: 'No shame, just positive steps.' },
            { icon: Hexagon, label: 'Story-Driven', desc: 'Your journey is a story.' },
            { icon: Smile, label: 'Calm Mood', desc: 'A gentle, welcoming vibe.' },
            { icon: PauseCircle, label: 'Own Pace', desc: 'Go at your speed—no pressure.' },
          ].map((v, i) => (
            <motion.div
              key={v.label}
              className="flex flex-col items-center bg-white/70 backdrop-blur-lg rounded-2xl px-8 py-6 shadow-md border border-blue-100 hover:shadow-xl transition group cursor-pointer relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: 'easeOut' }}
              viewport={{ once: false, amount: 0.3 }}
              title={v.desc}
              whileHover={{ scale: 1.07, boxShadow: '0 8px 32px 0 rgba(16,185,129,0.10)' }}
            >
              <v.icon className="h-8 w-8 mb-2 text-emerald-500 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-lg md:text-xl text-gray-900">{v.label}</span>
              {/* Tooltip (simple) */}
              <span className="absolute left-1/2 -bottom-2 -translate-x-1/2 mt-2 px-3 py-1 rounded bg-emerald-700 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20 whitespace-nowrap shadow-lg">{v.desc}</span>
            </motion.div>
          ))}
        </motion.div>
        {/* Animated numbers for impact card */}
        <div className="mx-auto max-w-xl bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-blue-100 p-10 flex items-center gap-8 relative z-10" style={{ boxShadow: '0 8px 40px 0 rgba(16,185,129,0.10)' }}>
          <img src="/images/color_story.png" alt="Impact Illustration" className="h-24 w-24 object-contain rounded-xl shadow" />
          <div className="text-left">
            <p className="text-xl md:text-2xl text-gray-700 font-semibold mb-2">Your unique impact so far:</p>
            <p className="text-lg text-gray-500">You've already saved <span className="text-emerald-700 font-bold">82kg CO₂</span>, conserved <span className="text-blue-700 font-bold">34L water</span>, and reduced <span className="text-green-700 font-bold">7kg waste</span>. Every step you take makes a real difference—keep going!</p>
          </div>
        </div>
      </section>
      
      {/* Action Spotlight & Reflections Archive Section */}
      <section className="w-full max-w-7xl mx-auto my-24 px-8 md:px-16">
        {/* Action Spotlight */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-10">Action Spotlight</h2>
        <h3 className="text-2xl md:text-3xl font-bold text-gray-400 text-center mb-8 leading-relaxed">Impact made simple</h3>
        <div className="flex justify-center mb-12">
          <div className="bg-white/80 backdrop-blur px-6 py-3 rounded-full shadow text-lg text-emerald-700 font-medium">
            Skipping meat once a week saves water and reduces your footprint.
          </div>
        </div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
        >
          {spotlightCards.map((card, i) => (
            <motion.div
              key={card.title}
              className={`bg-white/80 backdrop-blur rounded-3xl p-8 shadow-xl border-l-4 ${card.border} flex flex-col justify-between min-h-[200px] transition-all hover:scale-105 hover:shadow-2xl`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12, duration: 0.7, ease: 'easeOut' }}
              viewport={{ once: false, amount: 0.3 }}
            >
              <div className="text-gray-700 text-lg font-medium leading-relaxed mb-6">{card.title}</div>
              <div className="flex items-center gap-3 mt-auto">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${card.effort === 'Low Effort' ? 'bg-emerald-100 text-emerald-700' : card.effort === 'Medium Effort' ? 'bg-yellow-100 text-yellow-700' : 'bg-pink-100 text-pink-700'}`}>{card.effort}</span>
                <span className="text-gray-400 text-sm">{card.sub}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
        {/* Reflections Archive */}
        <section className="w-full max-w-7xl mx-auto my-24 px-8 md:px-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-10">Reflections Archive</h2>
          <div className="text-xl md:text-2xl text-gray-500 text-center leading-relaxed mb-8">
            Discover journeys, share your story, and see the ripple effect of climate action in our community.
          </div>
          <div className="text-base text-gray-400 text-center mb-8 max-w-2xl mx-auto">
            Browse real eco-persona reflections, filter by topic or region, and inspire others with your unique perspective.
          </div>
          <div className="flex justify-center mb-12">
            <svg width="400" height="200" viewBox="0 0 400 200" fill="none" className="mx-auto" style={{ filter: 'drop-shadow(0 4px 24px rgba(16,185,129,0.10))' }}>
              <defs>
                <radialGradient id="rippleGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.2" />
                </radialGradient>
              </defs>
              {/* Ripples */}
              <ellipse cx="200" cy="100" rx="160" ry="60" stroke="url(#rippleGradient)" strokeWidth="3" opacity="0.25" />
              <ellipse cx="200" cy="100" rx="110" ry="40" stroke="url(#rippleGradient)" strokeWidth="3" opacity="0.5" />
              <ellipse cx="200" cy="100" rx="60" ry="22" stroke="#10b981" strokeWidth="3" opacity="0.8" />
              {/* Central circle */}
              <circle cx="200" cy="100" r="24" fill="#fff" stroke="#10b981" strokeWidth="5" />
              <circle cx="200" cy="100" r="32" fill="none" stroke="#6ee7b7" strokeWidth="2" opacity="0.5">
                <animate attributeName="r" values="32;50;32" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
              </circle>
              <text x="200" y="107" textAnchor="middle" fontSize="20" fill="#10b981" fontWeight="bold" fontFamily="Inter, Arial, sans-serif">You</text>
              <text x="200" y="170" textAnchor="middle" fontSize="28" fill="#94a3b8" fontWeight="bold" fontFamily="Inter, Arial, sans-serif" opacity="0.8">Community</text>
            </svg>
          </div>
          <div className="text-center text-gray-500 text-lg mb-8">Your story creates ripples.</div>
          <div className="flex justify-center">
            <button className="bg-emerald-600 text-white rounded-full px-6 py-2 font-bold shadow hover:bg-emerald-700 transition text-base md:text-lg">
              Share Your Story
            </button>
          </div>
        </section>
        <div className="border-t border-gray-100 my-8"></div>
        <section className="w-full max-w-7xl mx-auto mb-0 px-8 md:px-16">
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
      <section className="w-full max-w-7xl mx-auto mt-0 mb-24 px-8 md:px-16 flex flex-col items-center justify-center">
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

export default Index;
