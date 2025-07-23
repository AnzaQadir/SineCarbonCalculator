import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Import the panda SVG as a React component

// Example icons (replace with hand-drawn SVGs or PNGs as needed)
const icons = {
  name: <span role="img" aria-label="wave">👋</span>,
  location: <span role="img" aria-label="home">🏡</span>,
  age: <span role="img" aria-label="seedling">🌱</span>,
  gender: <span role="img" aria-label="person">🧑</span>,
  profession: <span role="img" aria-label="briefcase">💼</span>,
  household: <span role="img" aria-label="family">👨‍👩‍👧‍👦</span>,
  email: <span role="img" aria-label="email">✉️</span>,
};

type Q = {
  key: string;
  question: string | ((a: Record<string,string>)=>string);
  subtext?: string | ((a: Record<string,string>)=>string);
  icon: React.ReactNode;
  inputType: 'text'|'email'|'number'|'select';
  placeholder?: string;
  required?: boolean;
  options?: string[];
  validate?: (val:string)=>boolean;
  error?: string;
};

const questions: Q[] = [
  {
    key:'name',
    question:'Bobo: “Hi there ��”',
    subtext:'I’m Bobo, your friendly panda guide. What name should I call you as we explore your climate story together?',
    icon: icons.name,
    inputType:'text',
    placeholder:'Your first name',
    required:true,
  },
  {
    key:'email',
    question:(a)=>`Bobo: “Lovely to meet you${a.name?`, ${a.name}`:''}!”`,
    subtext:'Where can I send your personalized reflections and gentle updates? I pinky promise — no spam, just little nudges of joy.',
    icon: icons.email,
    inputType:'email',
    placeholder:'you@example.com',
    required:true,
    validate:(v)=>/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v),
    error:'Please enter a valid email address.'
  },
  {
    key:'age',
    question:'Bobo: “Out of soft curiosity…”',
    subtext:'How many seasons young are you? Everyone’s welcome here, no matter how many birthdays they’ve gathered 🌱',
    icon: icons.age,
    inputType:'number',
    placeholder:'Your age',
    required:true,
    validate:(v)=>/^\d+$/.test(v)&&Number(v)>0,
    error:'Please enter a valid age.'
  },
  {
    key:'gender',
    question:'Bobo: “And if you feel like sharing…”',
    subtext:'How do you identify? Our community blooms brightest when every voice and identity feels seen.',
    icon: icons.gender,
    inputType:'select',
    options:['Female','Male','Non-binary','Prefer to self-describe','Prefer not to say'],
    required:true,
  },
  {
    key:'profession',
    question:(a)=>`Bobo: “What fills your days${a.name?`, ${a.name}`:''}?”`,
    subtext:'Whether you’re learning, creating, working, or caring — your rhythm matters. I’ll use this to tailor your experience.',
    icon: icons.profession,
    inputType:'select',
    options:[
      'Student (School / College / University)','Education (Teacher, Lecturer, Academic)','Business & Management','Engineering & Technology','Health & Medicine','Science & Research','Law & Policy','Environment & Sustainability','Arts, Design & Creative Fields','Media & Communications','Social Sciences & Humanities','IT & Software Development','Government & Public Sector','Hospitality, Travel & Tourism','Skilled Trades (e.g., Electrician, Plumber, Mechanic)','Retail, Sales & Customer Service','Logistics, Transport & Delivery','Home & Caregiving (e.g., Stay-at-home parent, Care worker)','Currently Unemployed or Exploring Options','Prefer Not to Say'
    ],
    required:true,
  },
  {
    key:'location',
    question:'Bobo: “Where’s home for you?”',
    subtext:'City, country — wherever you feel rooted. This helps me notice local patterns and stories across our eco-community 🌏',
    icon: icons.location,
    inputType:'text',
    placeholder:'City, Country',
    required:true,
  },
  {
    key:'household',
    question:'Bobo: “And who shares your cozy nest?”',
    subtext:'How many hearts live with you at home? Every household, big or small, is a climate team in disguise 💛',
    icon: icons.household,
    inputType:'number',
    placeholder:'Number of people',
    required:true,
    validate:(v)=>/^\d+$/.test(v)&&Number(v)>0,
    error:'Please enter a valid number greater than 0.'
  }
];

