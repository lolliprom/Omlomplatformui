import { useState } from 'react';
import { useGameStore } from '../store/game-store';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

export default function Calendar() {
  const { tasks } = useGameStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get tasks for a specific day
  const getTasksForDay = (day: Date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      return isSameDay(taskDate, day);
    });
  };

  // Calculate workload for a day
  const getWorkloadForDay = (day: Date) => {
    const dayTasks = getTasksForDay(day);
    const incompleteTasks = dayTasks.filter(t => !t.completed);
    return incompleteTasks.reduce((sum, t) => sum + t.value, 0);
  };

  const getWorkloadColor = (workload: number) => {
    if (workload === 0) return 'bg-gray-100';
    if (workload < 100) return 'bg-green-100 border-green-300';
    if (workload < 300) return 'bg-yellow-100 border-yellow-300';
    return 'bg-red-100 border-red-300';
  };

  const totalWorkload = tasks
    .filter(t => !t.completed)
    .reduce((sum, t) => sum + t.value, 0);

  const upcomingDeadlines = tasks
    .filter(t => !t.completed)
    .slice(0, 5);

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between pt-4">
        <div>
          <h1 className="text-3xl mb-1">Calendar</h1>
          <p className="text-gray-600">Plan your quest schedule</p>
        </div>
        <CalendarIcon className="w-8 h-8 text-purple-500" />
      </div>

      {/* Workload Alert */}
      {totalWorkload > 300 && (
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">High Workload Alert!</p>
              <p className="text-sm text-red-700 mt-1">
                Your Omlom is stressed. Consider completing some quests to reduce workload.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Calendar Navigation */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-xl">{format(currentMonth, 'MMMM yyyy')}</h2>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs text-gray-600 font-semibold py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: monthStart.getDay() }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* Days of month */}
          {daysInMonth.map(day => {
            const workload = getWorkloadForDay(day);
            const dayTasks = getTasksForDay(day);
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={day.toISOString()}
                className={`aspect-square border-2 rounded-lg p-1 ${
                  isToday ? 'border-purple-500' : 'border-gray-200'
                } ${getWorkloadColor(workload)}`}
              >
                <div className="text-xs font-semibold">{format(day, 'd')}</div>
                {dayTasks.length > 0 && (
                  <div className="text-xs text-center mt-1">
                    <Badge variant="secondary" className="text-xs px-1 py-0">
                      {dayTasks.length}
                    </Badge>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded" />
            <span>Light</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-300 rounded" />
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded" />
            <span>Heavy</span>
          </div>
        </div>
      </Card>

      {/* Upcoming Tasks */}
      {upcomingDeadlines.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg">Upcoming Quests</h2>
          <div className="space-y-2">
            {upcomingDeadlines.map(task => (
              <Card key={task.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{task.title}</p>
                    <p className="text-xs text-gray-500">
                      Created {format(new Date(task.createdAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <Badge variant={task.value >= 70 ? 'destructive' : 'secondary'}>
                    {task.value} pts
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Weekly Summary */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-purple-200">
        <h3 className="font-semibold mb-2">This Week</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-600">Total Workload</p>
            <p className="text-xl">{totalWorkload} pts</p>
          </div>
          <div>
            <p className="text-gray-600">Active Quests</p>
            <p className="text-xl">{tasks.filter(t => !t.completed).length}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
