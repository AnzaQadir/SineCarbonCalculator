import React, { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import Calculator from '@/components/Calculator';
import { useCalculator } from '@/hooks/useCalculator';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';
import ResultsDisplay from '@/components/ResultsDisplay';
import { calculatePersonality, logEvent, checkUserExists, createSession } from '@/services/api';
import type { PersonalityResponse } from '@/services/api';
import type { UserResponses } from '@/services/api';
import { personalityQuestions } from '@/data/personalityQuestions';
import { useQuizStore } from '@/stores/quizStore';
import { getSessionId } from '@/services/session';

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
                className="text-slate-800 font-serif text-3xl lg:text-4xl font-bold tracking-wide mb-2"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
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
              
              {/* Decorative underline */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100px" }}
                transition={{ duration: 1, delay: 1.2 }}
                className="h-0.5 bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full mx-auto mt-3"
              />
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
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Let's begin your
              <span className="block text-slate-900">
                sustainability story.
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="text-xl lg:text-2xl text-slate-600 leading-relaxed font-light"
            >
              This isn't about being perfect — it's about being present. One small step, together with Bobo.
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
                Bobo will guide you through each step — with kindness, curiosity, and zero judgment.
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
                className="group relative w-full max-w-md mx-auto bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white text-xl font-bold py-6 px-12 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden"
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
  const [currentStep, setCurrentStep] = useState(0);
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
  };

  const handleNext = () => {
    setCurrentStep(prev => Math.min(5, prev + 1));
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
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
  const setQuizAnswers = useQuizStore(state => state.setQuizAnswers);

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
        { value: 'C', label: 'Frequent Flyer' }
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
      type: 'text',
      placeholder: 'Enter your email'
    },
    {
      key: 'age',
      header: 'Chapter 7: Your Story',
      icon: '🎂',
      question: 'How many years young are you?',
      type: 'select',
      options: [
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
      icon: '🌈',
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

  // Store answers in the same structure as CalculatorState
  const answersRef = useRef<any>({});

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
    
    // Special handling for username verification on Next button click
    if (q.key === 'name') {
      console.log('🎯 Next button clicked for username question:', currentAnswer);
      if (currentAnswer && currentAnswer.trim()) {
        try {
          console.log('🔍 Checking user existence for:', currentAnswer);
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
            return; // Don't proceed to next step, show welcome back screen
          } else {
            console.log('User not found, proceeding with quiz');
          }
        } catch (error) {
          console.error('Error checking user existence:', error);
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
            className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-16 border border-slate-200/50 relative overflow-hidden"
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
              className="text-center mb-12"
            >
              <motion.h1 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-5xl md:text-6xl font-serif mb-8 text-slate-900 leading-tight" 
                style={{ 
                  fontFamily: 'Cormorant Garamond, serif',
                  fontWeight: 700
                }}
              >
                Welcome back, {existingUser.firstName || existingUser.email}!
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-2xl mx-auto font-light"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                We already know a glimpse of your story. Let's see your personalized results.
              </motion.p>
              
              {/* Elegant separator */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "80px" }}
                transition={{ duration: 1, delay: 1.2 }}
                className="h-px bg-gradient-to-r from-slate-300 to-slate-400 rounded-full mx-auto mt-8"
              ></motion.div>
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
                className="group relative inline-flex items-center gap-4 px-12 py-5 bg-gradient-to-r from-[#FA8072] to-[#FFB6C1] text-white text-xl font-medium rounded-2xl shadow-xl hover:shadow-2xl hover:from-[#FFB6C1] hover:to-[#FA8072] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
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
                <span className="relative z-10">
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
          setShowResults(false);
          setResults(null);
          // Go back to the welcome back screen while preserving all quiz data
          setShowExistingUserScreen(true);
          // All quiz data (answers, personalityTraits, existingUser) remains intact
        }}
        state={answers}
        gender={answers.gender === 'female' ? 'girl' : 'boy'}
        // Pass the comprehensivePowerMoves data directly
        comprehensivePowerMoves={results?.comprehensivePowerMoves}
      />
    );
  }

  const q = questions[step];
  const section = getSectionInfo(q.key, q.type);

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

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto',
        backgroundPosition: 'top left',
        backgroundColor: '#F9F7E8',
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
      
      {/* Fading edge gradient at bottom */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-5"
        style={{
          background: 'linear-gradient(to top, rgba(249, 247, 232, 0.9) 0%, rgba(249, 247, 232, 0.6) 30%, rgba(249, 247, 232, 0.3) 60%, transparent 100%)',
          zIndex: 5
        }}
      />
      

      

      
      <div className="max-w-5xl w-full mx-auto bg-white/80 rounded-3xl shadow-xl p-8 mb-6 border border-[#A7D58E22] relative z-10 max-h-[90vh] overflow-y-auto">
        {/* Chapter Title */}
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-serif text-sage-800 text-center mb-2 tracking-wide" style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700 }}>{section.title}</h2>
          <div className="text-base md:text-lg text-sage-600 text-center italic mb-4 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic', fontWeight: 400 }}>{section.sub}</div>
        </div>
        {/* Question */}
        <div className="flex flex-col items-center mb-4">
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
              className="relative group"
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
            className="text-2xl md:text-3xl lg:text-4xl font-serif text-sage-800 text-center mt-8 mb-8 leading-tight" 
            style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600 }}
          >
            {q.question}
          </motion.div>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mb-8 max-w-4xl mx-auto">
          {q.key === 'country' ? (
            <select
              value={getNestedValue(answers, q.key) || ''}
              onChange={e => handleSelect(q.key, e.target.value)}
              className="rounded-xl px-6 py-4 text-base font-medium border-2 border-sage-200 focus:border-sage-500 focus:outline-none shadow-lg w-full max-w-lg bg-white appearance-none transition-colors duration-200 hover:border-sage-300 text-sage-800"
              style={{ background: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M6 8L10 12L14 8\' stroke=\'%237A8B7A\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E") no-repeat right 1.5rem center/1.25rem 1.25rem', paddingRight: '3rem', fontFamily: 'Inter, sans-serif' }}
            >
              <option value="" disabled>Enter your country</option>
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Australia">Australia</option>
              <option value="India">India</option>
              <option value="Pakistan">Pakistan</option>
              <option value="United Arab Emirates">United Arab Emirates</option>
              <option value="Saudi Arabia">Saudi Arabia</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
              <option value="Brazil">Brazil</option>
              <option value="Japan">Japan</option>
              <option value="China">China</option>
              <option value="South Africa">South Africa</option>
              <option value="Turkey">Turkey</option>
              <option value="Indonesia">Indonesia</option>
              <option value="Bangladesh">Bangladesh</option>
              <option value="Nigeria">Nigeria</option>
              <option value="Mexico">Mexico</option>
              <option value="Russia">Russia</option>
              <option value="Egypt">Egypt</option>
              <option value="Argentina">Argentina</option>
              <option value="Italy">Italy</option>
              <option value="Spain">Spain</option>
              <option value="Other">Other</option>
            </select>
          ) : q.key === 'location' ? (
            (() => {
              const selectedCountry = getNestedValue(answers, 'country');
              const cities = countryCityMap[selectedCountry];
              if (!selectedCountry) {
                return (
                  <select
                    disabled
                    className="rounded-xl px-6 py-4 text-base font-medium border-2 border-sage-200 bg-gray-100 text-gray-400 shadow-lg w-full max-w-lg appearance-none"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    <option value="">Select a country first</option>
                  </select>
                );
              } else if (cities) {
                return (
                  <select
                    value={getNestedValue(answers, q.key) || ''}
                    onChange={e => handleSelect(q.key, e.target.value)}
                    className="rounded-xl px-6 py-4 text-base font-medium border-2 border-sage-200 focus:border-sage-500 focus:outline-none shadow-lg w-full max-w-lg bg-white appearance-none transition-colors duration-200 hover:border-sage-300 text-sage-800"
                    style={{ background: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M6 8L10 12L14 8\' stroke=\'%237A8B7A\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E") no-repeat right 1.5rem center/1.25rem 1.25rem', paddingRight: '3rem', fontFamily: 'Inter, sans-serif' }}
                  >
                    <option value="" disabled>Select your city</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                );
              } else {
                return (
                  <input
                    type="text"
                    value={getNestedValue(answers, q.key) || ''}
                    onChange={e => handleSelect(q.key, e.target.value)}
                    placeholder="Enter your city"
                    className="rounded-xl px-6 py-4 text-base font-medium border-2 border-sage-200 focus:border-sage-500 focus:outline-none shadow-lg w-full max-w-lg text-sage-800 placeholder-sage-400"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                );
              }
            })()
          ) : q.type === 'personality' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {q.options?.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(q.key, opt.value)}
                  className={`rounded-xl px-8 py-4 text-base font-medium shadow-lg transition-all border-2 ${getNestedValue(answers, q.key) === opt.value ? 'bg-sage-600 text-white border-sage-600 shadow-sage-200' : 'bg-white text-sage-700 border-sage-200 hover:border-sage-300 hover:shadow-md'}`}
                  style={{ minWidth: 180, fontFamily: 'Inter, sans-serif' }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          ) : Array.isArray(q.options) ? (
            q.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSelect(q.key, opt.value)}
                className={`rounded-xl px-8 py-4 text-base font-medium shadow-lg transition-all border-2 ${getNestedValue(answers, q.key) === opt.value ? 'bg-sage-600 text-white border-sage-600 shadow-sage-200' : 'bg-white text-sage-700 border-sage-200 hover:border-sage-300 hover:shadow-md'}`}
                style={{ minWidth: 180, fontFamily: 'Inter, sans-serif' }}
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
              className="rounded-xl px-6 py-4 text-base font-medium border-2 border-sage-200 focus:border-sage-500 focus:outline-none shadow-lg w-full max-w-lg text-sage-800 placeholder-sage-400"
              style={{ fontFamily: 'Inter, sans-serif' }}
            />
          ) : q.type === 'number' ? (
            <input
              type="number"
              value={getNestedValue(answers, q.key) || ''}
              onChange={e => handleSelect(q.key, e.target.value)}
              placeholder={q.placeholder}
              className="rounded-xl px-6 py-4 text-base font-medium border-2 border-sage-200 focus:border-sage-500 focus:outline-none shadow-lg w-full max-w-lg text-sage-800 placeholder-sage-400"
              style={{ fontFamily: 'Inter, sans-serif' }}
            />
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
        <div className="flex justify-between items-center mt-8 max-w-5xl mx-auto">
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
    </div>
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