const backgroundNature = (
  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bg-grad" cx="50%" cy="50%" r="80%">
        <stop offset="0%" stopColor="#f7fafc" />
        <stop offset="100%" stopColor="#e6fffa" />
      </radialGradient>
    </defs>
    <rect width="800" height="600" fill="url(#bg-grad)" />
    {/* Leaves drifting */}
    <motion.ellipse cx="120" cy="80" rx="30" ry="12" fill="#b9fbc0" initial={{ y: 0 }} animate={{ y: [0, 20, 0] }} transition={{ duration: 8, repeat: Infinity }} opacity={0.3} />
    <motion.ellipse cx="700" cy="500" rx="24" ry="10" fill="#a3e635" initial={{ y: 0 }} animate={{ y: [-10, 10, -10] }} transition={{ duration: 10, repeat: Infinity }} opacity={0.2} />
    {/* Sunbeam */}
    <motion.circle cx="650" cy="100" r="60" fill="#fef9c3" initial={{ opacity: 0.7 }} animate={{ opacity: [0.7, 0.5, 0.7] }} transition={{ duration: 6, repeat: Infinity }} />
    {/* Wind lines */}
    <motion.path d="M200 400 Q250 390 300 400" stroke="#bae6fd" strokeWidth="6" fill="none" initial={{ x: 0 }} animate={{ x: [0, 20, 0] }} transition={{ duration: 7, repeat: Infinity }} opacity={0.2} />
    <motion.path d="M500 200 Q550 190 600 200" stroke="#bae6fd" strokeWidth="4" fill="none" initial={{ x: 0 }} animate={{ x: [-10, 10, -10] }} transition={{ duration: 9, repeat: Infinity }} opacity={0.15} />
  </svg>
);

const pandaVariants = {
  idle: { rotate: 0, y: 0 },
  tilt: { rotate: -10, y: -5 },
  wave: { rotate: [0, 10, -10, 0], y: [0, -5, 0, 0] },
};

export interface ConversationalSignupProps {
  onComplete: (data: Record<string, string>) => void;
}

