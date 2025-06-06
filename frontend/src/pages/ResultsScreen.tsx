import React from 'react';
import { useNavigate } from 'react-router-dom';
import ResultsDisplay from '@/components/ResultsDisplay';
import { useUserStore } from '@/stores/userStore';
import { useQuizStore } from '@/stores/quizStore';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';

const ResultsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { quizResults } = useQuizStore();

  if (!quizResults) {
    // If no results, redirect to quiz or home
    navigate('/');
    return null;
  }

  return (
    <Layout>
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ResultsDisplay
          score={quizResults.finalScore || 0}
          emissions={quizResults.impactMetrics?.carbonReduced ? parseFloat(quizResults.impactMetrics.carbonReduced) : 0}
          categoryEmissions={{
            home: quizResults.categoryScores?.home?.score || 0,
            transport: quizResults.categoryScores?.transport?.score || 0,
            food: quizResults.categoryScores?.food?.score || 0,
            waste: quizResults.categoryScores?.waste?.score || 0,
          }}
          recommendations={[]}
          isVisible={true}
          onReset={() => navigate('/')}
          state={quizResults}
          gender={user?.gender || 'boy'}
        />
        <div className="flex justify-center mt-8">
          <Button
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg shadow-lg text-lg font-semibold"
            onClick={() => navigate('/recommendations')}
          >
            View Personalized Recommendations
          </Button>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default ResultsScreen; 