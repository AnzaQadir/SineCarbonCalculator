import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    setShowCardDetail(true);
  };

  const closeCardDetail = () => {
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
      <div className="bg-white border-b-2 border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-8xl mx-auto px-10 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              {onBack && (
            <Button
                  variant="ghost"
                  onClick={onBack}
                  className="flex items-center gap-4 text-gray-700 hover:text-black hover:bg-gray-50 px-6 py-3 rounded-xl transition-all duration-200 border border-transparent hover:border-gray-200"
                >
                  <ArrowLeft className="h-6 w-6" />
                  <span className="font-medium text-lg">Back</span>
                </Button>
              )}
              <div className="flex items-center gap-8">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-gray-100 shadow-2xl bg-white ring-4 ring-gray-50">
                  <img 
                    src={displayProfileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    style={{ objectPosition: 'center 20%' }}
                  />
                </div>
                <div>
                  <h1 className="text-6xl font-extrabold text-black mb-6 tracking-tighter leading-tight">Personalized Recommendations</h1>
                  <p className="text-2xl text-black font-normal tracking-wide">Tailored for <span className="font-medium">{personalityType}</span></p>
                </div>
        </div>
        </div>
          </div>
              </div>
              </div>

      {/* Main Content */}
      <div className="max-w-8xl mx-auto px-10 py-20">
        {/* Category Tabs */}
        <div className="mb-24">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 p-8 rounded-3xl shadow-2xl min-h-[120px] backdrop-blur-sm">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.domain}
                  value={category.domain}
                  className={cn(
                    "flex flex-col items-center justify-center gap-3 px-8 py-10 rounded-2xl transition-all duration-500 data-[state=active]:shadow-2xl font-semibold relative overflow-hidden min-h-[100px] group",
                    selectedCategory === category.domain
                      ? "bg-white text-black border-2 border-gray-200 shadow-2xl transform scale-105 ring-4 ring-gray-100"
                      : "text-gray-600 hover:text-black hover:bg-white/80 hover:scale-105 hover:shadow-xl border-2 border-transparent hover:border-gray-200"
                  )}
                >
                  {selectedCategory === category.domain && (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50 opacity-80"></div>
                  )}
                  <div className={cn(
                    "w-20 h-20 flex items-center justify-center rounded-3xl transition-all duration-500 group-hover:scale-110",
                    selectedCategory === category.domain 
                      ? "bg-gradient-to-br from-gray-100 to-gray-200 shadow-inner ring-2 ring-gray-300" 
                      : "bg-gray-100/50 group-hover:bg-gray-100"
                  )}>
                    {category.icon}
                  </div>
                  <span className="capitalize text-xl relative z-10 font-semibold tracking-wide group-hover:scale-105 transition-transform duration-300">{category.domain}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Category Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Category Header */}
            <div className="text-center space-y-16">
              <p className="text-2xl text-black max-w-5xl mx-auto leading-relaxed font-normal tracking-wide">
                Discover personalized actions to reduce your <span className="font-medium">{selectedCategory}</span> impact
              </p>
              <div className="flex items-center justify-center gap-20">
                <div className="flex items-center gap-6 bg-white/90 backdrop-blur-sm px-8 py-6 rounded-3xl border-2 border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 group hover:scale-105">
                  <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-inner ring-2 ring-gray-300 group-hover:ring-gray-400 transition-all duration-300">
                    <Target className="h-8 w-8 text-gray-700" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-black">{getCurrentCards().length}</div>
                    <div className="text-base text-gray-600 font-medium">actions available</div>
                  </div>
                </div>
                <div className="flex items-center gap-6 bg-white/90 backdrop-blur-sm px-8 py-6 rounded-3xl border-2 border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 group hover:scale-105">
                  <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-inner ring-2 ring-gray-300 group-hover:ring-gray-400 transition-all duration-300">
                    <Leaf className="h-8 w-8 text-gray-700" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-black">~{Math.round(getCurrentCategory()?.totalImpact || 0)}</div>
                    <div className="text-base text-gray-600 font-medium">kg CO₂e/year potential</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cards Carousel */}
            {getCurrentCards().length > 0 && (
              <div className="relative">
                {/* Navigation Arrows */}
                <button
                  onClick={prevCard}
                  disabled={currentCardIndex === 0}
                  className={cn(
                    "absolute left-8 top-1/2 -translate-y-1/2 z-10 w-24 h-24 rounded-full bg-white/95 backdrop-blur-sm border-2 border-gray-200 shadow-2xl flex items-center justify-center transition-all duration-500 group",
                    currentCardIndex === 0
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:border-gray-300 hover:shadow-3xl hover:scale-110 hover:bg-white hover:ring-4 hover:ring-gray-100"
                  )}
                >
                  <ChevronLeft className="h-12 w-12 text-gray-700 group-hover:text-black transition-colors duration-300" />
                </button>

                <button
                  onClick={nextCard}
                  disabled={currentCardIndex === getCurrentCards().length - 1}
                  className={cn(
                    "absolute right-8 top-1/2 -translate-y-1/2 z-10 w-24 h-24 rounded-full bg-white/95 backdrop-blur-sm border-2 border-gray-200 shadow-2xl flex items-center justify-center transition-all duration-500 group",
                    currentCardIndex === getCurrentCards().length - 1
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:border-gray-300 hover:shadow-3xl hover:scale-110 hover:bg-white hover:ring-4 hover:ring-gray-100"
                  )}
                >
                  <ChevronRight className="h-12 w-12 text-gray-700 group-hover:text-black transition-colors duration-300" />
                </button>

                {/* Current Card */}
                <div className="max-w-6xl mx-auto px-24">
                  <motion.div
                    key={`${selectedCategory}-${currentCardIndex}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="bg-white border-2 border-gray-100 shadow-2xl hover:shadow-3xl transition-all duration-500 cursor-pointer transform hover:scale-[1.01] overflow-hidden"
                          onClick={() => handleCardClick(getCurrentCards()[currentCardIndex])}>
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/30 to-transparent pointer-events-none"></div>
                      <CardContent className="p-12 relative z-10">
                        <div className="space-y-8">
                          {/* Card Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                                                    <h3 className="text-4xl font-extrabold text-black leading-tight mb-6 tracking-tight">
                        {getCurrentCards()[currentCardIndex]?.action || 'Loading...'}
                      </h3>
                            </div>
                            <div className="text-right">
                              <div className="text-4xl font-bold text-black">
                                {getCurrentCards()[currentCardIndex]?.estImpactKgPerYear || 0}
                              </div>
                              <div className="text-base text-gray-500 font-medium">kg CO₂e/year</div>
                            </div>
                          </div>

                                                     {/* Impact & Why */}
                           <div className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                             <div className="flex items-start gap-6">
                               <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner">
                                 <Leaf className="h-8 w-8 text-gray-700" />
                               </div>
                               <div className="flex-1">
                                                         <h4 className="text-2xl font-bold text-black mb-4 tracking-tight">Why This Matters</h4>
                        <p className="text-lg text-black leading-relaxed font-normal">
                          {getCurrentCards()[currentCardIndex]?.why || 'Loading...'}
                        </p>
                                 {getCurrentCards()[currentCardIndex]?.equivalents && (
                                   <div className="mt-4 flex flex-wrap gap-3">
                                     {getCurrentCards()[currentCardIndex]?.equivalents.map((equiv, idx) => (
                                       <Badge key={idx} variant="secondary" className="bg-white text-gray-700 border-2 border-gray-200 px-3 py-1 text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200">
                                         {equiv}
                                       </Badge>
                                     ))}
                                   </div>
                                 )}
                               </div>
                             </div>
                           </div>

                           {/* Personality Overlay */}
                           <div className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                             <div className="flex items-start gap-6">
                               <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner">
                                 <Brain className="h-8 w-8 text-gray-700" />
                               </div>
                               <div className="flex-1">
                                                         <h4 className="text-2xl font-bold text-black mb-4 tracking-tight">Personalized for You</h4>
                        <div className="space-y-4">
                          <div>
                            <span className="text-base font-semibold text-black">Tone:</span>
                            <span className="ml-3 text-lg text-black font-normal">{getPersonalityOverlay(getCurrentCards()[currentCardIndex] || {} as RecommendationCard).tone}</span>
                          </div>
                          <div>
                            <span className="text-base font-semibold text-black">Your Nudge:</span>
                            <span className="ml-3 text-lg text-black font-normal">{getPersonalityOverlay(getCurrentCards()[currentCardIndex] || {} as RecommendationCard).nudge}</span>
                          </div>
                        </div>
                               </div>
                             </div>
                           </div>

                          {/* Action Button */}
                          <div className="text-center pt-6">
                            <Button 
                              className="bg-black hover:bg-gray-800 text-white px-10 py-4 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-black"
                              onClick={() => handleCardClick(getCurrentCards()[currentCardIndex])}
                            >
                              <Rocket className="h-6 w-6 mr-3" />
                              Explore Action Levels
                </Button>
                          </div>
              </div>
            </CardContent>
          </Card>
                  </motion.div>
                </div>

                {/* Carousel Indicators */}
                <div className="flex justify-center mt-10 gap-3">
                  {getCurrentCards().map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentCardIndex(index)}
                      className={cn(
                        "w-4 h-4 rounded-full transition-all duration-300 border-2",
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={closeCardDetail}
                className="absolute top-6 right-6 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors z-10"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>

              {/* Modal Content */}
              <div className="p-8">
                                 {/* Header */}
                 <div className="text-center mb-10">
                   <div className="flex items-center justify-center gap-4 mb-6">
                     <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center">
                       <div className="w-12 h-12 text-gray-700">
                         {categoryConfig[selectedCard.domain]?.icon || <Info className="h-12 w-12" />}
                       </div>
                     </div>
                                       <h2 className="text-5xl font-extrabold text-black tracking-tight">Action Details</h2>
                </div>
                <h3 className="text-3xl text-black leading-relaxed max-w-4xl mx-auto font-normal tracking-wide">
                  {selectedCard.action}
                </h3>
                 </div>

                                 {/* Action Levels */}
                 <div className="space-y-8 mb-10">
                   <h4 className="text-3xl font-bold text-black text-center mb-8">Choose Your Level</h4>
                   
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     {/* Start Level */}
                     <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg">
                       <div className="text-center space-y-6">
                         <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto">
                           <Play className="h-10 w-10 text-gray-700" />
                         </div>
                         <h5 className="text-2xl font-bold text-black">Start</h5>
                         <p className="text-gray-700 text-base leading-relaxed">
                           {selectedCard.levels.start}
                         </p>
                         <Badge className="bg-gray-100 text-black border-2 border-gray-300 px-4 py-2 text-sm font-semibold">
                           Easy Start
                         </Badge>
                       </div>
                     </div>

                     {/* Level Up */}
                     <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg">
                       <div className="text-center space-y-6">
                         <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto">
                           <TrendingUp className="h-10 w-10 text-gray-700" />
                         </div>
                         <h5 className="text-2xl font-bold text-black">Level Up</h5>
                         <p className="text-gray-700 text-base leading-relaxed">
                           {selectedCard.levels.levelUp}
                         </p>
                         <Badge className="bg-gray-100 text-black border-2 border-gray-300 px-4 py-2 text-sm font-semibold">
                           Build Momentum
                         </Badge>
                       </div>
                     </div>

                     {/* Stretch */}
                     <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg">
                       <div className="text-center space-y-6">
                         <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto">
                           <Rocket className="h-10 w-10 text-gray-700" />
                         </div>
                         <h5 className="text-2xl font-bold text-black">Stretch</h5>
                         <p className="text-gray-700 text-base leading-relaxed">
                           {selectedCard.levels.stretch}
                         </p>
                         <Badge className="bg-gray-100 text-black border-2 border-gray-300 px-4 py-2 text-sm font-semibold">
                           Maximum Impact
                         </Badge>
                       </div>
                      </div>
                  </div>
                </div>

                                 {/* Additional Details */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {/* Enabler */}
                   {selectedCard.enabler && (
                     <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
                       <h5 className="text-xl font-bold text-black mb-4 flex items-center gap-3">
                         <Shield className="h-6 w-6 text-gray-700" />
                         What You'll Need
                       </h5>
                       <p className="text-lg text-gray-700 leading-relaxed">{selectedCard.enabler}</p>
                     </div>
                   )}

                   {/* Prerequisites */}
                   {selectedCard.prerequisites.length > 0 && (
                     <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
                       <h5 className="text-xl font-bold text-black mb-4 flex items-center gap-3">
                         <CheckCircle className="h-6 w-6 text-gray-700" />
                         Prerequisites
                       </h5>
                       <ul className="space-y-3">
                         {selectedCard.prerequisites.map((prereq, idx) => (
                           <li key={idx} className="flex items-center gap-3 text-lg text-gray-700">
                             <div className="w-3 h-3 bg-black rounded-full"></div>
                             {prereq}
                           </li>
                         ))}
                       </ul>
                     </div>
                   )}
                </div>

                 {/* Action Buttons */}
                 <div className="flex justify-center gap-6 mt-10 pt-8 border-t-2 border-gray-200">
                   <Button
                     variant="outline"
                     onClick={closeCardDetail}
                     className="px-10 py-4 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 text-lg font-semibold rounded-xl"
                   >
                     Close
                   </Button>
                <Button
                     className="bg-black hover:bg-gray-800 text-white px-10 py-4 text-lg font-semibold rounded-xl border-2 border-black"
                   >
                     <Target className="h-6 w-6 mr-3" />
                     Start This Action
                </Button>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecommendationEngine; 