const ConversationalSignup: React.FC<ConversationalSignupProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [animState, setAnimState] = useState<'idle' | 'tilt' | 'wave'>('idle');
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null);

  const current = questions[step];
  const isLast = step === questions.length - 1;

  // Set input value when step changes (for editing previous answers or default)
  React.useEffect(() => {
    console.log('[Signup] Step changed:', step, 'question key:', current.key);
    setInputValue(answers[current.key] || '');
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 100); // ensure focus after animation
  }, [step]);

  // Panda animates on question change
  React.useEffect(() => {
    setAnimState('tilt');
    const timeout = setTimeout(() => setAnimState('idle'), 1200);
    return () => clearTimeout(timeout);
  }, [step]);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    console.log('[Signup] Submit clicked at step', step, 'key:', current.key, 'raw value:', inputValue);
    setError(null);
    const value = inputValue.trim();
    if (current.required && !value) {
      console.warn('[Signup] Validation failed: required value missing for key', current.key);
      setError('This field is required.');
      return;
    }
    if (current.validate && !current.validate(value)) {
      console.warn('[Signup] Validation failed: custom validation for key', current.key, 'value:', value);
      setError(current.error || 'Invalid input.');
      return;
    }
    setSubmitting(true);

    const updatedAnswers = { ...answers, [current.key]: value };
    console.log('[Signup] Answers updated:', updatedAnswers);
    setAnswers(updatedAnswers);

    if (!isLast) {
      console.log('[Signup] Advancing to step', step + 1);
      setStep(step + 1);
      // allow animation to finish before allowing next submit
      setTimeout(() => setSubmitting(false), 400);
    } else {
      console.log('[Signup] Final submission. Completing signup with data:', updatedAnswers);
      onComplete(updatedAnswers);
      setSubmitting(false);
    }
    setAnimState('wave');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    console.log('[Signup] Input change at step', step, 'key:', current.key, 'value:', e.target.value);
    setInputValue(e.target.value);
  };

  return (
    <div className="relative min-h-[600px] flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(120deg, #f7fafc 0%, #e6fffa 100%)' }}>
      {backgroundNature}
      {/* Panda mascot */}
      <motion.div
        className="absolute left-0 bottom-0 md:left-12 md:bottom-8 z-20 flex flex-col items-center"
        animate={animState}
        variants={pandaVariants}
        transition={{ duration: 1, type: 'spring' }}
        style={{ width: 180, height: 220 }}
      >
        <img src="/images/panda.svg" alt="Panda mascot" className="w-40 h-44 drop-shadow-xl select-none pointer-events-none" />
        {/* Blush effect */}
        <motion.div
          className="absolute left-10 bottom-16 w-6 h-3 rounded-full bg-pink-200 opacity-70"
          animate={{ opacity: [0.7, 0.3, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute right-10 bottom-16 w-6 h-3 rounded-full bg-pink-200 opacity-70"
          animate={{ opacity: [0.7, 0.3, 0.7] }}
          transition={{ duration: 2.2, repeat: Infinity }}
        />
      </motion.div>
      {/* Chat bubble interface */}
      <div className="relative z-30 flex flex-col items-center w-full max-w-md mx-auto">
        <form onSubmit={handleNext} className="w-full">
            <Card className="rounded-3xl px-6 py-8 shadow-xl bg-white/90 border-2 border-emerald-100 flex flex-col items-center gap-4">
              <div className="text-xs text-emerald-700 absolute top-2 right-4">Step {step + 1}/{questions.length} ({current.key})</div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{current.icon}</span>
                <span className="text-lg font-semibold text-emerald-900">{typeof current.question==='function'?current.question(answers):current.question}</span>
              </div>
              {current.subtext && (
                <div className="text-sm text-gray-500 text-center mb-2">{typeof current.subtext==='function'?current.subtext(answers):current.subtext}</div>
              )}
              {current.inputType === 'select' ? (
                <select
                  ref={inputRef as React.RefObject<HTMLSelectElement>}
                  className="w-full rounded-xl border border-emerald-100 px-4 py-3 text-lg focus:ring-2 focus:ring-emerald-300 focus:border-transparent bg-emerald-50"
                  value={inputValue}
                  onChange={handleInputChange}
                  required={current.required}
                  disabled={submitting}
                >
                  <option value="" disabled>
                    {current.placeholder || 'Select...'}
                  </option>
                  {current.options?.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : current.inputType === 'number' ? (
                <input
                  ref={inputRef as React.RefObject<HTMLInputElement>}
                  type="number"
                  min={1}
                  className="w-full rounded-xl border border-emerald-100 px-4 py-3 text-lg focus:ring-2 focus:ring-emerald-300 focus:border-transparent bg-emerald-50"
                  placeholder={current.placeholder}
                  value={inputValue}
                  onChange={handleInputChange}
                  required={current.required}
                  autoFocus
                  disabled={submitting}
                />
              ) : (
                <input
                  ref={inputRef as React.RefObject<HTMLInputElement>}
                  type={current.inputType}
                  className="w-full rounded-xl border border-emerald-100 px-4 py-3 text-lg focus:ring-2 focus:ring-emerald-300 focus:border-transparent bg-emerald-50"
                  placeholder={current.placeholder}
                  value={inputValue}
                  onChange={handleInputChange}
                  required={current.required}
                  autoFocus
                  disabled={submitting}
                />
              )}
              {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
              <Button type="submit" className="mt-2 w-full rounded-full bg-emerald-400 hover:bg-emerald-500 text-white text-lg font-bold py-2 shadow-md" disabled={submitting}>
                {isLast ? 'Finish' : 'Next'}
              </Button>
            </Card>
        </form>
      </div>
    </div>
  );
};

export default ConversationalSignup; 