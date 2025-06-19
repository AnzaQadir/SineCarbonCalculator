import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap, Lightbulb, Info, X, Share2, Loader2, ArrowLeft, ArrowRight, Leaf, Clock, Target, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { PersonalityType } from '@/types/personality';
import { getPersonalityImage } from '@/utils/personalityImages';
import { useNavigate } from 'react-router-dom';

// Type guard for PersonalityType
const isPersonalityType = (value: string): value is PersonalityType => {
  return [
    'Sustainability Slayer',
    "Planet's Main Character",
    'Sustainability Soft Launch',
    'Kind of Conscious, Kind of Confused',
    'Eco in Progress',
    'Doing Nothing for the Planet',
    'Certified Climate Snoozer',
  ].includes(value);
};

interface RecommendationROI {
  emotional: string;
  environmental: string;
}

interface RecommendationSimulation {
  weekly?: string;
  monthly?: string;
  quarterly?: string;
  yearly?: string;
}

interface Recommendation {
  action: string;
  linkedBehavior: string;
  impact: string;
  analogy: string;
  effortLevel: 'low' | 'medium' | 'high';
  roi: RecommendationROI;
  category: string;
  simulation: RecommendationSimulation;
  personas: PersonalityType[];
  region: string;
  lifestyle: string;
}

interface WeekData {
  theme: string;
  actions: Recommendation[];
}

interface RecommendationEngineProps {
  personalityData: any; // The object with ecoPersonality, personality, personalityType
  profileImage: string;
  personality: string;
  userName: string;
  autoSimulate?: boolean;
  onBack?: () => void;
}

