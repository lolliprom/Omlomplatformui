import { Users, TrendingUp, Target, Flame } from 'lucide-react';
import { Progress } from './ui/progress';

interface GuildMemberActivity {
  id: string;
  name: string;
  activity: string;
  timestamp: string;
  type: 'focus' | 'levelup' | 'quest' | 'achievement';
}

interface GuildActivityFeedProps {
  activities: GuildMemberActivity[];
  guildName: string;
  guildGoal: {
    current: number;
    target: number;
    description: string;
  };
}

export function GuildActivityFeed({ activities, guildName, guildGoal }: GuildActivityFeedProps) {
  const goalPercentage = (guildGoal.current / guildGoal.target) * 100;

  const getActivityIcon = (type: GuildMemberActivity['type']) => {
    switch (type) {
      case 'focus':
        return <Flame className="w-4 h-4 text-orange-500" />;
      case 'levelup':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'quest':
        return <Target className="w-4 h-4 text-blue-500" />;
      default:
        return <Target className="w-4 h-4 text-purple-500" />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-4 border-2 border-slate-700 shadow-lg h-full flex flex-col">
      {/* Guild Header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-700">
        <Users className="w-5 h-5 text-cyan-400" />
        <h3 className="font-bold text-white">{guildName}</h3>
      </div>

      {/* Guild Goal */}
      <div className="bg-slate-800/50 rounded-lg p-3 mb-4 border border-slate-700">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-semibold text-cyan-400">Guild Goal</h4>
          <span className="text-xs text-gray-400">
            {guildGoal.current}/{guildGoal.target}
          </span>
        </div>
        <p className="text-xs text-gray-300 mb-2">{guildGoal.description}</p>
        <Progress value={goalPercentage} className="h-2 bg-gray-700">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
            style={{ width: `${goalPercentage}%` }}
          />
        </Progress>
      </div>

      {/* Activity Feed */}
      <div className="flex-1 overflow-hidden">
        <h4 className="text-sm font-semibold text-gray-400 mb-3">Live Feed</h4>
        <div className="space-y-2 overflow-y-auto max-h-[400px]">
          {activities.map((activity) => (
            <div 
              key={activity.id}
              className="bg-slate-800/30 rounded p-2 border border-slate-700/50 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-start gap-2">
                <div className="mt-0.5">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold text-white">{activity.name}</span>{' '}
                    {activity.activity}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{activity.timestamp}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
