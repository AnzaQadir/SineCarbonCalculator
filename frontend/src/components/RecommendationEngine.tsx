import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap, Lightbulb, Info, X, Share2, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Recommendation {
  action: string;
  description: string;
  linkedBehavior: string;
  impact: string;
  analogy: string;
  effortLevel: string;
  category: string;
  roi: {
    emotional: string;
    environmental: string;
  };
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
  const [weeks, setWeeks] = useState<{ [week: string]: WeekData }>({});
  const [weekKeys, setWeekKeys] = useState<string[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<string>('');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSimulate, setShowSimulate] = useState(false);
  const [simulated, setSimulated] = useState<Recommendation | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/recommendations/static', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(personalityData),
        });
        if (!res.ok) throw new Error('Failed to fetch recommendations');
        const data = await res.json();
        // Support multiple weeks
        const weekEntries = Object.entries(data).filter(([key]) => key.startsWith('week'));
        const weekMap: { [week: string]: WeekData } = {};
        weekEntries.forEach(([week, value]) => {
          weekMap[week] = value as WeekData;
        });
        setWeeks(weekMap);
        setWeekKeys(weekEntries.map(([week]) => week));
        if (weekEntries.length > 0) {
          setSelectedWeek(weekEntries[0][0]);
          setRecommendations((weekEntries[0][1] as WeekData).actions);
        } else {
          setSelectedWeek('');
          setRecommendations([]);
        }
      } catch (err: any) {
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
    if (autoSimulate && recommendations.length > 0 && !showSimulate) {
      setSimulated(recommendations[0]);
      setShowSimulate(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSimulate, recommendations]);

  const handleSimulate = (rec: Recommendation) => {
    setSimulated(rec);
    setShowSimulate(true);
  };

  const closeModal = () => {
    setShowSimulate(false);
    setSimulated(null);
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
          {profileImage && <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />}
        </div>
        <h1 className="text-4xl font-extrabold text-green-800 font-serif flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-yellow-400 animate-pulse" />
          {userName}, Your Personalized Recommendations
        </h1>
        <div className="text-lg text-green-700 font-semibold">Eco-Personality: <span className="font-bold">{personality}</span></div>
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
              <div className="text-gray-700 text-base mb-2">{recommendations[currentIndex].description}</div>
              <div className="flex flex-wrap gap-3 mb-2">
                <Badge className="bg-green-100 text-green-800">{recommendations[currentIndex].category}</Badge>
                <Badge className={cn(
                  recommendations[currentIndex].effortLevel === 'low' ? 'bg-green-200 text-green-900' :
                  recommendations[currentIndex].effortLevel === 'medium' ? 'bg-yellow-200 text-yellow-900' :
                  'bg-red-200 text-red-900'
                )}>{recommendations[currentIndex].effortLevel}</Badge>
                <Badge className="bg-blue-100 text-blue-800">{recommendations[currentIndex].impact}</Badge>
              </div>
              <div className="bg-white/80 rounded-xl p-4 border border-green-100 flex items-center gap-3">
                <Info className="h-5 w-5 text-green-500" />
                <span className="italic text-green-700">{recommendations[currentIndex].analogy}</span>
              </div>
              <div className="flex flex-col md:flex-row gap-4 mt-4">
                <div className="flex-1 bg-green-50 rounded-xl p-4">
                  <div className="font-semibold text-green-700 mb-1">Emotional ROI</div>
                  <div className="text-green-900">{recommendations[currentIndex].roi.emotional}</div>
                </div>
                <div className="flex-1 bg-blue-50 rounded-xl p-4">
                  <div className="font-semibold text-blue-700 mb-1">Environmental ROI</div>
                  <div className="text-blue-900">{recommendations[currentIndex].roi.environmental}</div>
                </div>
              </div>
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg shadow transition text-lg py-3 font-semibold mt-6"
                onClick={() => handleSimulate(recommendations[currentIndex])}
              >
                <Zap className="h-5 w-5 mr-2" /> Simulate Recommendation
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
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-gradient-to-br from-green-100 to-blue-100 rounded-3xl p-8 shadow-2xl max-w-lg w-full"
            >
              <button
                onClick={closeModal}
                className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-6 w-6 text-gray-900" />
              </button>
              <div className="flex flex-col items-center gap-4">
                <Sparkles className="h-10 w-10 text-yellow-400 animate-pulse" />
                <h2 className="text-2xl font-bold text-green-800 text-center">Simulated Impact</h2>
                <div className="text-lg text-green-700 text-center">{simulated.action}</div>
                <div className="text-base text-gray-700 text-center mb-2">{simulated.impact}</div>
                <div className="bg-white/80 rounded-xl p-4 border border-green-100 flex items-center gap-3 mb-2">
                  <Info className="h-5 w-5 text-green-500" />
                  <span className="italic text-green-700">{simulated.analogy}</span>
                </div>
                <div className="flex flex-col md:flex-row gap-4 w-full">
                  <div className="flex-1 bg-green-50 rounded-xl p-4">
                    <div className="font-semibold text-green-700 mb-1">Emotional ROI</div>
                    <div className="text-green-900">{simulated.roi.emotional}</div>
                  </div>
                  <div className="flex-1 bg-blue-50 rounded-xl p-4">
                    <div className="font-semibold text-blue-700 mb-1">Environmental ROI</div>
                    <div className="text-blue-900">{simulated.roi.environmental}</div>
                  </div>
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