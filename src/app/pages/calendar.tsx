import { useMemo, useState } from "react";
import {
  addMonths,
  addDays,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import {
  AlertCircle,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

import { ChronosCalendar } from "../components/chronos-calendar";
import { useGameStore } from "../store/game-store";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

const getWorkloadColor = (value: number) => {
  if (value === 0) {
    return "bg-slate-50";
  }

  if (value < 60) {
    return "bg-emerald-50 border-emerald-200";
  }

  if (value < 120) {
    return "bg-amber-50 border-amber-200";
  }

  return "bg-rose-50 border-rose-200";
};

export default function Calendar() {
  const { tasks } = useGameStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const tasksForDay = (date: Date) =>
    tasks
      .filter((task) => isSameDay(task.dueDate, date))
      .sort((left, right) => left.dueDate.getTime() - right.dueDate.getTime());

  const activeTasks = tasks.filter((task) => !task.completed);
  const selectedDayTasks = tasksForDay(selectedDay);
  const totalOpenValue = activeTasks.reduce((total, task) => total + task.value, 0);
  const dueTodayCount = activeTasks.filter((task) => isToday(task.dueDate)).length;
  const selectedWeekStart = startOfWeek(selectedDay, { weekStartsOn: 1 });
  const nextWeekStart = addDays(selectedWeekStart, 7);

  const weeklyTasks = useMemo(
    () =>
      activeTasks
        .filter(
          (task) =>
            task.dueDate.getTime() >= selectedWeekStart.getTime() &&
            task.dueDate.getTime() < nextWeekStart.getTime(),
        )
        .map((task) => ({
          id: task.id,
          title: task.title,
          type:
            task.priority === "high"
              ? "dungeon"
              : task.category === "project"
                ? "party"
                : "quest",
          day: (task.dueDate.getDay() + 6) % 7,
          startHour: task.dueDate.getHours(),
          durationHours: Math.max(1, Math.round(task.estimatedMinutes / 60)),
          color:
            task.priority === "high"
              ? "bg-rose-500"
              : task.priority === "medium"
                ? "bg-amber-500"
                : "bg-sky-500",
        })),
    [activeTasks, nextWeekStart, selectedWeekStart],
  );

  return (
    <div className="px-4 pb-24 pt-5 space-y-5">
      <section className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">Planning layer</p>
          <h1 className="text-3xl text-slate-950">Quest Calendar</h1>
          <p className="mt-1 text-sm text-slate-600">
            Shift from the high-level quest board into due dates and weekly scheduling.
          </p>
        </div>
        <CalendarIcon className="h-8 w-8 text-indigo-500" />
      </section>

      <section className="grid grid-cols-3 gap-3">
        <Card className="gap-2 border-slate-200 bg-white/95 p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500">Open load</p>
          <p className="text-2xl text-slate-950">{totalOpenValue}</p>
        </Card>
        <Card className="gap-2 border-slate-200 bg-white/95 p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500">Due today</p>
          <p className="text-2xl text-slate-950">{dueTodayCount}</p>
        </Card>
        <Card className="gap-2 border-slate-200 bg-white/95 p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500">Selected day</p>
          <p className="text-lg text-slate-950">{selectedDayTasks.length} quests</p>
        </Card>
      </section>

      {totalOpenValue > 230 && (
        <Card className="border-rose-200 bg-rose-50 p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-rose-600" />
            <div>
              <p className="text-sm font-medium text-rose-900">High workload signal</p>
              <p className="mt-1 text-sm text-rose-700">
                The board is filling up. Clear a high-value quest before adding more work.
              </p>
            </div>
          </div>
        </Card>
      )}

      <Tabs className="w-full" defaultValue="month">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="month">Month</TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
        </TabsList>

        <TabsContent className="space-y-4" value="month">
          <Card className="border-slate-200 bg-white/95 p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <Button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} size="icon" variant="outline">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl text-slate-950">{format(currentMonth, "MMMM yyyy")}</h2>
              <Button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} size="icon" variant="outline">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-xs text-slate-500">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div className="py-2 font-medium" key={day}>
                  {day}
                </div>
              ))}
            </div>

            <div className="mt-2 grid grid-cols-7 gap-2">
              {Array.from({ length: monthStart.getDay() }).map((_, index) => (
                <div className="aspect-square" key={`empty-${index}`} />
              ))}

              {daysInMonth.map((day) => {
                const dayTasks = tasksForDay(day);
                const dayWorkload = dayTasks
                  .filter((task) => !task.completed)
                  .reduce((total, task) => total + task.value, 0);

                return (
                  <button
                    className={`aspect-square rounded-2xl border p-2 text-left transition-colors ${
                      isSameDay(day, selectedDay)
                        ? "border-indigo-500 bg-indigo-50"
                        : getWorkloadColor(dayWorkload)
                    }`}
                    key={day.toISOString()}
                    onClick={() => setSelectedDay(day)}
                    type="button"
                  >
                    <div className="text-xs font-medium text-slate-700">{format(day, "d")}</div>
                    {dayTasks.length > 0 && (
                      <div className="mt-2">
                        <Badge className="px-1.5 py-0 text-[10px]" variant="secondary">
                          {dayTasks.length}
                        </Badge>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="border-slate-200 bg-white/95 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">Agenda</p>
                <h2 className="text-xl text-slate-950">{format(selectedDay, "EEEE, MMM d")}</h2>
              </div>
              <Badge variant="outline">{selectedDayTasks.length} quests</Badge>
            </div>

            <div className="mt-4 space-y-3">
              {selectedDayTasks.length > 0 ? (
                selectedDayTasks.map((task) => (
                  <div
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    key={task.id}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-slate-950">{task.title}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {format(task.dueDate, "h:mm a")} - {task.estimatedMinutes} min
                        </p>
                      </div>
                      <Badge variant={task.completed ? "secondary" : "outline"}>
                        {task.completed ? "Completed" : `${task.value} pts`}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 p-5 text-center text-sm text-slate-500">
                  No quests scheduled for this date.
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent className="space-y-4" value="week">
          <ChronosCalendar
            baseDate={selectedDay}
            onTaskClick={(task) =>
              toast.success(`Use ${task.title} as the live schedule example in the demo.`)
            }
            tasks={weeklyTasks}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
