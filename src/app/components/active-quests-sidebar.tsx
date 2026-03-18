import { ScrollArea } from './ui/scroll-area';
import { QuestItem, QuestDifficulty } from './quest-item';
import { Button } from './ui/button';
import { Plus, Filter } from 'lucide-react';

export interface Quest {
  id: string;
  title: string;
  difficulty: QuestDifficulty;
  xpReward: number;
  goldReward: number;
  timeEstimate?: string;
  completed: boolean;
}

interface ActiveQuestsSidebarProps {
  quests: Quest[];
  onQuestClick?: (quest: Quest) => void;
  onAddQuest?: () => void;
}

export function ActiveQuestsSidebar({ quests, onQuestClick, onAddQuest }: ActiveQuestsSidebarProps) {
  const activeQuests = quests.filter(q => !q.completed);
  const completedQuests = quests.filter(q => q.completed);

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-4 border-2 border-gray-700 shadow-lg h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-700">
        <div>
          <h3 className="font-bold text-white">Active Quests</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {activeQuests.length} in progress
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            <Filter className="w-4 h-4" />
          </Button>
          <Button 
            variant="default" 
            size="sm"
            onClick={onAddQuest}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Quest List */}
      <ScrollArea className="flex-1 -mx-1 px-1">
        <div className="space-y-3">
          {/* Active Quests */}
          {activeQuests.length > 0 && (
            <>
              {activeQuests.map(quest => (
                <QuestItem
                  key={quest.id}
                  title={quest.title}
                  difficulty={quest.difficulty}
                  xpReward={quest.xpReward}
                  goldReward={quest.goldReward}
                  timeEstimate={quest.timeEstimate}
                  completed={quest.completed}
                  onClick={() => onQuestClick?.(quest)}
                />
              ))}
            </>
          )}

          {/* Completed Quests */}
          {completedQuests.length > 0 && (
            <>
              <div className="pt-3 mt-3 border-t border-gray-700">
                <h4 className="text-xs font-semibold text-gray-500 mb-3">
                  Completed Today ({completedQuests.length})
                </h4>
              </div>
              {completedQuests.map(quest => (
                <QuestItem
                  key={quest.id}
                  title={quest.title}
                  difficulty={quest.difficulty}
                  xpReward={quest.xpReward}
                  goldReward={quest.goldReward}
                  timeEstimate={quest.timeEstimate}
                  completed={quest.completed}
                  onClick={() => onQuestClick?.(quest)}
                />
              ))}
            </>
          )}

          {activeQuests.length === 0 && completedQuests.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">No quests yet</p>
              <Button
                variant="outline"
                size="sm"
                onClick={onAddQuest}
                className="mt-3 border-gray-600 text-gray-400 hover:text-white hover:border-gray-500"
              >
                <Plus className="w-4 h-4 mr-1" />
                Create First Quest
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
