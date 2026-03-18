import { useGameStore } from '../store/game-store';
import { OmlomCharacter } from '../components/omlom-character';
import { Card } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Button } from '../components/ui/button';
import { Sparkles, Coins, Zap, Trophy } from 'lucide-react';
import { Link } from 'react-router';

export default function Dashboard() {
  const { stats, omlom, tasks } = useGameStore();
  
  const incompleteTasks = tasks.filter(t => !t.completed);
  const recentlyCompleted = tasks
    .filter(t => t.completed)
    .sort((a, b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0))
    .slice(0, 3);

  const xpProgress = (stats.xp / stats.nextLevelXp) * 100;

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="pt-4">
        <h1 className="text-3xl mb-1">Omlom</h1>
        <p className="text-gray-600">Transform tasks into rewards</p>
      </div>

      {/* Omlom Character Card */}
      <Card className="p-6 bg-gradient-to-br from-purple-100 to-blue-100 border-2 border-purple-200">
        <div className="flex flex-col items-center">
          <OmlomCharacter state={omlom} size="large" />
          <div className="mt-4 text-center">
            <p className="text-lg mb-1">{omlom.mood}</p>
            <p className="text-sm text-gray-600">
              Workload: {omlom.workloadLevel.toFixed(0)}%
            </p>
            {incompleteTasks.length > 0 && (
              <p className="text-sm text-purple-600 mt-2">
                {incompleteTasks.length} quest{incompleteTasks.length !== 1 ? 's' : ''} waiting
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            <span className="text-sm text-gray-600">Level</span>
          </div>
          <p className="text-2xl">{stats.level}</p>
          <Progress value={xpProgress} className="mt-2 h-2" />
          <p className="text-xs text-gray-500 mt-1">
            {stats.xp} / {stats.nextLevelXp} XP
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Coins className="w-5 h-5 text-yellow-600" />
            <span className="text-sm text-gray-600">Gold</span>
          </div>
          <p className="text-2xl">{stats.gold.toLocaleString()}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <span className="text-sm text-gray-600">Aura Shards</span>
          </div>
          <p className="text-2xl">{stats.auraShards}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-orange-500" />
            <span className="text-sm text-gray-600">Completed</span>
          </div>
          <p className="text-2xl">{stats.tasksCompleted}</p>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h2 className="text-lg">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link to="/tasks">
            <Button className="w-full" variant="default">
              Create Quest
            </Button>
          </Link>
          <Link to="/social">
            <Button className="w-full" variant="outline">
              View Feed
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Completions */}
      {recentlyCompleted.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg">Recent Victories</h2>
          <div className="space-y-2">
            {recentlyCompleted.map(task => (
              <Card key={task.id} className="p-3 bg-green-50 border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm">{task.title}</p>
                    <p className="text-xs text-gray-500">
                      +{task.value * 10} XP • +{task.value * 5} Gold
                    </p>
                  </div>
                  <Trophy className="w-5 h-5 text-green-600" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
