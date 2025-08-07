import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, Share2, TrendingUp, Leaf, Car, Utensils, Trash2, Shirt, Wind, BarChart3 } from 'lucide-react';
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
  const { quizResults } = useQuizStore();
  const [categoryScores, setCategoryScores] = useState<CategoryScores | null>(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const [currentGraphIndex, setCurrentGraphIndex] = useState(0);

  useEffect(() => {
    console.log('Quiz Results:', quizResults);
    if (quizResults?.categoryScores) {
      console.log('Setting category scores:', quizResults.categoryScores);
      setCategoryScores(quizResults.categoryScores as CategoryScores);
    } else {
      console.log('No category scores found in quiz results');
    }
  }, [quizResults]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'homeEnergy':
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'homeEnergy':
        return 'from-gray-600 to-gray-700';
      case 'transport':
        return 'from-blue-500 to-blue-600';
      case 'food':
        return 'from-orange-500 to-orange-600';
      case 'waste':
        return 'from-purple-500 to-purple-600';
      case 'clothing':
        return 'from-pink-500 to-pink-600';
      case 'airQuality':
        return 'from-teal-500 to-teal-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'homeEnergy':
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

  // Get impact metrics from quiz results
  const getImpactMetrics = () => {
    if (!quizResults?.impactMetrics) {
      return {
        carbonReduced: 0,
        treesPlanted: 0,
        communityImpact: 0
      };
    }
    return {
      carbonReduced: parseFloat(quizResults.impactMetrics.carbonReduced) || 0,
      treesPlanted: quizResults.impactMetrics.treesPlanted || 0,
      communityImpact: quizResults.impactMetrics.communityImpact || 0
    };
  };

  // Get the first 4 categories for display (excluding airQuality if it's 0)
  const getDisplayCategories = () => {
    if (!categoryScores) return [];
    
    // Debug: Log the category scores
    console.log('Category Scores:', categoryScores);
    
    const categories = Object.entries(categoryScores)
      .filter(([_, data]) => data.percentage > 0) // Filter out categories with 0%
      .slice(0, 4); // Take first 4 categories
    
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
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-slate-800"
            >
              Zerrah Dashboard
            </motion.h1>
            <button
              onClick={() => navigate('/results')}
              className="w-10 h-10 bg-slate-800 rounded-full shadow-lg flex items-center justify-center hover:bg-slate-700 hover:shadow-xl transition-all duration-300"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Impact across categories Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 mb-12"
          >
            <div className="flex items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Category Impact</h2>
            </div>
            <div className="flex justify-center">
              <div className="grid grid-cols-4 gap-8">
              {getDisplayCategories().length > 0 ? (
                getDisplayCategories().map(([category, data], index) => (
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
                      animate={{ height: `${data.percentage}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    >
                      {/* Percentage Text */}
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white font-bold text-sm">
                        {data.percentage.toFixed(1)}%
                      </div>
                    </motion.div>
                  </div>

                  {/* Category Name */}
                  <h3 className="text-center font-semibold text-slate-800 text-sm">
                    {getCategoryName(category)}
                  </h3>
                </motion.div>
              ))
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
                    <h3 className="text-center font-semibold text-slate-800 text-sm">
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

          {/* Impact in numbers Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 mb-12"
          >
            <div className="flex items-center mb-4">
              <h3 className="text-xl font-bold text-slate-800">Quantified Impact</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800 mb-1">
                  {Math.round(getImpactMetrics().carbonReduced)} lb
                </div>
                <div className="text-sm text-slate-600">CO₂ Saved</div>
              </div>
              <div className="text-center border-l border-r border-slate-200">
                <div className="text-2xl font-bold text-slate-800 mb-1">
                  {getImpactMetrics().treesPlanted} ft²
                </div>
                <div className="text-sm text-slate-600">Forest Area</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800 mb-1">
                  {Math.floor(getImpactMetrics().communityImpact / 60)}h {getImpactMetrics().communityImpact % 60}m
                </div>
                <div className="text-sm text-slate-600">Time Invested</div>
              </div>
            </div>
          </motion.div>

          {/* Section Divider */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
          </div>

          {/* Impact rings Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex justify-center mb-12"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
              <div className="flex items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800">
                  Zerrah Ring
                </h3>
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
              {console.log('Rendering BarGraph component, showDetailView is:', showDetailView)}
              <BarGraph />
            </motion.div>
          )}

          {/* Share Progress Button - Now at the bottom */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="text-center mt-8"
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
                    navigator.clipboard.writeText(`My Climate Progress: ${Math.round(calculateTotalPoints())} points, ${calculateAveragePercentage()}% average`);
                    alert('Progress copied to clipboard!');
                  }
                }
              }}
              className="bg-gradient-to-r from-slate-600 to-slate-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 mx-auto"
            >
              <Share2 className="h-5 w-5" />
              Share Progress
            </button>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default PersonalizedDashboard; 