import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { getUserData } from '@/services/session';

// Avatar image paths
const pandaSrc = '/images/panda.svg';
const penguinSrc = '/images/penguin.png';

// Helper types
interface Message { role: 'bot' | 'user'; text: string; }

// Typing indicator component
const TypingIndicator: React.FC = () => (
  <div className="flex items-center space-x-1">
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
    </div>
    <span className="text-sm text-gray-500 ml-2">Bobo is typing...</span>
  </div>
);

// User typing indicator component
const UserTypingIndicator: React.FC = () => (
  <div className="flex items-center space-x-1">
    <span className="text-sm text-white/80 mr-2">You are typing...</span>
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
      <div className="w-2 h-2 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
      <div className="w-2 h-2 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
    </div>
  </div>
);

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
  const [isTyping, setIsTyping] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [showTopIndicator, setShowTopIndicator] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [cityList, setCityList] = useState<string[]>([]);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTop = useRef<number>(0);

  // Sound effects using Web Audio API
  const playMessageSent = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  };

  const playMessageReceived = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  const playTyping = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator.type = 'sawtooth';
    
    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

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


  const makeBotText = (q: Q, currentAns: Record<string,string>) => {
    const main = typeof q.question === 'function'? q.question(currentAns): q.question;
    const sub = q.subtext ? (typeof q.subtext === 'function'? q.subtext(currentAns): q.subtext) : '';
    return sub ? `${main}\n${sub}` : main;
  };



  // Enhanced scroll functions
  const scrollToBottom = (smooth = true, delay = 0) => {
    if (delay > 0) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ 
          behavior: smooth ? 'smooth' : 'instant',
          block: 'end',
          inline: 'nearest'
        });
      }, delay);
    } else {
      messagesEndRef.current?.scrollIntoView({ 
        behavior: smooth ? 'smooth' : 'instant',
        block: 'end',
        inline: 'nearest'
      });
    }
  };

  const scrollToBottomButton = () => {
    setIsScrolling(true);
    scrollToBottom(true, 0);
    setTimeout(() => setIsScrolling(false), 500);
  };

  // Check if user is near bottom of scroll
  const isNearBottom = () => {
    if (!messagesContainerRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    return scrollHeight - scrollTop - clientHeight < 100;
  };

  // Handle scroll events
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    
    const { scrollTop } = messagesContainerRef.current;
    const isScrollingUp = scrollTop < lastScrollTop.current;
    lastScrollTop.current = scrollTop;
    
    // Show scroll button if user scrolls up and not near bottom
    setShowScrollButton(isScrollingUp && !isNearBottom());
    
    // Show top indicator if there's content above
    setShowTopIndicator(scrollTop > 50);
    
    // Clear any existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    // Hide scroll button after 2 seconds of no scrolling
    scrollTimeoutRef.current = setTimeout(() => {
      setShowScrollButton(false);
    }, 2000);
  };

  // Auto-scroll with intelligent behavior
  useEffect(() => {
    // Only auto-scroll if user is near bottom or if it's a new message
    if (isNearBottom() || messages.length <= 1) {
      scrollToBottom(true, 100);
    }
  }, [messages]);

  // Initialize scroll position on mount
  useEffect(() => {
    // Set initial scroll position to bottom
    setTimeout(() => {
      scrollToBottom(false, 0);
    }, 100);
  }, []);

  // Auto-scroll when typing indicators appear/disappear
  useEffect(() => {
    if (isTyping || isUserTyping) {
      scrollToBottom(true, 50);
    }
  }, [isTyping, isUserTyping]);

  // Handle typing detection for native inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Show user typing indicator
    setIsUserTyping(value.length > 0);
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Play typing sound if user is actively typing
    if (value.length > 0) {
      playTyping();
    }
    
    // Hide typing indicator after 1 second of no typing
    typingTimeoutRef.current = setTimeout(() => {
      setIsUserTyping(false);
    }, 1000);
  };

  // Handle value change from custom selects
  const handleSelectChange = (value: string) => {
    setInputValue(value);
    setIsUserTyping(value.length > 0);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => setIsUserTyping(false), 600);
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const sendUserAnswer = () => {
    const value = inputValue.trim();
    if (!value) return;

    // Clear user typing indicator
    setIsUserTyping(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

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
    playMessageSent(); // Play sound for user message

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
      
      // Show typing indicator
      setIsTyping(true);
      
      // push bot message after small delay
      setTimeout(() => {
        setIsTyping(false);
        setMessages((m) => [
          ...m,
          { role: 'bot', text: makeBotText(next, updatedAns) },
        ]);
        playMessageReceived(); // Play sound for bot message
        setStep(step + 1);
      }, 800); // Slightly longer delay to show typing indicator
    } else {
      // Show typing indicator for final message
      setIsTyping(true);
      
      setTimeout(() => {
        setIsTyping(false);
        setMessages((m) => [
          ...m,
          { role: 'bot', text: `Bobo: Thank you for sharing your story, ${updatedAns.name || 'friend'}! I'm so glad we found each other. Let's keep going one gentle, joyful step at a time.` },
        ]);
        playMessageReceived(); // Play sound for final bot message
        setFinished(true);
        onComplete(updatedAns);
      }, 800);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendUserAnswer();
    }
  };

  // Lightweight sleek custom select (similar vibe to quiz)
  const CustomSelect: React.FC<{
    value: string;
    onChange: (v: string) => void;
    options: string[];
    placeholder?: string;
  }> = ({ value, onChange, options, placeholder }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
      const handler = (e: MouseEvent) => {
        if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
      };
      document.addEventListener('mousedown', handler);
      return () => document.removeEventListener('mousedown', handler);
    }, []);
    return (
      <div ref={ref} className="relative w-full">
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="w-full h-14 rounded-3xl px-6 pr-14 text-lg font-semibold border-2 border-emerald-200 focus:border-emerald-500 bg-white/90 shadow-xl text-emerald-900 transition-all duration-200 flex items-center justify-between"
        >
          <span className={!value ? 'text-emerald-400' : ''}>{value || placeholder || 'Select...'}</span>
          <svg className={`w-5 h-5 text-emerald-700 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="none" stroke="currentColor"><path d="M6 8L10 12L14 8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        {open && (
          <div className="absolute z-50 bottom-full mb-2 w-full max-h-72 overflow-y-auto rounded-2xl border-2 border-emerald-100 bg-white shadow-2xl">
            {options.map(opt => (
              <button
                type="button"
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                className={`w-full text-left px-4 py-3 text-base hover:bg-emerald-50 ${value === opt ? 'bg-emerald-100 text-emerald-900 font-semibold' : 'text-emerald-800'}`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[80vh] max-h-[800px] w-full max-w-2xl mx-auto bg-gray-50 rounded-3xl shadow-xl overflow-visible">
      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth custom-scrollbar relative"
        onScroll={handleScroll}
        style={{ 
          scrollBehavior: 'smooth',
          scrollbarWidth: 'thin',
          scrollbarColor: '#10b981 #f3f4f6'
        }}
      >
        {/* Top scroll indicator */}
        {showTopIndicator && (
          <div className="sticky top-0 z-10 bg-gradient-to-b from-gray-50 to-transparent h-8 flex items-center justify-center">
            <div className="bg-emerald-100 text-emerald-700 text-xs px-3 py-1 rounded-full shadow-sm">
              ↑ More messages above
            </div>
          </div>
        )}
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
        {/* Typing indicators */}
        {isTyping && (
          <div className="flex items-start">
            <div className="relative mr-3">
              <div className="absolute inset-0 bg-emerald-200/30 rounded-full blur-sm scale-110"></div>
              <div className="relative bg-white rounded-full p-1.5 shadow-lg border border-emerald-100">
                <img 
                  src={pandaSrc} 
                  alt="Bobo the Panda" 
                  className="w-10 h-10 object-contain" 
                />
              </div>
            </div>
            <div className="bg-emerald-50 text-gray-900 border border-emerald-100 rounded-2xl px-6 py-4 shadow-lg">
              <TypingIndicator />
            </div>
          </div>
        )}
        {isUserTyping && (
          <div className="flex items-end justify-end">
            <div className="bg-emerald-500 text-white rounded-2xl px-6 py-4 shadow-lg">
              <UserTypingIndicator />
            </div>
            <div className="relative ml-3">
              <div className="absolute inset-0 bg-blue-200/30 rounded-full blur-sm scale-110"></div>
              <div className="relative bg-white rounded-full p-1.5 shadow-lg border border-blue-100">
                <img 
                  src={penguinSrc} 
                  alt="You" 
                  className="w-10 h-10 object-contain" 
                />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
        
        {/* Scroll to bottom button */}
        {showScrollButton && (
          <div className="fixed bottom-24 right-8 z-50">
            <button
              onClick={scrollToBottomButton}
              disabled={isScrolling}
              className={`bg-emerald-500 hover:bg-emerald-600 text-white rounded-full p-3 shadow-lg transition-all duration-300 transform hover:scale-110 ${
                isScrolling ? 'opacity-50 cursor-not-allowed' : 'opacity-90 hover:opacity-100'
              }`}
              aria-label="Scroll to bottom"
            >
              <svg 
                className={`w-5 h-5 transition-transform duration-300 ${isScrolling ? 'animate-bounce' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>
        )}
      </div>
      {/* Input */}
      {!finished ? (
        <div className="border-t p-4 flex gap-3 bg-white/90 backdrop-blur-sm">
          {current.inputType === 'select' ? (
            <CustomSelect
              value={inputValue}
              onChange={handleSelectChange}
              options={(current.key === 'city' && cityList.length > 0) ? cityList : (current.options || [])}
              placeholder={current.placeholder}
            />
          ) : (
            <input
              type={current.inputType}
              value={inputValue}
              placeholder={current.placeholder}
              onChange={handleInputChange}
              onKeyDown={handleKey}
              className={`flex-1 h-14 border-2 rounded-3xl px-6 text-lg font-semibold focus:outline-none focus:ring-0 transition-all duration-200 bg-white/90 shadow-xl placeholder-emerald-300 ${
                isUserTyping ? 'border-emerald-400' : 'border-emerald-200 focus:border-emerald-500'
              }`}
            />
          )}
          <Button
            type="button"
            onClick={sendUserAnswer}
            disabled={!inputValue.trim()}
            className="h-14 w-14 min-w-0 p-0 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-full flex items-center justify-center shadow-xl disabled:opacity-50"
          >
            <Send className="h-6 w-6 text-white" />
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default ChatSignup; 