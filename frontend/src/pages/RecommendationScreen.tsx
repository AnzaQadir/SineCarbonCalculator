import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RecommendationEngine from '@/components/RecommendationEngine';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import { useUserStore } from '@/stores/userStore'; // Assuming you have a user store
import { useQuizStore } from '@/stores/quizStore'; // Assuming you have a quiz store

const RecommendationScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { quizResults } = useQuizStore();
  const [isLoading, setIsLoading] = useState(true);

  // Extract only the relevant personality keys
  const personalityData = quizResults
    ? {
        ecoPersonality: quizResults.personalityType,
        personality: quizResults.personalityType,
        personalityType: quizResults.personalityType,
      }
    : {};

  // If no quiz results, redirect to quiz
  useEffect(() => {
    if (!quizResults) {
      navigate('/quiz');
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
              onClick={() => navigate(-1)}
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
          personality={quizResults.personalityType || 'Eco Explorer'}
          userName={user?.name || 'Eco Hero'}
          autoSimulate={true}
          onBack={() => navigate(-1)}
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