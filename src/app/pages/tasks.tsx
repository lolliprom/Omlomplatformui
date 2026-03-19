import { useMemo, useState } from "react";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  Circle,
  Clock3,
  Plus,
  Trash2,
} from "lucide-react";
import {
  addDays,
  format,
  isPast,
  isToday,
  isTomorrow,
} from "date-fns";
import { toast } from "sonner";

import { calculateReward } from "../demo-data";
import { useGameStore } from "../store/game-store";
import { Task, TaskPriority } from "../types";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Slider } from "../components/ui/slider";
import { Textarea } from "../components/ui/textarea";

type TaskFilter = "active" | "today" | "upcoming" | "completed";

const filterOptions: { key: TaskFilter; label: string }[] = [
  { key: "active", label: "Active" },
  { key: "today", label: "Today" },
  { key: "upcoming", label: "Upcoming" },
  { key: "completed", label: "Completed" },
];

const priorityClasses: Record<TaskPriority, string> = {
  high: "border-rose-200 bg-rose-50 text-rose-700",
  medium: "border-amber-200 bg-amber-50 text-amber-700",
  low: "border-slate-200 bg-slate-50 text-slate-700",
};

const categoryLabels: Record<Task["category"], string> = {
  homework: "Homework",
  revision: "Revision",
  assignment: "Assignment",
  project: "Project",
  other: "Other",
};

const toDateTimeInputValue = (date: Date) => {
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
};

const createDefaultTask = () => ({
  title: "",
  description: "",
  value: 60,
  category: "project" as Task["category"],
  priority: "medium" as TaskPriority,
  estimatedMinutes: 60,
  dueDate: toDateTimeInputValue(addDays(new Date(), 1)),
});

const formatDue = (date: Date) => {
  if (isToday(date)) {
    return `Today at ${format(date, "h:mm a")}`;
  }

  if (isTomorrow(date)) {
    return `Tomorrow at ${format(date, "h:mm a")}`;
  }

  return format(date, "EEE, MMM d - h:mm a");
};

const getValueLabel = (value: number) => {
  if (value >= 80) {
    return "Critical";
  }

  if (value >= 60) {
    return "High impact";
  }

  if (value >= 40) {
    return "Steady";
  }

  return "Quick win";
};

