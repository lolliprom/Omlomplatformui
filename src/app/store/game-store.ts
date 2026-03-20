import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, UserStats, OmlomState, Reward, Accessory } from '../types';

interface GameStore {
  tasks: Task[];
  stats: UserStats;
  omlom: OmlomState;
  inventory: string[];
  accessories: Accessory[];
  
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  completeTask: (taskId: string) => Reward;
  deleteTask: (taskId: string) => void;
  updateOmlomState: () => void;
  addReward: (reward: Reward) => void;
  unlockAccessory: (accessoryId: string) => void;
  toggleAccessory: (accessoryId: string) => void;
}

const calculateReward = (taskValue: number): Reward => {
  const baseMultiplier = taskValue / 100;
  return {
    gold: Math.floor(50 + taskValue * 5 * baseMultiplier),
    xp: Math.floor(100 + taskValue * 10 * baseMultiplier),
    auraShards: Math.floor(1 + taskValue / 20),
    items: taskValue >= 80 ? ['Rare Item'] : taskValue >= 50 ? ['Uncommon Item'] : undefined,
  };
};

const calculateOmlomState = (tasks: Task[]): OmlomState => {
  const incompleteTasks = tasks.filter(t => !t.completed);
  const totalWorkload = incompleteTasks.reduce((sum, t) => sum + t.value, 0);
  const taskCount = incompleteTasks.length;
  
  const workloadLevel = Math.min(100, totalWorkload / 5);
  
  if (workloadLevel > 70) {
    return {
      mode: 'stressed',
      workloadLevel,
      mood: 'Overwhelmed 😰',
      currentAura: 'red',
    };
  } else if (workloadLevel < 20 && taskCount === 0) {
    return {
      mode: 'happy',
      workloadLevel,
      mood: 'Relaxed & Happy 😊',
      currentAura: 'rainbow',
    };
  } else {
    return {
      mode: 'normal',
      workloadLevel,
      mood: 'Focused 😌',
      currentAura: 'blue',
    };
  }
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      stats: {
        level: 1,
        xp: 0,
        nextLevelXp: 1000,
        gold: 500,
        auraShards: 0,
        tasksCompleted: 0,
        currentStreak: 0,
        totalValue: 0,
      },
      omlom: {
        mode: 'normal',
        workloadLevel: 0,
        mood: 'Ready to work! 😊',
        currentAura: 'blue',
      },
      inventory: [],
      accessories: [],

      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          completed: false,
        };
        set((state) => ({
          tasks: [...state.tasks, newTask],
        }));
        get().updateOmlomState();
      },

      completeTask: (taskId) => {
        const task = get().tasks.find(t => t.id === taskId);
        if (!task || task.completed) {
          return { gold: 0, xp: 0, auraShards: 0 };
        }

        const reward = calculateReward(task.value);
        
        set((state) => ({
          tasks: state.tasks.map(t =>
            t.id === taskId
              ? { ...t, completed: true, completedAt: new Date() }
              : t
          ),
        }));

        get().addReward(reward);
        get().updateOmlomState();
        
        return reward;
      },

      deleteTask: (taskId) => {
        set((state) => ({
          tasks: state.tasks.filter(t => t.id !== taskId),
        }));
        get().updateOmlomState();
      },

      updateOmlomState: () => {
        const tasks = get().tasks;
        const newOmlomState = calculateOmlomState(tasks);
        set({ omlom: newOmlomState });
      },

      addReward: (reward) => {
        set((state) => {
          const newXp = state.stats.xp + reward.xp;
          let newLevel = state.stats.level;
          let newNextLevelXp = state.stats.nextLevelXp;

          // Level up logic
          if (newXp >= newNextLevelXp) {
            newLevel += 1;
            newNextLevelXp = newLevel * 1000;
          }

          return {
            stats: {
              ...state.stats,
              xp: newXp,
              level: newLevel,
              nextLevelXp: newNextLevelXp,
              gold: state.stats.gold + reward.gold,
              auraShards: state.stats.auraShards + reward.auraShards,
              tasksCompleted: state.stats.tasksCompleted + 1,
              totalValue: state.stats.totalValue + (reward.xp / 10),
            },
            inventory: reward.items
              ? [...state.inventory, ...reward.items]
              : state.inventory,
          };
        });
      },

      unlockAccessory: (accessoryId) => {
        set((state) => {
          const accessory = state.accessories.find(a => a.id === accessoryId);
          if (accessory) {
            return {
              accessories: state.accessories.map(a =>
                a.id === accessoryId
                  ? { ...a, unlocked: true }
                  : a
              ),
            };
          }
          return state;
        });
      },

      toggleAccessory: (accessoryId) => {
        set((state) => {
          const accessory = state.accessories.find(a => a.id === accessoryId);
          if (accessory) {
            return {
              accessories: state.accessories.map(a =>
                a.id === accessoryId
                  ? { ...a, equipped: !a.equipped }
                  : a
              ),
            };
          }
          return state;
        });
      },
    }),
    {
      name: 'omlom-game-storage',
      onRehydrateStorage: () => (state) => {
        // Add default tasks if no tasks exist
        if (state && state.tasks.length === 0) {
          const defaultTasks: Task[] = [
            {
              id: crypto.randomUUID(),
              title: 'Complete Math Homework Chapter 5',
              description: 'Solve problems 1-20 from the algebra section',
              value: 65,
              completed: false,
              createdAt: new Date(),
              category: 'homework',
              deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now (tomorrow)
            },
            {
              id: crypto.randomUUID(),
              title: 'Study for Biology Quiz',
              description: 'Review cell structure and photosynthesis',
              value: 50,
              completed: false,
              createdAt: new Date(),
              category: 'revision',
            },
            {
              id: crypto.randomUUID(),
              title: 'Write English Essay Draft',
              description: 'First draft of persuasive essay on climate change',
              value: 85,
              completed: false,
              createdAt: new Date(),
              category: 'assignment',
            },
            {
              id: crypto.randomUUID(),
              title: 'Group Project - Research Phase',
              description: 'Gather sources for history presentation',
              value: 70,
              completed: false,
              createdAt: new Date(),
              category: 'project',
            },
            {
              id: crypto.randomUUID(),
              title: 'Practice Spanish Vocabulary',
              description: 'Learn 25 new words from Unit 3',
              value: 35,
              completed: false,
              createdAt: new Date(),
              category: 'revision',
            },
            {
              id: crypto.randomUUID(),
              title: 'Physics Lab Report',
              description: 'Write up results from pendulum experiment',
              value: 75,
              completed: false,
              createdAt: new Date(),
              category: 'assignment',
            },
            {
              id: crypto.randomUUID(),
              title: 'Read Chapter 7 - World History',
              description: 'Read and take notes on Renaissance period',
              value: 45,
              completed: false,
              createdAt: new Date(),
              category: 'homework',
            },
          ];
          state.tasks = defaultTasks;
          state.omlom = calculateOmlomState(defaultTasks);
        }
      },
    }
  )
);