import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, Zap, Lightbulb, Info, X, Share2, Loader2, ArrowLeft, ArrowRight, 
  Leaf, Clock, Target, Users, Car, Home, Utensils, Shirt, Trash2, ChevronLeft, 
  ChevronRight, Star, TrendingUp, Heart, Globe, Award, Play, Pause, CheckCircle,
  BarChart3, Brain, Rocket, Shield, Compass, MapPin, Timer
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { PersonalityType } from '@/types/personality';
import { getPersonalityImage } from '@/utils/personalityImages';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '@/services/api';

// Type guard for PersonalityType
const isPersonalityType = (value: string): value is PersonalityType => {
  return [
    'Sustainability Slayer', "Planet's Main Character", 'Sustainability Soft Launch',
    'Kind of Conscious, Kind of Confused', 'Eco in Progress', 'Doing Nothing for the Planet',
    'Certified Climate Snoozer', 'Strategist', 'Trailblazer', 'Coordinator', 'Visionary',
    'Explorer', 'Catalyst', 'Builder', 'Networker', 'Steward', 'The Seed'
  ].includes(value as any);
};

// Enhanced interfaces for the new system
interface PersonaOverlay {
  tone: string;
  nudge: string;
}

interface RecommendationCard {
  id: string;
  domain: 'transport' | 'food' | 'home' | 'clothing' | 'waste';
  action: string;
  levels: {
    start: string;
    levelUp: string;
    stretch: string;
  };
  enabler?: string;
  why: string;
  chips: string[];
  accessTags: string[];
  prerequisites: string[];
  estImpactKgPerYear: number;
  equivalents?: string[];
  fitWeights: Record<string, number>;
  behaviorDistance: 'small' | 'medium' | 'large';
  priority: number;
  personaOverlays: Record<string, PersonaOverlay>;
}

interface CategoryData {
  domain: string;
  cards: RecommendationCard[];
  totalImpact: number;
  icon: React.ReactNode;
  color: string;
  gradient: string;
}

interface RecommendationEngineProps {
  personalityData: any;
  profileImage: string;
  personality: string;
  userName: string;
  autoSimulate?: boolean;
  onBack?: () => void;
}

