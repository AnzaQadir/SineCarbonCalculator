import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { getUserData } from '@/services/session';

// Avatar image paths
const pandaSrc = '/images/panda.svg';
const penguinSrc = '/images/penguin.png';

// Helper types
interface Message { role: 'bot' | 'user'; text: string; }

// Question definition (reuse the updated Q type)
type Q = {
  key: string;
  question: string | ((a: Record<string, string>) => string);
  subtext?: string | ((a: Record<string, string>) => string);
  inputType: 'text' | 'email' | 'number' | 'select';
  placeholder?: string;
  required?: boolean;
  options?: string[];
  validate?: (val: string) => boolean;
  error?: string;
};

// Same questions array as ConversationalSignup (copied here for isolation)
const questions: Q[] = [
  {
    key: 'name',
    question: 'Bobo: “Hi there 🌿”',
    subtext: 'I’m Bobo, your friendly panda guide. What name should I call you as we explore your climate story together?',
    inputType: 'text',
    placeholder: 'Your first name',
    required: true,
  },
  {
    key: 'email',
    question: (a) => `Bobo: “Lovely to meet you${a.name ? `, ${a.name}` : ''}!”`,
    subtext: 'Where can I send your personalized reflections and gentle updates? I pinky promise — no spam, just little nudges of joy.',
    inputType: 'email',
    placeholder: 'you@example.com',
    required: true,
    validate: (v) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v),
    error: 'Please enter a valid email address.',
  },
  {
    key: 'age',
    question: 'Bobo: “Out of soft curiosity…”',
    subtext: 'How many seasons young are you? Everyone’s welcome here, no matter how many birthdays they’ve gathered 🌱',
    inputType: 'number',
    placeholder: 'Your age',
    required: true,
    validate: (v) => /^\d+$/.test(v) && Number(v) > 0,
    error: 'Please enter a valid age.',
  },
  {
    key: 'gender',
    question: 'Bobo: “And if you feel like sharing…”',
    subtext: 'How do you identify? Our community blooms brightest when every voice and identity feels seen.',
    inputType: 'select',
    options: ['Female', 'Male', 'Non-binary', 'Prefer to self-describe', 'Prefer not to say'],
    required: true,
  },
  {
    key: 'profession',
    question: (a) => `Bobo: “What fills your days${a.name ? `, ${a.name}` : ''}?”`,
    subtext: 'Whether you’re learning, creating, working, or caring — your rhythm matters. I’ll use this to tailor your experience.',
    inputType: 'select',
    options: [
      'Student (School / College / University)',
      'Education (Teacher, Lecturer, Academic)',
      'Business & Management',
      'Engineering & Technology',
      'Health & Medicine',
      'Science & Research',
      'Law & Policy',
      'Environment & Sustainability',
      'Arts, Design & Creative Fields',
      'Media & Communications',
      'Social Sciences & Humanities',
      'IT & Software Development',
      'Government & Public Sector',
      'Hospitality, Travel & Tourism',
      'Skilled Trades (e.g., Electrician, Plumber, Mechanic)',
      'Retail, Sales & Customer Service',
      'Logistics, Transport & Delivery',
      'Home & Caregiving (e.g., Stay-at-home parent, Care worker)',
      'Currently Unemployed or Exploring Options',
      'Prefer Not to Say',
    ],
    required: true,
  },
  {
    key: 'location',
    question: 'Bobo: “Where’s home for you?”',
    subtext: 'City, country — wherever you feel rooted. This helps me notice local patterns and stories across our eco-community 🌏',
    inputType: 'text',
    placeholder: 'City, Country',
    required: true,
  },
  {
    key: 'household',
    question: 'Bobo: “And who shares your cozy nest?”',
    subtext: 'How many hearts live with you at home? Every household, big or small, is a climate team in disguise 💛',
    inputType: 'number',
    placeholder: 'Number of people',
    required: true,
    validate: (v) => /^\d+$/.test(v) && Number(v) > 0,
    error: 'Please enter a valid number greater than 0.',
  },
];

interface Props { onComplete: (data: Record<string, string>) => void; }

