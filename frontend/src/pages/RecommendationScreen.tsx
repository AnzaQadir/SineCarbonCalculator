import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RecommendationEngine from '@/components/RecommendationEngine';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import { useUserStore } from '@/stores/userStore'; // Assuming you have a user store
import { useQuizStore } from '@/stores/quizStore'; // Assuming you have a quiz store

// Map frontend types to backend canonical types
const personalityTypeMap: Record<string, string> = {
  'Sustainability Slayer': 'Sustainability Slayer',
  "Planet's Main Character": "Planet's Main Character",
  'Sustainability Soft Launch': 'Sustainability Soft Launch',
  'Kind of Conscious': 'Kind of Conscious, Kind of Confused',
  'Kind of Conscious, Kind of Confused': 'Kind of Conscious, Kind of Confused',
  'Eco in Progress': 'Eco in Progress',
  'Doing Nothing': 'Doing Nothing for the Planet',
  'Doing Nothing for the Planet': 'Doing Nothing for the Planet',
  'Certified Climate Snoozer': 'Certified Climate Snoozer',
  // Add any other frontend aliases here
  'Eco Explorer': 'Eco in Progress', // Example alias
  'Green Guardian': 'Sustainability Soft Launch', // Example alias
  'Climate Conscious': 'Kind of Conscious, Kind of Confused', // Example alias
};

const RecommendationScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { quizResults } = useQuizStore();
  const [isLoading, setIsLoading] = useState(true);

  console.log('RecommendationScreen - quizResults:', JSON.stringify(quizResults, null, 2));
  console.log('RecommendationScreen - user:', user);

  // Get the personality type from quizResults
  const personalityType = quizResults?.personalityType || 'Eco in Progress';
  console.log('RecommendationScreen - personalityType:', personalityType);

  // Extract only the relevant personality keys
  const personalityData = quizResults
    ? {
        ecoPersonality: personalityType,
        personality: personalityType,
        personalityType: personalityType,
      }
    : {};

  console.log('RecommendationScreen - personalityData:', JSON.stringify(personalityData, null, 2));

  // If no quiz results, redirect to /results
  useEffect(() => {
    console.log('RecommendationScreen - useEffect - quizResults:', JSON.stringify(quizResults, null, 2));
    if (!quizResults) {
      navigate('/results');
    }
    setIsLoading(false);
  }, [quizResults, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!quizResults) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-green-700"
            >
              <Home className="h-5 w-5" />
              Home
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate('/results')}
              className="flex items-center gap-2 text-green-700"
            >
              <ArrowLeft className="h-5 w-5" />
              Back
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RecommendationEngine
          personalityData={personalityData}
          profileImage={user?.profileImage || '/default-avatar.png'}
          personality={personalityType}
          userName={user?.name || 'Eco Hero'}
          autoSimulate={true}
          onBack={() => navigate('/results')}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            Make a difference, one recommendation at a time 🌱
          </p>
        </div>
      </footer>
    </div>
  );
};

export default RecommendationScreen; 