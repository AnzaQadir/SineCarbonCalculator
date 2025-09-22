import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import ResultsDisplay from '@/components/ResultsDisplay';
import { useQuizStore } from '@/stores/quizStore';
import { useUserStore } from '@/stores/userStore';
import { getLatestUserPersonality } from '@/services/api';

const Journey: React.FC = () => {
  const { quizResults, setQuizResults } = useQuizStore();
  const { user } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!user?.id) {
        setError('No user found. Please sign up first.');
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const resp = await getLatestUserPersonality(user.id);
        // Expect resp = { success: true, data: { response: PersonalityResponse, ... } }
        const payload = resp?.data?.response || resp?.data || null;
        if (!payload) {
          setError('No journey data available yet.');
        } else {
          setQuizResults(payload);
        }
      } catch (e: any) {
        setError(e?.message || 'Failed to load journey data');
      } finally {
        setLoading(false);
      }
    };
    // Only fetch if not already in store
    if (!quizResults) load();
  }, [user?.id]);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading && (
            <div className="text-center text-gray-600">Loading your journey...</div>
          )}
          {error && (
            <div className="text-center text-red-600">{error}</div>
          )}
          {quizResults && (
            <ResultsDisplay
              score={quizResults.finalScore || 0}
              emissions={quizResults.impactMetrics?.carbonReduced ? parseFloat(quizResults.impactMetrics.carbonReduced) : 0}
              categoryEmissions={{
                home: (quizResults as any).categoryScores?.home?.score || 0,
                transport: (quizResults as any).categoryScores?.transport?.score || 0,
                food: (quizResults as any).categoryScores?.food?.score || 0,
                waste: (quizResults as any).categoryScores?.waste?.score || 0,
              }}
              recommendations={[]}
              isVisible={true}
              onReset={() => window.location.assign('/')}
              onBack={() => window.location.assign('/')}
              state={quizResults}
              gender={'boy'}
              comprehensivePowerMoves={quizResults?.comprehensivePowerMoves}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Journey;


