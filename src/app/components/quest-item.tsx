import { Sword, Zap, Trophy, Coins } from 'lucide-react';
import { Badge } from './ui/badge';

export type QuestDifficulty = 'Common' | 'Rare' | 'Epic' | 'Legendary';

interface QuestItemProps {
  title: string;
  difficulty: QuestDifficulty;
  xpReward: number;
  goldReward: number;
  timeEstimate?: string;
  completed?: boolean;
  onClick?: () => void;
}

const difficultyColors = {
  Common: 'bg-gray-500 border-gray-400',
  Rare: 'bg-blue-600 border-blue-400',
  Epic: 'bg-purple-600 border-purple-400',
  Legendary: 'bg-orange-600 border-orange-400'
};

const difficultyTextColors = {
  Common: 'text-gray-400',
  Rare: 'text-blue-400',
  Epic: 'text-purple-400',
  Legendary: 'text-orange-400'
};

export function QuestItem({ 
  title, 
  difficulty, 
  xpReward, 
  goldReward,
  timeEstimate,
  completed = false,
  onClick
}: QuestItemProps) {
  return (
    <div 
      onClick={onClick}
      className={`p-3 rounded-lg border-2 transition-all cursor-pointer hover:scale-[1.02] ${
        completed 
          ? 'bg-gray-800/50 border-gray-700 opacity-60' 
          : 'bg-gray-800 border-gray-700 hover:border-yellow-500/50'
      }`}
    >
      <div className="flex items-start gap-2 mb-2">
        <Sword className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-semibold ${completed ? 'line-through text-gray-500' : 'text-white'}`}>
            {title}
          </h4>
          {timeEstimate && (
            <p className="text-xs text-gray-500 mt-0.5">{timeEstimate}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <Badge 
          variant="secondary" 
          className={`text-xs ${difficultyColors[difficulty]} border`}
        >
          {difficulty}
        </Badge>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1 text-cyan-400">
            <Zap className="w-3 h-3" />
            <span>{xpReward}</span>
          </div>
          <div className="flex items-center gap-1 text-yellow-400">
            <Coins className="w-3 h-3" />
            <span>{goldReward}</span>
          </div>
        </div>
      </div>

      {completed && (
        <div className="flex items-center gap-1 mt-2 text-green-500 text-xs">
          <Trophy className="w-3 h-3" />
          <span>Quest Completed!</span>
        </div>
      )}
    </div>
  );
}
