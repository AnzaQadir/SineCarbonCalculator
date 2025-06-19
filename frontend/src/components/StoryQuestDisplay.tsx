import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  BookOpen, Scroll, Map,
  Trophy, Star, CheckCircle2,
  Timer, Users, Target,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'individual' | 'team' | 'community';
  difficulty: 'easy' | 'medium' | 'hard';
  rewards: {
    points: number;
    achievement?: string;
    unlocks?: string;
  };
  tasks: Array<{
    id: string;
    description: string;
    completed: boolean;
    deadline?: Date;
  }>;
  progress: number;
  teamMembers?: string[];
}

interface StoryQuestDisplayProps {
  currentChapter: {
    title: string;
    description: string;
    quests: Quest[];
  };
  onQuestComplete: (questId: string) => void;
  onTaskComplete: (questId: string, taskId: string) => void;
}

export const StoryQuestDisplay: React.FC<StoryQuestDisplayProps> = ({
  currentChapter,
  onQuestComplete,
  onTaskComplete
}) => {
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

  const getQuestIcon = (type: Quest['type']) => {
    switch (type) {
      case 'individual':
        return <Target className="h-5 w-5" />;
      case 'team':
        return <Users className="h-5 w-5" />;
      case 'community':
        return <Globe className="h-5 w-5" />;
    }
  };

  const getDifficultyColor = (difficulty: Quest['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'hard':
        return 'text-red-600 bg-red-100';
    }
  };

  return (
    <div className="space-y-8">
      {/* Chapter Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-8 border border-blue-100"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{currentChapter.title}</h2>
            <p className="text-gray-600 mt-2">{currentChapter.description}</p>
          </div>
        </div>
      </motion.div>

      {/* Quest List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentChapter.quests.map((quest) => (
          <motion.div
            key={quest.id}
            whileHover={{ scale: 1.02 }}
            className="relative"
          >
            <Card
              className={cn(
                "p-6 cursor-pointer transition-all duration-300",
                quest.progress === 100
                  ? "bg-gradient-to-br from-green-50 to-green-100/50 border-green-200"
                  : "hover:shadow-lg"
              )}
              onClick={() => setSelectedQuest(quest)}
            >
              {/* Quest Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    quest.type === 'individual' ? "bg-purple-100" :
                    quest.type === 'team' ? "bg-blue-100" :
                    "bg-gray-100"
                  )}>
                    {getQuestIcon(quest.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{quest.title}</h3>
                    <p className="text-sm text-gray-600">{quest.description}</p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className={cn(
                    "px-2 py-1",
                    getDifficultyColor(quest.difficulty)
                  )}
                >
                  {quest.difficulty}
                </Badge>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{quest.progress}%</span>
                </div>
                <Progress value={quest.progress} className="h-2" />
              </div>

              {/* Rewards Preview */}
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">{quest.rewards.points} points</span>
                </div>
                {quest.rewards.achievement && (
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium">Achievement</span>
                  </div>
                )}
              </div>

              {/* Team Members (if applicable) */}
              {quest.type === 'team' && quest.teamMembers && (
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {quest.teamMembers.slice(0, 3).map((member, index) => (
                      <div
                        key={index}
                        className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium"
                      >
                        {member[0]}
                      </div>
                    ))}
                    {quest.teamMembers.length > 3 && (
                      <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium">
                        +{quest.teamMembers.length - 3}
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-gray-600">Team Quest</span>
                </div>
              )}
            </Card>

            {/* Completion Badge */}
            {quest.progress === 100 && (
              <div className="absolute -top-2 -right-2 p-1.5 rounded-full bg-gray-500 text-white">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Selected Quest Details */}
      <AnimatePresence>
        {selectedQuest && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedQuest(null)}
          >
            <motion.div
              className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="space-y-6">
                {/* Quest Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-lg",
                      selectedQuest.type === 'individual' ? "bg-purple-100" :
                      selectedQuest.type === 'team' ? "bg-blue-100" :
                      "bg-gray-100"
                    )}>
                      {getQuestIcon(selectedQuest.type)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{selectedQuest.title}</h3>
                      <p className="text-gray-600">{selectedQuest.description}</p>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "px-2 py-1",
                      getDifficultyColor(selectedQuest.difficulty)
                    )}
                  >
                    {selectedQuest.difficulty}
                  </Badge>
                </div>

                {/* Tasks */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Tasks</h4>
                  <div className="space-y-3">
                    {selectedQuest.tasks.map((task) => (
                      <motion.div
                        key={task.id}
                        whileHover={{ scale: 1.01 }}
                        className={cn(
                          "p-4 rounded-lg border-2 transition-colors",
                          task.completed
                            ? "border-gray-200 bg-gray-50"
                            : "border-gray-200"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "rounded-full w-6 h-6 p-0",
                              task.completed
                                ? "bg-gray-100 text-gray-600"
                                : "bg-gray-100 text-gray-400 hover:text-gray-600"
                            )}
                            onClick={() => onTaskComplete(selectedQuest.id, task.id)}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                          <div className="flex-1">
                            <p className="text-gray-900">{task.description}</p>
                            {task.deadline && (
                              <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                                <Timer className="h-4 w-4" />
                                <span>Due {task.deadline.toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Rewards */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Rewards</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-100">
                      <div className="flex items-center gap-2 text-yellow-600">
                        <Star className="h-5 w-5" />
                        <span className="font-medium">{selectedQuest.rewards.points} Points</span>
                      </div>
                    </div>
                    {selectedQuest.rewards.achievement && (
                      <div className="p-4 rounded-lg bg-purple-50 border border-purple-100">
                        <div className="flex items-center gap-2 text-purple-600">
                          <Trophy className="h-5 w-5" />
                          <span className="font-medium">Achievement Unlock</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedQuest(null)}
                  >
                    Close
                  </Button>
                  {selectedQuest.progress === 100 && (
                    <Button
                      onClick={() => {
                        onQuestComplete(selectedQuest.id);
                        setSelectedQuest(null);
                      }}
                    >
                      Complete Quest
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StoryQuestDisplay; 