const RecommendationEngine: React.FC<RecommendationEngineProps> = ({ 
  personalityData, profileImage, personality, userName, autoSimulate, onBack 
}) => {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('transport');
  const [selectedCard, setSelectedCard] = useState<RecommendationCard | null>(null);
  const [showCardDetail, setShowCardDetail] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [autoSimulateTriggered, setAutoSimulateTriggered] = useState(false);
  const [showHurrayScreen, setShowHurrayScreen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [modalSelectedLevel, setModalSelectedLevel] = useState<string>('');
  const hasFetchedRef = useRef(false);

  const navigate = useNavigate();
  const personalityType: PersonalityType = isPersonalityType(personality) ? personality : 'Eco in Progress';
  const displayProfileImage = getPersonalityImage(personalityType, 'boy');

  // Category configuration
  const categoryConfig = {
    transport: {
      icon: <Car className="h-8 w-8" />,
      color: 'text-blue-600',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50'
    },
    food: {
      icon: <Utensils className="h-8 w-8" />,
      color: 'text-green-600',
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50'
    },
    home: {
      icon: <Home className="h-8 w-8" />,
      color: 'text-purple-600',
      gradient: 'from-purple-500 to-violet-500',
      bgGradient: 'from-purple-50 to-violet-50'
    },
    clothing: {
      icon: <Shirt className="h-8 w-8" />,
      color: 'text-orange-600',
      gradient: 'from-orange-500 to-amber-500',
      bgGradient: 'from-orange-50 to-amber-50'
    },
    waste: {
      icon: <Trash2 className="h-8 w-8" />,
      color: 'text-red-600',
      gradient: 'from-red-500 to-pink-500',
      bgGradient: 'from-red-50 to-pink-50'
    }
  };

  useEffect(() => {
    // Prevent duplicate API calls
    if (hasFetchedRef.current) {
      return;
    }

    const fetchAllCategories = async () => {
      console.log('🔄 Fetching recommendations for personality:', personality);
      setLoading(true);
      setError(null);
      
      try {
        const allCategories: CategoryData[] = [];
        
        // Fetch recommendations for all 5 categories
        for (const domain of ['transport', 'food', 'home', 'clothing', 'waste'] as const) {
          try {
            console.log(`📡 Fetching ${domain} recommendations...`);
            const res = await fetch(`${API_BASE_URL}/recommendations/catalog?persona=${encodeURIComponent(personality)}&domain=${domain}&maxItems=20`, {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
            });
            
            if (res.ok) {
              const data = await res.json();
              const cards = data.cards || [];
              const totalImpact = cards.reduce((sum: number, card: RecommendationCard) => sum + card.estImpactKgPerYear, 0);
              
              allCategories.push({
                domain,
                cards,
                totalImpact,
                icon: categoryConfig[domain].icon,
                color: categoryConfig[domain].color,
                gradient: categoryConfig[domain].gradient
              });
              console.log(`✅ ${domain}: ${cards.length} cards loaded`);
            }
          } catch (err) {
            console.error(`❌ Error fetching ${domain} recommendations:`, err);
          }
        }
        
        setCategories(allCategories);
        if (allCategories.length > 0) {
          setSelectedCategory(allCategories[0].domain);
        }
        hasFetchedRef.current = true;
        console.log('🎉 All categories loaded successfully');
      } catch (err: any) {
        console.error('❌ Error fetching recommendations:', err);
        setError(err.message || 'Failed to fetch recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchAllCategories();
  }, [personality]);

  // Auto-simulate first card if enabled
  useEffect(() => {
    if (autoSimulate && categories.length > 0 && !autoSimulateTriggered) {
      const firstCategory = categories[0];
      if (firstCategory.cards.length > 0) {
        setSelectedCard(firstCategory.cards[0]);
        setShowCardDetail(true);
        setAutoSimulateTriggered(true);
      }
    }
  }, [autoSimulate, categories, autoSimulateTriggered]);

  const getCurrentCategory = () => categories.find(cat => cat.domain === selectedCategory);
  const getCurrentCards = () => getCurrentCategory()?.cards || [];

  const handleCardClick = (card: RecommendationCard) => {
    setSelectedCard(card);
    setModalSelectedLevel(''); // Reset selection when opening modal
    setShowCardDetail(true);
  };

  const closeCardDetail = () => {
    setShowCardDetail(false);
    setSelectedCard(null);
    setModalSelectedLevel(''); // Reset selection when closing modal
  };

  const handleLevelSelection = (level: string) => {
    setSelectedLevel(level);
    setShowHurrayScreen(true);
  };

  const handleModalLevelSelection = (level: string) => {
    setModalSelectedLevel(level);
  };

  const closeHurrayScreen = () => {
    setShowHurrayScreen(false);
    setSelectedLevel('');
    setShowCardDetail(false);
    setSelectedCard(null);
  };

  const nextCard = () => {
    const currentCards = getCurrentCards();
    if (currentCardIndex < currentCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
    }
  };

  const getPersonalityOverlay = (card: RecommendationCard) => {
    return card.personaOverlays[personality] || card.personaOverlays['Eco in Progress'] || {
      tone: 'supportive',
      nudge: 'Start with what feels right for you.'
    };
  };

  const getEffortLevelColor = (level: string) => {
    switch (level) {
      case 'small': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'large': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 4) return 'text-red-600 bg-red-50 border-red-200';
    if (priority >= 3) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-blue-600 bg-blue-50 border-blue-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-emerald-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500 mx-auto"></div>
          <p className="text-lg text-emerald-700 font-medium">Loading your personalized recommendations...</p>
        </div>
      </div>
    );
  }

  if (error) {
  return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-red-50">
        <div className="text-center space-y-4 max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <X className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-red-800">Oops! Something went wrong</h2>
          <p className="text-red-600">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {onBack && (
                <Button
                  variant="ghost"
                  onClick={onBack}
                  className="flex items-center gap-2 text-gray-700 hover:text-black hover:bg-gray-50 px-2 py-1 rounded-md transition-all duration-200 border border-transparent hover:border-gray-200"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="font-medium text-sm">Back</span>
                </Button>
              )}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 shadow-sm bg-white">
                  <img 
                    src={displayProfileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    style={{ objectPosition: 'center 20%' }}
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-black mb-1 tracking-tight leading-tight">Personalized Recommendations</h1>
                  <p className="text-sm text-gray-600 font-normal tracking-wide">Tailored for <span className="font-medium">{personalityType}</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-4">
        {/* Category Tabs */}
        <div className="mt-8 mb-8">
          <div className="relative">
            {/* Minimal Category Selector */}
            <div className="flex justify-center items-center gap-6">
              {categories.map((category, index) => (
                <motion.div
                  key={category.domain}
                  className="relative group cursor-pointer"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ 
                    delay: index * 0.1, 
                    duration: 0.6,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    y: -4,
                    transition: { duration: 0.3 }
                  }}
                  onClick={() => setSelectedCategory(category.domain)}
                >
                  {/* Category Circle */}
                  <motion.div
                    className={cn(
                      "relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 border-2",
                      selectedCategory === category.domain
                        ? "bg-black border-black shadow-2xl scale-110"
                        : "bg-white border-gray-300 shadow-lg hover:shadow-xl hover:border-gray-400"
                    )}
                    animate={{
                      y: selectedCategory === category.domain ? [-1, 1, -1] : 0
                    }}
                    transition={{
                      y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    {/* Icon */}
                    <div className={cn(
                      "transition-all duration-500",
                      selectedCategory === category.domain 
                        ? "text-white" 
                        : "text-gray-600 group-hover:text-gray-800"
                    )}>
                      {category.icon}
                    </div>

                    {/* Selection Indicator */}
                    {selectedCategory === category.domain && (
                      <motion.div
                        className="absolute -top-1 -right-1 w-3 h-3 bg-black rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, type: "spring" }}
                      />
                    )}
                  </motion.div>

                  {/* Category Label */}
                  <motion.div
                    className={cn(
                      "mt-2 text-center",
                      selectedCategory === category.domain
                        ? "text-black font-bold"
                        : "text-gray-600 font-medium"
                    )}
                    animate={{
                      scale: selectedCategory === category.domain ? [1, 1.05, 1] : 1
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="capitalize text-xs tracking-wide">
                      {category.domain}
                    </span>
                  </motion.div>

                  {/* Subtle Connection Line */}
                  {index < categories.length - 1 && (
                    <motion.div
                      className="absolute top-1/2 left-full w-6 h-px bg-gray-200"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Category Header */}
            <div className="text-center space-y-2 mb-6">
              <h2 className="text-xl font-light text-gray-800 tracking-wide">
                Discover personalized actions to reduce your{' '}
                <span className="font-semibold text-black">{selectedCategory}</span> impact
              </h2>
            </div>

            {/* Cards Carousel */}
            {getCurrentCards().length > 0 && (
              <div className="relative">
                {/* Navigation Arrows */}
                <button
                  onClick={prevCard}
                  disabled={currentCardIndex === 0}
                  className={cn(
                    "absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center transition-all duration-300",
                    currentCardIndex === 0
                      ? "opacity-30 cursor-not-allowed"
                      : "hover:border-gray-300 hover:shadow-xl hover:scale-105"
                  )}
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>

                <button
                  onClick={nextCard}
                  disabled={currentCardIndex === getCurrentCards().length - 1}
                  className={cn(
                    "absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center transition-all duration-300",
                    currentCardIndex === getCurrentCards().length - 1
                      ? "opacity-30 cursor-not-allowed"
                      : "hover:border-gray-300 hover:shadow-xl hover:scale-105"
                  )}
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>

                {/* Current Card */}
                <div className="max-w-4xl mx-auto px-12">
                  <motion.div
                    key={`${selectedCategory}-${currentCardIndex}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden">
                      <CardContent className="p-5">
                        <div className="space-y-5">
                          {/* Card Header */}
                          <div className="text-center space-y-2">
                            <h3 className="text-2xl font-light text-black leading-tight tracking-tight mb-1">
                              {getCurrentCards()[currentCardIndex]?.action || 'Loading...'}
                            </h3>
                            <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-full border border-gray-200 shadow-sm">
                              <span className="text-xl font-bold text-black tracking-wide">
                                {getCurrentCards()[currentCardIndex]?.estImpactKgPerYear || 0}
                              </span>
                              <span className="text-xs text-gray-600 font-medium tracking-wide uppercase">kg CO₂e/year</span>
                            </div>
                          </div>

                          {/* Why This Matters */}
                          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                            <h4 className="text-base font-semibold text-black mb-2 tracking-wide flex items-center gap-2">
                              <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
                                <Leaf className="h-3 w-3 text-gray-600" />
                              </div>
                              Why This Matters
                            </h4>
                            <p className="text-gray-700 leading-relaxed text-sm font-normal tracking-wide">
                              {getCurrentCards()[currentCardIndex]?.why || 'Loading...'}
                            </p>
                            {getCurrentCards()[currentCardIndex]?.equivalents && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {getCurrentCards()[currentCardIndex]?.equivalents?.map((equiv, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-white text-gray-700 border border-gray-200 rounded-full text-xs font-medium shadow-sm tracking-wide">
                                    {equiv}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Personalized for You */}
                          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                            <h4 className="text-base font-semibold text-black mb-2 tracking-wide flex items-center gap-2">
                              <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
                                <Brain className="h-3 w-3 text-gray-600" />
                              </div>
                              Personalized for You
                            </h4>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-gray-600 tracking-wide uppercase">Tone:</span>
                                <span className="text-gray-800 text-sm font-medium tracking-wide">{getPersonalityOverlay(getCurrentCards()[currentCardIndex] || {} as RecommendationCard).tone}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-gray-600 tracking-wide uppercase">Your Nudge:</span>
                                <span className="text-gray-800 text-sm font-medium tracking-wide">{getPersonalityOverlay(getCurrentCards()[currentCardIndex] || {} as RecommendationCard).nudge}</span>
                              </div>
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="text-center pt-2">
                            <Button 
                              className="bg-black hover:bg-gray-800 text-white px-7 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-lg border-2 border-black tracking-wide"
                              onClick={() => handleCardClick(getCurrentCards()[currentCardIndex])}
                            >
                              Explore Action Levels
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Carousel Indicators */}
                <div className="flex justify-center mt-6 gap-2">
                  {getCurrentCards().map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentCardIndex(index)}
                      className={cn(
                        "w-2.5 h-2.5 rounded-full transition-all duration-300 border",
                        index === currentCardIndex
                          ? "bg-black border-black scale-125"
                          : "bg-gray-200 border-gray-300 hover:bg-gray-300"
                      )}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Card Detail Modal */}
      <AnimatePresence>
        {showCardDetail && selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative bg-white rounded-2xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={closeCardDetail}
                className="absolute top-6 right-6 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors z-10"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>

              {/* Modal Content */}
              <div className="p-6">
                {/* Header */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-light text-black tracking-tight mb-3">
                    Action Details
                  </h2>
                  <h3 className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto font-normal">
                    {selectedCard.action}
                  </h3>
                </div>

                {/* Action Levels */}
                <div className="space-y-6 mb-8">
                  <h4 className="text-xl font-medium text-black text-center mb-6">Choose Your Level</h4>
                  
                  {/* Selection Indicator */}
                  {modalSelectedLevel && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center mb-4"
                    >
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-sm font-medium">
                        <span>Selected:</span>
                        <span className="font-semibold">{modalSelectedLevel}</span>
                      </div>
                    </motion.div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Start Level */}
                    <div 
                      className={cn(
                        "bg-white rounded-xl p-4 border transition-all duration-300 hover:shadow-md cursor-pointer",
                        modalSelectedLevel === 'Start' 
                          ? "border-black shadow-lg bg-gray-50" 
                          : "border-gray-200 hover:border-gray-300"
                      )}
                      onClick={() => handleModalLevelSelection('Start')}
                    >
                      <div className="text-center space-y-3">
                        <div className={cn(
                          "w-14 h-14 rounded-full flex items-center justify-center mx-auto transition-all duration-300",
                          modalSelectedLevel === 'Start' 
                            ? "bg-black text-white" 
                            : "bg-gray-100 text-gray-600"
                        )}>
                          <Play className="h-7 w-7" />
                        </div>
                        <h5 className="text-lg font-semibold text-black">Start</h5>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {selectedCard.levels.start}
                        </p>
                        <div className={cn(
                          "inline-block px-3 py-1 rounded-full text-sm font-medium border transition-all duration-300",
                          modalSelectedLevel === 'Start'
                            ? "bg-black text-white border-black"
                            : "bg-gray-100 text-gray-800 border-gray-200"
                        )}>
                          Easy Start
                        </div>
                      </div>
                    </div>

                    {/* Level Up */}
                    <div 
                      className={cn(
                        "bg-white rounded-xl p-4 border transition-all duration-300 hover:shadow-md cursor-pointer",
                        modalSelectedLevel === 'Level Up' 
                          ? "border-black shadow-lg bg-gray-50" 
                          : "border-gray-200 hover:border-gray-300"
                      )}
                      onClick={() => handleModalLevelSelection('Level Up')}
                    >
                      <div className="text-center space-y-3">
                        <div className={cn(
                          "w-14 h-14 rounded-full flex items-center justify-center mx-auto transition-all duration-300",
                          modalSelectedLevel === 'Level Up' 
                            ? "bg-black text-white" 
                            : "bg-gray-100 text-gray-600"
                        )}>
                          <TrendingUp className="h-7 w-7" />
                        </div>
                        <h5 className="text-lg font-semibold text-black">Level Up</h5>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {selectedCard.levels.levelUp}
                        </p>
                        <div className={cn(
                          "inline-block px-3 py-1 rounded-full text-sm font-medium border transition-all duration-300",
                          modalSelectedLevel === 'Level Up'
                            ? "bg-black text-white border-black"
                            : "bg-gray-100 text-gray-800 border-gray-200"
                        )}>
                          Build Momentum
                        </div>
                      </div>
                    </div>

                    {/* Stretch */}
                    <div 
                      className={cn(
                        "bg-white rounded-xl p-4 border transition-all duration-300 hover:shadow-md cursor-pointer",
                        modalSelectedLevel === 'Stretch' 
                          ? "border-black shadow-lg bg-gray-50" 
                          : "border-gray-200 hover:border-gray-300"
                      )}
                      onClick={() => handleModalLevelSelection('Stretch')}
                    >
                      <div className="text-center space-y-3">
                        <div className={cn(
                          "w-14 h-14 rounded-full flex items-center justify-center mx-auto transition-all duration-300",
                          modalSelectedLevel === 'Stretch' 
                            ? "bg-black text-white" 
                            : "bg-gray-100 text-gray-600"
                        )}>
                          <Rocket className="h-7 w-7" />
                        </div>
                        <h5 className="text-lg font-semibold text-black">Stretch</h5>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {selectedCard.levels.stretch}
                        </p>
                        <div className={cn(
                          "inline-block px-3 py-1 rounded-full text-sm font-medium border transition-all duration-300",
                          modalSelectedLevel === 'Stretch'
                            ? "bg-black text-white border-black"
                            : "bg-gray-100 text-gray-800 border-gray-200"
                        )}>
                          Maximum Impact
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* Enabler */}
                  {selectedCard.enabler && (
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <h5 className="text-base font-semibold text-black mb-2">
                        What You'll Need
                      </h5>
                      <p className="text-gray-700 leading-relaxed text-sm">{selectedCard.enabler}</p>
                    </div>
                  )}

                  {/* Prerequisites */}
                  {selectedCard.prerequisites.length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <h5 className="text-base font-semibold text-black mb-2">
                        Prerequisites
                      </h5>
                      <ul className="space-y-1">
                        {selectedCard.prerequisites.map((prereq, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-gray-700 text-sm">
                            <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                            {prereq}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-3 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={closeCardDetail}
                    className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium rounded-lg transition-all duration-300"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      if (modalSelectedLevel) {
                        handleLevelSelection(modalSelectedLevel);
                      }
                    }}
                    disabled={!modalSelectedLevel}
                    className={cn(
                      "px-6 py-2 text-sm font-medium rounded-lg transition-all duration-300",
                      modalSelectedLevel
                        ? "bg-black hover:bg-gray-800 text-white transform hover:scale-105"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    )}
                  >
                    Start This Action
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hurray Screen Modal */}
      <AnimatePresence>
        {showHurrayScreen && selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-gray-100"
            >
              {/* Close Button */}
              <button
                onClick={closeHurrayScreen}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-300 z-10 border border-gray-200"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>

              {/* Hurray Content */}
              <div className="p-6 text-center">
                {/* Celebration Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, type: "spring" }}
                  className="w-32 h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-gray-200"
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <img 
                      src="/images/panda.svg" 
                      alt="Panda" 
                      className="h-16 w-16"
                    />
                  </motion.div>
                </motion.div>

                {/* Hurray Message */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-5xl font-light text-black mb-6 tracking-tight"
                >
                  Hurray! 🎉
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="text-xl text-gray-600 mb-8 font-medium"
                >
                  You've chosen the <span className="font-bold text-black">{selectedLevel}</span> level for:
                </motion.p>

                {/* Selected Level Details */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="bg-gray-700 rounded-2xl p-6 mb-8 text-white shadow-xl"
                >
                  <div className="text-center">
                    <div className="inline-flex items-center gap-3 mb-3">
                      {selectedLevel === 'Start' && (
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                          <Play className="h-6 w-6 text-white" />
                        </div>
                      )}
                      {selectedLevel === 'Level Up' && (
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                          <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                      )}
                      {selectedLevel === 'Stretch' && (
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                          <Rocket className="h-6 w-6 text-white" />
                        </div>
                      )}
                      <span className="text-2xl font-light text-white tracking-wide">{selectedLevel}</span>
                    </div>
                    <p className="text-gray-100 text-lg leading-relaxed max-w-xl mx-auto">
                      {selectedLevel === 'Start' && selectedCard.levels.start}
                      {selectedLevel === 'Level Up' && selectedCard.levels.levelUp}
                      {selectedLevel === 'Stretch' && selectedCard.levels.stretch}
                    </p>
                  </div>
                </motion.div>

                {/* Impact Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                  className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-200 mb-8 shadow-sm"
                >
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                      <Leaf className="h-4 w-4 text-gray-600" />
                    </div>
                    <span className="text-gray-800 font-semibold text-lg">Your Impact</span>
                  </div>
                  <div className="text-center">
                    <span className="text-3xl font-bold text-black">
                      {selectedCard.estImpactKgPerYear}
                    </span>
                    <span className="text-gray-600 font-medium ml-2 text-lg">kg CO₂e/year</span>
                  </div>
                  {selectedCard.equivalents && (
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                      {selectedCard.equivalents.map((equiv, idx) => (
                        <span key={idx} className="px-3 py-1 bg-white text-gray-700 border border-gray-200 rounded-full text-sm font-medium shadow-sm">
                          {equiv}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>

                {/* Action Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3, duration: 0.6 }}
                >
                  <Button
                    onClick={closeHurrayScreen}
                    className="bg-black hover:bg-gray-800 text-white px-10 py-4 text-xl font-medium rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl border-2 border-black"
                  >
                    Continue Exploring
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecommendationEngine; 