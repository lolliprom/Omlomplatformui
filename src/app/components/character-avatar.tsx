import { Shield, Sparkles } from 'lucide-react';
import { Progress } from './ui/progress';

interface CharacterAvatarProps {
  name: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  hp: number;
  maxHp: number;
  className?: string;
}

export function CharacterAvatar({ 
  name, 
  level, 
  xp, 
  xpToNextLevel, 
  hp, 
  maxHp,
  className = ''
}: CharacterAvatarProps) {
  const xpPercentage = (xp / xpToNextLevel) * 100;
  const hpPercentage = (hp / maxHp) * 100;

  return (
    <div className={`bg-gradient-to-br from-indigo-900 to-purple-900 rounded-lg p-4 border-2 border-yellow-500/50 shadow-lg ${className}`}>
      <div className="flex items-start gap-3">
        {/* Character Sprite */}
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center border-2 border-yellow-400 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          {/* Focus Aura */}
          <div className="absolute -top-1 -right-1">
            <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold text-white">{name}</h3>
            <span className="px-2 py-0.5 bg-yellow-500 text-black text-xs font-bold rounded">
              LVL {level}
            </span>
          </div>

          {/* HP Bar */}
          <div className="mb-2">
            <div className="flex justify-between text-xs text-gray-300 mb-1">
              <span>HP (Stamina)</span>
              <span>{hp}/{maxHp}</span>
            </div>
            <Progress value={hpPercentage} className="h-2 bg-gray-700">
              <div 
                className="h-full bg-gradient-to-r from-red-500 to-pink-500 transition-all"
                style={{ width: `${hpPercentage}%` }}
              />
            </Progress>
          </div>

          {/* XP Bar */}
          <div>
            <div className="flex justify-between text-xs text-gray-300 mb-1">
              <span>XP (Productivity)</span>
              <span>{xp}/{xpToNextLevel}</span>
            </div>
            <Progress value={xpPercentage} className="h-2 bg-gray-700">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all"
                style={{ width: `${xpPercentage}%` }}
              />
            </Progress>
          </div>
        </div>
      </div>
    </div>
  );
}
