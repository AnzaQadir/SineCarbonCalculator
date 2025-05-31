import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import Calculator from '@/components/Calculator';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LeafyGreen, Droplets, Wind, Trees, FileText, BarChart4, Map, Users, CheckCircle, Smile, Heart, Check, Globe, Hexagon, Star, Zap, Share2, PauseCircle, Medal, Lightbulb, Leaf } from 'lucide-react';
import { useCalculator } from '@/hooks/useCalculator';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

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
      <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-2">Contact Us</h2>
      <h3 className="text-xl md:text-2xl font-bold text-gray-400 text-center mb-8">We'd love to hear from you.</h3>
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
  const { state, updateCalculator } = useCalculator();
  const [currentStep, setCurrentStep] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const isQuizRoute = location.pathname === '/quiz';

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

  if (isQuizRoute) {
  return (
    <Layout>
      <section className="py-20 bg-white">
        <div className="container px-4">
          <div className="mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Carbon Footprint Calculator
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Complete all sections to get an accurate estimate of your annual carbon footprint.
                We'll show you how your lifestyle impacts the environment and suggest personalized ways to reduce your carbon emissions.
              </p>
            </div>
            
            <Calculator 
                state={{
                  ...state,
                  householdSize: state.householdSize.toString(),
                  electricityKwh: state.electricityKwh.toString(),
                  naturalGasTherm: state.naturalGasTherm.toString(),
                  heatingOilGallons: state.heatingOilGallons.toString(),
                  propaneGallons: state.propaneGallons.toString(),
                  annualMileage: state.annualMileage.toString(),
                  costPerMile: state.costPerMile.toString(),
                  plantBasedMealsPerWeek: state.plantBasedMealsPerWeek.toString(),
                }}
                onUpdate={(updates) => {
                  const processedUpdates = {
                    ...updates,
                    householdSize: updates.householdSize ? Number(updates.householdSize) : state.householdSize,
                    electricityKwh: updates.electricityKwh ? Number(updates.electricityKwh) : state.electricityKwh,
                    naturalGasTherm: updates.naturalGasTherm ? Number(updates.naturalGasTherm) : state.naturalGasTherm,
                    heatingOilGallons: updates.heatingOilGallons ? Number(updates.heatingOilGallons) : state.heatingOilGallons,
                    propaneGallons: updates.propaneGallons ? Number(updates.propaneGallons) : state.propaneGallons,
                    annualMileage: updates.annualMileage ? Number(updates.annualMileage) : state.annualMileage,
                    costPerMile: updates.costPerMile ? Number(updates.costPerMile) : state.costPerMile,
                    plantBasedMealsPerWeek: updates.plantBasedMealsPerWeek ? Number(updates.plantBasedMealsPerWeek) : state.plantBasedMealsPerWeek,
                  };
                  updateCalculator(processedUpdates);
                }}
              onCalculate={handleCalculate}
              onBack={handleBack}
              onNext={handleNext}
              onStepChange={handleStepChange}
              currentStep={currentStep}
            />
          </div>
        </div>
        </section>
      </Layout>
    );
  }

  // --- Minimalist Hero Section ---
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Custom Header */}
      <header className="w-full bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-6">
          {/* Side-by-side layout (default) */}
          <div className="flex items-center pl-8 mr-6">
            <div className="flex items-center justify-center">
              <img
                src="/images/zerrah_logo_globe_bolder_5120px.png"
                alt="Zerrah - Sustainability Platform"
                className="h-32 w-auto drop-shadow-lg"
                style={{ minWidth: 128 }}
              />
            </div>
            <span
              className="font-serif font-semibold text-6xl tracking-wide ml-1 flex items-center"
              style={{ color: '#007C78', fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, lineHeight: 1, height: '128px' }}
            >
              Zerrah
            </span>
          </div>
          {/*
          // Stacked layout (uncomment to use)
          <div className="flex flex-col items-center py-2">
            <img
              src="/images/logo_without_bg.png"
              alt="Zerrah Logo"
              className="h-12 w-12 rounded-full shadow-md mb-2"
            />
            <span className="font-extrabold text-3xl md:text-4xl text-gray-900 tracking-tight">
              Zerrah
            </span>
          </div>
          */}
          <nav className="flex items-center space-x-8">
            <a href="/" className="text-gray-600 hover:text-emerald-600 font-medium text-base md:text-lg transition">Home</a>
            <a href="/quiz" className="text-gray-600 hover:text-emerald-600 font-medium text-base md:text-lg transition">Quiz</a>
            <a href="/reflections" className="text-gray-600 hover:text-emerald-600 font-medium text-base md:text-lg transition">Reflections</a>
          </nav>
          <Link to="/signup" className="ml-8 bg-emerald-600 text-white rounded-full px-6 py-2 font-bold shadow hover:bg-emerald-700 transition text-base md:text-lg">Get Started</Link>
        </div>
      </header>

      {/* Hero Content */}
      <main className="flex flex-col items-center justify-center flex-1 text-center px-4">
        <h1 className="text-3xl md:text-5xl font-extrabold mt-24 mb-4" style={{ fontFamily: 'Inter, Arial, sans-serif' }}>
          Small actions. Big climate impact.
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-400 mb-8" style={{ fontFamily: 'Inter, Arial, sans-serif' }}>
          Discover your eco-story in 3 minutes.
        </h2>
        <button
          onClick={handleStartQuiz}
          className="bg-black text-white rounded-full px-6 py-2 font-semibold text-base shadow hover:bg-gray-800 transition"
        >
          Take the Quiz
        </button>
      </main>

      {/* How It Works Section */}
      <section className="w-full max-w-5xl mx-auto mt-24 mb-12 px-4 bg-white rounded-3xl shadow-sm py-16">
        <div className="flex flex-col items-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 tracking-tight mb-8">How It Works</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Top-left: Step 1 text */}
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl font-extrabold mb-2">Take the Quiz</h3>
            <p className="text-gray-400 text-lg">Answer quick, vibes-based questions about daily habits.</p>
          </div>
          {/* Top-right: Visual block with image */}
          <div className="flex items-center justify-center">
            <div className="h-48 w-48 bg-gray-50 rounded-2xl shadow flex items-center justify-center">
              <img src="/images/image.png" alt="Take the Quiz" className="h-32 w-32 object-contain" />
            </div>
          </div>
          {/* Bottom-left: Visual block with Story image */}
          <div className="flex items-center justify-center">
            <div className="h-48 w-48 bg-gray-50 rounded-2xl shadow flex items-center justify-center">
              <img src="/images/color_story.png" alt="Discover Your Story" className="h-32 w-32 object-contain" />
            </div>
          </div>
          {/* Bottom-right: Step 2 text */}
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl font-extrabold mb-2">Discover Your Story</h3>
            <p className="text-gray-400 text-lg">Uncover your unique eco-persona and what makes you shine.</p>
          </div>
        </div>
        {/* Step 3: Reflect & Reimagine (below grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl font-extrabold mb-2">Reflect & Reimagine</h3>
            <p className="text-gray-400 text-lg">See gentle, clear tips for making a bigger impact.</p>
          </div>
          <div className="flex items-center justify-center">
            <div className="h-48 w-48 bg-gray-50 rounded-2xl shadow flex items-center justify-center">
              <img src="/images/reflect.png" alt="Reflect & Reimagine" className="h-32 w-32 object-contain" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Impact at a Glance Section */}
      <section className="w-full max-w-5xl mx-auto my-16 px-4">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-8">Your Impact at a Glance</h2>
        <div className="border-2 border-blue-200 rounded-xl overflow-hidden mb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 bg-white divide-x divide-blue-100">
            <div className="flex flex-col items-center py-8">
              <Zap className="h-8 w-8 text-gray-400 mb-2" />
              <span className="font-bold">Reflective</span>
            </div>
            <div className="flex flex-col items-center py-8">
              <Star className="h-8 w-8 text-gray-400 mb-2" />
              <span className="font-bold">Guilt-Free</span>
            </div>
            <div className="flex flex-col items-center py-8">
              <Hexagon className="h-8 w-8 text-pink-400 mb-2" />
              <span className="font-bold">Story-Driven</span>
            </div>
            <div className="flex flex-col items-center py-8">
              <Globe className="h-8 w-8 text-gray-400 mb-2" />
              <span className="font-bold">For Now</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 bg-blue-50 divide-x divide-blue-100 border-t border-blue-100">
            <div className="flex flex-col items-center py-8">
              <Smile className="h-8 w-8 text-blue-300 mb-2" />
              <span className="font-bold">Calm Mood</span>
                </div>
            <div className="flex flex-col items-center py-8">
              <Heart className="h-8 w-8 text-blue-300 mb-2" />
              <span className="font-bold">Gentle Icons</span>
                </div>
            <div className="flex flex-col items-center py-8">
              <Share2 className="h-8 w-8 text-blue-300 mb-2" />
              <span className="font-bold">Share Ripple</span>
                </div>
            <div className="flex flex-col items-center py-8">
              <PauseCircle className="h-8 w-8 text-blue-300 mb-2" />
              <span className="font-bold">Own Pace</span>
                </div>
          </div>
        </div>
        <div className="max-w-2xl mx-auto">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-3 text-gray-500">CO₂ Saved</td>
                <td className="py-3 text-right font-semibold">82kg</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 text-gray-500">Water Used</td>
                <td className="py-3 text-right font-semibold">34L</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 text-gray-500">Waste Reduced</td>
                <td className="py-3 text-right font-semibold">7kg</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 text-gray-500">Light/Dark Mode</td>
                <td className="py-3 text-right text-gray-400">Toggle</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 text-gray-500">Compare Impact</td>
                <td className="py-3 text-right text-gray-400">vs Average</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-500">Your Impact</td>
                <td className="py-3 text-right text-gray-400">Unique</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      
      {/* Action Spotlight & Reflections Archive Section */}
      <section className="w-full max-w-5xl mx-auto my-24 px-4">
        {/* Action Spotlight */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold mb-1">Action Spotlight</h2>
          <h3 className="text-2xl font-bold text-gray-400">Impact made simple</h3>
        </div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
          initial="hidden"
          animate="visible"
          variants={{}}
        >
          {spotlightCards.map((card, i) => (
            <Tooltip key={card.title}>
              <TooltipTrigger asChild>
                <motion.div
                  className={`bg-gray-100 rounded-2xl p-6 flex flex-col justify-between min-h-[180px] cursor-pointer ${card.border}`}
                  variants={cardMotion}
                  custom={i}
                  whileHover="hover"
                  initial="hidden"
                  animate="visible"
                  onClick={() => alert(`Learn more about: ${card.effort}`)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Learn more about ${card.effort}`}
                >
                  <div className="text-gray-700 mb-8">{card.title}</div>
                  <div>
                    <span className="font-bold">{card.effort}</span>
                    <span className="block text-gray-400 text-sm">{card.sub}</span>
                  </div>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-base">
                {card.tooltip}
              </TooltipContent>
            </Tooltip>
          ))}
        </motion.div>
        {/* Reflections Archive */}
        <section className="py-16 max-w-3xl mx-auto bg-white">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 tracking-tight mb-6">Reflections Archive</h2>
          <div className="text-center">
            <p className="text-gray-600 mb-6 max-w-xl mx-auto tracking-normal">
              Browse user stories, discover journeys, and get inspired by eco-persona reflections from our global community.
            </p>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto tracking-normal">
              Filter by persona, topic, and region to see climate reflections relevant to you. Real voices drive real change.
            </p>
            <p className="text-gray-600 mb-10 max-w-xl mx-auto tracking-normal">
              Share your eco-story to inspire others—each ripple builds a brighter world.
            </p>
            <div className="flex justify-center">
              <div className="relative flex flex-col items-center">
                <svg width="80" height="40" viewBox="0 0 60 32" fill="none" className="text-gray-300 mx-auto">
                  <path d="M2 30c10-10 15-28 25-28s15 18 25 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-16 h-4 bg-gradient-to-t from-gray-200/40 to-transparent rounded-full blur-sm"></div>
              </div>
            </div>
          </div>
        </section>
        <div className="border-t border-gray-100 my-8"></div>
        {/* Ripple Effect Diagram */}
        <div className="flex flex-col items-center my-12">
          <svg viewBox="0 0 400 220" width="340" height="180" className="max-w-full" fill="none">
            {/* Outer faded ring */}
            <ellipse cx="200" cy="110" rx="170" ry="80" fill="none" stroke="#e5e7eb" strokeWidth="2" opacity="0.7" />
            {/* Second ripple */}
            <ellipse cx="200" cy="110" rx="120" ry="55" fill="none" stroke="#e5e7eb" strokeWidth="2" opacity="0.9" />
            {/* First ripple */}
            <ellipse cx="200" cy="110" rx="70" ry="30" fill="none" stroke="#6ee7b7" strokeWidth="2" opacity="1" />
            {/* Central circle */}
            <circle cx="200" cy="110" r="22" fill="#fff" stroke="#10b981" strokeWidth="3" />
            <text x="200" y="115" textAnchor="middle" fontSize="15" fill="#059669" fontWeight="bold">You</text>
            {/* First ripple: 3 circles */}
            <circle cx="200" cy="60" r="14" fill="#fff" stroke="#a7f3d0" strokeWidth="2" />
            <circle cx="160" cy="130" r="14" fill="#fff" stroke="#a7f3d0" strokeWidth="2" />
            <circle cx="240" cy="130" r="14" fill="#fff" stroke="#a7f3d0" strokeWidth="2" />
            <text x="200" y="50" textAnchor="middle" fontSize="12" fill="#10b981">Inspire</text>
            {/* Lines from center to first ripple */}
            <line x1="200" y1="110" x2="200" y2="74" stroke="#d1d5db" strokeWidth="1.5" />
            <line x1="200" y1="110" x2="170" y2="124" stroke="#d1d5db" strokeWidth="1.5" />
            <line x1="200" y1="110" x2="230" y2="124" stroke="#d1d5db" strokeWidth="1.5" />
            {/* Second ripple: 5 circles */}
            <circle cx="200" cy="30" r="10" fill="#fff" stroke="#a7f3d0" strokeWidth="1.5" />
            <circle cx="130" cy="110" r="10" fill="#fff" stroke="#a7f3d0" strokeWidth="1.5" />
            <circle cx="270" cy="110" r="10" fill="#fff" stroke="#a7f3d0" strokeWidth="1.5" />
            <circle cx="170" cy="170" r="10" fill="#fff" stroke="#a7f3d0" strokeWidth="1.5" />
            <circle cx="230" cy="170" r="10" fill="#fff" stroke="#a7f3d0" strokeWidth="1.5" />
            {/* Lines from first ripple to second ripple */}
            <line x1="200" y1="60" x2="200" y2="40" stroke="#d1d5db" strokeWidth="1" />
            <line x1="200" y1="60" x2="130" y2="110" stroke="#d1d5db" strokeWidth="1" />
            <line x1="200" y1="60" x2="270" y2="110" stroke="#d1d5db" strokeWidth="1" />
            <line x1="160" y1="130" x2="170" y2="170" stroke="#d1d5db" strokeWidth="1" />
            <line x1="160" y1="130" x2="130" y2="110" stroke="#d1d5db" strokeWidth="1" />
            <line x1="160" y1="130" x2="200" y2="40" stroke="#d1d5db" strokeWidth="1" />
            <line x1="240" y1="130" x2="230" y2="170" stroke="#d1d5db" strokeWidth="1" />
            <line x1="240" y1="130" x2="270" y2="110" stroke="#d1d5db" strokeWidth="1" />
            <line x1="240" y1="130" x2="200" y2="40" stroke="#d1d5db" strokeWidth="1" />
            {/* Outer ring label */}
            <text x="200" y="200" textAnchor="middle" fontSize="14" fill="#9ca3af" fontWeight="bold" opacity="0.8">Community</text>
          </svg>
          <div className="mt-6 text-center text-gray-500 text-base max-w-lg mx-auto tracking-normal">
            Your story creates ripples.
          </div>
                </div>
        <div className="border-t border-gray-100 my-8"></div>
        <section className="py-16 max-w-3xl mx-auto bg-white">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 tracking-tight mb-6">Meet the Founders</h2>
          <div className="text-center">
            <p className="text-gray-600 mb-6 max-w-xl mx-auto tracking-normal">
              Anza Qadir and Salma believe storytelling can turn climate worry into climate action. Each brings a love for gentle design, clear guidance, and true inclusivity.
            </p>
            <p className="text-gray-600 max-w-2xl mx-auto tracking-normal">
              Reach out with feedback, connect on LinkedIn, or<br />
              share your reflections. Your story shapes Zerrah.
            </p>
                </div>
        </section>
        {/* Founders Profile Photos */}
        <div className="flex flex-col items-center mt-10 mb-20">
          <div className="flex flex-row gap-12 justify-center">
            {/* Anza */}
            <div className="flex flex-col items-center">
              <img src="/profile.jpg" alt="Anza Qadir" className="h-28 w-28 rounded-full border-4 border-white shadow-md object-cover" />
              <div className="mt-4 text-lg font-bold text-gray-900">Anza Qadir</div>
              <div className="text-sm text-gray-400">Co-Founder</div>
                </div>
            {/* Salma */}
            <div className="flex flex-col items-center">
              <img src="/images/Sustainability-Soft-Launch-Girl.png" alt="Salma" className="h-28 w-28 rounded-full border-4 border-white shadow-md object-cover" />
              <div className="mt-4 text-lg font-bold text-gray-900">Salma</div>
              <div className="text-sm text-gray-400">Co-Founder</div>
                </div>
          </div>
        </div>
      </section>

      {/* Meet the Founders & Contact Us Section */}
      <section className="w-full max-w-5xl mx-auto mt-24 px-4">
        {/* Contact Us */}
        <ContactForm />
      </section>

      <footer className="w-full border-t border-gray-100 py-12 bg-white mt-24">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start justify-between px-4">
          <div className="mb-8 md:mb-0">
            <img src="/images/logo.png" alt="Zerrah Logo" className="h-6 w-auto opacity-30 grayscale" />
          </div>
          <div className="flex flex-row gap-16">
            <div>
              <h4 className="font-semibold mb-2">Navigation</h4>
              <ul className="space-y-1 text-gray-400">
                <li><a href="/" className="hover:text-black transition">Home</a></li>
                <li><a href="/quiz" className="hover:text-black transition">Quiz</a></li>
                <li><a href="/reflections" className="hover:text-black transition">Reflections</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Connect</h4>
              <ul className="space-y-1 text-gray-400">
                <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-black transition">Instagram</a></li>
                <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-black transition">LinkedIn</a></li>
                <li><a href="#about" className="hover:text-black transition">About Zerrah</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
