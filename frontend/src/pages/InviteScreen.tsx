import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Leaf, Users, CheckCircle, ArrowLeft } from 'lucide-react';
import { useTaskStore } from '@/stores/taskStore';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const InviteScreen: React.FC = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const task = query.get('task');
  const addTask = useTaskStore((state) => state.addTask);

  const inviteUrl = `http://localhost:8080/invite?task=${encodeURIComponent(task || '')}`;
  const shareText = `I'm inviting you to join me in this sustainability action! 🌱\n\nRecommendation: ${task}\n\nAccept the challenge and track your progress here: ${inviteUrl}`;

  const handleAccept = () => {
    if (task) {
      addTask({ id: `${Date.now()}`, title: task });
      alert('Task added to your list!');
      navigate('/');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join me in this eco-action!',
        text: shareText,
        url: inviteUrl
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Invite link copied to clipboard!');
    }
  };

  if (!task) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 to-green-50 px-4 py-12">
        <Card className="max-w-lg w-full rounded-2xl shadow-xl border border-yellow-200 bg-white/95 backdrop-blur-md">
          <CardContent className="p-12 flex flex-col items-center gap-8">
            <h1 className="text-3xl font-serif font-extrabold text-yellow-700 text-center mb-2">Invalid Invite</h1>
            <p className="text-lg text-gray-700 text-center mb-4">Sorry, this invite link is missing the task information.</p>
            <Button
              className="w-full bg-gradient-to-r from-emerald-500 to-yellow-400 hover:from-emerald-600 hover:to-yellow-500 text-white rounded-full shadow-lg transition text-lg font-bold flex items-center justify-center gap-2"
              onClick={() => navigate('/recommendations')}
            >
              <ArrowLeft className="h-4 w-4" /> Go Back to Recommendations
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-green-50 flex flex-col items-center justify-center px-4 py-12">
      <Card className="max-w-lg w-full rounded-2xl shadow-xl border border-yellow-200 bg-white/95 backdrop-blur-md">
        <CardContent className="p-12 flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-3">
            <div className="bg-gradient-to-br from-yellow-100 to-yellow-300 rounded-full p-4 shadow mb-2">
              <Sparkles className="h-10 w-10 text-yellow-500" />
            </div>
            <h1 className="text-4xl font-serif font-extrabold text-yellow-700 text-center mb-1 tracking-tight">
              You're Invited to a Climate Challenge
            </h1>
            <p className="text-lg text-gray-700 text-center max-w-md mb-2 italic">
              "The best journeys are those we take together."
            </p>
          </div>
          <div className="w-full bg-gradient-to-br from-yellow-50 to-green-50 border border-yellow-100 rounded-xl shadow p-6 flex flex-col items-center gap-3">
            <Leaf className="h-7 w-7 text-yellow-600 mb-1" />
            <div className="text-xl font-bold text-green-800 text-center">{task}</div>
            <div className="text-sm text-gray-500 text-center italic">
              "Every small step together creates a ripple of change."
            </div>
          </div>
          <div className="w-full bg-white/80 rounded-lg border-l-4 border-yellow-300 p-4 mt-2 text-center shadow-sm">
            <span className="text-yellow-700 font-semibold">Why you?</span>
            <p className="text-sm text-gray-700 mt-1">
              A friend believes you have the spark to make a difference. Will you join them in this journey for the planet?
            </p>
          </div>
          <Button
            className="w-full bg-gradient-to-r from-emerald-500 to-yellow-400 hover:from-emerald-600 hover:to-yellow-500 text-white rounded-full shadow-lg transition text-lg font-bold flex items-center justify-center gap-2 mt-4"
            onClick={handleAccept}
          >
            <CheckCircle className="h-4 w-4" /> Accept & Add to My Tasks
          </Button>
          <Button
            className="w-full bg-gradient-to-r from-yellow-400 to-emerald-400 hover:from-yellow-500 hover:to-emerald-500 text-white rounded-full shadow-lg transition text-lg font-bold flex items-center justify-center gap-2 mt-2"
            onClick={handleShare}
          >
            <span className="text-base mr-2">🤝</span> Share This Invite
          </Button>
          <Button
            variant="outline"
            className="w-full mt-2 flex items-center gap-2 text-yellow-700 border-yellow-200"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" /> Go Back
          </Button>
          <div className="mt-8 text-center text-yellow-600 text-xs font-serif italic">
            "Together, we can turn small actions into a movement."
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InviteScreen; 