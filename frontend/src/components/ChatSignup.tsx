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
    question: 'Bobo: Hi there, new friend!',
    subtext: 'I\'m Bobo your gentle panda guide through this climate journey. What name should I call you as we wander together?',
    inputType: 'text',
    placeholder: 'Your first name',
    required: true,
  },
  {
    key: 'email',
    question: (a) => `Bobo: Lovely to meet you${a.name ? `, ${a.name}` : ''}!`,
    subtext: 'Where should I send your little bundles of joy reflections, nudges, and tiny climate wins? (No spam just warm, helpful moments. Pinky promise)',
    inputType: 'email',
    placeholder: 'you@example.com',
    required: true,
    validate: (v) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v),
    error: 'Please enter a valid email address.',
  },
  {
    key: 'age',
    question: 'Bobo: Out of soft curiosity…',
    subtext: 'How many beautiful seasons young are you? All ages are welcome there\'s wisdom in every chapter.',
    inputType: 'number',
    placeholder: 'Your age',
    required: true,
    validate: (v) => /^\d+$/.test(v) && Number(v) > 0,
    error: 'Please enter a valid age.',
  },
  {
    key: 'gender',
    question: 'Bobo: And if you feel like sharing…',
    subtext: 'How do you identify? Every voice, every identity adds a new thread to our shared story.',
    inputType: 'select',
    options: ['Female', 'Male', 'Non-binary', 'Prefer to self-describe', 'Prefer not to say'],
    required: true,
  },
  {
    key: 'profession',
    question: (a) => `Bobo: What fills your days${a.name ? `, ${a.name}` : ''}?`,
    subtext: 'Whether you\'re teaching, coding, planting, parenting I\'m here to walk with you. This helps me make your journey more you-shaped.',
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
    key: 'country',
    question: 'Bobo: Where in the world do you call home?',
    subtext: 'Choose your country so I can notice patterns and stories blooming nearby.',
    inputType: 'select',
    options: [
      'United States','Canada','United Kingdom','Australia','India','Pakistan','United Arab Emirates','Saudi Arabia','Germany','France','Brazil','Japan','China','South Africa','Turkey','Indonesia','Bangladesh','Nigeria','Mexico','Russia','Egypt','Argentina','Italy','Spain','Other'
    ],
    placeholder: 'Select your country',
    required: true,
  },
  {
    key: 'city',
    question: (a) => `Bobo: And which city in ${a.country || 'your country'}?`,
    subtext: 'Pick the city that feels most like home.',
    inputType: 'select',
    placeholder: 'Your city',
    required: true,
  },
  {
    key: 'household',
    question: 'Bobo: And who shares your cozy nest?',
    subtext: 'How many hearts live with you under one roof? Every household is a little team cheering for the planet in their own way.',
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
  const [cityList, setCityList] = useState<string[]>([]);

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
    }
    
    // Always start from the first question
    setMessages([{ role: 'bot', text: makeBotText(current, answers) }]);
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
    const value = inputValue.trim();
    if (!value) return;

    // validate BEFORE sending the user message
    if (current.validate && !current.validate(value)) {
      setError(current.error || 'Invalid input');
      // Send a gentle bot prompt instead of echoing the invalid answer
      setMessages((m) => [
        ...m,
        { role: 'bot', text: current.error || 'Please provide a valid input.' },
      ]);
      return;
    }

    // clear any previous error once valid
    if (error) setError(null);

    // user message (only for valid input)
    setMessages((m) => [...m, { role: 'user', text: value }]);

    const updatedAns = { ...answers, [current.key]: value };
    setAnswers(updatedAns);
    setInputValue('');

    if (!isLast) {
      const next = questions[step + 1];
      // If moving to city, prep city list if we know the country
      if (next?.key === 'city') {
        const c = updatedAns.country;
        const map: Record<string, string[]> = {
          'United States': ['New York','Los Angeles','Chicago','San Francisco','Other'],
          Pakistan: ['Karachi','Lahore','Islamabad','Rawalpindi','Other'],
          India: ['Mumbai','Delhi','Bangalore','Chennai','Other'],
          Canada: ['Toronto','Vancouver','Montreal','Calgary','Other'],
          'United Kingdom': ['London','Manchester','Birmingham','Liverpool','Other'],
          Australia: ['Sydney','Melbourne','Brisbane','Perth','Other'],
        };
        setCityList(map[c] || ['Other']);
      }
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
        { role: 'bot', text: `Bobo: Thank you for sharing your story, ${updatedAns.name || 'friend'}! I'm so glad we found each other. Let's keep going one gentle, joyful step at a time.` },
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
              {current.key === 'city' && cityList.length > 0
                ? cityList.map((opt) => <option key={opt} value={opt}>{opt}</option>)
                : current.options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
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