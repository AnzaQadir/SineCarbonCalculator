import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Trophy, Medal, Crown,
  Users, Star, ArrowUp,
  ArrowDown, Sparkles, Globe,
  Leaf, Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar?: string;
  points: number;
  rank: number;
  previousRank: number;
  achievements: number;
  level: string;
  team?: string;
  recentAchievement?: {
    title: string;
    points: number;
    date: Date;
  };
}

interface EcoLeaderboardProps {
  entries: LeaderboardEntry[];
  userEntry: LeaderboardEntry;
  timeframe: 'weekly' | 'monthly' | 'allTime';
  onTimeframeChange: (timeframe: 'weekly' | 'monthly' | 'allTime') => void;
}

export const EcoLeaderboard: React.FC<EcoLeaderboardProps> = ({
  entries,
  userEntry,
  timeframe,
  onTimeframeChange
}) => {
  const [selectedEntry, setSelectedEntry] = useState<LeaderboardEntry | null>(null);

  const getRankChange = (entry: LeaderboardEntry) => {
    const change = entry.previousRank - entry.rank;
    if (change > 0) {
      return { icon: <ArrowUp className="h-4 w-4 text-green-500" />, value: change };
    } else if (change < 0) {
      return { icon: <ArrowDown className="h-4 w-4 text-red-500" />, value: Math.abs(change) };
    }
    return null;
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <Target className="h-6 w-6 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Leaderboard Header */}
      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 rounded-xl p-8 border border-yellow-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Trophy className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Eco Leaderboard</h2>
              <p className="text-gray-600">Compete with others and earn rewards</p>
            </div>
          </div>
          <Tabs value={timeframe} onValueChange={(value: any) => onTimeframeChange(value)}>
            <TabsList>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="allTime">All Time</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4">
        {entries.slice(0, 3).map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "relative p-6 rounded-xl text-center",
              index === 1 ? "mt-8" :
              index === 2 ? "mt-16" : "mt-0",
              "bg-gradient-to-br from-white to-gray-50 border-2",
              index === 0 ? "border-yellow-200" :
              index === 1 ? "border-gray-200" :
              "border-amber-200"
            )}
          >
            {/* Rank Icon */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <div className={cn(
                "p-3 rounded-full",
                index === 0 ? "bg-yellow-100" :
                index === 1 ? "bg-gray-100" :
                "bg-amber-100"
              )}>
                {getRankIcon(index + 1)}
              </div>
            </div>

            {/* User Info */}
            <div className="mt-4 space-y-2">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                {entry.avatar ? (
                  <img src={entry.avatar} alt={entry.name} className="w-14 h-14 rounded-full" />
                ) : (
                  <Users className="h-8 w-8 text-green-600" />
                )}
              </div>
              <h3 className="font-semibold text-lg">{entry.name}</h3>
              <div className="flex items-center justify-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">{entry.points} points</span>
              </div>
              {getRankChange(entry) && (
                <div className="flex items-center justify-center gap-1 text-sm">
                  {getRankChange(entry)?.icon}
                  <span>{getRankChange(entry)?.value} positions</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Leaderboard List */}
      <Card className="overflow-hidden">
        <div className="divide-y">
          {entries.slice(3).map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "p-4 hover:bg-gray-50 transition-colors",
                entry.id === userEntry.id && "bg-green-50"
              )}
            >
              <div className="flex items-center gap-4">
                <span className="font-medium text-gray-600 w-8">{entry.rank}</span>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                  {entry.avatar ? (
                    <img src={entry.avatar} alt={entry.name} className="w-8 h-8 rounded-full" />
                  ) : (
                    <Users className="h-5 w-5 text-green-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{entry.name}</span>
                    {entry.team && (
                      <span className="text-sm text-gray-500">• {entry.team}</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">{entry.level}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{entry.points} points</div>
                  {getRankChange(entry) && (
                    <div className="flex items-center justify-end gap-1 text-sm">
                      {getRankChange(entry)?.icon}
                      <span>{getRankChange(entry)?.value}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Achievement */}
              {entry.recentAchievement && (
                <div className="mt-3 ml-12 flex items-center gap-2 text-sm">
                  <div className="p-1 bg-yellow-100 rounded">
                    <Sparkles className="h-3 w-3 text-yellow-600" />
                  </div>
                  <span className="text-gray-600">
                    Earned "{entry.recentAchievement.title}" (+{entry.recentAchievement.points} pts)
                  </span>
                  <span className="text-gray-400">
                    • {entry.recentAchievement.date.toLocaleDateString()}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </Card>

      {/* User's Position */}
      <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-6 border border-green-100">
        <div className="flex items-center gap-4">
          <span className="font-medium text-gray-600 w-8">{userEntry.rank}</span>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
            {userEntry.avatar ? (
              <img src={userEntry.avatar} alt={userEntry.name} className="w-10 h-10 rounded-full" />
            ) : (
              <Users className="h-6 w-6 text-green-600" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-lg">You</span>
              <span className="text-sm text-gray-500">• {userEntry.level}</span>
            </div>
            <div className="text-sm text-gray-600">
              {getRankChange(userEntry)?.value
                ? `Moved ${getRankChange(userEntry)?.value} positions ${userEntry.previousRank > userEntry.rank ? 'up' : 'down'}`
                : 'Same position as last week'}
            </div>
          </div>
          <div className="text-right">
            <div className="font-medium text-lg">{userEntry.points} points</div>
            <div className="text-sm text-gray-600">{userEntry.achievements} achievements</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcoLeaderboard; 