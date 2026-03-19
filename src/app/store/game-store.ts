import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  buildInventory,
  buildOmlomState,
  buildStats,
  calculateReward,
  createCompletionPost,
  createDemoState,
  createLevelActivity,
  createLevelMilestonePost,
  createQuestActivity,
  normalizeGuildActivity,
  normalizeProfile,
  normalizeSocialPost,
  normalizeTask,
} from "../demo-data";
import {
  DemoProfile,
  GuildActivity,
  OmlomState,
  Reward,
  SocialPost,
  Task,
  UserStats,
} from "../types";

type NewTaskInput = Omit<Task, "id" | "createdAt" | "completed" | "completedAt">;

interface GameStore {
  profile: DemoProfile;
  tasks: Task[];
  stats: UserStats;
  omlom: OmlomState;
  inventory: string[];
  socialPosts: SocialPost[];
  guildActivities: GuildActivity[];
  addTask: (task: NewTaskInput) => void;
  completeTask: (taskId: string) => Reward;
  deleteTask: (taskId: string) => void;
  togglePostLike: (postId: string) => void;
  loadDemoData: () => void;
  resetDemoData: () => void;
}

const MAX_FEED_ITEMS = 24;
const MAX_GUILD_ITEMS = 24;

const deriveState = (tasks: Task[]) => {
  const stats = buildStats(tasks);

  return {
    stats,
    inventory: buildInventory(tasks),
    omlom: buildOmlomState(tasks, stats),
  };
};

const createStoreData = () => {
  const seed = createDemoState();

  return {
    ...seed,
    ...deriveState(seed.tasks),
  };
};

const emptyReward: Reward = {
  gold: 0,
  xp: 0,
  auraShards: 0,
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...createStoreData(),

      addTask: (taskData) => {
        const timestamp = new Date();
        const nextTask: Task = {
          ...taskData,
          id: crypto.randomUUID(),
          createdAt: timestamp,
          completed: false,
        };

        set((state) => {
          const tasks = [...state.tasks, nextTask];
          const guildActivities = [
            {
              id: crypto.randomUUID(),
              name: state.profile.username,
              activity: `queued ${nextTask.title.toLowerCase()}.`,
              timestamp,
              type: "focus" as const,
              taskId: nextTask.id,
            },
            ...state.guildActivities,
          ].slice(0, MAX_GUILD_ITEMS);

          return {
            tasks,
            guildActivities,
            ...deriveState(tasks),
          };
        });
      },

      completeTask: (taskId) => {
        const state = get();
        const task = state.tasks.find((entry) => entry.id === taskId);

        if (!task || task.completed) {
          return emptyReward;
        }

        const timestamp = new Date();
        const reward = calculateReward(task.value);
        const completedTask: Task = {
          ...task,
          completed: true,
          completedAt: timestamp,
        };
        const tasks = state.tasks.map((entry) =>
          entry.id === taskId ? completedTask : entry,
        );
        const derived = deriveState(tasks);
        const socialPosts = [
          createCompletionPost(state.profile, completedTask, reward, timestamp),
          ...state.socialPosts,
        ];
        const guildActivities = [
          createQuestActivity(state.profile, completedTask, timestamp),
          ...state.guildActivities,
        ];

        if (derived.stats.level > state.stats.level) {
          socialPosts.unshift(
            createLevelMilestonePost(state.profile, derived.stats.level, timestamp),
          );
          guildActivities.unshift(
            createLevelActivity(state.profile, derived.stats.level, timestamp),
          );
        }

        set({
          tasks,
          socialPosts: socialPosts.slice(0, MAX_FEED_ITEMS),
          guildActivities: guildActivities.slice(0, MAX_GUILD_ITEMS),
          ...derived,
        });

        return reward;
      },

      deleteTask: (taskId) => {
        set((state) => {
          const tasks = state.tasks.filter((task) => task.id !== taskId);

          return {
            tasks,
            socialPosts: state.socialPosts.filter((post) => post.taskId !== taskId),
            guildActivities: state.guildActivities.filter(
              (activity) => activity.taskId !== taskId,
            ),
            ...deriveState(tasks),
          };
        });
      },

      togglePostLike: (postId) => {
        set((state) => ({
          socialPosts: state.socialPosts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  likedByViewer: !post.likedByViewer,
                  likes: post.likes + (post.likedByViewer ? -1 : 1),
                }
              : post,
          ),
        }));
      },

      loadDemoData: () => {
        set(createStoreData());
      },

      resetDemoData: () => {
        set(createStoreData());
      },
    }),
    {
      name: "omlom-demo-storage",
      version: 2,
      migrate: (persistedState, version) => {
        if (version < 2) {
          return createStoreData();
        }

        return persistedState as GameStore;
      },
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<GameStore> | undefined;

        if (!persisted) {
          return currentState;
        }

        const profile = persisted.profile
          ? normalizeProfile(persisted.profile)
          : currentState.profile;
        const tasks = (persisted.tasks ?? currentState.tasks).map(normalizeTask);
        const socialPosts = (persisted.socialPosts ?? currentState.socialPosts).map(
          normalizeSocialPost,
        );
        const guildActivities = (
          persisted.guildActivities ?? currentState.guildActivities
        ).map(normalizeGuildActivity);

        return {
          ...currentState,
          ...persisted,
          profile,
          tasks,
          socialPosts,
          guildActivities,
          ...deriveState(tasks),
        };
      },
    },
  ),
);
