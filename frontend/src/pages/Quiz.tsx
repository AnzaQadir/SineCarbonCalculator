import React, { useState } from 'react';
import Layout from '@/components/Layout';
import Calculator from '@/components/Calculator';
import { useCalculator } from '@/hooks/useCalculator';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';

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

function QuizIntro({ onStart, onBack }: { onStart: () => void; onBack?: () => void }) {
  return (
    <div
      className="min-h-screen flex flex-col bg-[#F9F7E8]"
      style={{ fontFamily: "'Cormorant Garamond', serif" }}
    >
      {/* Back Button */}
      <button
        onClick={onBack ? onBack : () => window.history.back()}
        style={{
          position: 'absolute',
          top: 18,
          left: 18,
          background: 'none',
          border: 'none',
          color: '#7A8B7A', // gentle moss green
          fontSize: 32,
          cursor: 'pointer',
          opacity: 0.85,
          zIndex: 10,
          padding: 0,
          lineHeight: 1,
          display: 'flex',
          alignItems: 'center'
        }}
        aria-label="Back"
      >
        <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 28L8 16L20 4" />
        </svg>
      </button>
      {/* Brand */}
      <div className="pt-0 pl-8 pb-0 m-0">
        <img
          src="/images/new_logo.png"
          alt="Zerrah logo"
          style={{
            height: 140,
            width: 'auto',
            opacity: 0.85,
            objectFit: 'contain',
            filter: 'brightness(0.85)',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}
        />
      </div>
      <div className="flex flex-col w-full max-w-4xl mx-auto px-6 md:px-12 gap-0 items-center">
        <motion.div
          initial="hidden"
          animate="visible"
          className="flex-1 flex flex-col items-center"
        >
          <motion.div custom={0} variants={fadeUp} className="mb-2 mt-0 p-0 m-0">
            <span
              style={{
                fontSize: 28,
                color: '#7A8B7A', // more prominent moss green or slate
                fontStyle: 'italic',
                textAlign: 'center',
                display: 'block',
                fontWeight: 500,
                letterSpacing: '0.01em',
                lineHeight: 1.7
              }}
            >
              Every journey begins with a quiet question.
            </span>
          </motion.div>
          <motion.h1
            custom={1}
            variants={fadeUp}
            className="mb-2"
            style={{
              fontSize: 48,
              color: '#E07A7A', // dusty rose
              fontWeight: 400,
              textAlign: 'center',
              lineHeight: 1.5,
              letterSpacing: '-0.01em',
              fontFamily: "'Cormorant Garamond', serif"
            }}
          >
            Let&apos;s begin your story.
          </motion.h1>
          <motion.div
            custom={2}
            variants={fadeUp}
            className="mb-2"
            style={{
              fontSize: 20,
              color: '#B97B5B', // muted coral/ochre
              textAlign: 'center',
              lineHeight: 1.6,
              maxWidth: 540,
              fontFamily: "'Cormorant Garamond', serif"
            }}
          >
            This isn&apos;t a test. It&apos;s a gentle mirror — a place to pause, breathe, and meet yourself where you are.
          </motion.div>
          {/* Illustration with hover reveal */}
          <motion.div
            custom={3}
            variants={fadeUp}
            className="mb-4 w-full flex justify-center"
          >
            <CircularImageReveal />
          </motion.div>
          <motion.div
            custom={4}
            variants={fadeUp}
            className="mb-4"
            style={{
              fontSize: 19,
              color: '#A08C7D', // soft taupe
              textAlign: 'center',
              lineHeight: 1.5,
              fontStyle: 'italic',
              fontFamily: "'Cormorant Garamond', serif"
            }}
          >
            Each question is a whisper. Each answer reveals a quiet truth.
          </motion.div>
        </motion.div>
      </div>
      {/* CTA Button (left-aligned under illustration/text) */}
      <motion.div
        custom={5}
        variants={fadeUp}
        className="w-full max-w-4xl mx-auto px-6 md:px-12 mt-0 flex flex-col items-center pb-6 mb-2"
      >
        <motion.button
          whileHover={{
            scale: 1.03,
            boxShadow: '0 0 0 8px #A7D58E33',
            opacity: 0.95
          }}
          whileTap={{ scale: 0.98 }}
          onClick={onStart}
          style={{
            background: '#A7D58E',
            color: '#fff',
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 22,
            border: 'none',
            borderRadius: 999,
            padding: '18px 48px',
            boxShadow: '0 6px 28px 0 rgba(167,213,142,0.18)',
            cursor: 'pointer',
            fontWeight: 400,
            letterSpacing: '0.02em',
            marginBottom: 32
          }}
        >
          Step Into the Story
        </motion.button>
      </motion.div>
    </div>
  );
}

const Quiz = () => {
  const { state, updateCalculator } = useCalculator();
  const [currentStep, setCurrentStep] = useState(0);
  const [started, setStarted] = useState(false);
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

  if (!started) {
    return <QuizIntro onStart={() => setStarted(true)} />;
  }

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
};

export default Quiz; 