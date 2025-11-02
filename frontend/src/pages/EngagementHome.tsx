import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';
import { useQuizStore } from '@/stores/quizStore';
import Layout from '@/components/Layout';
import { EngagementDashboard } from '@/components/engagement/EngagementDashboard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';

const EngagementHome: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { quizResults } = useQuizStore();

  // Redirect to results if no quiz completed
  if (!quizResults) {
    navigate('/results');
    return null;
  }

  // Get profile image from user or default
  const profileImage = user?.profileImage || undefined;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-green-200/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Back Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/results')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Results
              </Button>

              {/* Title */}
              <div className="text-center flex-1">
                <h1 className="text-xl font-bold text-gray-900">
                  Your Action Hub
                </h1>
                <p className="text-sm text-gray-600 hidden sm:block">
                  One best next action
                </p>
              </div>

              {/* Right actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <Home className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EngagementDashboard profileImage={profileImage} />
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center text-sm text-gray-600 pb-8">
          <p>Built with ❤️ for the planet</p>
        </div>
      </div>
    </Layout>
  );
};

export default EngagementHome;
