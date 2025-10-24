import React, { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import Calculator from '@/components/Calculator';
import { useCalculator } from '@/hooks/useCalculator';
import { motion } from 'framer-motion';
// import { Leaf } from 'lucide-react';
import ResultsDisplay from '@/components/ResultsDisplay';
import { calculatePersonality, logEvent, checkUserExists, createSession } from '@/services/api';
import type { PersonalityResponse } from '@/services/api';
import type { UserResponses } from '@/services/api';
import { personalityQuestions } from '@/data/personalityQuestions';
import { useQuizStore } from '@/stores/quizStore';
import { getSessionId, setUserData } from '@/services/session';
import { useUserStore } from '@/stores/userStore';

// Utility function to shuffle array
const shuffleArray = (array: any[]): any[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Add a type for questions
interface Question {
  key: string;
  header: string;
  icon: string;
  question: string;
  type: string;
  options?: { value: string; label: string }[];
  placeholder?: string;
}

const pastel = {
  lavender: '#E6E6F7',
  dustyGreen: '#D6F5E3',
  dustyBlue: '#C7E9F7',
  dustyYellow: '#FFF7C0',
  dustyRose: '#F7C8C8',
  gray: '#6B7280',
  white: '#FFFFFF',
};

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.18, duration: 0.7, ease: 'easeOut' }
  })
};

function CircularImageReveal() {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        position: 'relative',
        width: 400,
        height: 400,
        margin: '0 auto',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Original image (rectangular, fades in on hover) */}
      <img
        src="/images/intro_girl.png"
        alt="Original"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 400,
          height: 400,
          objectFit: 'cover',
          borderRadius: 32,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.5s',
          zIndex: 2,
        }}
      />
      {/* Circular image (fades out on hover) */}
      <img
        src="/images/intro_girl.png"
        alt="Circular"
        style={{
          width: 400,
          height: 400,
          objectFit: 'cover',
          borderRadius: '50%',
          boxShadow: '0 12px 40px 0 rgba(167,213,142,0.12)',
          background: 'linear-gradient(120deg, #E6E3F7 0%, #F9F7E8 60%, #A7D58E 100%)',
          opacity: hovered ? 0 : 1,
          transition: 'opacity 0.5s',
          zIndex: 3,
        }}
      />
    </div>
  );
}