const ChatSignup: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check for existing user data on mount
  useEffect(() => {
    const existingUserData = getUserData();
    if (existingUserData) {
      // Prefill answers with existing data
      const prefilledAnswers: Record<string, string> = {};
      
      if (existingUserData.firstName) prefilledAnswers.name = existingUserData.firstName;
      if (existingUserData.email) prefilledAnswers.email = existingUserData.email;
      if (existingUserData.age) prefilledAnswers.age = existingUserData.age;
      if (existingUserData.gender) prefilledAnswers.gender = existingUserData.gender;
      if (existingUserData.profession) prefilledAnswers.profession = existingUserData.profession;
      if (existingUserData.city && existingUserData.country) {
        prefilledAnswers.location = `${existingUserData.city}, ${existingUserData.country}`;
      }
      if (existingUserData.household) prefilledAnswers.household = existingUserData.household;
      
      setAnswers(prefilledAnswers);
      
      // Skip to the end if we have all the data
      if (Object.keys(prefilledAnswers).length >= questions.length - 1) {
        setStep(questions.length - 1);
        setMessages([
          { role: 'bot', text: `🐼 Bobo: "Welcome back! I see you've been here before. Let me just confirm your details..."` },
        ]);
      } else {
        // Set initial message only if not skipping to end
        setMessages([{ role: 'bot', text: makeBotText(current, answers) }]);
      }
    } else {
      // Set initial message for new users
      setMessages([{ role: 'bot', text: makeBotText(current, answers) }]);
    }
  }, []); // Only run once on mount

  const current = questions[step];
  const isLast = step === questions.length - 1;

  // helper to render text or function
  const render = (v: string | ((a: Record<string,string>)=>string)) => typeof v==='function'?v(answers):v;

  const makeBotText = (q: Q, currentAns: Record<string,string>) => {
    const main = typeof q.question === 'function'? q.question(currentAns): q.question;
    const sub = q.subtext ? (typeof q.subtext === 'function'? q.subtext(currentAns): q.subtext) : '';
    return sub ? `${main}\n${sub}` : main;
  };



  // auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendUserAnswer = () => {
    if (!inputValue.trim()) return;
    // user message
    setMessages((m) => [...m, { role: 'user', text: inputValue.trim() }]);

    // validate
    if (current.validate && !current.validate(inputValue.trim())) {
      setError(current.error || 'Invalid input');
      return;
    }

    const updatedAns = { ...answers, [current.key]: inputValue.trim() };
    setAnswers(updatedAns);
    setInputValue('');

    if (!isLast) {
      const next = questions[step + 1];
      // push bot message after small delay
      setTimeout(() => {
        setMessages((m) => [
          ...m,
          { role: 'bot', text: makeBotText(next, updatedAns) },
        ]);
        setStep(step + 1);
      }, 400);
    } else {
      // final
      setMessages((m) => [
        ...m,
        { role: 'bot', text: `🐼 Bobo: “Thank you for sharing, ${updatedAns.name || 'friend'}! I can’t wait to walk beside you — one gentle step at a time.”` },
      ]);
      setFinished(true);
      onComplete(updatedAns);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendUserAnswer();
    }
  };

  return (
    <div className="flex flex-col h-[80vh] max-h-[800px] w-full max-w-2xl mx-auto bg-gray-50 rounded-3xl shadow-xl overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'bot' ? 'items-start' : 'items-end justify-end'}`}>
            {msg.role === 'bot' && (
              <div className="relative mr-3">
                {/* Glowing background effect */}
                <div className="absolute inset-0 bg-emerald-200/30 rounded-full blur-sm scale-110"></div>
                {/* Icon container with enhanced styling */}
                <div className="relative bg-white rounded-full p-1.5 shadow-lg border border-emerald-100">
                  <img 
                    src={pandaSrc} 
                    alt="Bobo the Panda" 
                    className="w-10 h-10 object-contain transition-transform duration-300 hover:scale-110" 
                  />
                </div>
                {/* Subtle animation */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full opacity-60 animate-pulse"></div>
              </div>
            )}
            <div
              className={`rounded-2xl px-6 py-4 text-base md:text-lg leading-relaxed whitespace-pre-line shadow-lg ${msg.role === 'bot' ? 'bg-emerald-50 text-gray-900 border border-emerald-100' : 'bg-emerald-500 text-white'}`}
              style={{ maxWidth: '85%' }}
            >
              <div className="font-medium">
                {msg.text}
              </div>
            </div>
            {msg.role === 'user' && (
              <div className="relative ml-3">
                {/* Glowing background effect */}
                <div className="absolute inset-0 bg-blue-200/30 rounded-full blur-sm scale-110"></div>
                {/* Icon container with enhanced styling */}
                <div className="relative bg-white rounded-full p-1.5 shadow-lg border border-blue-100">
                  <img 
                    src={penguinSrc} 
                    alt="You" 
                    className="w-10 h-10 object-contain transition-transform duration-300 hover:scale-110" 
                  />
                </div>
                {/* Subtle animation */}
                <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-400 rounded-full opacity-60 animate-pulse"></div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {/* Input */}
      {!finished ? (
        <div className="border-t p-4 flex gap-3 bg-white">
          {current.inputType === 'select' ? (
            <select
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 text-base font-medium focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all duration-200"
            >
              <option value="" disabled>{current.placeholder || 'Select...'}</option>
              {current.options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          ) : (
            <input
              type={current.inputType}
              value={inputValue}
              placeholder={current.placeholder}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKey}
              className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 text-base font-medium focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all duration-200"
            />
          )}
          <Button
            type="button"
            onClick={sendUserAnswer}
            disabled={!inputValue.trim()}
            className="h-10 w-10 min-w-0 p-0 bg-emerald-500 hover:bg-emerald-600 rounded-full flex items-center justify-center"
          >
            <Send className="h-5 w-5 text-white" />
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default ChatSignup; 