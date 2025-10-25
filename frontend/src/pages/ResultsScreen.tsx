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
      <div className="max-w-[2000px] mx-auto px-8 sm:px-10 lg:px-12 py-12">
        
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
          onBack={() => navigate('/quiz')}
          state={quizResults}
          gender={'boy'}
          comprehensivePowerMoves={quizResults?.comprehensivePowerMoves}
        />

      </div>
    </div>
    </Layout>
  );
};

export default ResultsScreen; 