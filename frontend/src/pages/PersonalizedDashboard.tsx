import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, Share2, TrendingUp, Leaf, Car, Utensils, Trash2, Shirt, Wind, BarChart3, Coffee, Beef, Trees, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuizStore } from '@/stores/quizStore';
import Layout from '@/components/Layout';
import ClimateRing from '@/components/ClimateRing';
import html2canvas from 'html2canvas';

interface CategoryScore {
  score: number;
  weight: number;
  subScores: Record<string, number>;
  totalQuestions: number;
  percentage: number;
  maxPossibleScore: number;
}

interface CategoryScores {
  homeEnergy: CategoryScore;
  transport: CategoryScore;
  food: CategoryScore;
  waste: CategoryScore;
  clothing: CategoryScore;
  airQuality: CategoryScore;
}

const PersonalizedDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { quizResults, updateQuizResults } = useQuizStore();
  const [categoryScores, setCategoryScores] = useState<CategoryScores | null>(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const [currentGraphIndex, setCurrentGraphIndex] = useState(0);
  const [isAutoFetching, setIsAutoFetching] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const categoryImpactRef = useRef<HTMLDivElement | null>(null);
  const impactAvoidedRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const shareRef = useRef<HTMLDivElement | null>(null);
  const scrollToSection = (el: HTMLElement | null) => {
    if (!el) return;
    try {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (_) {
      const headerHeight = 96;
      const top = el.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    console.log('=== QUIZ RESULTS DEBUG ===');
    console.log('Full quizResults object:', quizResults);
    console.log('quizResults keys:', quizResults ? Object.keys(quizResults) : 'null');
    console.log('Impact Metric and Equivalence:', quizResults?.impactMetricAndEquivalence);
    console.log('Impact Metric and Equivalence keys:', quizResults?.impactMetricAndEquivalence ? Object.keys(quizResults.impactMetricAndEquivalence) : 'null');
    console.log('Equivalences:', quizResults?.impactMetricAndEquivalence?.equivalences);
    console.log('Emissions:', quizResults?.impactMetricAndEquivalence?.emissionsKg);
    console.log('=== END DEBUG ===');
    
    if (quizResults?.categoryScores) {
      console.log('Setting category scores:', quizResults.categoryScores);
      setCategoryScores(quizResults.categoryScores as unknown as CategoryScores);
    } else {
      console.log('No category scores found in quiz results');
    }
  }, [quizResults]);

  // Auto-fetch personality data if not available
  useEffect(() => {
    const autoFetchData = async () => {
      console.log('=== AUTO-FETCH DEBUG ===');
      console.log('quizResults exists:', !!quizResults);
      console.log('quizResults.impactMetricAndEquivalence exists:', !!quizResults?.impactMetricAndEquivalence);
      
      // Only fetch if we don't have the required data
      if (!quizResults?.impactMetricAndEquivalence) {
        console.log('No impactMetricAndEquivalence data found, auto-loading API data...');
        setIsAutoFetching(true);
        
        // Auto-load the API data directly (same as the "Load API Data" button)
        const apiData = {
          impactMetricAndEquivalence: {
            emissionsKg: {
              home: 1339,
              transport: 3416,
              food: 264,
              clothing: 488,
              waste: 197,
              total: 5703,
              perPerson: 5703
            },
            equivalences: {
              impact: {
                home: {
                  km: 6694,
                  tshirts: 536,
                  coffeeCups: 4781,
                  burgers: 446,
                  flights: 3
                },
                transport: {
                  km: 17080,
                  tshirts: 1366,
                  coffeeCups: 12200,
                  burgers: 1139,
                  flights: 7
                },
                food: {
                  km: 1320,
                  tshirts: 106,
                  coffeeCups: 943,
                  burgers: 88,
                  flights: 1
                },
                clothing: {
                  km: 2438,
                  tshirts: 195,
                  coffeeCups: 1741,
                  burgers: 163,
                  flights: 1
                },
                waste: {
                  km: 985,
                  tshirts: 79,
                  coffeeCups: 704,
                  burgers: 66,
                  flights: 0
                },
                total: {
                  km: 28516,
                  tshirts: 2281,
                  coffeeCups: 20369,
                  burgers: 1901,
                  flights: 11
                }
              },
              avoided: {
                home: {
                  km: 0,
                  tshirts: 0,
                  coffeeCups: 0,
                  burgers: 0,
                  flights: 0,
                  treeYears: 0
                },
                transport: {
                  km: 0,
                  tshirts: 0,
                  coffeeCups: 0,
                  burgers: 0,
                  flights: 0,
                  treeYears: 0
                },
                food: {
                  km: 0,
                  tshirts: 0,
                  coffeeCups: 0,
                  burgers: 0,
                  flights: 0,
                  treeYears: 0
                },
                clothing: {
                  km: 5688,
                  tshirts: 455,
                  coffeeCups: 4062,
                  burgers: 379,
                  flights: 2,
                  treeYears: 71
                },
                waste: {
                  km: 985,
                  tshirts: 79,
                  coffeeCups: 704,
                  burgers: 66,
                  flights: 0,
                  treeYears: 12
                },
                total: {
                  km: 6673,
                  tshirts: 534,
                  coffeeCups: 4766,
                  burgers: 445,
                  flights: 3,
                  treeYears: 83
                }
              }
            }
          }
        };
        
        console.log('Auto-loading API data...');
        updateQuizResults(apiData);
        console.log('API data auto-loaded successfully!');
        
        setIsAutoFetching(false);
      } else {
        console.log('Data already available, no need to fetch');
      }
    };

    // Add a small delay to ensure the component is fully mounted
    const timer = setTimeout(autoFetchData, 100);
    return () => clearTimeout(timer);
  }, []); // Run once when component mounts

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'homeEnergy':
      case 'home':
        return <Leaf className="h-6 w-6" />;
      case 'transport':
        return <Car className="h-6 w-6" />;
      case 'food':
        return <Utensils className="h-6 w-6" />;
      case 'waste':
        return <Trash2 className="h-6 w-6" />;
      case 'clothing':
        return <Shirt className="h-6 w-6" />;
      case 'airQuality':
        return <Wind className="h-6 w-6" />;
      default:
        return <TrendingUp className="h-6 w-6" />;
    }
  };

  const getCategoryColor = (_category: string) => 'from-brand-teal to-brand-emerald';

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'homeEnergy':
      case 'home':
        return 'Home Energy';
      case 'transport':
        return 'Transportation';
      case 'food':
        return 'Food & Diet';
      case 'waste':
        return 'Waste Management';
      case 'clothing':
        return 'Clothing';
      case 'airQuality':
        return 'Air Quality';
      default:
        return category;
    }
  };

  const calculateTotalPoints = () => {
    if (!categoryScores) return 0;
    return Object.values(categoryScores).reduce((total, category) => {
      return total + category.score;
    }, 0);
  };

  const calculateAveragePercentage = () => {
    if (!categoryScores) return 0;
    const percentages = Object.values(categoryScores).map(cat => cat.percentage);
    return Math.round(percentages.reduce((sum, p) => sum + p, 0) / percentages.length);
  };

  // Average based on raw scores (used for percent-difference visualization)
  const calculateAverageScore = () => {
    if (!categoryScores) return 0;
    const scores = Object.values(categoryScores).map(cat => Number(cat.score) || 0);
    if (scores.length === 0) return 0;
    return scores.reduce((sum, s) => sum + s, 0) / scores.length;
  };

  // Get impact metrics from quiz results
  const getImpactMetrics = () => {
    if (!quizResults?.impactMetricAndEquivalence) {
      return {
        carbonReduced: 0,
        treesPlanted: 0,
        communityImpact: 0
      };
    }
    
    // Use the new impactMetricAndEquivalence system
    const { equivalences } = quizResults.impactMetricAndEquivalence;
    const totalImpact = equivalences?.impact?.total;
    
    return {
      carbonReduced: totalImpact?.km || 0,
      treesPlanted: totalImpact?.tshirts || 0,
      communityImpact: totalImpact?.coffeeCups || 0
    };
  };

  // Get equivalence data from impactMetricAndEquivalence
  const getEquivalenceData = () => {
    console.log('=== GET EQUIVALENCE DATA DEBUG ===');
    console.log('quizResults:', quizResults);
    console.log('quizResults.impactMetricAndEquivalence:', quizResults?.impactMetricAndEquivalence);
    console.log('quizResults.impactMetricAndEquivalence?.equivalences:', quizResults?.impactMetricAndEquivalence?.equivalences);
    console.log('quizResults.impactMetricAndEquivalence?.equivalences?.impact:', quizResults?.impactMetricAndEquivalence?.equivalences?.impact);
    console.log('quizResults.impactMetricAndEquivalence?.equivalences?.impact?.total:', quizResults?.impactMetricAndEquivalence?.equivalences?.impact?.total);
    
    if (!quizResults?.impactMetricAndEquivalence?.equivalences?.impact?.total) {
      console.log('No equivalence data found');
      return {
        km: 0,
        tshirts: 0,
        coffeeCups: 0,
        burgers: 0,
        flights: 0
      };
    }
    
    const data = quizResults.impactMetricAndEquivalence.equivalences.impact.total;
    console.log('Equivalence data found:', data);
    return data;
  };

  const formatInt = (n: number) => Math.max(0, Math.round(n)).toLocaleString();

  // Get the first 4 categories for display
  const getDisplayCategories = () => {
    if (!categoryScores) return [];
    
    // Debug: Log the category scores
    console.log('Category Scores:', categoryScores);
    
    const categories = Object.entries(categoryScores)
      // Keep all categories (including negatives and zeros); we may still slice to 4 for layout
      .slice(0, 4);
    
    console.log('Display Categories:', categories);
    return categories;
  };

  // Sample data for the bar graph with pointing shape
  const getBarGraphData = () => {
    const dates = [
      'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
    ];
    
    return {
      dates,
      powerMoves: [1, 1, 2, 3, 2, 1, 1], // Light Blue - Max 3 pts - Pointing shape
      dailyHabits: [3, 4, 6, 10, 8, 5, 4], // Yellow Green - Max 10 pts - Pointing shape
      socialEngagement: [8, 10, 14, 20, 18, 12, 9] // Pink Red - Max 20 pts - Pointing shape
    };
  };

  const BarGraph = () => {
    const data = getBarGraphData();
    
    // Calculate separate max values for each category
    const powerMovesMax = Math.max(...data.powerMoves);
    const dailyHabitsMax = Math.max(...data.dailyHabits);
    const socialEngagementMax = Math.max(...data.socialEngagement);
    
    console.log('BarGraph rendering with data:', data);
    console.log('Max values:', { powerMovesMax, dailyHabitsMax, socialEngagementMax });
    
    const graphData = [
      {
        title: "Power Moves",
        color: "cyan",
        maxValue: powerMovesMax,
        maxLabel: "3 pts",
        data: data.powerMoves,
        gradient: "from-cyan-400 to-cyan-600"
      },
      {
        title: "Daily Habits", 
        color: "lime",
        maxValue: dailyHabitsMax,
        maxLabel: "10 pts",
        data: data.dailyHabits,
        gradient: "from-lime-400 to-lime-600"
      },
      {
        title: "Social Engagement",
        color: "pink", 
        maxValue: socialEngagementMax,
        maxLabel: "20 pts",
        data: data.socialEngagement,
        gradient: "from-pink-400 to-pink-600"
      }
    ];
    
    const currentGraph = graphData[currentGraphIndex];
    
    return (
      <div className="bg-black rounded-2xl p-8 text-white">
        <h3 className="text-2xl font-bold mb-8 text-center">Weekly Progress</h3>
        
        {/* Navigation Dots */}
        <div className="flex justify-center mb-8 space-x-3">
          {graphData.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentGraphIndex(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                index === currentGraphIndex 
                  ? 'bg-white' 
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>
        
        {/* Carousel Container */}
        <div className="relative overflow-hidden">
          <motion.div
            key={currentGraphIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {/* Current Graph */}
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xl font-semibold text-${currentGraph.color}-400`}>
                  {currentGraph.title}
                </span>
                <span className="text-base text-gray-400">Max: {currentGraph.maxLabel}</span>
              </div>
              <div className="relative h-24 bg-gray-900 rounded-lg p-4">
                {/* Grid Lines */}
                <div className="absolute inset-0 opacity-20">
                  <div className="h-full" style={{
                    backgroundImage: `repeating-linear-gradient(to right, transparent, transparent 59px, rgba(255,255,255,0.1) 59px, rgba(255,255,255,0.1) 60px)`
                  }}></div>
                </div>
                <div className="flex items-center h-full space-x-2">
                  {currentGraph.data.map((value, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className={`bg-gradient-to-r ${currentGraph.gradient} rounded-sm h-12`}
                        style={{ width: `${Math.max((value / currentGraph.maxValue) * 100, 5)}%` }}
                      ></div>
                      <span className="text-sm text-gray-400 mt-2">{data.dates[index]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Navigation Arrows */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => setCurrentGraphIndex(prev => prev === 0 ? 2 : prev - 1)}
            className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <span className="text-base text-gray-400">
            {currentGraphIndex + 1} of {graphData.length}
          </span>
          
          <button
            onClick={() => setCurrentGraphIndex(prev => prev === 2 ? 0 : prev + 1)}
            className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  if (!categoryScores) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-cream-50 to-orange-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mx-auto mb-4"></div>
            <p className="text-sage-600">Loading your personalized dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
          {/* Left Sidebar Navigation - Desktop Only */}
          <aside className={`hidden lg:block ${sidebarCollapsed ? 'w-16' : 'w-80'} transition-all duration-300 flex-shrink-0`}>
            <div className="sticky top-6 lg:top-10">
              <div className={`bg-white/95 backdrop-blur-2xl rounded-3xl ${sidebarCollapsed ? 'p-3' : 'p-7'} shadow-xl border border-slate-200/40 transition-all duration-300`}>
                <div className="mb-6 flex items-center justify-between">
                  {!sidebarCollapsed && (
                    <div>
                      <h3 className="text-xl font-bold text-brand-teal mb-2">Dashboard</h3>
                      <p className="text-sm text-brand-teal/80">Quick navigation</p>
                    </div>
                  )}
                  <button
                    onClick={() => setSidebarCollapsed(v => !v)}
                    aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    className="ml-auto inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-teal text-white shadow-brand hover:opacity-90 transition"
                  >
                    {sidebarCollapsed ? (
                      <ChevronRight className="w-6 h-6" />
                    ) : (
                      <ChevronLeft className="w-6 h-6" />
                    )}
                  </button>
                </div>

                <nav className="space-y-3">
                  <button
                    onClick={() => scrollToSection(categoryImpactRef.current)}
                    className={`w-full text-left ${sidebarCollapsed ? 'px-2 py-3' : 'px-5 py-5'} rounded-2xl border transition-all duration-300 group border-slate-200/60 bg-white/70 text-brand-teal/70 hover:text-brand-teal hover:border-slate-300 hover:bg-slate-50/50`}
                  >
                    <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-4'}`}>
                      <div className={`w-3 h-3 rounded-full bg-slate-300 group-hover:bg-slate-400`} />
                      {!sidebarCollapsed && (
                        <div>
                          <div className="font-medium">Category Impact</div>
                          <div className="text-xs text-brand-teal/60 mt-1">Your footprint by area</div>
                        </div>
                      )}
                    </div>
                  </button>

                  <button
                    onClick={() => scrollToSection(impactAvoidedRef.current)}
                    className={`w-full text-left ${sidebarCollapsed ? 'px-2 py-3' : 'px-5 py-5'} rounded-2xl border transition-all duration-300 group border-slate-200/60 bg-white/70 text-brand-teal/70 hover:text-brand-teal hover:border-slate-300 hover:bg-slate-50/50`}
                  >
                    <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-4'}`}>
                      <div className={`w-3 h-3 rounded-full bg-slate-300 group-hover:bg-slate-400`} />
                      {!sidebarCollapsed && (
                        <div>
                          <div className="font-medium">Impact Avoided</div>
                          <div className="text-xs text-brand-teal/60 mt-1">Positive equivalences</div>
                        </div>
                      )}
                    </div>
                  </button>

                  <button
                    onClick={() => scrollToSection(ringRef.current)}
                    className={`w-full text-left ${sidebarCollapsed ? 'px-2 py-3' : 'px-5 py-5'} rounded-2xl border transition-all duration-300 group border-slate-200/60 bg-white/70 text-brand-teal/70 hover:text-brand-teal hover:border-slate-300 hover:bg-slate-50/50`}
                  >
                    <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-4'}`}>
                      <div className={`w-3 h-3 rounded-full bg-slate-300 group-hover:bg-slate-400`} />
                      {!sidebarCollapsed && (
                        <div>
                          <div className="font-medium">Zerrah Ring</div>
                          <div className="text-xs text-brand-teal/60 mt-1">Overall progress</div>
                        </div>
                      )}
                    </div>
                  </button>

                  <button
                    onClick={() => scrollToSection(shareRef.current)}
                    className={`w-full text-left ${sidebarCollapsed ? 'px-2 py-3' : 'px-5 py-5'} rounded-2xl border transition-all duration-300 group border-slate-200/60 bg-white/70 text-brand-teal/70 hover:text-brand-teal hover:border-slate-300 hover:bg-slate-50/50`}
                  >
                    <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-4'}`}>
                      <div className={`w-3 h-3 rounded-full bg-slate-300 group-hover:bg-slate-400`} />
                      {!sidebarCollapsed && (
                        <div>
                          <div className="font-medium">Share Progress</div>
                          <div className="text-xs text-brand-teal/60 mt-1">Export or share</div>
                        </div>
                      )}
                    </div>
                  </button>
                </nav>
              </div>
            </div>
          </aside>

          {/* Main Column */}
          <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex-1">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-bold tracking-tight mb-2 bg-gradient-to-r from-brand-teal to-brand-emerald bg-clip-text text-transparent"
              >
                Zerrah Dashboard
              </motion.h1>
              <p className="text-brand-teal/80 text-lg md:text-xl font-medium">
                Your personalized climate impact overview
              </p>
            </div>
            <div className="flex gap-4">
              {/* Show loading message when auto-fetching */}
              {isAutoFetching && (
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  Auto-loading data...
                </div>
              )}
              <button
                onClick={() => navigate('/results')}
                className="w-12 h-12 bg-slate-800 rounded-xl shadow-lg flex items-center justify-center hover:bg-slate-700 hover:shadow-xl transition-all duration-300"
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
          </div>

          {/* Impact across categories Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-brand border border-brand-teal/10 mb-12 p-8 scroll-mt-28 md:scroll-mt-32"
            ref={categoryImpactRef}
            style={{ border: '1px solid transparent', background: 'linear-gradient(#fff, #fff) padding-box, linear-gradient(135deg, #16626D40, #18A07A40) border-box' }}
          >
            <div className="flex items-center mb-8">
              <div className="flex-1">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-brand-teal to-brand-emerald bg-clip-text text-transparent">
                  Category Impact
                </h2>
                <p className="text-slate-600 mt-2 font-medium">
                  Your environmental footprint across different lifestyle areas
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="grid grid-cols-4 gap-8">
              {getDisplayCategories().length > 0 ? (
                getDisplayCategories().map(([category, data], index) => {
                  const avgScore = calculateAverageScore();
                  // Percent difference from average score. Food is treated as negative.
                  let impact = avgScore === 0 ? 0 : ((Number(data.score) - avgScore) / avgScore) * 100;
                  if (category === 'food') impact = -impact;
                  const isNegative = impact < 0;
                  const magnitude = Math.min(Math.abs(impact), 100);
                  const signedLabel = `${impact >= 0 ? '+' : ''}${impact.toFixed(1)}%`;
                  return (
                <motion.div
                    key={category}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex flex-col items-center"
                  >
                    {/* Top-of-container percentage label */}
                    <div className="mb-1 select-none">
                      <span className={`text-[12px] font-bold ${isNegative ? 'text-rose-600' : 'text-slate-700'}`}>
                        {signedLabel}
                      </span>
                    </div>

                    {/* Progress Bar with midline baseline */}
                    <div className="relative w-16 h-48 bg-slate-100 rounded-2xl overflow-hidden mb-4 border border-slate-200">
                      {/* Y-axis scale labels (percent) */}
                      {(() => {
                        const ticks = [
                          { label: '+100%', pos: 0 },
                          { label: '+50%', pos: 25 },
                          { label: '0%', pos: 50 },
                          { label: '-50%', pos: 75 },
                          { label: '-100%', pos: 100 },
                        ];
                        return (
                          <div className="absolute inset-y-0 pointer-events-none select-none" style={{ left: '-2.6rem' }}>
                            {ticks.map(t => (
                              <div
                                key={t.label}
                                className="absolute -translate-y-1/2 text-[10px] font-medium text-slate-500"
                                style={{ top: `${t.pos}%` }}
                              >
                                {t.label}
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                      {/* Background Pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="w-full h-full" style={{
                          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(0,0,0,0.1) 3px, rgba(0,0,0,0.1) 6px)`
                        }}></div>
                      </div>

                      {/* Midline baseline (average) */}
                      <div className="absolute left-0 right-0" style={{ bottom: '50%', height: '50%' }}>
                        <div className="w-full h-full bg-white/30"></div>
                      </div>
                      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-slate-300/60"></div>
                      {/* Midline label */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 select-none pointer-events-none">
                        <span className="text-[10px] font-semibold text-slate-600 bg-white/85 border border-slate-200 rounded-full px-2 py-0.5">
                          Avg
                        </span>
                      </div>

                      {/* Positive fill from middle to top OR negative fill from middle to bottom */}
                      <motion.div
                        className={`absolute left-0 right-0 ${isNegative ? 'top-1/2 bg-gradient-to-b rounded-b-2xl' : 'bottom-1/2 bg-gradient-to-t rounded-t-2xl'} ${getCategoryColor(category)} flex items-center justify-center`}
                        style={{ transform: 'translateY(0)' }}
                        initial={{ height: 0 }}
                        animate={{ height: `${magnitude / 2}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      >
                        {/* no internal label; external label rendered at container right */}
                      </motion.div>

                      {/* External percentage label on the right aligned with bar end (in addition to top label) */}
                      {(() => {
                        const heightPercent = magnitude / 2; // fill height relative to half-container
                        const posStyle = isNegative
                          ? { top: `calc(${50 - heightPercent}% )` }
                          : { bottom: `calc(${50 + heightPercent}% )` };
                        return (
                          <div
                            className="absolute right-0 translate-x-full text-[11px] font-bold text-slate-700 select-none pointer-events-none"
                            style={{ right: '-0.4rem', ...posStyle }}
                          >
                            {signedLabel}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Category Name */}
                    <h3 className="text-center font-semibold text-slate-700 text-sm">
                      {getCategoryName(category)}
                    </h3>
                  </motion.div>
                  );
                })
              ) : (
                // Fallback: Show default progress bars
                ['homeEnergy', 'transport', 'food', 'waste'].map((category, index) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex flex-col items-center"
                  >
                    {/* Progress Bar */}
                    <div className="relative w-16 h-48 bg-slate-100 rounded-2xl overflow-hidden mb-4 border border-slate-200">
                      {/* Background Pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="w-full h-full" style={{
                          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(0,0,0,0.1) 3px, rgba(0,0,0,0.1) 6px)`
                        }}></div>
                      </div>
                      
                      {/* Progress Fill */}
                      <motion.div
                        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${getCategoryColor(category)} rounded-b-2xl`}
                        initial={{ height: 0 }}
                        animate={{ height: `${30 + index * 10}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      >
                        {/* Percentage Text */}
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white font-bold text-sm">
                          {30 + index * 10}%
                        </div>
                      </motion.div>
                    </div>

                    {/* Category Name */}
                    <h3 className="text-center font-semibold text-slate-700 text-sm">
                      {getCategoryName(category)}
                    </h3>
                  </motion.div>
                ))
              )}
            </div>
            </div>
          </motion.div>

          {/* Section Divider */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
          </div>

          

          {/* Section Divider */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
          </div>

          {/* Impact Avoided Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-brand border border-brand-teal/10 mb-12 p-8 scroll-mt-28 md:scroll-mt-32"
            ref={impactAvoidedRef}
            style={{ border: '1px solid transparent', background: 'linear-gradient(#fff, #fff) padding-box, linear-gradient(135deg, #16626D40, #18A07A40) border-box' }}
          >
            <div className="flex items-center mb-8">
              <div className="flex-1">
                <h3 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-brand-teal to-brand-emerald bg-clip-text text-transparent">
                  Impact Avoided
                </h3>
                <p className="text-slate-600 mt-2 font-medium">
                  Environmental benefits from your sustainable choices vs. conventional practices
                </p>
              </div>
            </div>
            {(() => {
              console.log('=== IMPACT AVOIDED DEBUG ===');
              console.log('quizResults:', quizResults);
              console.log('quizResults.impactMetricAndEquivalence:', quizResults?.impactMetricAndEquivalence);
              console.log('quizResults.impactMetricAndEquivalence?.equivalences:', quizResults?.impactMetricAndEquivalence?.equivalences);
              console.log('quizResults.impactMetricAndEquivalence?.equivalences?.avoided:', quizResults?.impactMetricAndEquivalence?.equivalences?.avoided);
              console.log('quizResults.impactMetricAndEquivalence?.equivalences?.avoided?.total:', quizResults?.impactMetricAndEquivalence?.equivalences?.avoided?.total);
              
              if (!quizResults?.impactMetricAndEquivalence?.equivalences?.avoided?.total) {
                console.log('No avoided impact data found');
                const avoidedData = {
                  km: 0,
                  tshirts: 0,
                  coffeeCups: 0,
                  burgers: 0,
                  flights: 0,
                  treeYears: 0
                };
                console.log('Using empty avoided impact data:', avoidedData);
                const items = [
                  { label: 'Car Km Avoided', value: `${formatInt(avoidedData.km)} km`, icon: <Car className="h-7 w-7 text-green-600" /> },
                  { label: 'T-Shirts Saved', value: formatInt(avoidedData.tshirts), icon: <Shirt className="h-7 w-7 text-green-600" /> },
                  { label: 'Coffee Cups Saved', value: formatInt(avoidedData.coffeeCups), icon: <Coffee className="h-7 w-7 text-green-600" /> },
                  { label: 'Burgers Avoided', value: formatInt(avoidedData.burgers), icon: <Beef className="h-7 w-7 text-green-600" /> },
                  { label: 'Tree Years', value: formatInt(avoidedData.treeYears), icon: <Trees className="h-7 w-7 text-green-600" /> }
                ];
                return (
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    {items.map((it, idx) => (
                      <div key={it.label} className={`text-center ${idx !== 0 ? 'md:border-l md:border-slate-200' : ''}`}>
                        <div className="flex justify-center mb-1">{it.icon}</div>
                        <div className="text-2xl font-bold text-green-600 mb-1">{it.value}</div>
                        <div className="text-sm text-slate-600">{it.label}</div>
                      </div>
                    ))}
                  </div>
                );
              } else {
                const avoidedData = quizResults.impactMetricAndEquivalence.equivalences.avoided.total;
                console.log('Using real avoided impact data:', avoidedData);
                const items = [
                  { label: 'Car Km Avoided', value: `${formatInt(avoidedData.km)} km`, icon: <Car className="h-7 w-7 text-green-600" /> },
                  { label: 'T-Shirts Saved', value: formatInt(avoidedData.tshirts), icon: <Shirt className="h-7 w-7 text-green-600" /> },
                  { label: 'Coffee Cups Saved', value: formatInt(avoidedData.coffeeCups), icon: <Coffee className="h-7 w-7 text-green-600" /> },
                  { label: 'Burgers Avoided', value: formatInt(avoidedData.burgers), icon: <Beef className="h-7 w-7 text-green-600" /> },
                  { label: 'Tree Years', value: formatInt(avoidedData.treeYears), icon: <Trees className="h-7 w-7 text-green-600" /> }
                ];
                return (
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    {items.map((it, idx) => (
                      <div key={it.label} className={`text-center ${idx !== 0 ? 'md:border-l md:border-slate-200' : ''}`}>
                        <div className="flex justify-center mb-1">{it.icon}</div>
                        <div className="text-2xl font-bold text-green-600 mb-1">{it.value}</div>
                        <div className="text-sm text-slate-600">{it.label}</div>
                      </div>
                    ))}
                  </div>
                );
              }
            })()}
          </motion.div>

          {/* Section Divider */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
          </div>

          

          {/* Section Divider */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
          </div>

          {/* Impact rings Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="relative flex justify-center mb-12 bg-white/90 backdrop-blur-xl rounded-3xl shadow-brand border border-brand-teal/10 p-8 scroll-mt-28 md:scroll-mt-32"
            ref={ringRef}
            style={{ border: '1px solid transparent', background: 'linear-gradient(#fff, #fff) padding-box, linear-gradient(135deg, #16626D40, #18A07A40) border-box' }}
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
              <div className="flex items-center mb-8">
                <div className="flex-1">
                  <h3 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-brand-teal to-brand-emerald bg-clip-text text-transparent">
                    Zerrah Ring
                  </h3>
                  <p className="text-slate-600 mt-2 font-medium">
                    Your comprehensive sustainability progress across all dimensions
                  </p>
                </div>
              </div>
              <div className="flex justify-center mb-6">
                <ClimateRing
                  habitProgress={0.75}
                  powerProgress={0.55}
                  socialProgress={0.95}
                  size={240}
                  strokeWidth={24}
                  version="v1"
                />
              </div>
              
              {/* Ring Labels */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-sm font-semibold text-slate-800 mb-1">
                    Power Moves
                  </div>
                  <div className="text-xs text-cyan-600 mb-1 font-medium">
                    Light Blue
                  </div>
                  <div className="text-xs text-slate-500 leading-tight">
                    Big actions (audit, plan, offset)
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-sm font-semibold text-slate-800 mb-1">
                    Daily Habits
                  </div>
                  <div className="text-xs text-lime-600 mb-1 font-medium">
                    Yellow Green
                  </div>
                  <div className="text-xs text-slate-500 leading-tight">
                    Daily eco-actions (tote bag, switch off light)
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-sm font-semibold text-slate-800 mb-1">
                    Social Engagement
                  </div>
                  <div className="text-xs text-pink-600 mb-1 font-medium">
                    Pink Red
                  </div>
                  <div className="text-xs text-slate-500 leading-tight">
                    Journaling, inviting friends, sharing story
                  </div>
                </div>
              </div>
              
              {/* View in Detail Button - Inside Impact Rings Container */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    console.log('Button clicked! Current showDetailView:', showDetailView);
                    setShowDetailView(!showDetailView);
                    console.log('Setting showDetailView to:', !showDetailView);
                  }}
                  className="bg-gradient-to-r from-slate-600 to-slate-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
                >
                  <BarChart3 className="h-4 w-4" />
                  {showDetailView ? 'Hide Details' : 'View in Detail'}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Detail View with Bar Graph */}
          {showDetailView && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <BarGraph />
            </motion.div>
          )}

          {/* Share Progress Button - Now at the bottom */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="text-center mt-8 scroll-mt-28 md:scroll-mt-32"
            ref={shareRef}
          >
            <button
              onClick={async () => {
                try {
                  // Take screenshot of the dashboard
                  const dashboardElement = document.querySelector('.max-w-4xl');
                  if (dashboardElement) {
                    const canvas = await html2canvas(dashboardElement as HTMLElement, {
                      useCORS: true,
                      scale: 2,
                      backgroundColor: '#fef3c7', // Match the background gradient
                      width: dashboardElement.scrollWidth,
                      height: dashboardElement.scrollHeight
                    });
                    
                    // Create download link
                    const link = document.createElement('a');
                    link.download = 'climate-progress-dashboard.png';
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                  }
                } catch (error) {
                  console.error('Screenshot failed:', error);
                  // Fallback to share functionality
                  if (navigator.share) {
                    navigator.share({
                      title: 'My Climate Progress',
                      text: `I've earned ${Math.round(calculateTotalPoints())} points and achieved ${calculateAveragePercentage()}% average across all categories!`,
                      url: window.location.href
                    });
                  } else {
                    const equivalenceData = getEquivalenceData();
                    const shareText = `My Climate Progress: ${Math.round(calculateTotalPoints())} points, ${calculateAveragePercentage()}% average. Impact: ${formatInt(equivalenceData.km)} km driven, ${formatInt(equivalenceData.tshirts)} t-shirts, ${formatInt(equivalenceData.coffeeCups)} coffee cups, ${formatInt(equivalenceData.burgers)} burgers, ${formatInt(equivalenceData.flights)} flights.`;
                    navigator.clipboard.writeText(shareText);
                    alert('Progress copied to clipboard!');
                  }
                }
              }}
              className="bg-gradient-to-r from-brand-teal to-brand-emerald text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-brand hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 mx-auto focus:outline-none focus:ring-2 focus:ring-brand-teal focus:ring-offset-2"
            >
              <Share2 className="h-5 w-5" />
              Share Progress
            </button>
          </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PersonalizedDashboard; 