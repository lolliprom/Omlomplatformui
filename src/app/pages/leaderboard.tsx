import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Trophy, Medal, Crown, Zap } from 'lucide-react';
import { useGameStore } from '../store/game-store';
import { LeaderboardEntry } from '../types';

// Mock leaderboard data
const mockGlobalLeaderboard: LeaderboardEntry[] = [
  { rank: 1, userId: '1', username: 'QueenBee_Anna', avatar: 'QB', level: 28, xp: 28500, tasksCompleted: 342, guild: 'Elite Scholars' },
  { rank: 2, userId: '2', username: 'DragonSlayer_Tom', avatar: 'DS', level: 26, xp: 26800, tasksCompleted: 315, guild: 'Study Warriors' },
  { rank: 3, userId: '3', username: 'StarGazer_Luna', avatar: 'SG', level: 25, xp: 25200, tasksCompleted: 298, guild: 'Night Owls' },
  { rank: 4, userId: '4', username: 'Phoenix_Ray', avatar: 'PR', level: 24, xp: 24100, tasksCompleted: 287, guild: 'Elite Scholars' },
  { rank: 5, userId: '5', username: 'Shadow_Kai', avatar: 'SK', level: 23, xp: 23400, tasksCompleted: 276 },
  { rank: 6, userId: '6', username: 'Thunder_Max', avatar: 'TM', level: 22, xp: 22700, tasksCompleted: 265, guild: 'Study Warriors' },
  { rank: 7, userId: '7', username: 'Crystal_Maya', avatar: 'CM', level: 22, xp: 22100, tasksCompleted: 251 },
  { rank: 8, userId: '8', username: 'Blaze_Jordan', avatar: 'BJ', level: 21, xp: 21500, tasksCompleted: 242, guild: 'Fire Starters' },
];

const mockGuildLeaderboard: LeaderboardEntry[] = [
  { rank: 1, userId: '2', username: 'DragonSlayer_Tom', avatar: 'DS', level: 26, xp: 26800, tasksCompleted: 315, guild: 'Study Warriors' },
  { rank: 2, userId: '6', username: 'Thunder_Max', avatar: 'TM', level: 22, xp: 22700, tasksCompleted: 265, guild: 'Study Warriors' },
  { rank: 3, userId: 'you', username: 'You', avatar: 'YO', level: 1, xp: 0, tasksCompleted: 0, guild: 'Study Warriors' },
];

export default function Leaderboard() {
  const [tab, setTab] = useState('global');
  const { stats } = useGameStore();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-600" />;
      default:
        return <span className="text-lg font-semibold text-gray-500">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-400';
    if (rank === 3) return 'bg-gradient-to-r from-orange-400 to-orange-600';
    return 'bg-gray-100';
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="pt-4">
        <h1 className="text-3xl mb-1">Leaderboard</h1>
        <p className="text-gray-600">Compete with students worldwide</p>
      </div>

      {/* Your Rank Card */}
      <Card className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-purple-100">Your Global Rank</p>
            <p className="text-3xl mb-1">#1,247</p>
            <p className="text-sm text-purple-100">Level {stats.level} • {stats.tasksCompleted} quests</p>
          </div>
          <Trophy className="w-16 h-16 opacity-80" />
        </div>
      </Card>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="global">Global</TabsTrigger>
          <TabsTrigger value="guild">My Guild</TabsTrigger>
        </TabsList>

        <TabsContent value="global" className="space-y-3 mt-6">
          {mockGlobalLeaderboard.map((entry) => (
            <Card
              key={entry.userId}
              className={`p-4 ${entry.rank <= 3 ? 'border-2' : ''} ${
                entry.rank === 1 ? 'border-yellow-400' : entry.rank === 2 ? 'border-gray-400' : entry.rank === 3 ? 'border-orange-400' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div className="w-12 flex items-center justify-center">
                  {getRankIcon(entry.rank)}
                </div>

                {/* Avatar */}
                <Avatar className={entry.rank <= 3 ? 'border-2 border-current' : ''}>
                  <AvatarFallback className={getRankBadgeColor(entry.rank) + ' text-white'}>
                    {entry.avatar}
                  </AvatarFallback>
                </Avatar>

                {/* Info */}
                <div className="flex-1">
                  <p className="font-semibold">{entry.username}</p>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Lv {entry.level}
                    </span>
                    <span>{entry.tasksCompleted} quests</span>
                  </div>
                  {entry.guild && (
                    <p className="text-xs text-purple-600 mt-0.5">🛡️ {entry.guild}</p>
                  )}
                </div>

                {/* XP */}
                <div className="text-right">
                  <p className="text-sm text-gray-500">XP</p>
                  <p className="font-semibold">{entry.xp.toLocaleString()}</p>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="guild" className="space-y-3 mt-6">
          {mockGuildLeaderboard.map((entry) => {
            const isYou = entry.userId === 'you';
            return (
              <Card
                key={entry.userId}
                className={`p-4 ${isYou ? 'border-2 border-purple-500 bg-purple-50' : ''}`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="w-12 flex items-center justify-center">
                    {getRankIcon(entry.rank)}
                  </div>

                  {/* Avatar */}
                  <Avatar>
                    <AvatarFallback className={isYou ? 'bg-purple-500 text-white' : getRankBadgeColor(entry.rank) + ' text-white'}>
                      {entry.avatar}
                    </AvatarFallback>
                  </Avatar>

                  {/* Info */}
                  <div className="flex-1">
                    <p className="font-semibold">
                      {entry.username}
                      {isYou && <span className="ml-2 text-xs text-purple-600">(You)</span>}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        Lv {isYou ? stats.level : entry.level}
                      </span>
                      <span>{isYou ? stats.tasksCompleted : entry.tasksCompleted} quests</span>
                    </div>
                  </div>

                  {/* XP */}
                  <div className="text-right">
                    <p className="text-sm text-gray-500">XP</p>
                    <p className="font-semibold">{(isYou ? stats.xp : entry.xp).toLocaleString()}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>

      {/* Seasonal Info */}
      <Card className="p-4 bg-gradient-to-r from-orange-100 to-pink-100 border-orange-200">
        <div className="flex items-center gap-3">
          <Trophy className="w-10 h-10 text-orange-500" />
          <div>
            <p className="font-semibold">Spring Season 2026</p>
            <p className="text-sm text-gray-600">15 days remaining • Top 100 earn exclusive rewards!</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
