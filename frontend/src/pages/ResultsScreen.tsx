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
        {/* Back Button (always return to Quiz at last stored step) */}
        <div className="flex justify-start mb-8">
          <Button
            onClick={() => navigate('/quiz')}
            className="flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-sage-200/50 hover:bg-white/90 hover:shadow-xl transition-all duration-300 group"
          >
            <svg className="h-5 w-5 text-sage-600 group-hover:text-sage-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-semibold text-sage-700 group-hover:text-sage-800 transition-colors">Back</span>
          </Button>
        </div>
        
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
        />

      </div>
    </div>
    </Layout>
  );
};

export default ResultsScreen; 