import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Users as UsersIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export interface CalendarTask {
  id: string;
  title: string;
  type: 'quest' | 'dungeon' | 'skill' | 'party';
  day: number; // 0-6 for Mon-Sun
  startHour: number;
  durationHours: number;
  color: string;
  participants?: string[]; // For party quests
  icon?: string;
}

interface ChronosCalendarProps {
  tasks: CalendarTask[];
  onTaskClick?: (task: CalendarTask) => void;
  onTimeSlotClick?: (day: number, hour: number) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function ChronosCalendar({ tasks, onTaskClick, onTimeSlotClick }: ChronosCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(0);

  const getTasksForSlot = (day: number, hour: number) => {
    return tasks.filter(
      task => 
        task.day === day && 
        hour >= task.startHour && 
        hour < task.startHour + task.durationHours
    );
  };

  const getTaskTypeLabel = (type: CalendarTask['type']) => {
    switch (type) {
      case 'quest': return '⚔️ Quest';
      case 'dungeon': return '🏰 Dungeon';
      case 'skill': return '📚 Skill';
      case 'party': return '👥 Party';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Calendar Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-white" />
            <h2 className="font-bold text-white">Chronos Map</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentWeek(prev => prev - 1)}
              className="text-white hover:bg-white/20"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-white font-medium px-2">
              Week {currentWeek === 0 ? 'Current' : currentWeek > 0 ? `+${currentWeek}` : currentWeek}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentWeek(prev => prev + 1)}
              className="text-white hover:bg-white/20"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Day Headers */}
          <div className="grid grid-cols-8 border-b border-gray-200 bg-gray-50">
            <div className="p-2 text-xs font-semibold text-gray-500"></div>
            {DAYS_SHORT.map((day, index) => (
              <div key={day} className="p-2 text-center">
                <div className="text-xs font-semibold text-gray-600">{day}</div>
                <div className="text-xs text-gray-500">
                  {new Date(2026, 2, 17 + index).getDate()}
                </div>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          <div className="relative">
            {HOURS.map(hour => (
              <div key={hour} className="grid grid-cols-8 border-b border-gray-100 hover:bg-gray-50/50">
                {/* Hour Label */}
                <div className="p-2 text-xs font-medium text-gray-500 border-r border-gray-200">
                  {hour.toString().padStart(2, '0')}:00
                </div>

                {/* Day Cells */}
                {DAYS.map((day, dayIndex) => {
                  const tasksInSlot = getTasksForSlot(dayIndex, hour);
                  const mainTask = tasksInSlot.find(t => t.startHour === hour);

                  return (
                    <div
                      key={`${day}-${hour}`}
                      className="relative border-r border-gray-100 min-h-[60px] cursor-pointer hover:bg-blue-50/30 transition-colors"
                      onClick={() => onTimeSlotClick?.(dayIndex, hour)}
                    >
                      {mainTask && (
                        <div
                          className={`absolute inset-0 m-0.5 rounded p-1.5 text-xs ${mainTask.color} border-l-4 border-opacity-50 cursor-pointer hover:shadow-md transition-shadow overflow-hidden`}
                          style={{ height: `${mainTask.durationHours * 60}px` }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onTaskClick?.(mainTask);
                          }}
                        >
                          <div className="font-semibold truncate text-white">
                            {mainTask.title}
                          </div>
                          <div className="text-xs opacity-90 text-white">
                            {getTaskTypeLabel(mainTask.type)}
                          </div>
                          {mainTask.participants && mainTask.participants.length > 0 && (
                            <div className="flex items-center gap-1 mt-1">
                              <UsersIcon className="w-3 h-3 text-white" />
                              <div className="flex -space-x-1">
                                {mainTask.participants.slice(0, 3).map((participant, i) => (
                                  <div
                                    key={i}
                                    className="w-4 h-4 rounded-full bg-white border border-gray-300 flex items-center justify-center"
                                    title={participant}
                                  >
                                    <span className="text-[8px] font-bold text-gray-700">
                                      {participant[0]}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
