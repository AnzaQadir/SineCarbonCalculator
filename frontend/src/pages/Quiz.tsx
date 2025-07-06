import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Calculator from '@/components/Calculator';
import { useCalculator } from '@/hooks/useCalculator';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';
import ResultsDisplay from '@/components/ResultsDisplay';
import { calculatePersonality } from '@/services/api';
import type { PersonalityResponse } from '@/services/api';
import type { UserResponses } from '@/services/api';

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9F7E8] px-4 py-12">
      {/* Brand logo */}
      <img src="/images/new_logo.png" alt="Zerrah logo" className="h-32 mb-6 opacity-90" />
      {/* Decorative background shape and illustration */}
      <div className="relative mb-8">
        <div className="absolute inset-0 w-80 h-80 bg-amber-100 rounded-full blur-2xl opacity-60 -z-10"></div>
        <img src="/images/intro_girl.png" alt="Quiz intro" className="w-64 h-64 rounded-full shadow-xl border-4 border-amber-200 object-cover" />
      </div>
      {/* Headline */}
      <h1 className="text-5xl font-extrabold text-emerald-900 mb-3 font-serif tracking-tight text-center">What's your sustainability story?</h1>
      {/* Subtitle */}
      <p className="italic text-lg text-amber-700 mb-4 max-w-2xl text-center">*Spoiler: it's not about being perfect, eating lettuce forever, or turning your life upside down overnight.*</p>
      {/* Description */}
      <p className="text-xl text-amber-900 mb-6 max-w-2xl text-center leading-relaxed">
        Take the Zerrah Quiz to discover your personal sustainability story, uncover your strengths, and get purposeful ideas to move forward.
      </p>
      {/* Final line */}
      <p className="text-base text-emerald-700 italic mb-8 text-center">Because the small stuff? It adds up.</p>
      {/* CTA Buttons */}
      <div className="flex gap-6">
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-bold py-3 px-8 rounded-full shadow transition" onClick={onStartA}>Begin My Story</button>
        <button className="bg-amber-500 hover:bg-amber-600 text-white text-lg font-bold py-3 px-8 rounded-full shadow transition" onClick={onStartB}>Surprise Me</button>
      </div>
    </div>
  );
}

const Quiz = () => {
  const { state, updateCalculator } = useCalculator();
  const [currentStep, setCurrentStep] = useState(0);
  const [started, setStarted] = useState<null | 'A' | 'B'>(null);
  const [notReady, setNotReady] = useState(false);

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
      <QuizIntro
        onStartA={() => setStarted('A')}
        onStartB={() => setStarted('B')}
      />
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
      <PoeticJourneyQuiz />
    );
  }
};