function QuizIntro({ onStartA, onStartB, onBack }: { onStartA: () => void; onStartB: () => void; onBack?: () => void }) {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen px-6 lg:px-12 pt-8">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start mx-auto">
          
          {/* Left Side - Text and Image Stack */}
          <motion.div 
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative flex flex-col items-center justify-center"
          >
            {/* Prominent Animated Text */}
            <motion.div
              initial={{ opacity: 0, y: -30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              className="text-center mb-8"
            >
              {/* Main Greeting */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-slate-800 font-proxima text-3xl lg:text-4xl font-bold tracking-wide mb-2"
                style={{ fontFamily: 'Proxima Nova, sans-serif' }}
              >
                <motion.span
                  animate={{ 
                    color: ["#1e293b", "#3b82f6", "#1e293b"],
                    textShadow: [
                      "0 0 0px rgba(59, 130, 246, 0)",
                      "0 0 20px rgba(59, 130, 246, 0.3)",
                      "0 0 0px rgba(59, 130, 246, 0)"
                    ]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  Greetings, I am Bobo
                </motion.span>
              </motion.div>
              
              {/* Subtitle */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                className="text-slate-600 font-light text-lg lg:text-xl tracking-wider uppercase font-medium"
              >
                <motion.span
                  animate={{ 
                    opacity: [0.7, 1, 0.7],
                    letterSpacing: ["0.1em", "0.2em", "0.1em"]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  Your Climate Companion
                </motion.span>
              </motion.div>
              
            </motion.div>
            
            {/* Image Container with Elegant Shadow */}
            <div className="relative w-full max-w-lg">
              {/* Subtle Glow Effect */}
              <motion.div 
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="absolute inset-0 bg-gradient-to-r from-blue-100 via-emerald-100 to-blue-100 rounded-3xl blur-3xl"
              />
              
              {/* Image with Elegant Styling */}
              <motion.div
                className="relative z-10 rounded-3xl overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <img 
                  src="/images/quiz_intro.png" 
                  alt="Quiz Introduction" 
                  className="w-full h-auto object-cover"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div 
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="space-y-8"
          >


            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="text-4xl lg:text-6xl xl:text-7xl font-bold text-slate-900 leading-tight tracking-tight -mt-4"
              style={{ fontFamily: 'Proxima Nova, sans-serif' }}
            >
              Let's begin your
              <span className="block text-slate-900">
                sustainability story
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="text-xl lg:text-2xl text-slate-600 leading-relaxed font-light"
            >
              This isn't about being perfect  it's about being 
            </motion.p>

            {/* Body Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="space-y-6 text-slate-600 leading-relaxed text-lg"
            >
              <p className="font-light">
                Zerrah is a safe space to reflect. There are no scores, no guilt, no pressure. Just gentle questions, thoughtful pauses, and moments to notice the beauty in your everyday choices.
              </p>
              <p className="font-light">
              Bobo will guide you through each step with kindness, curiosity, and zero judgment
              </p>
            </motion.div>



            {/* CTA Button */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5 }}
              className="pt-8"
            >
              <motion.button 
                onClick={onStartB}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="group relative w-full max-w-md mx-auto bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-amber-950 text-white text-xl font-bold py-6 px-12 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden"
              >
                {/* Animated background overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Subtle animated sparkles */}
                <motion.div 
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute top-2 right-4 w-3 h-3 bg-white/30 rounded-full"
                />
                <motion.div 
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-2 left-4 w-2 h-2 bg-white/40 rounded-full"
                />
                
                {/* Button content */}
                <div className="relative flex items-center justify-center">
                  <div className="text-center">
                    <div className="font-bold text-2xl">Start Your Journey</div>
                    <div className="text-sm font-normal opacity-90 mt-1">Discover your sustainability story with Bobo</div>
                  </div>
                </div>
                
                {/* Arrow icon */}
                <motion.svg 
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 w-10 h-10 text-white/90 group-hover:translate-x-1 transition-transform duration-200" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </motion.svg>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
    </div>
  );
}

const Quiz = () => {
  const { state, updateCalculator } = useCalculator();
  const lastStep = useQuizStore(s => s.lastStep);
  const setLastStep = useQuizStore(s => s.setLastStep);
  const [currentStep, setCurrentStep] = useState(lastStep ?? 0);
  const [started, setStarted] = useState<null | 'A' | 'B'>(null);
  const [notReady, setNotReady] = useState(false);

  // Track quiz start
  useEffect(() => {
    const trackQuizStart = async () => {
      try {
        // First create a session if it doesn't exist
        await createSession();
        // Then log the quiz start event
        await logEvent('QUIZ_STARTED', {
          quizType: 'carbon-calculator',
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error tracking quiz start:', error);
      }
    };
    
    trackQuizStart();
  }, []);

  const handleCalculate = () => {
    // Handle calculation completion
    console.log('Calculating results...');
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
    setLastStep(Math.max(0, (lastStep ?? 0) - 1));
  };

  const handleNext = () => {
    setCurrentStep(prev => {
      const next = Math.min(5, prev + 1);
      setLastStep(next);
      return next;
    });
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
    setLastStep(step);
  };

  if (started === null) {
    return (
      <Layout>
        <QuizIntro
          onStartA={() => setStarted('A')}
          onStartB={() => setStarted('B')}
        />
      </Layout>
    );
  }

  if (started === 'A') {
    return (
      <Layout>
        <section className="py-20 bg-white">
          <div className="container px-4">
            <div className="mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-8">
                  Lifestyle Persona Snapshot
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Answer a few quick questions about your lifestyle to discover your unique persona and get personalized climate action tips.
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
                  weeklyKm: state.weeklyKm.toString(),
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
                    weeklyKm: updates.weeklyKm ? Number(updates.weeklyKm) : state.weeklyKm,
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

  if (started === 'B') {
    return (
      <Layout>
        <PoeticJourneyQuiz />
      </Layout>
    );
  }
};

// Copy transformStateToApiFormat from ResultsDisplay
function transformStateToApiFormat(state: any): UserResponses {
  console.log('=== TRANSFORM FUNCTION DEBUG ===');
  console.log('Input state:', state);
  console.log('monthlyDiningOut in input:', state.monthlyDiningOut);
  
  const result = {
    // Demographics
    name: state.name,
    email: state.email,
    age: state.age,
    gender: state.gender,
    profession: state.profession,
    location: state.location,
    country: state.country,
    householdSize: state.householdSize,
    // Home Energy
    homeSize: state.homeSize,
    homeEfficiency: state.homeEfficiency,
    energyManagement: state.energyManagement,
    electricityKwh: state.electricityKwh,
    naturalGasTherm: state.naturalGasTherm,
    heatingOilGallons: state.heatingOilGallons,
    propaneGallons: state.propaneGallons,
    usesRenewableEnergy: state.usesRenewableEnergy,
    hasEnergyEfficiencyUpgrades: state.hasEnergyEfficiencyUpgrades,
    hasSmartThermostats: state.hasSmartThermostats,
    hasEnergyStarAppliances: state.hasEnergyStarAppliances,
    // Transportation
    primaryTransportMode: state.primaryTransportMode,
    carProfile: state.carProfile,
    weeklyKm: state.weeklyKm,
    costPerMile: state.costPerMile,
    longDistanceTravel: state.longDistanceTravel,
    // Food & Diet
    dietType: state.dietType,
    plateProfile: state.plateProfile,
    monthlyDiningOut: state.monthlyDiningOut,
    plantBasedMealsPerWeek: state.plantBasedMealsPerWeek,
    // Waste
    waste: state.waste,
    // Air Quality
    airQuality: state.airQuality,
    // Clothing
    clothing: state.clothing,
  };
  
  console.log('Output result:', result);
  console.log('monthlyDiningOut in output:', result.monthlyDiningOut);
  
  return result;
}

function getSectionInfo(key: string, type?: string) {
  if (type === 'personality') {
    return {
      title: 'YOU AND BOBO',
      sub: 'A few fun questions to get to know you and Bobo the Panda!'
    };
  }
  if ([
    'homeSize', 'homeEfficiency', 'energyManagement',
  ].includes(key)) {
    return {
      title: 'Chapter I: The Hearth That Holds You',
      sub: 'Tell us about the home that nurtures your daily rhythm.'
    };
  }
  if ([
    'primaryTransportMode', 'carProfile', 'weeklyKm', 'longDistanceTravel',
  ].includes(key)) {
    return {
      title: 'Chapter II: The Way You Move',
      sub: 'How do you most often travel through your world?'
    };
  }
  if ([
    'dietType', 'plateProfile', 'monthlyDiningOut', 'plantBasedMealsPerWeek',
  ].includes(key)) {
    return {
      title: 'Chapter III: The Meals You Gather',
      sub: 'What kind of harvest shapes your daily plate?'
    };
  }
  if ([
    'clothing.wardrobeImpact', 'clothing.mindfulUpgrades', 'clothing.durability', 'clothing.consumptionFrequency', 'clothing.brandLoyalty',
  ].includes(key)) {
    return {
      title: 'Chapter IV: The Clothes You Keep',
      sub: 'How often does new fabric fold into your life?'
    };
  }
  if ([
    'waste.prevention', 'waste.smartShopping', 'waste.dailyWaste', 'waste.management', 'waste.repairOrReplace',
  ].includes(key)) {
    return {
      title: 'Chapter V: What You Let Go',
      sub: 'How do you part with what no longer serves you?'
    };
  }

  // Demographics
  return {
    title: 'Chapter VII: Your Story & Context',
    sub: 'A few details about you—so we can better reflect your journey.'
  };
}

function PoeticJourneyQuiz() {
  const { state, updateCalculator } = useCalculator();
  const { setUser } = useUserStore();
  const [step, setStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<PersonalityResponse | null>(null);
  const [loadingResults, setLoadingResults] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showScrollHint, setShowScrollHint] = useState(false);
  // NEW: Collect personality traits in a separate object
  const [personalityTraits, setPersonalityTraits] = useState<any>({});
  const [existingUser, setExistingUser] = useState<any>(null);
  const [showExistingUserScreen, setShowExistingUserScreen] = useState(false);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  // State to store shuffled options for each question to maintain consistent order
  const [shuffledOptions, setShuffledOptions] = useState<Record<string, { value: string; label: string }[]>>({});
  const setQuizAnswers = useQuizStore(state => state.setQuizAnswers);
  // Divider slide state
  const [showDivider, setShowDivider] = useState(false);
  const [dividerSubtitle, setDividerSubtitle] = useState('');
  const shownGroupsRef = useRef<Set<string>>(new Set());
  const dividerTimerRef = useRef<number | null>(null);
  // Simple email validation state
  const [emailError, setEmailError] = useState<string | null>(null);

  const isValidEmail = (v: string) => /[^@\s]+@[^@\s]+\.[^@\s]+/.test(v);

  // Validation modal
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  // Show scroll hint after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowScrollHint(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Track quiz start and create session
  useEffect(() => {
    const trackQuizStart = async () => {
      try {
        // First create a session if it doesn't exist
        await createSession();
        // Then log the quiz start event
        await logEvent('QUIZ_STARTED', {
          quizType: 'personality-assessment',
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error tracking quiz start:', error);
      }
    };
    
    trackQuizStart();
  }, []);

  // Combine personality questions and main questions
  const questions: Question[] = [
    ...personalityQuestions.map(q => ({
      ...q,
      type: 'personality',
      header: 'Personality Insights',
      icon: q.icon,
    })),
    // --- Home Energy ---
    {
      key: 'homeSize',
      header: 'Chapter 1: The Energy of Home',
      icon: '🏠',
      question: 'How many bedrooms does your home have?',
      type: 'select',
      options: [
        { value: '1', label: '1 Bedroom' },
        { value: '2', label: '2 Bedrooms' },
        { value: '3', label: '3 Bedrooms' },
        { value: '4', label: '4 Bedrooms' },
        { value: '5', label: '5 Bedrooms' },
        { value: '6', label: '6 Bedrooms' },
        { value: '7+', label: '7+ Bedrooms' }
      ]
    },
    {
      key: 'homeEfficiency',
      header: 'Chapter 1: The Energy of Home',
      icon: '⚡',
      question: 'How energy efficient is your home?',
      type: 'select',
      options: [
        { value: 'A', label: 'Energy Efficient Home' },
        { value: 'B', label: 'Mixed Efficiency' },
        { value: 'C', label: 'Standard Home' }
      ]
    },
    {
      key: 'energyManagement',
      header: 'Chapter 1: The Energy of Home',
      icon: '🌬️',
      question: 'How do you manage your energy sources?',
      type: 'select',
      options: [
        { value: 'A', label: 'Renewable Energy' },
        { value: 'B', label: 'Mixed Sources' },
        { value: 'C', label: 'Traditional Grid' }
      ]
    },

    // --- Transportation ---
    {
      key: 'primaryTransportMode',
      header: 'Chapter 2: Journeys & Movement',
      icon: '🚌',
      question: "What's your primary mode of transportation?",
      type: 'select',
      options: [
        { value: 'A', label: 'Active Transport' },
        { value: 'B', label: 'Public Transit' },
        { value: 'C', label: 'Personal Vehicle' },
        { value: 'D', label: 'Frequent Flyer' }
      ]
    },
    {
      key: 'carProfile',
      header: 'Chapter 2: Journeys & Movement',
      icon: '🚗',
      question: "What's your car profile?",
      type: 'select',
      options: [
        { value: 'A', label: 'Electric Vehicle' },
        { value: 'B', label: 'Hybrid Vehicle' },
        { value: 'C', label: 'Standard Vehicle' },
        { value: 'D', label: 'Large Vehicle' },
        { value: 'E', label: 'Luxury Vehicle' }
      ]
    },
    {
      key: 'weeklyKm',
      header: 'Chapter 2: Journeys & Movement',
      icon: '🗺️',
      question: 'How many kilometers do you drive weekly?',
      type: 'select',
      options: [
        { value: '50', label: 'Light (~50 km/week)' },
        { value: '100', label: 'Moderate (~100 km/week)' },
        { value: '200', label: 'Regular (~200 km/week)' },
        { value: '300', label: 'Frequent (~300 km/week)' }
      ]
    },
    {
      key: 'longDistanceTravel',
      header: 'Chapter 2: Journeys & Movement',
      icon: '✈️',
      question: 'How do you travel long distances?',
      type: 'select',
      options: [
        { value: 'A', label: 'Rail and Bus' },
        { value: 'B', label: 'Mix of Flights & Trains' },
        { value: 'C', label: 'Frequent Flyer' },
        { value: 'D', label: 'Car / Drive' }
      ]
    },

    // --- Food & Diet ---
    {
      key: 'dietType',
      header: 'Chapter 3: Nourishment & Choice',
      icon: '🍎',
      question: "What's your diet type?",
      type: 'select',
      options: [
        { value: 'VEGAN', label: 'Plant-Based Diet' },
        { value: 'VEGETARIAN', label: 'Vegetarian' },
        { value: 'FLEXITARIAN', label: 'Flexitarian' },
        { value: 'MEAT_MODERATE', label: 'Moderate Meat' },
        { value: 'MEAT_HEAVY', label: 'Mostly Meat' }
      ]
    },
    {
      key: 'plateProfile',
      header: 'Chapter 3: Nourishment & Choice',
      icon: '🥗',
      question: 'How do you source your food?',
      type: 'select',
      options: [
        { value: 'A', label: 'Local & Seasonal' },
        { value: 'B', label: 'Mixed Sources' },
        { value: 'C', label: 'Mostly Imported' }
      ]
    },
    {
      key: 'monthlyDiningOut',
      header: 'Chapter 3: Nourishment & Choice',
      icon: '🍽️',
      question: 'How many times a month do you choose dining out/takeout over cooking at home?',
      type: 'select',
      options: [
        { value: 'A', label: 'Rarely Dine Out (<1 a month)' },
        { value: 'B', label: 'Occasionally (1-4 times a month)' },
        { value: 'C', label: 'Regularly (5-10 times a month)' },
        { value: 'D', label: 'Frequently (>10 times a month)' }
      ]
    },
    {
      key: 'plantBasedMealsPerWeek',
      header: 'Chapter 3: Nourishment & Choice',
      icon: '🌱',
      question: 'How many plant-based meals do you eat per week?',
      type: 'number',
      placeholder: 'Enter number of meals'
    },

    // --- Clothing ---
    {
      key: 'clothing.wardrobeImpact',
      header: 'Chapter 4: Style & Substance',
      icon: '👕',
      question: 'How do you approach shopping for clothes?',
      type: 'select',
      options: [
        { value: 'A', label: 'Minimal Wardrobe' },
        { value: 'B', label: 'Balanced Collection' },
        { value: 'C', label: 'Extensive Wardrobe' }
      ]
    },
    {
      key: 'clothing.mindfulUpgrades',
      header: 'Chapter 4: Style & Substance',
      icon: '🛍️',
      question: 'When you upgrade your wardrobe, what do you consider?',
      type: 'select',
      options: [
        { value: 'A', label: 'Sustainable Brands' },
        { value: 'B', label: 'Mixed Approach' },
        { value: 'C', label: 'Conventional Shopping' }
      ]
    },
    {
      key: 'clothing.durability',
      header: 'Chapter 4: Style & Substance',
      icon: '⏰',
      question: 'How would you describe your wardrobe shopping style?',
      type: 'select',
      options: [
        { value: 'A', label: 'Long-lasting Items' },
        { value: 'B', label: 'Mixed Quality' },
        { value: 'C', label: 'Fast Fashion' }
      ]
    },
    {
      key: 'clothing.consumptionFrequency',
      header: 'Chapter 4: Style & Substance',
      icon: '🛒',
      question: 'How often do you buy new clothes?',
      type: 'select',
      options: [
        { value: 'A', label: 'Infrequent Shopper' },
        { value: 'B', label: 'Seasonal Shopper' },
        { value: 'C', label: 'Frequent Shopper' }
      ]
    },
    {
      key: 'clothing.brandLoyalty',
      header: 'Chapter 4: Style & Substance',
      icon: '🏷️',
      question: 'How do you choose your clothing brands?',
      type: 'select',
      options: [
        { value: 'A', label: 'Price and convenience: If it\'s affordable and easy to find, I\'m in' },
        { value: 'B', label: 'Style and fit: I go for what looks good and feels right, brand comes second' },
        { value: 'C', label: 'Reputation and values: I try to support brands that align with my ethics' },
        { value: 'D', label: 'I don\'t really think about it: I just grab what I need when I need it' }
      ]
    },

    // --- Waste ---
    {
      key: 'waste.prevention',
      header: 'Chapter 5: Waste & Wisdom',
      icon: '♻️',
      question: 'How do you typically handle items before they become waste?',
      type: 'select',
      options: [
        { value: 'A', label: 'I actively avoid creating waste (reuse containers, buy in bulk, compost)' },
        { value: 'B', label: 'I often reuse items and try to reduce waste when possible' },
        { value: 'C', label: 'I sometimes reuse items but mostly use disposable options' },
        { value: 'D', label: 'I usually throw things away when I\'m done with them' }
      ]
    },
    {
      key: 'waste.smartShopping',
      header: 'Chapter 5: Waste & Wisdom',
      icon: '🛍️',
      question: 'When shopping, how do you think about packaging and waste?',
      type: 'select',
      options: [
        { value: 'A', label: 'I choose products with minimal packaging and bring my own bags' },
        { value: 'B', label: 'I try to avoid excess packaging when convenient' },
        { value: 'C', label: 'I usually go with whatever is easiest and most convenient' }
      ]
    },
    {
      key: 'waste.dailyWaste',
      header: 'Chapter 5: Waste & Wisdom',
      icon: '🗑️',
      question: 'How full is your trash bin at the end of a typical day?',
      type: 'select',
      options: [
        { value: 'A', label: 'Almost empty (less than 1/4 full)' },
        { value: 'B', label: 'Half full' },
        { value: 'C', label: 'Mostly full (3/4 full)' },
        { value: 'D', label: 'Full or overflowing' }
      ]
    },
    {
      key: 'waste.repairOrReplace',
      header: 'Chapter 5: Waste & Wisdom',
      icon: '🔧',
      question: 'When something breaks, do you try to repair it instead of replacing it right away?',
      type: 'select',
      options: [
        { value: 'A', label: 'Always Repair' },
        { value: 'B', label: 'Sometimes Repair' },
        { value: 'C', label: 'Usually Replace' },
        { value: 'D', label: 'Always Replace' }
      ]
    },



    // --- Demographics ---
    {
      key: 'name',
      header: 'Chapter 7: Your Story',
      icon: '👤',
      question: 'What name should we use when we chat about your eco-journey?',
      type: 'text',
      placeholder: 'Enter your name'
    },
    {
      key: 'email',
      header: 'Chapter 7: Your Story',
      icon: '📧',
      question: 'Where can we send your personalized tips and progress updates?',
      type: 'email',
      placeholder: 'Enter your email'
    },
    {
      key: 'age',
      header: 'Chapter 7: Your Story',
      icon: '🎂',
      question: 'How many years young are you?',
      type: 'select',
      options: [
        { value: '10-17', label: '10-17' },
        { value: '18-24', label: '18-24' },
        { value: '25-34', label: '25-34' },
        { value: '35-44', label: '35-44' },
        { value: '45-54', label: '45-54' },
        { value: '55-64', label: '55-64' },
        { value: '65+', label: '65+' }
      ]
    },
    {
      key: 'gender',
      header: 'Chapter 7: Your Story',
      icon: '👤',
      question: 'Which gender do you identify with?',
      type: 'select',
      options: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'non-binary', label: 'Non-binary' },
        { value: 'prefer-not-to-say', label: 'Prefer not to say' }
      ]
    },
    {
      key: 'profession',
      header: 'Chapter 7: Your Story',
      icon: '💼',
      question: "What's your profession or what field are you studying?",
      type: 'select',
      options: [
        { value: 'student', label: 'Student' },
        { value: 'education', label: 'Education' },
        { value: 'business', label: 'Business & Management' },
        { value: 'engineering', label: 'Engineering & Technology' },
        { value: 'health', label: 'Health & Medicine' },
        { value: 'science', label: 'Science & Research' },
        { value: 'law', label: 'Law & Policy' },
        { value: 'environment', label: 'Environment & Sustainability' },
        { value: 'arts', label: 'Arts, Design & Creative Fields' },
        { value: 'media', label: 'Media & Communications' },
        { value: 'social', label: 'Social Sciences & Humanities' },
        { value: 'it', label: 'IT & Software Development' },
        { value: 'government', label: 'Government & Public Sector' },
        { value: 'hospitality', label: 'Hospitality, Travel & Tourism' },
        { value: 'trades', label: 'Skilled Trades' },
        { value: 'retail', label: 'Retail, Sales & Customer Service' },
        { value: 'logistics', label: 'Logistics, Transport & Delivery' },
        { value: 'caregiving', label: 'Home & Caregiving' },
        { value: 'unemployed', label: 'Currently Unemployed' },
        { value: 'prefer-not-to-say', label: 'Prefer Not to Say' }
      ]
    },
    {
      key: 'country',
      header: 'Chapter 7: Your Story',
      icon: '🌍',
      question: 'Where do you call home?',
      type: 'select',
      options: [
        { value: 'United States', label: 'United States' },
        { value: 'Canada', label: 'Canada' },
        { value: 'United Kingdom', label: 'United Kingdom' },
        { value: 'Australia', label: 'Australia' },
        { value: 'India', label: 'India' },
        { value: 'Pakistan', label: 'Pakistan' },
        { value: 'United Arab Emirates', label: 'United Arab Emirates' },
        { value: 'Saudi Arabia', label: 'Saudi Arabia' },
        { value: 'Germany', label: 'Germany' },
        { value: 'France', label: 'France' },
        { value: 'Brazil', label: 'Brazil' },
        { value: 'Japan', label: 'Japan' },
        { value: 'China', label: 'China' },
        { value: 'South Africa', label: 'South Africa' },
        { value: 'Turkey', label: 'Turkey' },
        { value: 'Indonesia', label: 'Indonesia' },
        { value: 'Bangladesh', label: 'Bangladesh' },
        { value: 'Nigeria', label: 'Nigeria' },
        { value: 'Mexico', label: 'Mexico' },
        { value: 'Russia', label: 'Russia' },
        { value: 'Egypt', label: 'Egypt' },
        { value: 'Argentina', label: 'Argentina' },
        { value: 'Italy', label: 'Italy' },
        { value: 'Spain', label: 'Spain' },
        { value: 'Other', label: 'Other' }
      ]
    },
    {
      key: 'location',
      header: 'Chapter 7: Your Story',
      icon: '🏙️',
      question: 'Which city do you live in?',
      type: 'text',
      placeholder: 'Enter your city'
    },
    {
      key: 'householdSize',
      header: 'Chapter 7: Your Story',
      icon: '👨‍👩‍👧‍👦',
      question: 'How many people, including you, share your home?',
      type: 'number',
      placeholder: 'Enter number of people'
    }
  ];

  // Group resolver for divider
  const getGroupForKey = (key: string, type?: string): string => {
    if (type === 'personality') return 'personality';
    if (['homeSize','homeEfficiency','energyManagement'].includes(key)) return 'home';
    if (['primaryTransportMode','carProfile','weeklyKm','longDistanceTravel'].includes(key)) return 'transport';
    if (['dietType','plateProfile','monthlyDiningOut','plantBasedMealsPerWeek'].includes(key)) return 'food';
    if (['clothing.wardrobeImpact','clothing.mindfulUpgrades','clothing.durability','clothing.consumptionFrequency','clothing.brandLoyalty'].includes(key)) return 'clothing';
    if (['waste.prevention','waste.smartShopping','waste.dailyWaste','waste.management','waste.repairOrReplace'].includes(key)) return 'waste';
    return 'demographics';
  };

  const dividerCopy: Record<string,string> = {
    personality: 'As a first step, bobo the panda wants to get to know you',
    home: 'Now that I know you better, tell me about the way you do things at home.',
    transport: 'How do you travel through the world?',
    food: 'What nourishes you day to day?',
    clothing: 'How would you describe your wardrobe and shopping choices?',
    waste: 'How do you reduce, reuse, and let go?',
    demographics: 'Just a few details to personalize your experience.',
  };

  useEffect(() => {
    const q = questions[step];
    if (!q) return;
    const group = getGroupForKey(q.key, q.type);
    if (!shownGroupsRef.current.has(group)) {
      shownGroupsRef.current.add(group);
      setDividerSubtitle(dividerCopy[group]);
      setShowDivider(true);
      if (dividerTimerRef.current) window.clearTimeout(dividerTimerRef.current);
      dividerTimerRef.current = window.setTimeout(() => setShowDivider(false), 5000);
      return () => {
        if (dividerTimerRef.current) window.clearTimeout(dividerTimerRef.current);
      };
    }
  }, [step]);

  // Store answers in the same structure as CalculatorState
  const answersRef = useRef<any>({});

  // Initialize shuffled options for all questions with options (excluding demographic questions)
  useEffect(() => {
    const initialShuffledOptions: Record<string, { value: string; label: string }[]> = {};
    // Demographic questions should maintain logical/alphabetical order for better UX
    const demographicKeys = ['age', 'gender', 'profession', 'country', 'location', 'householdSize'];
    
    questions.forEach(q => {
      if (q.options && q.options.length > 0) {
        // Don't shuffle demographic questions - keep them in logical order
        if (demographicKeys.includes(q.key)) {
          initialShuffledOptions[q.key] = q.options; // Keep original order
        } else {
          initialShuffledOptions[q.key] = shuffleArray(q.options); // Shuffle non-demographic questions
        }
      }
    });
    setShuffledOptions(initialShuffledOptions);
  }, []); // Run once on component mount

  // Debug: Track answers state changes
  useEffect(() => {
    console.log('=== ANSWERS STATE CHANGED ===');
    console.log('New answers state:', answers);
    console.log('monthlyDiningOut in answers:', answers.monthlyDiningOut);
    answersRef.current = answers;
  }, [answers]);

  // Helper to set nested value by dot notation
  function setNestedValue(obj: any, path: string, value: any) {
    const keys = path.split('.');
    let temp = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!temp[keys[i]]) temp[keys[i]] = {};
      temp = temp[keys[i]];
    }
    temp[keys[keys.length - 1]] = value;
    return { ...obj };
  }

  async function handleSelect(key: string, value: string) {
    console.log('=== HANDLE SELECT DEBUG ===');
    console.log('Key:', key, 'Value:', value);
    console.log('Current answers before update:', answers);
    console.log('Function called at:', new Date().toISOString());
    
    // If this is a personality question, update personalityTraits
    if (personalityQuestions.some(q => q.key === key)) {
      setPersonalityTraits((prev: any) => ({ ...prev, [key]: value }));
      console.log('Updated personalityTraits:', { ...personalityTraits, [key]: value });
    }
    
    // Update answers state
    if (key.includes('.')) {
      setAnswers((prev: any) => {
        const newAnswers = setNestedValue({ ...prev }, key, value);
        console.log('Updated nested answers:', newAnswers);
        return newAnswers;
      });
    } else {
      setAnswers((prev: any) => {
        const newAnswers = { ...prev, [key]: value };
        console.log('Updated flat answers:', newAnswers);
        console.log('Previous answers:', prev);
        console.log('New answers:', newAnswers);
        return newAnswers;
      });
      
      // Force a re-render to ensure the state is updated
      setTimeout(() => {
        console.log('Answers state after timeout:', answers);
      }, 0);
    }
    
    // Also update the calculator state for compatibility
    if (key.includes('.')) {
      updateCalculator(setNestedValue({ ...state }, key, value));
    } else {
      updateCalculator({ [key]: value });
    }
  }

  async function handleNext() {
    // Check if current question is answered
    const currentAnswer = getNestedValue(answers, q.key);
    if (!currentAnswer) {
      console.log('Current question not answered:', q.key);
      return;
    }
    
    // Special handling for existing user check using email on Next button click
    if (q.key === 'email') {
      console.log('🎯 Next button clicked for email question:', currentAnswer);
      if (!isValidEmail(currentAnswer)) {
        setEmailError('Please enter a valid email address.');
        setValidationMessage('Please enter a valid email address to continue.');
        setShowValidationModal(true);
        return;
      } else {
        setEmailError(null);
      }
      if (currentAnswer && currentAnswer.trim()) {
        try {
          console.log('🔍 Checking user existence (by email) for:', currentAnswer);
          const response = await checkUserExists(currentAnswer);
          console.log('📡 User check response:', response);
          if (response.success && response.exists) {
            console.log('User found:', response.user);
            setExistingUser(response.user);
            setShowExistingUserScreen(true);
            // Pre-fill answers with existing user data
            const userData = response.user;
            const prefilledAnswers = {
              ...answers,
              [q.key]: currentAnswer,
              // Map user data to quiz fields
              homeSize: userData.household || '2',
              age: userData.age || '25-30',
              gender: userData.gender || 'Prefer not to say',
              profession: userData.profession || 'Student',
              country: userData.country || 'United States',
              city: userData.city || 'New York',
              household: userData.household || '1 person'
            };
            setAnswers(prefilledAnswers);
            // Update session/user immediately so header switches to "Hi {name}"
            try {
              if (userData?.id) {
                localStorage.setItem('zerrah_user_id', userData.id);
                setUser({ id: userData.id, name: userData.firstName || answers.name || 'Friend', email: userData.email });
                setUserData({
                  email: userData.email,
                  firstName: userData.firstName || answers.name,
                  age: userData.age,
                  gender: userData.gender,
                  profession: userData.profession,
                  country: userData.country,
                  city: userData.city,
                  household: userData.household,
                });
              }
            } catch (e) {
              console.log('Failed to set existing user session data:', e);
            }
            return; // Don't proceed to next step, show welcome back screen
          } else {
            console.log('User not found, proceeding with quiz');
          }
        } catch (error: any) {
          console.error('Error checking user existence:', error);
          // Surface a friendly, actionable prompt to the user
          const message = typeof error?.response?.data?.error === 'string'
            ? error.response.data.error
            : (error?.message || 'We could not verify your email right now.');
          setValidationMessage(`${message} Please try again or continue without lookup.`);
          setShowValidationModal(true);
          // Continue with quiz even if check fails
        }
      }
    }
    
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // On last question, calculate and show results
      handleFinishQuiz();
    }
  }

  function handleBack() {
    if (step > 0) setStep(step - 1);
  }

  // Helper to get nested value by dot notation
  function getNestedValue(obj: any, path: string) {
    return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
  }

  async function handleFinishQuiz() {
    setLoadingResults(true);
    setApiError(null);
    try {
      // Use the ref to get the latest answers state
      const latestAnswers = answersRef.current;
      
      // Debug: Log the answers state in detail
      console.log('=== DETAILED ANSWERS DEBUG ===');
      console.log('Full answers object:', latestAnswers);
      console.log('monthlyDiningOut value:', latestAnswers.monthlyDiningOut);
      console.log('homeSize value:', latestAnswers.homeSize);
      console.log('weeklyKm value:', latestAnswers.weeklyKm);
      console.log('longDistanceTravel value:', latestAnswers.longDistanceTravel);
      console.log('airQuality object:', latestAnswers.airQuality);
      
      const apiPayload = {
        ...transformStateToApiFormat(latestAnswers),
        personalityTraits // <-- include the traits in the payload
      };
      
      // Debug: Log what's missing
      console.log('=== API PAYLOAD DEBUG ===');
      console.log('API Payload:', apiPayload);
      console.log('monthlyDiningOut in payload:', apiPayload.monthlyDiningOut);
      console.log('Missing fields:', {
        homeSize: !latestAnswers.homeSize ? 'MISSING' : 'PRESENT',
        weeklyKm: !latestAnswers.weeklyKm ? 'MISSING' : 'PRESENT', 
        longDistanceTravel: !latestAnswers.longDistanceTravel ? 'MISSING' : 'PRESENT',
        monthlyDiningOut: !latestAnswers.monthlyDiningOut ? 'MISSING' : 'PRESENT',
        airQuality: Object.keys(latestAnswers.airQuality || {}).length === 0 ? 'EMPTY' : 'HAS DATA'
      });
      
      // Validate that all required fields are present
      const requiredFields = [
        'homeSize', 'homeEfficiency', 'energyManagement',
        'primaryTransportMode', 'carProfile', 'weeklyKm', 'longDistanceTravel',
        'dietType', 'plateProfile', 'monthlyDiningOut', 'plantBasedMealsPerWeek'
      ];
      
      const missingFields = requiredFields.filter(field => !latestAnswers[field]);
      if (missingFields.length > 0) {
        console.error('Missing required fields:', missingFields);
        setApiError(`Missing required fields: ${missingFields.join(', ')}`);
        setLoadingResults(false);
        return;
      }
      
      // Track quiz completion
      try {
        // Ensure session exists before logging event
        await createSession();
        await logEvent('QUIZ_COMPLETED', {
          quizType: 'personality-assessment',
          answersCount: Object.keys(latestAnswers).length,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error tracking quiz completion:', error);
      }
      
      setQuizAnswers(apiPayload); // Persist the full answers in the store
                const apiResults = await calculatePersonality(apiPayload);
                // If backend created/found a user, set header session immediately
                const newUserId = (apiResults as any)?._metadata?.userId;
                if (newUserId) {
                  localStorage.setItem('zerrah_user_id', newUserId);
                  setUser({ id: newUserId, name: answers.name || existingUser?.firstName || 'Friend', email: answers.email || existingUser?.email });
                  setUserData({
                    email: answers.email || existingUser?.email,
                    firstName: answers.name || existingUser?.firstName,
                    age: answers.age,
                    gender: answers.gender,
                    profession: answers.profession,
                    country: answers.country,
                    city: answers.location,
                    household: answers.householdSize,
                  });
                }
      setResults(apiResults);
      setShowResults(true);
    } catch (err) {
      setApiError('Failed to fetch results. Please try again.');
    } finally {
      setLoadingResults(false);
    }
  }

  // Show existing user screen if user was found
  if (showExistingUserScreen && existingUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        {/* Clean, minimal background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100/10 via-transparent to-emerald-100/10"></div>
        </div>

                 {/* Main content container */}
         <div className="relative z-10 max-w-4xl w-full mx-auto px-8 py-16">
           {/* Back Button */}
           <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.6, delay: 0.2 }}
             className="mb-8"
           >
             <button
               onClick={() => {
                 setShowExistingUserScreen(false);
                 setExistingUser(null);
                 // Go back to the name question specifically
                 const nameQuestionIndex = questions.findIndex(q => q.key === 'name');
                 setStep(nameQuestionIndex >= 0 ? nameQuestionIndex : 0);
               }}
               className="group relative flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm border-2 border-slate-200/60 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 shadow-lg hover:shadow-xl rounded-2xl"
             >
               {/* Background glow effect */}
               <div className="absolute inset-0 bg-gradient-to-r from-slate-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
               
               {/* Icon with enhanced animation */}
               <div className="relative z-10 flex items-center justify-center w-6 h-6 bg-slate-100 rounded-full group-hover:bg-slate-200 transition-colors duration-300">
                 <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                 </svg>
               </div>
               
               {/* Text */}
               <span className="relative z-10 font-semibold">Back</span>
             </button>
           </motion.div>

           {/* Card with sleek styling */}
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-white/98 backdrop-blur-sm rounded-3xl shadow-2xl p-16 border border-slate-200/30 relative overflow-hidden"
          >
            
            {/* Panda container with sleek styling */}
            <motion.div 
              initial={{ scale: 0.8, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative mb-12"
            >
               {/* Panda image with elegant styling */}
               <div className="relative">
                 <motion.img 
                   src="/gif/joyful_panda.gif" 
                   alt="Joyful Panda" 
                   className="w-48 h-48 mx-auto rounded-full shadow-2xl border-4 border-white/90 relative z-10"
                   whileHover={{ scale: 1.02 }}
                   transition={{ duration: 0.3 }}
                 />
               </div>
            </motion.div>

            {/* Welcome text with sleek typography */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center mb-16"
              >
              <motion.h1 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-5xl md:text-6xl font-serif mb-8 text-slate-900 leading-tight tracking-tight" 
                style={{ 
                  fontFamily: 'Proxima Nova, sans-serif',
                  fontWeight: 600,
                  letterSpacing: '-0.02em'
                }}
              >
                Welcome back, {existingUser.firstName || existingUser.email}!
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="text-lg md:text-xl text-slate-700 leading-relaxed max-w-2xl mx-auto font-normal text-center"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 400,
                  letterSpacing: '0.01em',
                  lineHeight: '1.6'
                }}
              >
                We already know a glimpse of your story.<br />
                Let's see your personalized results.
              </motion.p>
              
            </motion.div>

            {/* Sleek CTA button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-center"
            >
              <motion.button 
                onClick={async () => {
                  setLoadingResults(true);
                  try {
                    // Use the pre-filled answers to calculate personality
                    const apiPayload = {
                      ...transformStateToApiFormat(answers),
                      personalityTraits
                    };
                    const apiResults = await calculatePersonality(apiPayload);
                    setResults(apiResults);
                    setShowResults(true);
                    setShowExistingUserScreen(false);
                  } catch (error) {
                    setApiError('Failed to fetch results. Please try again.');
                  } finally {
                    setLoadingResults(false);
                  }
                }}
                disabled={loadingResults}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="group relative inline-flex items-center gap-4 px-12 py-5 bg-gradient-to-r from-amber-700 to-amber-900 text-white text-xl font-medium rounded-2xl shadow-xl hover:shadow-2xl hover:from-amber-800 hover:to-amber-950 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {/* Button background glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Loading spinner */}
                {loadingResults && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                )}
                
                {/* Button text */}
                <span className="relative z-10 font-semibold tracking-wide">
                  {loadingResults ? 'Calculating...' : 'See Results'}
                </span>
                
                {/* Arrow icon */}
                {!loadingResults && (
                  <motion.svg 
                    className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-200" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </motion.svg>
                )}
              </motion.button>
            </motion.div>


          </motion.div>
        </div>
      </div>
    );
  }

  if (showResults) {
    if (loadingResults) {
      return (
        <Layout>
          <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F7E8] px-4 py-12">
            <div className="max-w-2xl w-full mx-auto bg-white/80 rounded-3xl shadow-xl p-8 mb-8 border border-[#A7D58E22] text-center">
              <h1 className="text-3xl font-serif mb-4">Calculating your results...</h1>
              <div className="text-lg text-[#A08C7D] italic">Please wait while we fetch your personalized results.</div>
            </div>
          </div>
        </Layout>
      );
    }
    if (apiError) {
      return (
        <Layout>
          <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F7E8] px-4 py-12">
            <div className="max-w-2xl w-full mx-auto bg-white/80 rounded-3xl shadow-xl p-8 mb-8 border border-[#A7D58E22] text-center">
              <h1 className="text-3xl font-serif mb-4">Error</h1>
              <div className="text-lg text-red-600 italic mb-4">{apiError}</div>
              <button className="bg-green-600 text-white px-6 py-2 rounded-xl" onClick={handleFinishQuiz}>Try Again</button>
            </div>
          </div>
        </Layout>
      );
    }
    // Compose categoryEmissions to match ResultsDisplay's expected type
    const categoryEmissions = {
      home: results?.categoryScores?.home?.score || 0,
      transport: results?.categoryScores?.transport?.score || 0,
      food: results?.categoryScores?.food?.score || 0,
      waste: results?.categoryScores?.waste?.score || 0,
    };
    
    // Debug: Log the API results to see what we're getting
    console.log('API Results passed to ResultsDisplay:', {
      comprehensivePowerMoves: results?.comprehensivePowerMoves,
      personality: results?.comprehensivePowerMoves?.personality,
      archetype: results?.comprehensivePowerMoves?.personality?.archetype,
      hookLine: results?.comprehensivePowerMoves?.personality?.hookLine,
      description: results?.comprehensivePowerMoves?.personality?.description
    });
    
    // For recommendations, pass an empty array (or map if you have Recommendation[])
    return (
      <ResultsDisplay
        score={results?.finalScore || 0}
        emissions={Number(results?.impactMetrics?.carbonReduced) || 0}
        categoryEmissions={categoryEmissions}
        recommendations={[]}
        isVisible={true}
        onReset={() => {
          setShowResults(false);
          setResults(null);
          setStep(0);
          setAnswers({});
          setPersonalityTraits({});
          setShowExistingUserScreen(false);
          setExistingUser(null);
        }}
        onBack={() => {
          // Return into quiz at the last recorded step
          setShowResults(false);
          setResults(null);
          setShowExistingUserScreen(false);
          const last = useQuizStore.getState().lastStep;
          setStep(typeof last === 'number' ? last : questions.length - 1);
        }}
        state={answers}
        gender={answers.gender === 'female' ? 'girl' : 'boy'}
        // Pass the comprehensivePowerMoves data directly
          comprehensivePowerMoves={results?.comprehensivePowerMoves}
          highlights={results?.highlights}
      />
    );
  }

  const q = questions[step];
  const section = getSectionInfo(q.key, q.type);

  // Divider screen rendering
  if (showDivider) {
    return (
      <div className="min-h-screen flex items-start justify-center bg-white pt-10 md:pt-16">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }} className="text-center px-6 w-full">
          <div className="max-w-lg md:max-w-xl mx-auto bg-white/92 border-2 border-gradient-to-r from-emerald-200 via-slate-200 to-emerald-200 rounded-[32px] shadow-2xl px-10 md:px-14 py-12 md:py-14 relative overflow-hidden">
            {/* Sleek gradient border effect */}
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-r from-emerald-200/50 via-slate-200/30 to-emerald-200/50 p-[2px]">
              <div className="w-full h-full bg-white/92 rounded-[30px]"></div>
            </div>
            {/* Animated border glow */}
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-r from-emerald-300/20 via-transparent to-emerald-300/20 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
            {/* Content container */}
            <div className="relative z-10">
            <motion.div
              initial={{ y: 6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.35 }}
              className="mx-auto mb-6 w-28 h-28 md:w-32 md:h-32 rounded-full bg-white ring-1 ring-slate-200/70 shadow-inner flex items-center justify-center"
            >
              <motion.div
                className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden"
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transform: 'scale(3)', transformOrigin: 'center' }}
              >
                <video
                  src="/gif/dancing.mp4"
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </motion.div>
            </motion.div>

            <div className="text-5xl md:text-6xl leading-tight font-extrabold tracking-tight text-emerald-600 text-center mb-3" style={{letterSpacing:'-0.01em'}}>Bobo</div>

            <div className="h-px bg-slate-200/70 mx-auto my-5 md:my-6 w-24 md:w-28 rounded-full" />

            <div className="text-center text-lg md:text-xl leading-relaxed md:leading-relaxed max-w-3xl mx-auto mb-8 text-slate-700 font-medium">
              {dividerSubtitle}
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => setShowDivider(false)}
                className="h-14 px-8 rounded-full bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 transition-colors w-full sm:w-auto text-lg"
              >
                Continue
              </button>
            </div>
            </div>
          </div>
        </motion.div>
        {showValidationModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="text-lg font-semibold text-slate-800 mb-2">Check your input</div>
              <div className="text-slate-600 mb-6">{validationMessage}</div>
              <div className="flex justify-end">
                <button onClick={() => setShowValidationModal(false)} className="px-5 py-2 rounded-lg bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700">OK</button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  // Debug: Log current question
  console.log(`Step ${step + 1}/${questions.length}: ${q.key} - ${q.question}`);
  console.log(`Current answer for ${q.key}:`, getNestedValue(answers, q.key));
  console.log(`All answers so far:`, answers);
  
  // Special debug for username question
  if (q.key === 'name') {
    console.log('🎯 Username question detected!');
    console.log('Question type:', q.type);
    console.log('Question placeholder:', q.placeholder);
    console.log('Question key:', q.key);
  }

  // Determine background image based on question section
  let backgroundImage = '/images/home_background.png';
  if (q.type === 'personality') {
    backgroundImage = '/images/panda_bg.png';
  } else if ([
    'primaryTransportMode', 'carProfile', 'weeklyKm', 'longDistanceTravel'
  ].includes(q.key)) {
    backgroundImage = '/images/transport.background.png';
  } else if ([
    'clothing.wardrobeImpact', 'clothing.mindfulUpgrades', 'clothing.durability', 'clothing.consumptionFrequency', 'clothing.brandLoyalty'
  ].includes(q.key)) {
    backgroundImage = '/images/clothes_background.png';
  } else if ([
    'dietType', 'plateProfile', 'monthlyDiningOut', 'plantBasedMealsPerWeek'
  ].includes(q.key)) {
    backgroundImage = '/images/food_clothes.png';
  } else if ([
    'waste.prevention', 'waste.smartShopping', 'waste.dailyWaste', 'waste.management', 'waste.repairOrReplace'
  ].includes(q.key)) {
    backgroundImage = '/images/waste_background.png';
  } else if ([
    'airQuality.outdoorAirQuality', 'airQuality.aqiMonitoring', 'airQuality.indoorAirQuality', 'airQuality.airQualityCommuting', 'airQuality.airQualityImpact'
  ].includes(q.key)) {
    backgroundImage = '/images/air_background.png';
  }

  // Add this mapping near the top of the file (inside the component or above it):
  const countryCityMap: Record<string, string[]> = {
    "United States": ["New York", "Los Angeles", "Chicago", "San Francisco", "Other"],
    "Pakistan": ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Other"],
    "United Arab Emirates": ["Dubai", "Abu Dhabi", "Sharjah", "Other"],
    "Saudi Arabia": ["Riyadh", "Jeddah", "Mecca", "Other"],
    "India": ["Mumbai", "Delhi", "Bangalore", "Chennai", "Other"],
    "Canada": ["Toronto", "Vancouver", "Montreal", "Calgary", "Other"],
    "United Kingdom": ["London", "Manchester", "Birmingham", "Liverpool", "Other"],
    "Australia": ["Sydney", "Melbourne", "Brisbane", "Perth", "Other"],
    "Germany": ["Berlin", "Munich", "Frankfurt", "Hamburg", "Other"],
    "France": ["Paris", "Lyon", "Marseille", "Nice", "Other"],
    "Brazil": ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador", "Other"],
    "Japan": ["Tokyo", "Osaka", "Kyoto", "Yokohama", "Other"],
    "China": ["Beijing", "Shanghai", "Guangzhou", "Shenzhen", "Other"],
    "South Africa": ["Johannesburg", "Cape Town", "Durban", "Pretoria", "Other"],
    "Turkey": ["Istanbul", "Ankara", "Izmir", "Bursa", "Other"],
    "Indonesia": ["Jakarta", "Surabaya", "Bandung", "Medan", "Other"],
    "Bangladesh": ["Dhaka", "Chittagong", "Khulna", "Rajshahi", "Other"],
    "Nigeria": ["Lagos", "Abuja", "Kano", "Ibadan", "Other"],
    "Mexico": ["Mexico City", "Guadalajara", "Monterrey", "Puebla", "Other"],
    "Russia": ["Moscow", "Saint Petersburg", "Novosibirsk", "Yekaterinburg", "Other"],
    "Egypt": ["Cairo", "Alexandria", "Giza", "Shubra El Kheima", "Other"],
    "Argentina": ["Buenos Aires", "Córdoba", "Rosario", "Mendoza", "Other"],
    "Italy": ["Rome", "Milan", "Naples", "Turin", "Other"],
    "Spain": ["Madrid", "Barcelona", "Valencia", "Seville", "Other"],
  };

  // Lightweight custom select component for fully styled dropdown
  function CustomSelect({
    value,
    onChange,
    options,
    placeholder,
    disabled,
  }: {
    value: string;
    onChange: (v: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
    disabled?: boolean;
  }) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      function handleClickOutside(e: MouseEvent) {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selected = options.find(o => o.value === value);

    return (
      <div ref={containerRef} className={`relative w-full max-w-2xl ${disabled ? 'opacity-60' : ''}`}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen(o => !o)}
          className="w-full h-24 rounded-3xl px-8 pr-16 text-2xl font-semibold border-2 border-sage-300 focus:border-emerald-500 focus:outline-none shadow-xl text-sage-800 bg-white/90 backdrop-blur-sm transition-colors duration-200 flex items-center justify-between"
          style={{ fontFamily: 'Inter, sans-serif' }}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className={!selected ? 'text-sage-400' : ''}>{selected ? selected.label : (placeholder || 'Select')}</span>
          <svg className={`w-6 h-6 text-sage-700 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="none" stroke="currentColor">
            <path d="M6 8L10 12L14 8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {open && !disabled && (
          <div className="absolute z-50 mt-2 w-full max-h-80 overflow-y-auto rounded-2xl border-2 border-sage-200 bg-white shadow-2xl">
            {options.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full text-left px-5 py-4 text-lg hover:bg-sage-50 ${value === opt.value ? 'bg-sage-100 text-sage-800 font-semibold' : 'text-sage-700'}`}
                style={{ fontFamily: 'Inter, sans-serif' }}
                role="option"
                aria-selected={value === opt.value}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen flex flex-col items-center justify-center relative pb-28 px-4 md:px-8"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto',
        backgroundPosition: 'top left',
        backgroundColor: '#F9F7E8',
        minHeight: '100vh',
        height: '100vh',
        width: '100vw',
        margin: 0,
        padding: 0
      }}
    >
      {/* Optional overlay for extra softness */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(255,255,255,0.7)',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      
      

      

      
      <div className="max-w-5xl w-full mx-auto bg-white/90 rounded-3xl shadow-2xl border border-[#A7D58E22] relative z-10 mx-4 mb-16 overflow-hidden
                      grid grid-rows-[auto_1fr_auto]
                      h-[calc(100vh-var(--app-header-h,72px)-2rem)] md:h-[calc(100vh-var(--app-header-h,80px)-3rem)]">
        {/* Card Header */}
        <div className="p-4 md:p-6 pb-2">
          <h2 className="text-2xl md:text-3xl font-proxima text-sage-800 text-center mb-2 tracking-wide" style={{ fontFamily: 'Proxima Nova, sans-serif', fontWeight: 700 }}>{section.title}</h2>
        </div>
        {/* Scrollable Body */}
        <div className="px-6 md:px-8 flex flex-col items-center justify-start mb-4 overflow-y-auto pb-6 min-h-0">
          {q.type === 'personality' ? (
            <PandaGifWithDelay gifUrl={step % 2 === 0 ? '/gif/joyful_panda.gif' : '/gif/panda.gif'} />
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              whileHover={{ 
                scale: 1.1, 
                rotate: [0, -5, 5, 0],
                transition: { duration: 0.6 }
              }}
              className="relative group mb-2"
            >
              {/* Glowing background circle */}
              <div className="absolute inset-0 bg-gradient-to-r from-sage-200/50 via-emerald-200/50 to-sage-200/50 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-150"></div>
              
              {/* Icon container with elegant styling */}
              <div className="relative bg-white/90 backdrop-blur-sm rounded-full p-8 shadow-2xl border border-sage-200/30 group-hover:border-sage-300/50 transition-all duration-300">
                <motion.span 
                  style={{ fontSize: 64 }}
                  className="block"
                  animate={{ 
                    y: [0, -2, 0],
                    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  {q.icon}
                </motion.span>
              </div>
              
              {/* Floating sparkles */}
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.8, 0.3],
                  rotate: [0, 180, 360]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-300 rounded-full opacity-0 group-hover:opacity-100"
              />
              <motion.div
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 0.9, 0.4],
                  rotate: [360, 180, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-300 rounded-full opacity-0 group-hover:opacity-100"
              />
            </motion.div>
          )}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-2xl md:text-3xl lg:text-4xl font-proxima text-sage-800 text-center mt-2 mb-6 lg:mb-8 leading-tight" 
            style={{ fontFamily: 'Proxima Nova, sans-serif', fontWeight: 600 }}
          >
            {q.question}
          </motion.div>
          {/* Spacer to push options to vertical center between question and footer */}
          <div className="flex-1" />
          <div className="flex flex-wrap justify-center gap-3 lg:gap-2 mb-2 max-w-4xl mx-auto mt-4">
          {q.key === 'country' ? (
            <CustomSelect
              value={getNestedValue(answers, q.key) || ''}
              onChange={(v) => handleSelect(q.key, v)}
              placeholder="Enter your country"
              options={shuffledOptions[q.key] || [
                { value: 'United States', label: 'United States' },
                { value: 'Canada', label: 'Canada' },
                { value: 'United Kingdom', label: 'United Kingdom' },
                { value: 'Australia', label: 'Australia' },
                { value: 'India', label: 'India' },
                { value: 'Pakistan', label: 'Pakistan' },
                { value: 'United Arab Emirates', label: 'United Arab Emirates' },
                { value: 'Saudi Arabia', label: 'Saudi Arabia' },
                { value: 'Germany', label: 'Germany' },
                { value: 'France', label: 'France' },
                { value: 'Brazil', label: 'Brazil' },
                { value: 'Japan', label: 'Japan' },
                { value: 'China', label: 'China' },
                { value: 'South Africa', label: 'South Africa' },
                { value: 'Turkey', label: 'Turkey' },
                { value: 'Indonesia', label: 'Indonesia' },
                { value: 'Bangladesh', label: 'Bangladesh' },
                { value: 'Nigeria', label: 'Nigeria' },
                { value: 'Mexico', label: 'Mexico' },
                { value: 'Russia', label: 'Russia' },
                { value: 'Egypt', label: 'Egypt' },
                { value: 'Argentina', label: 'Argentina' },
                { value: 'Italy', label: 'Italy' },
                { value: 'Spain', label: 'Spain' },
                { value: 'Other', label: 'Other' },
              ]}
            />
          ) : q.key === 'location' ? (
            (() => {
              const selectedCountry = getNestedValue(answers, 'country');
              const cities = countryCityMap[selectedCountry];
              if (!selectedCountry) {
                return (
                  <CustomSelect
                    value={''}
                    onChange={() => {}}
                    options={[]}
                    placeholder="Select a country first"
                    disabled
                  />
                );
              } else if (cities) {
                return (
                  <CustomSelect
                    value={getNestedValue(answers, q.key) || ''}
                    onChange={(v) => handleSelect(q.key, v)}
                    placeholder="Select your city"
                    options={cities.map(city => ({ value: city, label: city }))}
                  />
                );
              } else {
                return (
                <input
                  type="text"
                  value={getNestedValue(answers, q.key) || ''}
                  onChange={e => handleSelect(q.key, e.target.value)}
                  placeholder="Enter your city"
                  className="w-full max-w-2xl h-24 rounded-3xl px-8 text-2xl font-semibold border-2 border-sage-300 focus:border-emerald-500 focus:outline-none shadow-xl text-sage-800 placeholder-sage-400 bg-white/90 backdrop-blur-sm"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
                );
              }
            })()
          ) : q.type === 'personality' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(shuffledOptions[q.key] || q.options)?.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(q.key, opt.value)}
                  className={`rounded-2xl px-10 py-6 text-lg md:text-xl font-semibold shadow-lg transition-all border-2 ${getNestedValue(answers, q.key) === opt.value ? 'bg-sage-600 text-white border-sage-600 shadow-sage-200' : 'bg-white text-sage-700 border-sage-200 hover:border-sage-300 hover:shadow-md'}`}
                  style={{ minWidth: 240, fontFamily: 'Inter, sans-serif' }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          ) : Array.isArray(q.options) ? (
            (shuffledOptions[q.key] || q.options).map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSelect(q.key, opt.value)}
                className={`rounded-2xl px-10 py-6 text-lg md:text-xl font-semibold shadow-lg transition-all border-2 ${getNestedValue(answers, q.key) === opt.value ? 'bg-sage-600 text-white border-sage-600 shadow-sage-200' : 'bg-white text-sage-700 border-sage-200 hover:border-sage-300 hover:shadow-md'}`}
                style={{ minWidth: 240, fontFamily: 'Inter, sans-serif' }}
              >
                {opt.label}
              </button>
            ))
          ) : q.type === 'text' ? (
            <input
              type="text"
              value={getNestedValue(answers, q.key) || ''}
              onChange={e => {
                console.log('Text input onChange triggered:', q.key, e.target.value);
                handleSelect(q.key, e.target.value);
              }}
              placeholder={q.placeholder}
              className="w-full max-w-2xl h-24 rounded-3xl px-8 text-2xl font-semibold border-2 border-sage-300 focus:border-emerald-500 focus:outline-none shadow-xl text-sage-800 placeholder-sage-400 bg-white/90 backdrop-blur-sm"
              style={{ fontFamily: 'Inter, sans-serif' }}
            />
          ) : q.type === 'email' ? (
            <div className="w-full max-w-2xl">
              <input
                type="email"
                value={getNestedValue(answers, q.key) || ''}
                onChange={e => {
                  const val = e.target.value;
                  handleSelect(q.key, val);
                  setEmailError(val && !isValidEmail(val) ? 'Please enter a valid email address.' : null);
                }}
                placeholder={q.placeholder}
                className={`w-full h-24 rounded-3xl px-8 text-2xl font-semibold border-2 shadow-xl bg-white/90 backdrop-blur-sm ${emailError ? 'border-red-400 focus:border-red-500' : 'border-sage-300 focus:border-emerald-500'} text-sage-800 placeholder-sage-400`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
              {emailError && (
                <div className="mt-2 text-sm text-red-600">{emailError}</div>
              )}
            </div>
          ) : q.type === 'number' ? (
            <div className="relative w-full max-w-2xl">
              <input
                type="number"
                value={getNestedValue(answers, q.key) || ''}
                onChange={e => handleSelect(q.key, e.target.value)}
                placeholder={q.placeholder}
                className="w-full h-24 rounded-3xl px-8 pr-20 text-2xl font-semibold border-2 border-sage-300 focus:border-emerald-500 focus:outline-none shadow-xl text-sage-800 placeholder-sage-400 bg-white/90 backdrop-blur-sm transition-colors duration-200"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  WebkitAppearance: 'none',
                  MozAppearance: 'textfield'
                }}
              />
              {/* Custom increment/decrement buttons */}
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => {
                    const currentValue = parseInt(getNestedValue(answers, q.key) || '0') || 0;
                    handleSelect(q.key, (currentValue + 1).toString());
                  }}
                  className="w-8 h-8 bg-sage-200 hover:bg-sage-300 text-sage-700 rounded-lg flex items-center justify-center transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const currentValue = parseInt(getNestedValue(answers, q.key) || '0') || 0;
                    if (currentValue > 0) {
                      handleSelect(q.key, (currentValue - 1).toString());
                    }
                  }}
                  className="w-8 h-8 bg-sage-200 hover:bg-sage-300 text-sage-700 rounded-lg flex items-center justify-center transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          ) : q.type === 'yesno' ? (
            <div className="flex gap-4">
              <button
                onClick={() => handleSelect(q.key, 'yes')}
                className={`rounded-xl px-8 py-4 text-base font-medium shadow-lg transition-all border-2 ${getNestedValue(answers, q.key) === 'yes' ? 'bg-sage-600 text-white border-sage-600 shadow-sage-200' : 'bg-white text-sage-700 border-sage-200 hover:border-sage-300 hover:shadow-md'}`}
                style={{ minWidth: 140, fontFamily: 'Inter, sans-serif' }}
              >
                Yes
              </button>
              <button
                onClick={() => handleSelect(q.key, 'no')}
                className={`rounded-xl px-8 py-4 text-base font-medium shadow-lg transition-all border-2 ${getNestedValue(answers, q.key) === 'no' ? 'bg-sage-600 text-white border-sage-600 shadow-sage-200' : 'bg-white text-sage-700 border-sage-200 hover:border-sage-300 hover:shadow-md'}`}
                style={{ minWidth: 300, fontFamily: 'Inter, sans-serif' }}
              >
                No
              </button>
            </div>
          ) : null}
          </div>
          {/* Bottom spacer to keep options centered relative to footer top */}
          <div className="flex-1" />
        </div>
        {/* Sticky Footer inside card */}
        <div className="py-4 md:py-5 px-6 md:px-8 border-top border-t bg-white/95 supports-[backdrop-filter]:bg-white/75 flex justify-between items-center gap-4">
          {/* Back Button */}
          <button
            onClick={handleBack}
            disabled={step === 0}
            className="group relative flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-white to-sage-50 border-2 border-sage-200 text-sage-700 font-serif text-base rounded-2xl shadow-lg hover:shadow-xl hover:border-sage-300 hover:from-white hover:to-sage-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          >
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-sage-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Icon with enhanced animation */}
            <div className="relative z-10 flex items-center justify-center w-6 h-6 bg-sage-100 rounded-full group-hover:bg-sage-200 transition-colors duration-300">
              <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            
            {/* Text */}
            <span className="relative z-10 font-semibold">Back</span>
          </button>
          
          {/* Progress Dots */}
          <div className="text-center mx-8">
            <div className="flex justify-center gap-1">
              {Array.from({ length: Math.ceil(questions.length / 2) }, (_, index) => {
                const startQuestion = index * 2;
                const endQuestion = Math.min(startQuestion + 1, questions.length - 1);
                const isCurrentDot = step >= startQuestion && step <= endQuestion;
                const isCompleted = step > endQuestion;
                const isHalfDot = questions.length % 2 === 1 && index === Math.ceil(questions.length / 2) - 1;
                
                return (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-sage-600' 
                        : isCurrentDot 
                          ? 'bg-sage-400' 
                          : 'bg-sage-200'
                    } ${isHalfDot ? 'w-1.5' : 'w-3'}`}
                  />
                );
              })}
            </div>
          </div>
          
          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={!getNestedValue(answers, q.key)}
            className="group relative flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-sage-500 to-sage-600 text-white font-serif text-base rounded-2xl shadow-lg hover:shadow-xl hover:from-sage-600 hover:to-sage-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          >
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Text */}
            <span className="relative z-10 font-semibold">{step === questions.length - 1 ? 'See Results' : 'Next'}</span>
            
            {/* Icon with enhanced animation */}
            <div className="relative z-10 flex items-center justify-center w-6 h-6 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors duration-300">
              <svg className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default Quiz; 

// PandaGifWithDelay: Shows a looping GIF with a 2s pause after each loop
const PANDA_GIF_URL = '/gif/panda.gif';
const GIF_DURATION_MS = 2000; // Set this to the actual duration of your GIF in ms
const PAUSE_MS = 2000; // 2s pause

function PandaGifWithDelay({ gifUrl }: { gifUrl: string }) {
  const [key, setKey] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // After GIF_DURATION_MS, pause for PAUSE_MS, then reload the GIF
    timeoutRef.current = setTimeout(() => {
      setKey(k => k + 1); // Force <img> reload
    }, GIF_DURATION_MS + PAUSE_MS);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [key]);

  return (
    <div className="mx-auto mb-2 flex items-center justify-center" style={{ width: '12rem', height: '12rem' }}>
      <div
        className="rounded-full overflow-hidden border-4 border-yellow-200 shadow-lg flex items-center justify-center"
        style={{ width: '12rem', height: '12rem', background: '#fff' }}
      >
        <img
          key={key}
          src={gifUrl}
          alt="Panda GIF"
          className="w-full h-full object-cover"
          style={{ display: 'block' }}
        />
      </div>
    </div>
  );
} 