import { useState, useEffect } from 'react';
import { calculatePersonality, PersonalityResult } from '../services/personalityService';
import { CalculatorState } from '../types/calculator';
import { Badge } from '../components/ui/badge';

interface ResultsDisplayProps {
  state: CalculatorState;
  emissions: number;
  score: number;
  categoryEmissions: Record<string, number>;
  categoryScores: Record<string, number>;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  state,
  emissions,
  score,
  categoryEmissions,
  categoryScores = {}
}) => {
  const [isPersonalityLoading, setIsPersonalityLoading] = useState(true);
  const [personalityResult, setPersonalityResult] = useState<PersonalityResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const generatePersonality = async () => {
      if (!state) return;
      
      try {
        setIsPersonalityLoading(true);
        setError(null);
        const result = await calculatePersonality(state);
        if (isMounted) {
          setPersonalityResult(result);
        }
      } catch (error: unknown) {
        if (isMounted) {
          console.error('Error generating personality:', error);
          setError(error instanceof Error ? error.message : 'Failed to generate personality');
        }
      } finally {
        if (isMounted) {
          setIsPersonalityLoading(false);
        }
      }
    };

    generatePersonality();

    return () => {
      isMounted = false;
    };
  }, [state]);

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (isPersonalityLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!personalityResult) {
    return null;
  }

  // Calculate impact metrics
  const treesPlanted = Math.round((16 - emissions) * 10);
  const carbonReduced = (16 - emissions).toFixed(1);
  const communityImpact = Math.round(score / 2);

  return (
    <div className="flex justify-center w-full mb-8">
      <div className="bg-white rounded-2xl shadow-lg p-0 flex flex-col items-center max-w-2xl w-full border border-green-100 overflow-hidden">
        {/* Personality Image */}
        <img
          src="/profile.jpg"
          alt="Personality Illustration"
          className="w-full object-contain bg-green-50 border-b-4 border-green-100 p-4"
          style={{ maxHeight: 320 }}
        />
        <div className="w-full p-8 flex flex-col items-center">
          {/* Personality Description */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl">{personalityResult.emoji}</span>
            <h2 className="text-2xl font-bold text-green-700 font-serif">{personalityResult.personality}</h2>
          </div>
          <Badge className="mb-2">{personalityResult.badge}</Badge>
          
          {/* Full Story */}
          <div className="w-full mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Story</h3>
            <p className="text-gray-700">{personalityResult.story}</p>
          </div>

          {/* Next Action */}
          <div className="w-full mb-6 bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Next Action</h3>
            <p className="text-green-700">{personalityResult.nextAction}</p>
          </div>

          {/* Climate Champion Status */}
          <div className="w-full mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Climate Champion Status</h3>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-lg">{personalityResult.champion}</Badge>
              <span className="text-gray-600">({personalityResult.subCategory})</span>
            </div>
          </div>
          
          {/* Impact Metrics */}
          <div className="grid grid-cols-3 gap-4 mt-4 w-full">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{treesPlanted}</div>
              <div className="text-sm text-gray-600">Trees Planted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{carbonReduced}</div>
              <div className="text-sm text-gray-600">Tons CO₂ Saved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{communityImpact}</div>
              <div className="text-sm text-gray-600">Community Impact</div>
            </div>
          </div>

          {/* Category Scores */}
          {Object.keys(categoryScores).length > 0 && (
            <div className="mt-8 w-full">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Impact by Category</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(categoryScores).map(([category, score]) => (
                  <div key={category} className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-gray-600 capitalize">{category}</div>
                    <div className="text-xl font-bold text-green-600">{score}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Power Moves */}
          <div className="mt-8 w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Power Moves</h3>
            <div className="grid grid-cols-1 gap-2">
              {personalityResult.powerMoves.map((move: string, index: number) => (
                <div key={index} className="flex items-center gap-2 text-gray-700">
                  <span className="text-green-500">•</span>
                  <span>{move}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Impact Tally */}
          {Object.keys(personalityResult.tally).length > 0 && (
            <div className="mt-8 w-full">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Impact Tally</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(personalityResult.tally).map(([category, score]) => (
                  <div key={category} className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-gray-600 capitalize">{category}</div>
                    <div className="text-xl font-bold text-green-600">{score}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