// Copy transformStateToApiFormat from ResultsDisplay
function transformStateToApiFormat(state: any): UserResponses {
  return {
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
}

function getSectionInfo(key: string) {
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
  if ([
    'airQuality.outdoorAirQuality', 'airQuality.aqiMonitoring', 'airQuality.indoorAirQuality', 'airQuality.airQualityCommuting', 'airQuality.airQualityImpact',
  ].includes(key)) {
    return {
      title: 'Chapter VI: The Air Around You',
      sub: 'How does the air you breathe feel—inside and out?'
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

  // Show scroll hint after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowScrollHint(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Expanded questions array covering all Calculator questions
  const questions = [
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
      question: 'How long do your clothes typically last?',
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
        { value: 'A', label: 'Brand Conscious' },
        { value: 'B', label: 'Flexible Shopper' },
        { value: 'C', label: 'Variety Seeker' }
      ]
    },

    // --- Waste ---
    {
      key: 'waste.prevention',
      header: 'Chapter 5: Waste & Wisdom',
      icon: '♻️',
      question: 'Imagine a typical day—how do you stop waste from ever reaching your bin?',
      type: 'select',
      options: [
        { value: 'A', label: 'Zero Waste Champion' },
        { value: 'B', label: 'Consistent Reuser' },
        { value: 'C', label: 'Occasional Reuser' },
        { value: 'D', label: 'Basic Disposer' }
      ]
    },
    {
      key: 'waste.smartShopping',
      header: 'Chapter 5: Waste & Wisdom',
      icon: '🛍️',
      question: 'Every purchase and disposal shapes the waste we create. Which option best describes your everyday approach?',
      type: 'select',
      options: [
        { value: 'A', label: 'Conscious Consumer' },
        { value: 'B', label: 'Balanced Shopper' },
        { value: 'C', label: 'Convenience Shopper' }
      ]
    },
    {
      key: 'waste.dailyWaste',
      header: 'Chapter 5: Waste & Wisdom',
      icon: '🗑️',
      question: 'How much waste do you typically generate in a day?',
      type: 'select',
      options: [
        { value: 'A', label: 'Minimal Waste' },
        { value: 'B', label: 'Moderate Waste' },
        { value: 'C', label: 'Regular Waste' },
        { value: 'D', label: 'High Waste' }
      ]
    },
    {
      key: 'waste.management',
      header: 'Chapter 5: Waste & Wisdom',
      icon: '♻️',
      question: 'Think about how you manage your everyday waste—what best reflects your habits?',
      type: 'select',
      options: [
        { value: 'A', label: 'Advanced Management' },
        { value: 'B', label: 'Basic Management' },
        { value: 'C', label: 'Limited Management' }
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
        { value: 'C', label: 'Usually Replace' }
      ]
    },

    // --- Air Quality ---
    {
      key: 'airQuality.outdoorAirQuality',
      header: 'Chapter 6: Breath of Life',
      icon: '🌬️',
      question: 'Imagine stepping outside into your neighborhood. How would you describe the quality of the air you breathe?',
      type: 'select',
      options: [
        { value: 'A', label: 'Fresh and Clean' },
        { value: 'B', label: 'Generally Clear' },
        { value: 'C', label: 'Sometimes Polluted' },
        { value: 'D', label: 'Not Sure' },
        { value: 'E', label: 'Mostly Polluted' }
      ]
    },
    {
      key: 'airQuality.aqiMonitoring',
      header: 'Chapter 6: Breath of Life',
      icon: '☀️',
      question: 'Do you check the Air Quality Index (AQI) in your area to plan your day or outdoor activities?',
      type: 'select',
      options: [
        { value: 'A', label: 'Active Monitoring' },
        { value: 'B', label: 'Basic Awareness' },
        { value: 'C', label: 'No Monitoring' }
      ]
    },
    {
      key: 'airQuality.indoorAirQuality',
      header: 'Chapter 6: Breath of Life',
      icon: '🏠',
      question: 'How do you manage the air inside your home to keep it as fresh as possible?',
      type: 'select',
      options: [
        { value: 'A', label: 'Air Purifiers & Plants' },
        { value: 'B', label: 'Natural Ventilation' },
        { value: 'C', label: 'Basic Management' },
        { value: 'D', label: 'Not Considered' }
      ]
    },
    {
      key: 'airQuality.airQualityCommuting',
      header: 'Chapter 6: Breath of Life',
      icon: '🚶',
      question: 'While commuting or running errands, do you make an effort to avoid times or areas with particularly poor air quality?',
      type: 'select',
      options: [
        { value: 'A', label: 'Air Quality Conscious' },
        { value: 'B', label: 'Sometimes Considerate' },
        { value: 'C', label: 'Not Considered' },
        { value: 'D', label: 'Never Thought About It' }
      ]
    },
    {
      key: 'airQuality.airQualityImpact',
      header: 'Chapter 6: Breath of Life',
      icon: '🌿',
      question: 'Have you ever felt that changes in air quality affect your mood or energy levels?',
      type: 'select',
      options: [
        { value: 'A', label: 'Low Impact' },
        { value: 'B', label: 'Moderate Impact' },
        { value: 'C', label: 'High Impact' }
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
  const [answers, setAnswers] = useState<any>({ ...state });

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

  function handleSelect(key: string, value: string) {
    console.log('handleSelect', 'key:', key, 'value:', value);
    if (key.includes('.')) {
      setAnswers((prev: any) => setNestedValue({ ...prev }, key, value));
      updateCalculator(setNestedValue({ ...state }, key, value));
    } else {
      setAnswers((prev: any) => ({ ...prev, [key]: value }));
      updateCalculator({ [key]: value });
    }
  }

  function handleNext() {
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
      const apiPayload = transformStateToApiFormat(answers);
      const apiResults = await calculatePersonality(apiPayload);
      setResults(apiResults);
      setShowResults(true);
    } catch (err) {
      setApiError('Failed to fetch results. Please try again.');
    } finally {
      setLoadingResults(false);
    }
  }

  if (showResults) {
    if (loadingResults) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F7E8] px-4 py-12">
          <div className="max-w-2xl w-full mx-auto bg-white/80 rounded-3xl shadow-xl p-8 mb-8 border border-[#A7D58E22] text-center">
            <h1 className="text-3xl font-serif mb-4">Calculating your results...</h1>
            <div className="text-lg text-[#A08C7D] italic">Please wait while we fetch your personalized results.</div>
          </div>
        </div>
      );
    }
    if (apiError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F7E8] px-4 py-12">
          <div className="max-w-2xl w-full mx-auto bg-white/80 rounded-3xl shadow-xl p-8 mb-8 border border-[#A7D58E22] text-center">
            <h1 className="text-3xl font-serif mb-4">Error</h1>
            <div className="text-lg text-red-600 italic mb-4">{apiError}</div>
            <button className="bg-green-600 text-white px-6 py-2 rounded-xl" onClick={handleFinishQuiz}>Try Again</button>
          </div>
        </div>
      );
    }
    // Compose categoryEmissions to match ResultsDisplay's expected type
    const categoryEmissions = {
      home: results?.categoryScores?.home?.score || 0,
      transport: results?.categoryScores?.transport?.score || 0,
      food: results?.categoryScores?.food?.score || 0,
      waste: results?.categoryScores?.waste?.score || 0,
    };
    // For recommendations, pass an empty array (or map if you have Recommendation[])
    return (
      <ResultsDisplay
        score={results?.finalScore || 0}
        emissions={Number(results?.impactMetrics?.carbonReduced) || 0}
        categoryEmissions={categoryEmissions}
        recommendations={[]}
        isVisible={true}
        onReset={() => window.location.reload()}
        state={answers}
        gender={answers.gender === 'female' ? 'girl' : 'boy'}
      />
    );
  }

  const q = questions[step];
  const section = getSectionInfo(q.key);

  // Determine background image based on question section
  let backgroundImage = '/images/home_background.png';
  if ([
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
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative"
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
      
      {/* Animated down arrow */}
      <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none transition-opacity duration-1000 ${showScrollHint ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex flex-col items-center">
          <div className="text-sm text-[#7A8B7A] opacity-70 mb-2 font-serif italic scroll-hint-text">
            More questions await...
          </div>
          <div className="scroll-hint-arrow">
            <svg 
              className="w-6 h-6 text-[#A7D58E] opacity-80" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 14l-7 7m0 0l-7-7m7 7V3" 
              />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Mobile swipe hint */}
      <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none md:hidden transition-opacity duration-1000 ${showScrollHint ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center gap-2 opacity-60">
          <div className="w-8 h-0.5 bg-[#A7D58E] rounded-full scroll-hint-line"></div>
          <span className="text-xs text-[#7A8B7A] font-serif scroll-hint-text">Swipe up</span>
          <div className="w-8 h-0.5 bg-[#A7D58E] rounded-full scroll-hint-line"></div>
        </div>
      </div>
      
      <div className="max-w-2xl w-full mx-auto bg-white/80 rounded-3xl shadow-xl p-8 mb-8 border border-[#A7D58E22] relative z-10">
        {/* Chapter Title */}
        <div className="mb-2">
          <h2 className="text-2xl md:text-3xl font-serif text-[#7A8B7A] text-center mb-1" style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600 }}>{section.title}</h2>
          <div className="text-base md:text-lg text-[#A08C7D] text-center italic mb-4" style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic', fontWeight: 400 }}>{section.sub}</div>
        </div>
        {/* Question */}
        <div className="flex flex-col items-center mb-6">
          <span style={{ fontSize: 48 }}>{q.icon}</span>
          <div className="text-2xl md:text-3xl font-serif text-[#7A8B7A] text-center mt-4 mb-2" style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 500 }}>{q.question}</div>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {q.key === 'country' ? (
            <select
              value={getNestedValue(answers, q.key) || ''}
              onChange={e => handleSelect(q.key, e.target.value)}
              className="rounded-xl px-6 py-4 text-lg font-serif border-2 border-[#E6E6F7] focus:border-[#A7D58E] focus:outline-none shadow w-full max-w-md bg-white appearance-none transition-colors duration-200 hover:border-[#A7D58E]"
              style={{ background: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M6 8L10 12L14 8\' stroke=\'%237A8B7A\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E") no-repeat right 1.5rem center/1.25rem 1.25rem', paddingRight: '3rem' }}
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
                    className="rounded-xl px-6 py-4 text-lg font-serif border-2 border-[#E6E6F7] bg-gray-100 text-gray-400 shadow w-full max-w-md appearance-none"
                  >
                    <option value="">Select a country first</option>
                  </select>
                );
              } else if (cities) {
                return (
                  <select
                    value={getNestedValue(answers, q.key) || ''}
                    onChange={e => handleSelect(q.key, e.target.value)}
                    className="rounded-xl px-6 py-4 text-lg font-serif border-2 border-[#E6E6F7] focus:border-[#A7D58E] focus:outline-none shadow w-full max-w-md bg-white appearance-none transition-colors duration-200 hover:border-[#A7D58E]"
                    style={{ background: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M6 8L10 12L14 8\' stroke=\'%237A8B7A\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E") no-repeat right 1.5rem center/1.25rem 1.25rem', paddingRight: '3rem' }}
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
                    className="rounded-xl px-6 py-4 text-lg font-serif border-2 border-[#E6E6F7] focus:border-[#A7D58E] focus:outline-none shadow w-full max-w-md"
                  />
                );
              }
            })()
          ) : q.key === 'country' ? (
            <select
              value={getNestedValue(answers, q.key) || ''}
              onChange={e => handleSelect(q.key, e.target.value)}
              className="rounded-xl px-6 py-4 text-lg font-serif border-2 border-[#E6E6F7] focus:border-[#A7D58E] focus:outline-none shadow w-full max-w-md bg-white appearance-none transition-colors duration-200 hover:border-[#A7D58E]"
              style={{ background: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M6 8L10 12L14 8\' stroke=\'%237A8B7A\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E") no-repeat right 1.5rem center/1.25rem 1.25rem', paddingRight: '3rem' }}
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
          ) : Array.isArray(q.options) ? (
            q.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSelect(q.key, opt.value)}
                className={`rounded-xl px-8 py-4 text-lg font-serif shadow transition-all border-2 ${getNestedValue(answers, q.key) === opt.value ? 'bg-[#A7D58E] text-white border-[#A7D58E]' : 'bg-white text-[#7A8B7A] border-[#E6E6F7]'}`}
                style={{ minWidth: 140 }}
              >
                {opt.label}
              </button>
            ))
          ) : q.type === 'text' ? (
            <input
              type="text"
              value={getNestedValue(answers, q.key) || ''}
              onChange={e => handleSelect(q.key, e.target.value)}
              placeholder={q.placeholder}
              className="rounded-xl px-6 py-4 text-lg font-serif border-2 border-[#E6E6F7] focus:border-[#A7D58E] focus:outline-none shadow w-full max-w-md"
            />
          ) : q.type === 'number' ? (
            <input
              type="number"
              value={getNestedValue(answers, q.key) || ''}
              onChange={e => handleSelect(q.key, e.target.value)}
              placeholder={q.placeholder}
              className="rounded-xl px-6 py-4 text-lg font-serif border-2 border-[#E6E6F7] focus:border-[#A7D58E] focus:outline-none shadow w-full max-w-md"
            />
          ) : q.type === 'yesno' ? (
            <div className="flex gap-4">
              <button
                onClick={() => handleSelect(q.key, 'yes')}
                className={`rounded-xl px-8 py-4 text-lg font-serif shadow transition-all border-2 ${getNestedValue(answers, q.key) === 'yes' ? 'bg-[#A7D58E] text-white border-[#A7D58E]' : 'bg-white text-[#7A8B7A] border-[#E6E6F7]'}`}
                style={{ minWidth: 140 }}
              >
                Yes
              </button>
              <button
                onClick={() => handleSelect(q.key, 'no')}
                className={`rounded-xl px-8 py-4 text-lg font-serif shadow transition-all border-2 ${getNestedValue(answers, q.key) === 'no' ? 'bg-[#A7D58E] text-white border-[#A7D58E]' : 'bg-white text-[#7A8B7A] border-[#E6E6F7]'}`}
                style={{ minWidth: 140 }}
              >
                No
              </button>
            </div>
          ) : null}
        </div>
        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className="rounded-full px-6 py-2 bg-[#E6E6F7] text-[#7A8B7A] font-serif text-lg shadow hover:bg-[#D6F5E3] transition"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="rounded-full px-6 py-2 bg-[#A7D58E] text-white font-serif text-lg shadow hover:bg-[#7A8B7A] transition"
            disabled={!getNestedValue(answers, q.key)}
          >
            {step === questions.length - 1 ? 'See Results' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Quiz; 