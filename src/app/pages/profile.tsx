import { useGameStore } from '../store/game-store';
import { OmlomCharacter } from '../components/omlom-character';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Trophy, Sparkles, Flame, Calendar, Award, Share2, Download } from 'lucide-react';

export default function Profile() {
  const { stats, omlom, inventory, tasks } = useGameStore();

  const achievements = [
    { id: 1, name: 'First Steps', description: 'Complete your first quest', unlocked: stats.tasksCompleted >= 1, icon: '🎯' },
    { id: 2, name: 'On Fire', description: 'Reach a 5-day streak', unlocked: stats.currentStreak >= 5, icon: '🔥' },
    { id: 3, name: 'Level Up!', description: 'Reach level 5', unlocked: stats.level >= 5, icon: '⬆️' },
    { id: 4, name: 'Task Master', description: 'Complete 50 quests', unlocked: stats.tasksCompleted >= 50, icon: '👑' },
    { id: 5, name: 'Aura Collector', description: 'Collect 100 aura shards', unlocked: stats.auraShards >= 100, icon: '✨' },
    { id: 6, name: 'Gold Rush', description: 'Accumulate 5000 gold', unlocked: stats.gold >= 5000, icon: '💰' },
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const xpProgress = (stats.xp / stats.nextLevelXp) * 100;

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Header */}
      <div className="pt-4 text-center">
        <h1 className="text-3xl mb-1">Profile</h1>
        <p className="text-gray-600">Your Omlom Journey</p>
      </div>

      {/* Profile Card */}
      <Card className="p-6 bg-gradient-to-br from-purple-100 to-blue-100 border-2 border-purple-200">
        <div className="flex flex-col items-center">
          {/* Mirror Frame */}
          <div className="relative mb-4">
            <div className="absolute -inset-4 border-4 border-purple-300 rounded-full opacity-50" />
            <div className="relative">
              <OmlomCharacter state={omlom} size="large" />
            </div>
          </div>

          {/* Player Info */}
          <h2 className="text-2xl mb-1">Student Hero</h2>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary" className="text-lg px-3 py-1">
              Level {stats.level}
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              🛡️ Study Warriors
            </Badge>
          </div>

          {/* XP Progress */}
          <div className="w-full max-w-xs">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600">XP Progress</span>
              <span className="font-semibold">{stats.xp} / {stats.nextLevelXp}</span>
            </div>
            <Progress value={xpProgress} className="h-3" />
          </div>

          {/* Share Button */}
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share to IG
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4 text-center">
          <Trophy className="w-8 h-8 mx-auto mb-2 text-orange-500" />
          <p className="text-2xl mb-1">{stats.tasksCompleted}</p>
          <p className="text-sm text-gray-600">Quests Done</p>
        </Card>

        <Card className="p-4 text-center">
          <Flame className="w-8 h-8 mx-auto mb-2 text-red-500" />
          <p className="text-2xl mb-1">{stats.currentStreak}</p>
          <p className="text-sm text-gray-600">Day Streak</p>
        </Card>

        <Card className="p-4 text-center">
          <Sparkles className="w-8 h-8 mx-auto mb-2 text-purple-500" />
          <p className="text-2xl mb-1">{stats.auraShards}</p>
          <p className="text-sm text-gray-600">Aura Shards</p>
        </Card>

        <Card className="p-4 text-center">
          <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-500" />
          <p className="text-2xl mb-1">{Math.floor(stats.totalValue)}</p>
          <p className="text-sm text-gray-600">Total Value</p>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="achievements" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-3 mt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg">Unlocked Achievements</h3>
            <Badge>{unlockedCount} / {achievements.length}</Badge>
          </div>

          <div className="grid gap-3">
            {achievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={`p-4 ${
                  achievement.unlocked
                    ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
                    : 'bg-gray-50 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <p className="font-semibold">{achievement.name}</p>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                  {achievement.unlocked && (
                    <Award className="w-6 h-6 text-yellow-600" />
                  )}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-3 mt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg">Your Items</h3>
            <Badge>{inventory.length} items</Badge>
          </div>

          {inventory.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {inventory.map((item, index) => (
                <Card key={index} className="p-4 text-center">
                  <div className="text-4xl mb-2">
                    {item === 'Rare Item' ? '💎' : item === 'Uncommon Item' ? '🎁' : '📦'}
                  </div>
                  <p className="text-sm font-semibold">{item}</p>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Sparkles className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 mb-2">No items yet</p>
              <p className="text-sm text-gray-500">Complete high-value quests to earn rare items!</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
