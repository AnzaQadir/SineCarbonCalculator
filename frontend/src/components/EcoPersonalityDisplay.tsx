import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  Leaf, Tree, Globe, Users, Star, Trophy,
  BookOpen, Sprout, Heart, Zap, Award,
  BadgeCheck, Target, Crown, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

interface StoryQuest {
  title: string;
  description: string;
  tasks: Array<{
    id: string;
    title: string;
    description: string;
    points: number;
    completed: boolean;
  }>;
  progress: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  dateEarned?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface EcoPersona {
  level: 'Eco-Novice' | 'Green Explorer' | 'Sustainability Advocate' | 'Planet Protector';
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  requiredPoints: number;
  story: {
    chapter: string;
    description: string;
    quests: StoryQuest[];
  };
}

interface EcoPersonalityDisplayProps {
  currentPoints: number;
  achievements: Achievement[];
  completedTasks: string[];
  teamStats: {
    name: string;
    points: number;
    rank: number;
    members: number;
  };
}

const ecoPersonas: EcoPersona[] = [
  {
    level: 'Eco-Novice',
    title: 'The Awakening',
    description: 'Beginning your journey into sustainable living',
    icon: <Sprout className="h-6 w-6" />,
    color: 'from-green-400 to-green-500',
    requiredPoints: 0,
    story: {
      chapter: 'Chapter 1: First Steps',
      description: 'Discover the impact of your daily choices on the environment',
      quests: [
        {
          title: 'Waste Warrior',
          description: 'Start your recycling journey',
          tasks: [
            {
              id: 'recycle-1',
              title: 'Sort Recyclables',
              description: 'Learn to properly sort different types of recyclables',
              points: 10,
              completed: false
            },
            {
              id: 'recycle-2',
              title: 'Reduce Waste',
              description: 'Track your daily waste for a week',
              points: 15,
              completed: false
            }
          ],
          progress: 0
        }
      ]
    }
  },
  // Add other personas...
];

export const EcoPersonalityDisplay: React.FC<EcoPersonalityDisplayProps> = ({
  currentPoints,
  achievements,
  completedTasks,
  teamStats
}) => {
  const [selectedPersona, setSelectedPersona] = useState<EcoPersona>(ecoPersonas[0]);
  const [showAvatarCustomization, setShowAvatarCustomization] = useState(false);

  // Calculate current level and progress
  const getCurrentLevel = () => {
    return ecoPersonas.reduce((current, persona) => {
      return currentPoints >= persona.requiredPoints ? persona : current;
    }, ecoPersonas[0]);
  };

  const getProgressToNextLevel = () => {
    const currentLevel = getCurrentLevel();
    const nextLevel = ecoPersonas[ecoPersonas.indexOf(currentLevel) + 1];
    if (!nextLevel) return 100;
    
    const pointsNeeded = nextLevel.requiredPoints - currentLevel.requiredPoints;
    const pointsGained = currentPoints - currentLevel.requiredPoints;
    return (pointsGained / pointsNeeded) * 100;
  };

  return (
    <div className="space-y-8">
      {/* Current Level Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-8 border border-green-100"
      >
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-3 rounded-xl bg-gradient-to-br",
                selectedPersona.color
              )}>
                {selectedPersona.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedPersona.level}</h2>
                <p className="text-gray-600">{selectedPersona.title}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 max-w-xl">{selectedPersona.description}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-green-600">{currentPoints}</div>
            <div className="text-sm text-gray-600">Eco Points</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progress to Next Level</span>
            <span>{Math.round(getProgressToNextLevel())}%</span>
          </div>
          <Progress value={getProgressToNextLevel()} className="h-2" />
        </div>
      </motion.div>

      {/* Story Quests */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-green-600" />
          Current Story Chapter
        </h3>
        <Card className="p-6">
          <h4 className="text-lg font-medium mb-2">{selectedPersona.story.chapter}</h4>
          <p className="text-gray-600 mb-6">{selectedPersona.story.description}</p>
          
          <div className="space-y-6">
            {selectedPersona.story.quests.map((quest, index) => (
              <div key={index} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium">{quest.title}</h5>
                  <Badge variant="outline">{quest.progress}% Complete</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quest.tasks.map((task) => (
                    <motion.div
                      key={task.id}
                      whileHover={{ scale: 1.02 }}
                      className={cn(
                        "p-4 rounded-lg border-2 transition-colors",
                        task.completed
                          ? "border-green-200 bg-green-50"
                          : "border-gray-200 hover:border-green-200"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "p-2 rounded-lg",
                          task.completed ? "bg-green-100" : "bg-gray-100"
                        )}>
                          {task.completed ? (
                            <BadgeCheck className="h-5 w-5 text-green-600" />
                          ) : (
                            <Target className="h-5 w-5 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <h6 className="font-medium">{task.title}</h6>
                          <p className="text-sm text-gray-600">{task.description}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium">{task.points} points</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Achievements */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Trophy className="h-5 w-5 text-green-600" />
          Recent Achievements
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              whileHover={{ scale: 1.05 }}
              className={cn(
                "p-4 rounded-xl border-2",
                achievement.rarity === 'legendary' ? "bg-gradient-to-br from-yellow-50 to-yellow-100/50 border-yellow-200" :
                achievement.rarity === 'epic' ? "bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200" :
                achievement.rarity === 'rare' ? "bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200" :
                "bg-gradient-to-br from-gray-50 to-gray-100/50 border-gray-200"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  achievement.rarity === 'legendary' ? "bg-yellow-100" :
                  achievement.rarity === 'epic' ? "bg-purple-100" :
                  achievement.rarity === 'rare' ? "bg-blue-100" :
                  "bg-gray-100"
                )}>
                  {achievement.icon}
                </div>
                <div>
                  <h4 className="font-medium">{achievement.title}</h4>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                  {achievement.dateEarned && (
                    <p className="text-xs text-gray-500 mt-1">
                      Earned {achievement.dateEarned.toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Team Stats */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Users className="h-5 w-5 text-green-600" />
          Team Progress
        </h3>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-lg font-medium">{teamStats.name}</h4>
              <p className="text-sm text-gray-600">Rank #{teamStats.rank} • {teamStats.members} members</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{teamStats.points}</div>
              <div className="text-sm text-gray-600">Team Points</div>
            </div>
          </div>
          
          <Button className="w-full" variant="outline">
            <Users className="h-4 w-4 mr-2" />
            View Team Dashboard
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default EcoPersonalityDisplay; 