export default function Tasks() {
  const { tasks, addTask, completeTask, deleteTask } = useGameStore();
  const [filter, setFilter] = useState<TaskFilter>("active");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState(createDefaultTask());

  const activeTasks = useMemo(
    () =>
      tasks
        .filter((task) => !task.completed)
        .sort((left, right) => left.dueDate.getTime() - right.dueDate.getTime()),
    [tasks],
  );
  const completedTasks = useMemo(
    () =>
      tasks
        .filter((task) => task.completed)
        .sort(
          (left, right) =>
            (right.completedAt?.getTime() ?? 0) - (left.completedAt?.getTime() ?? 0),
        ),
    [tasks],
  );

  const visibleTasks = useMemo(() => {
    switch (filter) {
      case "today":
        return activeTasks.filter((task) => isToday(task.dueDate));
      case "upcoming":
        return activeTasks.filter((task) => !isToday(task.dueDate));
      case "completed":
        return completedTasks;
      default:
        return activeTasks;
    }
  }, [activeTasks, completedTasks, filter]);

  const rewardPreview = calculateReward(newTask.value);

  const handleCreateTask = () => {
    if (!newTask.title.trim()) {
      toast.error("Give the quest a clear title.");
      return;
    }

    if (!newTask.dueDate) {
      toast.error("Choose a due date for the quest.");
      return;
    }

    addTask({
      title: newTask.title.trim(),
      description: newTask.description.trim(),
      value: newTask.value,
      category: newTask.category,
      priority: newTask.priority,
      estimatedMinutes: newTask.estimatedMinutes,
      dueDate: new Date(newTask.dueDate),
    });

    setNewTask(createDefaultTask());
    setIsDialogOpen(false);
    toast.success("Quest added to the board.");
  };

  const handleCompleteTask = (taskId: string) => {
    const reward = completeTask(taskId);

    if (!reward.xp) {
      return;
    }

    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#0f172a", "#2563eb", "#38bdf8"],
    });

    toast.success(`Quest complete: +${reward.xp} XP, +${reward.gold} gold.`);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    toast.success("Quest removed from the board.");
  };

  return (
    <div className="px-4 pb-24 pt-5 space-y-5">
      <section className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">Execution layer</p>
          <h1 className="text-3xl text-slate-950">Quest Board</h1>
          <p className="mt-1 text-sm text-slate-600">
            Organize the next sprint, assign reward weight, and clear work with momentum.
          </p>
        </div>

        <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full px-4">
              <Plus className="h-4 w-4" />
              New quest
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create a new quest</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="task-title">Title</Label>
                <Input
                  id="task-title"
                  onChange={(event) =>
                    setNewTask((current) => ({ ...current, title: event.target.value }))
                  }
                  placeholder="Finalize launch story"
                  value={newTask.title}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="task-description">Description</Label>
                <Textarea
                  id="task-description"
                  onChange={(event) =>
                    setNewTask((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  placeholder="What needs to happen before this feels demo ready?"
                  rows={3}
                  value={newTask.description}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    onValueChange={(value) =>
                      setNewTask((current) => ({
                        ...current,
                        category: value as Task["category"],
                      }))
                    }
                    value={newTask.category}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoryLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    onValueChange={(value) =>
                      setNewTask((current) => ({
                        ...current,
                        priority: value as TaskPriority,
                      }))
                    }
                    value={newTask.priority}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="task-due-date">Due date</Label>
                  <Input
                    id="task-due-date"
                    onChange={(event) =>
                      setNewTask((current) => ({ ...current, dueDate: event.target.value }))
                    }
                    type="datetime-local"
                    value={newTask.dueDate}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="task-duration">Focus minutes</Label>
                  <Input
                    id="task-duration"
                    min={15}
                    onChange={(event) =>
                      setNewTask((current) => ({
                        ...current,
                        estimatedMinutes: Number(event.target.value) || 15,
                      }))
                    }
                    step={15}
                    type="number"
                    value={newTask.estimatedMinutes}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <Label>Impact and reward weight</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">{getValueLabel(newTask.value)}</span>
                    <span className="font-medium text-slate-950">{newTask.value}</span>
                  </div>
                </div>
                <Slider
                  className="w-full"
                  max={100}
                  min={1}
                  onValueChange={([value]) =>
                    setNewTask((current) => ({ ...current, value }))
                  }
                  step={1}
                  value={[newTask.value]}
                />
                <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                  <span>{rewardPreview.xp} XP</span>
                  <span>{rewardPreview.gold} gold</span>
                  <span>{rewardPreview.auraShards} shards</span>
                  {rewardPreview.items?.[0] && <span>{rewardPreview.items[0]}</span>}
                </div>
              </div>

              <Button className="w-full" onClick={handleCreateTask}>
                Create quest
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </section>

      <Card className="grid grid-cols-3 gap-3 border-slate-200 bg-white/95 p-4 shadow-sm">
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">Active</p>
          <p className="mt-2 text-2xl text-slate-950">{activeTasks.length}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">Due today</p>
          <p className="mt-2 text-2xl text-slate-950">
            {activeTasks.filter((task) => isToday(task.dueDate)).length}
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">Completed</p>
          <p className="mt-2 text-2xl text-slate-950">{completedTasks.length}</p>
        </div>
      </Card>

      <div className="flex flex-wrap gap-2">
        {filterOptions.map((option) => (
          <Button
            className="rounded-full"
            key={option.key}
            onClick={() => setFilter(option.key)}
            size="sm"
            variant={filter === option.key ? "default" : "outline"}
          >
            {option.label}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {visibleTasks.map((task) => {
          const reward = calculateReward(task.value);
          const isCompleted = task.completed;
          const overdue = !isCompleted && isPast(task.dueDate) && !isToday(task.dueDate);

          return (
            <Card
              className={`border p-4 shadow-sm ${
                isCompleted
                  ? "border-slate-200 bg-slate-50/80"
                  : overdue
                    ? "border-rose-200 bg-rose-50/70"
                    : "border-slate-200 bg-white/95"
              }`}
              key={task.id}
            >
              <div className="flex items-start gap-3">
                <button
                  className={`mt-0.5 transition-colors ${
                    isCompleted ? "text-emerald-600" : "text-slate-400 hover:text-emerald-500"
                  }`}
                  onClick={() => handleCompleteTask(task.id)}
                  type="button"
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-6 w-6" />
                  ) : (
                    <Circle className="h-6 w-6" />
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2
                          className={`text-base ${
                            isCompleted ? "text-slate-500 line-through" : "text-slate-950"
                          }`}
                        >
                          {task.title}
                        </h2>
                        <Badge className={priorityClasses[task.priority]} variant="outline">
                          {task.priority}
                        </Badge>
                        <Badge variant="secondary">{categoryLabels[task.category]}</Badge>
                      </div>
                      {task.description && (
                        <p className="mt-2 text-sm text-slate-600">{task.description}</p>
                      )}
                    </div>

                    <button
                      className="text-slate-400 transition-colors hover:text-rose-600"
                      onClick={() => handleDeleteTask(task.id)}
                      type="button"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="h-3.5 w-3.5" />
                      {isCompleted && task.completedAt
                        ? `Completed ${format(task.completedAt, "EEE, MMM d - h:mm a")}`
                        : formatDue(task.dueDate)}
                    </span>
                    <span>{task.estimatedMinutes} min</span>
                    <span>{reward.xp} XP</span>
                    <span>{reward.gold} gold</span>
                    {overdue && <span className="text-rose-600">Overdue</span>}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}

        {visibleTasks.length === 0 && (
          <Card className="border-dashed border-slate-300 bg-white/70 p-8 text-center shadow-sm">
            <p className="text-base text-slate-950">No quests in this view.</p>
            <p className="mt-2 text-sm text-slate-500">
              Switch filters or create a new quest for the demo run.
            </p>
            <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Add quest
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
