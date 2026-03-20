import { useState } from 'react';
import { useGameStore } from '../store/game-store';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Slider } from '../components/ui/slider';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { CheckCircle2, Circle, Trash2, Plus, Sparkles, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { Task } from '../types';

export default function Tasks() {
  const { tasks, addTask, completeTask, deleteTask } = useGameStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    value: 50,
    category: 'homework' as Task['category'],
  });

  const handleCreateTask = () => {
    if (!newTask.title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    addTask(newTask);
    toast.success('Quest created!');
    setIsDialogOpen(false);
    setNewTask({
      title: '',
      description: '',
      value: 50,
      category: 'homework',
    });
  };

  const handleCompleteTask = (taskId: string) => {
    const reward = completeTask(taskId);
    
    // Celebration effect
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#667eea', '#764ba2', '#f093fb'],
    });

    toast.success(
      <div>
        <p className="font-semibold">Quest Complete! 🎉</p>
        <p className="text-sm">+{reward.xp} XP • +{reward.gold} Gold • +{reward.auraShards} Aura Shards</p>
      </div>
    );
  };

  const incompleteTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  const getCategoryColor = (category: Task['category']) => {
    switch (category) {
      case 'homework': return 'bg-blue-100 text-blue-700';
      case 'revision': return 'bg-purple-100 text-purple-700';
      case 'assignment': return 'bg-orange-100 text-orange-700';
      case 'project': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getValueLabel = (value: number) => {
    if (value >= 80) return { label: 'Epic', color: 'text-purple-600' };
    if (value >= 60) return { label: 'Hard', color: 'text-orange-600' };
    if (value >= 40) return { label: 'Medium', color: 'text-blue-600' };
    return { label: 'Easy', color: 'text-green-600' };
  };

  const getDeadlineInfo = (deadline: Date) => {
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    
    if (diffDays < 0) {
      return { text: 'Overdue!', color: 'bg-red-600 text-white', icon: AlertTriangle, urgent: true };
    } else if (diffDays === 0) {
      return { text: 'Due Today!', color: 'bg-red-500 text-white', icon: AlertTriangle, urgent: true };
    } else if (diffDays === 1) {
      return { text: 'Due Tomorrow', color: 'bg-orange-500 text-white', icon: Clock, urgent: true };
    } else if (diffDays === 2) {
      return { text: 'Due in 2 days', color: 'bg-yellow-500 text-white', icon: Clock, urgent: false };
    } else if (diffDays <= 7) {
      return { text: `Due in ${diffDays} days`, color: 'bg-blue-500 text-white', icon: Clock, urgent: false };
    }
    return { text: `Due ${deadline.toLocaleDateString()}`, color: 'bg-gray-500 text-white', icon: Clock, urgent: false };
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pt-4">
        <div>
          <h1 className="text-3xl mb-1">Quests</h1>
          <p className="text-gray-600">{incompleteTasks.length} active quest{incompleteTasks.length !== 1 ? 's' : ''}</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="rounded-full">
              <Plus className="w-5 h-5 mr-2" />
              New Quest
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Quest</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Quest Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Complete Math Homework"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newTask.category}
                  onValueChange={(value) => setNewTask({ ...newTask, category: value as Task['category'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="homework">Homework</SelectItem>
                    <SelectItem value="revision">Revision</SelectItem>
                    <SelectItem value="assignment">Assignment</SelectItem>
                    <SelectItem value="project">Group Project</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add details about this quest..."
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Difficulty / Value</Label>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${getValueLabel(newTask.value).color}`}>
                      {getValueLabel(newTask.value).label}
                    </span>
                    <span className="font-semibold">{newTask.value}</span>
                  </div>
                </div>
                <Slider
                  value={[newTask.value]}
                  onValueChange={([value]) => setNewTask({ ...newTask, value })}
                  min={1}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">
                  Rewards: ~{newTask.value * 10} XP • ~{newTask.value * 5} Gold
                </p>
              </div>

              <Button onClick={handleCreateTask} className="w-full" size="lg">
                <Sparkles className="w-4 h-4 mr-2" />
                Create Quest
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Quests */}
      {incompleteTasks.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg">Active Quests</h2>
          <div className="space-y-2">
            {incompleteTasks.map(task => {
              const deadlineInfo = task.deadline ? getDeadlineInfo(task.deadline) : null;
              const DeadlineIcon = deadlineInfo?.icon;
              const isOnFire = deadlineInfo?.urgent;
              
              return (
              <Card key={task.id} className={`p-4 hover:shadow-md transition-shadow relative overflow-hidden ${
                isOnFire ? 'border-2 border-orange-500 shadow-xl shadow-orange-200' : ''
              }`}>
                {/* Fire effect background */}
                {isOnFire && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-100 via-red-50 to-transparent opacity-40 animate-pulse"></div>
                    <div className="absolute top-0 right-0 text-6xl opacity-20 animate-bounce">
                      🔥
                    </div>
                    <div className="absolute bottom-0 left-0 text-4xl opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}>
                      🔥
                    </div>
                  </>
                )}
                
                <div className="flex items-start gap-3 relative z-10">
                  <button
                    onClick={() => handleCompleteTask(task.id)}
                    className="mt-0.5 text-gray-400 hover:text-green-500 transition-colors"
                  >
                    <Circle className="w-6 h-6" />
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {isOnFire && <span className="text-xl animate-pulse">🔥</span>}
                          <h3 className="font-medium">{task.title}</h3>
                          {isOnFire && <span className="text-xl animate-pulse" style={{ animationDelay: '0.5s' }}>🔥</span>}
                          {deadlineInfo && (
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${deadlineInfo.color} ${
                              isOnFire ? 'animate-pulse shadow-lg' : ''
                            }`}>
                              {DeadlineIcon && <DeadlineIcon className="w-3 h-3" />}
                              <span>{deadlineInfo.text}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(task.category)}`}>
                        {task.category}
                      </span>
                    </div>
                    
                    {task.description && (
                      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`px-3 py-1.5 rounded-lg font-bold ${
                          task.value >= 80 
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                            : task.value >= 60 
                            ? 'bg-gradient-to-r from-orange-400 to-red-400 text-white shadow-md' 
                            : task.value >= 40 
                            ? 'bg-gradient-to-r from-blue-400 to-cyan-400 text-white shadow-md'
                            : 'bg-gradient-to-r from-green-400 to-emerald-400 text-white shadow-md'
                        }`}>
                          <span className="text-sm">⚡</span> {task.value} <span className="text-xs">PTS</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          +{task.value * 10} XP
                        </span>
                      </div>
                      
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            )})}
          </div>
        </div>
      )}

      {/* Completed Quests */}
      {completedTasks.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg text-gray-600">Completed Quests</h2>
          <div className="space-y-2">
            {completedTasks.slice(0, 5).map(task => (
              <Card key={task.id} className="p-4 bg-gray-50 border-gray-200 opacity-60">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="font-medium line-through text-gray-600">{task.title}</h3>
                        <div className="mt-1">
                          <span className="px-2 py-0.5 rounded bg-gray-200 text-gray-600 text-xs">
                            ⚡ {task.value} PTS
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {incompleteTasks.length === 0 && completedTasks.length === 0 && (
        <div className="text-center py-12">
          <Circle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg mb-2">No Quests Yet</h3>
          <p className="text-gray-600 mb-4">Create your first quest to start earning rewards!</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Quest
          </Button>
        </div>
      )}
    </div>
  );
}