const RecommendationEngine: React.FC<RecommendationEngineProps> = ({ personalityData, profileImage, personality, userName, autoSimulate, onBack }) => {
  console.log('RecommendationEngine props:', { personalityData, profileImage, personality, userName });
  const [weeks, setWeeks] = useState<{ [week: string]: WeekData }>({});
  const [weekKeys, setWeekKeys] = useState<string[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<string>('');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSimulate, setShowSimulate] = useState(false);
  const [simulated, setSimulated] = useState<Recommendation | null>(null);

  // Ref to ensure autoSimulate only triggers once per recommendations load
  const autoSimulateTriggered = useRef(false);

  const navigate = useNavigate();

  // Ensure personality type is valid
  const personalityType: PersonalityType = isPersonalityType(personality) ? personality : 'Eco in Progress';
  const displayProfileImage = getPersonalityImage(personalityType, 'boy'); // Using 'boy' as default gender

  useEffect(() => {
    const fetchRecommendations = async () => {
      console.log('Fetching recommendations with data:', personalityData);
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/recommendations/static', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(personalityData),
        });
        console.log('API Response status:', res.status);
        if (!res.ok) throw new Error('Failed to fetch recommendations');
        const data = await res.json();
        console.log('API Response data:', JSON.stringify(data, null, 2));
        setWeeks(data);
        setWeekKeys(Object.keys(data));
        if (Object.keys(data).length > 0) {
          setSelectedWeek(Object.keys(data)[0]);
          setRecommendations(data[Object.keys(data)[0]].actions);
        }
      } catch (err: any) {
        console.error('Error fetching recommendations:', err);
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, [personalityData]);

  // Update recommendations when week changes
  useEffect(() => {
    if (selectedWeek && weeks[selectedWeek]) {
      setRecommendations(weeks[selectedWeek].actions);
      setCurrentIndex(0);
    }
  }, [selectedWeek, weeks]);

  // Auto open simulate modal if autoSimulate is true and recommendations are loaded
  useEffect(() => {
    if (autoSimulate && recommendations.length > 0 && !autoSimulateTriggered.current) {
      setSimulated(recommendations[0]);
      setShowSimulate(true);
      autoSimulateTriggered.current = true;
    }
    if (recommendations.length === 0) {
      autoSimulateTriggered.current = false;
    }
  }, [autoSimulate, recommendations]);

  const handleSimulate = (rec: Recommendation) => {
    setSimulated(rec);
    setShowSimulate(true);
  };

  const closeModal = () => {
    setShowSimulate(false);
    setSimulated(null);
  };

  const getEffortLevelColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'airQuality':
        return <Leaf className="h-5 w-5" />;
      case 'clothing':
        return <Users className="h-5 w-5" />;
      case 'waste':
        return <Target className="h-5 w-5" />;
      case 'food':
        return <Leaf className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 space-y-10">
      {/* Back Button */}
      {onBack && (
        <div className="mb-4">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2 text-green-700 border-green-200">
            <ArrowLeft className="h-4 w-4" /> Back to Results
          </Button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="w-28 h-28 rounded-full overflow-hidden shadow-lg border-4 border-green-200 bg-white">
          {displayProfileImage && <img src={displayProfileImage} alt="Profile" className="w-full h-full object-cover" />}
        </div>
        <h1 className="text-4xl font-extrabold text-green-800 font-serif flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-yellow-400 animate-pulse" />
          {userName}, Your Personalized Recommendations
        </h1>
        <div className="text-lg text-green-700 font-semibold">Eco-Personality: <span className="font-bold">{personalityType}</span></div>
      </div>

      {/* Week Selector */}
      {weekKeys.length > 1 && (
        <div className="flex justify-center gap-4 mb-6">
          {weekKeys.map((week) => (
            <Button
              key={week}
              onClick={() => setSelectedWeek(week)}
              className={cn(
                'px-4 py-2 rounded-full font-semibold border transition-all',
                selectedWeek === week
                  ? 'bg-green-600 text-white border-green-700 scale-105 shadow-lg'
                  : 'bg-white text-green-700 border-green-200 hover:scale-105 hover:shadow'
              )}
              style={{ minWidth: 100 }}
            >
              {week.replace('week', 'Week ')}
            </Button>
          ))}
        </div>
      )}

      {/* Theme Display */}
      {selectedWeek && weeks[selectedWeek] && (
        <div className="text-2xl font-bold text-green-700 text-center mb-4">
          Theme: {weeks[selectedWeek].theme}
        </div>
      )}

      {/* Recommendation Cards */}
      <div className="relative">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-green-600 mb-4" />
            <div className="text-green-700 text-lg">Generating your recommendations...</div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-6 rounded-xl text-center">{error}</div>
        ) : recommendations.length === 0 ? (
          <div className="text-gray-500 text-center">No recommendations available.</div>
        ) : (
          <Card className="bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl shadow-2xl p-0 overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <Lightbulb className="h-7 w-7 text-green-500" />
                <h2 className="text-2xl font-bold text-green-700 font-serif">{recommendations[currentIndex].action}</h2>
              </div>
              
              {/* Impact and Effort Level */}
              <div className="flex flex-wrap gap-3 mb-2">
                <Badge className="bg-blue-100 text-blue-800">
                  {recommendations[currentIndex].impact}
                </Badge>
                <Badge className={getEffortLevelColor(recommendations[currentIndex].effortLevel)}>
                  {recommendations[currentIndex].effortLevel} Effort
                </Badge>
                <Badge className="bg-purple-100 text-purple-800">
                  {recommendations[currentIndex].category}
                </Badge>
              </div>

              {/* ROI Section */}
              <div className="bg-white/80 rounded-xl p-4 border border-green-100 space-y-3">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-500" />
                  <span className="font-semibold text-green-700">Impact & Benefits</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-600">Emotional</div>
                    <div className="text-sm text-gray-700">{recommendations[currentIndex].roi.emotional}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Environmental</div>
                    <div className="text-sm text-gray-700">{recommendations[currentIndex].roi.environmental}</div>
                  </div>
                </div>
              </div>

              {/* Simulation Section */}
              <div className="bg-white/80 rounded-xl p-4 border border-green-100 space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-500" />
                  <span className="font-semibold text-green-700">Impact Timeline</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(recommendations[currentIndex].simulation).map(([period, impact]) => (
                    <div key={period}>
                      <div className="text-sm font-medium text-gray-600 capitalize">{period}</div>
                      <div className="text-sm text-gray-700">{impact}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Analogy */}
              <div className="bg-white/80 rounded-xl p-4 border border-green-100 flex items-center gap-3">
                <Info className="h-5 w-5 text-green-500" />
                <span className="italic text-green-700">{recommendations[currentIndex].analogy}</span>
              </div>

              <Button
                className="w-full text-white rounded-full shadow-lg transition-all duration-200 text-lg font-bold flex items-center justify-center gap-2 focus:ring-2 focus:ring-green-400"
                style={{ backgroundColor: '#5E1614' }}
                aria-label="Try This Action"
                onClick={() => handleSimulate(recommendations[currentIndex])}
              >
                <Zap className="h-4 w-4 mr-2" /> Try This Action
              </Button>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-200 text-lg font-bold flex items-center justify-center gap-2 focus:ring-2 focus:ring-blue-400 mt-3"
                aria-label="Add to My Calendar"
                onClick={() => {
                  const rec = recommendations[currentIndex];
                  const title = encodeURIComponent(rec.action);
                  const details = encodeURIComponent(`${rec.impact}\n${rec.analogy}`);
                  const dates = '20240601T090000Z/20240601T093000Z'; // Example: 30 min event
                  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${dates}`;
                  window.open(url, '_blank');
                }}
              >
                <span className="text-base mr-2">📅</span> Add to My Calendar
              </Button>
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg transition-all duration-200 text-lg font-bold flex items-center justify-center gap-2 focus:ring-2 focus:ring-purple-400 mt-3"
                aria-label="Do This Together"
                onClick={() => {
                  const rec = recommendations[currentIndex];
                  const path = `/invite?task=${encodeURIComponent(rec.action)}`;
                  console.log('Navigating to:', path, 'with action:', rec.action);
                  navigate(path);
                }}
              >
                <span className="text-base mr-2">🤝</span> Do This Together
              </Button>

              <div className="flex justify-between items-center mt-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-2 text-green-700 border-green-200"
                >
                  <ArrowLeft className="h-4 w-4" /> Previous
                </Button>
                <div className="text-sm text-green-700">{currentIndex + 1} / {recommendations.length}</div>
                <Button
                  variant="outline"
                  onClick={() => setCurrentIndex(i => Math.min(recommendations.length - 1, i + 1))}
                  disabled={currentIndex === recommendations.length - 1}
                  className="flex items-center gap-2 text-green-700 border-green-200"
                >
                  Next <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Simulate Modal */}
      <AnimatePresence>
        {showSimulate && simulated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-gradient-to-br from-green-100 to-blue-100 rounded-3xl p-8 shadow-2xl max-w-lg w-full"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X className="h-6 w-6 text-gray-900" />
              </button>
              <div className="flex flex-col items-center gap-4">
                <Sparkles className="h-10 w-10 text-yellow-400 animate-pulse" />
                <h2 className="text-2xl font-bold text-green-800 text-center">Simulated Impact</h2>
                <div className="text-lg text-green-700 text-center">{simulated.action}</div>
                <div className="text-base text-gray-700 text-center mb-2">{simulated.impact}</div>
                
                {/* Simulation Timeline */}
                <div className="w-full bg-white/80 rounded-xl p-4 border border-green-100">
                  <div className="text-sm font-semibold text-green-700 mb-2">Impact Timeline</div>
                  <div className="space-y-2">
                    {Object.entries(simulated.simulation).map(([period, impact]) => (
                      <div key={period} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 capitalize">{period}</span>
                        <span className="text-sm text-gray-700">{impact}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/80 rounded-xl p-4 border border-green-100 flex items-center gap-3 mb-2">
                  <Info className="h-5 w-5 text-green-500" />
                  <span className="italic text-green-700">{simulated.analogy}</span>
                </div>

                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg shadow transition text-lg py-3 font-semibold mt-6"
                  onClick={() => {
                    navigator.share ? navigator.share({
                      title: 'My Sustainability Recommendation',
                      text: `${userName} is taking action: ${simulated.action} (${simulated.impact})! #EcoAction`,
                      url: window.location.href
                    }) : navigator.clipboard.writeText(`${userName} is taking action: ${simulated.action} (${simulated.impact})! #EcoAction`);
                  }}
                >
                  <Share2 className="h-5 w-5 mr-2" /> Share This Impact
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecommendationEngine; 