import {
  addDays,
  differenceInCalendarDays,
  endOfWeek,
  format,
  isSameDay,
  isWithinInterval,
  setHours,
  setMinutes,
  startOfDay,
  startOfToday,
  startOfWeek,
  subDays,
} from "date-fns";

import {
  DailyMomentum,
  DemoProfile,
  GuildActivity,
  LeaderboardEntry,
  OmlomState,
  Reward,
  SocialPost,
  Task,
  UserStats,
} from "./types";

export interface DemoSeedState {
  profile: DemoProfile;
  tasks: Task[];
  socialPosts: SocialPost[];
  guildActivities: GuildActivity[];
}

export interface LeaderboardSet {
  global: LeaderboardEntry[];
  guild: LeaderboardEntry[];
  weekly: LeaderboardEntry[];
}

const GLOBAL_LEADERBOARD_BASE: Omit<LeaderboardEntry, "rank">[] = [
  {
    userId: "luna-hart",
    username: "Luna Hart",
    avatar: "LH",
    level: 5,
    xp: 3920,
    tasksCompleted: 19,
    guild: "Night Shift",
    streak: 6,
    weeklyXp: 980,
    focusMinutes: 640,
  },
  {
    userId: "omar-vale",
    username: "Omar Vale",
    avatar: "OV",
    level: 4,
    xp: 3440,
    tasksCompleted: 16,
    guild: "Launch Ops",
    streak: 5,
    weeklyXp: 860,
    focusMinutes: 585,
  },
  {
    userId: "sana-cho",
    username: "Sana Cho",
    avatar: "SC",
    level: 4,
    xp: 3180,
    tasksCompleted: 15,
    guild: "Study Warriors",
    streak: 4,
    weeklyXp: 730,
    focusMinutes: 520,
  },
  {
    userId: "niko-reeve",
    username: "Niko Reeve",
    avatar: "NR",
    level: 3,
    xp: 2640,
    tasksCompleted: 12,
    guild: "Sprint Club",
    streak: 3,
    weeklyXp: 610,
    focusMinutes: 470,
  },
  {
    userId: "maya-lin",
    username: "Maya Lin",
    avatar: "ML",
    level: 3,
    xp: 2210,
    tasksCompleted: 10,
    guild: "Study Warriors",
    streak: 2,
    weeklyXp: 480,
    focusMinutes: 390,
  },
];

const GUILD_LEADERBOARD_BASE: Omit<LeaderboardEntry, "rank">[] = [
  {
    userId: "sana-cho",
    username: "Sana Cho",
    avatar: "SC",
    level: 4,
    xp: 3180,
    tasksCompleted: 15,
    guild: "Study Warriors",
    streak: 4,
    weeklyXp: 730,
    focusMinutes: 520,
  },
  {
    userId: "maya-lin",
    username: "Maya Lin",
    avatar: "ML",
    level: 3,
    xp: 2210,
    tasksCompleted: 10,
    guild: "Study Warriors",
    streak: 2,
    weeklyXp: 480,
    focusMinutes: 390,
  },
  {
    userId: "eli-morris",
    username: "Eli Morris",
    avatar: "EM",
    level: 3,
    xp: 1980,
    tasksCompleted: 9,
    guild: "Study Warriors",
    streak: 3,
    weeklyXp: 430,
    focusMinutes: 360,
  },
];

const MAX_FEED_ITEMS = 24;
const MAX_GUILD_ITEMS = 24;

const toDatedValue = <T extends string | Date | undefined>(value: T) =>
  value ? new Date(value) : undefined;

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

const makeTime = (baseDate: Date, dayOffset: number, hour: number, minute = 0) =>
  setMinutes(setHours(addDays(startOfDay(baseDate), dayOffset), hour), minute);

const toRankedEntries = (
  entries: Omit<LeaderboardEntry, "rank">[],
  metric: "xp" | "weeklyXp",
) =>
  [...entries]
    .sort((left, right) => {
      const metricDelta = right[metric] - left[metric];
      if (metricDelta !== 0) {
        return metricDelta;
      }

      const taskDelta = right.tasksCompleted - left.tasksCompleted;
      if (taskDelta !== 0) {
        return taskDelta;
      }

      return right.streak - left.streak;
    })
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

const calculateStreaks = (tasks: Task[]) => {
  const completionDays = Array.from(
    new Set(
      tasks
        .filter((task) => task.completedAt)
        .map((task) => startOfDay(task.completedAt as Date).getTime()),
    ),
  ).sort((left, right) => right - left);

  let bestStreak = 0;
  let runningStreak = 0;
  let previousDay: number | undefined;

  completionDays.forEach((dayValue) => {
    if (
      previousDay === undefined ||
      differenceInCalendarDays(new Date(previousDay), new Date(dayValue)) === 1
    ) {
      runningStreak += 1;
    } else {
      runningStreak = 1;
    }

    bestStreak = Math.max(bestStreak, runningStreak);
    previousDay = dayValue;
  });

  const today = startOfToday().getTime();
  const yesterday = subDays(startOfToday(), 1).getTime();

  let currentStreak = 0;
  if (completionDays[0] === today || completionDays[0] === yesterday) {
    currentStreak = 1;
    for (let index = 1; index < completionDays.length; index += 1) {
      if (
        differenceInCalendarDays(
          new Date(completionDays[index - 1]),
          new Date(completionDays[index]),
        ) === 1
      ) {
        currentStreak += 1;
      } else {
        break;
      }
    }
  }

  return { currentStreak, bestStreak };
};

const computeLevelInfo = (xp: number) => {
  let level = 1;
  let nextLevelXp = 1000;

  while (xp >= nextLevelXp) {
    level += 1;
    nextLevelXp = level * 1000;
  }

  return { level, nextLevelXp };
};

export const calculateReward = (taskValue: number): Reward => {
  const reward: Reward = {
    gold: Math.round(30 + taskValue * 4.5),
    xp: Math.round(120 + taskValue * 7),
    auraShards: Math.max(1, Math.floor(taskValue / 25)),
  };

  if (taskValue >= 85) {
    reward.items = ["Moonstone Charm"];
  } else if (taskValue >= 65) {
    reward.items = ["Focus Tonic"];
  } else if (taskValue >= 45) {
    reward.items = ["Aura Ticket"];
  }

  return reward;
};

export const buildInventory = (tasks: Task[]) =>
  tasks.flatMap((task) => (task.completed ? calculateReward(task.value).items ?? [] : []));

export const buildStats = (tasks: Task[]): UserStats => {
  const completedTasks = tasks.filter((task) => task.completed);
  const completedRewards = completedTasks.map((task) => calculateReward(task.value));
  const weeklyInterval = {
    start: startOfWeek(new Date(), { weekStartsOn: 1 }),
    end: endOfWeek(new Date(), { weekStartsOn: 1 }),
  };

  const xp = sum(completedRewards.map((reward) => reward.xp));
  const gold = sum(completedRewards.map((reward) => reward.gold));
  const auraShards = sum(completedRewards.map((reward) => reward.auraShards));
  const focusMinutes = sum(completedTasks.map((task) => task.estimatedMinutes));
  const weeklyCompletedTasks = completedTasks.filter(
    (task) => task.completedAt && isWithinInterval(task.completedAt, weeklyInterval),
  );
  const weeklyXp = sum(weeklyCompletedTasks.map((task) => calculateReward(task.value).xp));
  const weeklyFocusMinutes = sum(weeklyCompletedTasks.map((task) => task.estimatedMinutes));
  const totalValue = sum(completedTasks.map((task) => task.value));
  const { currentStreak, bestStreak } = calculateStreaks(completedTasks);
  const { level, nextLevelXp } = computeLevelInfo(xp);

  return {
    level,
    xp,
    nextLevelXp,
    gold,
    auraShards,
    tasksCompleted: completedTasks.length,
    questsCreated: tasks.length,
    currentStreak,
    bestStreak,
    totalValue,
    focusMinutes,
    weeklyGoalMinutes: 540,
    weeklyFocusMinutes,
    weeklyXp,
    completionRate: tasks.length
      ? Math.round((completedTasks.length / tasks.length) * 100)
      : 0,
  };
};

export const buildOmlomState = (tasks: Task[], stats: UserStats): OmlomState => {
  const now = new Date();
  const activeTasks = tasks.filter((task) => !task.completed);
  const overdueTasks = activeTasks.filter((task) => task.dueDate.getTime() < now.getTime());
  const dueSoonTasks = activeTasks.filter((task) => {
    const dueInMs = task.dueDate.getTime() - now.getTime();
    return dueInMs >= 0 && dueInMs <= 1000 * 60 * 60 * 48;
  });
  const totalWorkload = sum(activeTasks.map((task) => task.value));
  const workloadLevel = Math.min(
    100,
    Math.round(totalWorkload / 3 + overdueTasks.length * 15 + dueSoonTasks.length * 7),
  );

  if (
    stats.currentStreak >= 4 &&
    overdueTasks.length === 0 &&
    activeTasks.length <= 4 &&
    workloadLevel <= 55
  ) {
    return {
      mode: "evolved",
      workloadLevel,
      mood: "Radiating momentum and ready for the demo.",
      currentAura: "gold",
    };
  }

  if (overdueTasks.length > 0 || workloadLevel >= 78) {
    return {
      mode: "stressed",
      workloadLevel,
      mood: "Needs a cleanup sprint before the next big push.",
      currentAura: "red",
    };
  }

  if (activeTasks.length === 0) {
    return {
      mode: "happy",
      workloadLevel,
      mood: "Quest board cleared. Time to celebrate.",
      currentAura: "rainbow",
    };
  }

  if (stats.currentStreak >= 3 && workloadLevel <= 45) {
    return {
      mode: "happy",
      workloadLevel,
      mood: "In a calm groove with strong follow-through.",
      currentAura: "rainbow",
    };
  }

  return {
    mode: "normal",
    workloadLevel,
    mood: "Locked in and pacing the next focus block.",
    currentAura: "blue",
  };
};

export const buildMomentum = (tasks: Task[]): DailyMomentum[] => {
  const today = startOfToday();

  return Array.from({ length: 7 }, (_, index) => {
    const day = subDays(today, 6 - index);
    const completedTasks = tasks.filter(
      (task) => task.completedAt && isSameDay(task.completedAt, day),
    );
    const plannedTasks = tasks.filter((task) => isSameDay(task.dueDate, day));

    return {
      date: day.toISOString(),
      label: format(day, "EEE"),
      xp: sum(completedTasks.map((task) => calculateReward(task.value).xp)),
      completions: completedTasks.length,
      focusMinutes: sum(completedTasks.map((task) => task.estimatedMinutes)),
      plannedValue: sum(plannedTasks.map((task) => task.value)),
    };
  });
};

export const buildLeaderboards = (
  profile: DemoProfile,
  stats: UserStats,
): LeaderboardSet => {
  const playerEntry: Omit<LeaderboardEntry, "rank"> = {
    userId: profile.userId,
    username: profile.username,
    avatar: profile.avatar,
    level: stats.level,
    xp: stats.xp,
    tasksCompleted: stats.tasksCompleted,
    guild: profile.guild,
    streak: stats.currentStreak,
    weeklyXp: stats.weeklyXp,
    focusMinutes: stats.weeklyFocusMinutes,
    isPlayer: true,
  };

  const weeklyPool = [
    ...GLOBAL_LEADERBOARD_BASE,
    ...GUILD_LEADERBOARD_BASE.filter(
      (entry) => !GLOBAL_LEADERBOARD_BASE.some((globalEntry) => globalEntry.userId === entry.userId),
    ),
    playerEntry,
  ];

  return {
    global: toRankedEntries([...GLOBAL_LEADERBOARD_BASE, playerEntry], "xp"),
    guild: toRankedEntries([...GUILD_LEADERBOARD_BASE, playerEntry], "xp"),
    weekly: toRankedEntries(weeklyPool, "weeklyXp"),
  };
};

export const normalizeTask = (task: Task): Task => ({
  ...task,
  createdAt: new Date(task.createdAt),
  dueDate: new Date(task.dueDate),
  completedAt: toDatedValue(task.completedAt),
});

export const normalizeSocialPost = (post: SocialPost): SocialPost => ({
  ...post,
  timestamp: new Date(post.timestamp),
});

export const normalizeGuildActivity = (activity: GuildActivity): GuildActivity => ({
  ...activity,
  timestamp: new Date(activity.timestamp),
});

export const normalizeProfile = (profile: DemoProfile): DemoProfile => ({
  ...profile,
  joinedAt: new Date(profile.joinedAt),
});

const createPlayerCompletionPost = (
  profile: DemoProfile,
  task: Task,
  timestamp: Date,
): SocialPost => ({
  id: crypto.randomUUID(),
  userId: profile.userId,
  username: profile.username,
  avatar: profile.avatar,
  content: `Locked in ${task.title.toLowerCase()} and shipped it ahead of the next review.`,
  taskId: task.id,
  taskCompleted: task.title,
  rewardEarned: calculateReward(task.value).xp,
  likes: 18,
  comments: 4,
  timestamp,
  kind: "player",
  guild: profile.guild,
});

export const createCompletionPost = (
  profile: DemoProfile,
  task: Task,
  reward: Reward,
  timestamp: Date,
): SocialPost => ({
  id: crypto.randomUUID(),
  userId: profile.userId,
  username: profile.username,
  avatar: profile.avatar,
  content: `Wrapped ${task.title.toLowerCase()} and opened up room for the next sprint.`,
  taskId: task.id,
  taskCompleted: task.title,
  rewardEarned: reward.xp,
  likes: 12,
  comments: 2,
  timestamp,
  kind: "player",
  guild: profile.guild,
  highlight: reward.items?.[0],
});

export const createLevelMilestonePost = (
  profile: DemoProfile,
  level: number,
  timestamp: Date,
): SocialPost => ({
  id: crypto.randomUUID(),
  userId: profile.userId,
  username: profile.username,
  avatar: profile.avatar,
  content: `Reached level ${level} and unlocked a steadier focus loop.`,
  likes: 24,
  comments: 6,
  timestamp,
  kind: "milestone",
  guild: profile.guild,
  highlight: `Level ${level}`,
});

export const createQuestActivity = (
  profile: DemoProfile,
  task: Task,
  timestamp: Date,
): GuildActivity => ({
  id: crypto.randomUUID(),
  name: profile.username,
  activity: `closed ${task.title.toLowerCase()}.`,
  timestamp,
  type: "quest",
  taskId: task.id,
});

export const createLevelActivity = (
  profile: DemoProfile,
  level: number,
  timestamp: Date,
): GuildActivity => ({
  id: crypto.randomUUID(),
  name: profile.username,
  activity: `leveled up to ${level}.`,
  timestamp,
  type: "levelup",
});

export const createDemoState = (): DemoSeedState => {
  const now = new Date();
  const profile: DemoProfile = {
    userId: "ari-vector",
    username: "Ari Vector",
    avatar: "AV",
    guild: "Study Warriors",
    role: "Product Builder",
    motto: "Build momentum one clear quest at a time.",
    joinedAt: subDays(now, 42),
  };

  const tasks: Task[] = [
    {
      id: "task-pitch-narrative",
      title: "Finalize pitch narrative",
      description: "Tighten the story arc for the live demo and investor Q and A.",
      value: 84,
      completed: false,
      createdAt: makeTime(now, -2, 9),
      dueDate: makeTime(now, 0, 18),
      category: "project",
      estimatedMinutes: 110,
      priority: "high",
    },
    {
      id: "task-investor-faq",
      title: "Polish investor FAQ",
      description: "Prepare crisp answers for pricing, retention, and moat questions.",
      value: 72,
      completed: false,
      createdAt: makeTime(now, -1, 11),
      dueDate: makeTime(now, 1, 11),
      category: "assignment",
      estimatedMinutes: 95,
      priority: "high",
    },
    {
      id: "task-demo-walkthrough",
      title: "Record demo walkthrough",
      description: "Capture a clean product flow video for backup during the pitch.",
      value: 61,
      completed: false,
      createdAt: makeTime(now, -1, 15),
      dueDate: makeTime(now, 1, 16),
      category: "project",
      estimatedMinutes: 75,
      priority: "medium",
    },
    {
      id: "task-onboarding-copy",
      title: "Clean onboarding copy",
      description: "Rewrite the first-run prompts so they read faster on mobile.",
      value: 38,
      completed: false,
      createdAt: makeTime(now, 0, 10),
      dueDate: makeTime(now, 2, 14),
      category: "revision",
      estimatedMinutes: 40,
      priority: "low",
    },
    {
      id: "task-insight-map",
      title: "Map interview insights",
      description: "Turn user interview notes into the final problem statement.",
      value: 63,
      completed: true,
      createdAt: makeTime(now, -5, 13),
      dueDate: makeTime(now, -3, 16),
      completedAt: makeTime(now, -3, 18),
      category: "revision",
      estimatedMinutes: 90,
      priority: "medium",
    },
    {
      id: "task-polish-sprint",
      title: "Prototype polish sprint",
      description: "Resolve visual rough edges before the internal review.",
      value: 79,
      completed: true,
      createdAt: makeTime(now, -4, 10),
      dueDate: makeTime(now, -2, 16),
      completedAt: makeTime(now, -2, 20),
      category: "project",
      estimatedMinutes: 120,
      priority: "high",
    },
    {
      id: "task-team-retro",
      title: "Team planning retro",
      description: "Align the sprint board before the final deck push.",
      value: 48,
      completed: true,
      createdAt: makeTime(now, -3, 9),
      dueDate: makeTime(now, -1, 10),
      completedAt: makeTime(now, -1, 11),
      category: "other",
      estimatedMinutes: 45,
      priority: "medium",
    },
    {
      id: "task-focus-reset",
      title: "Morning focus reset",
      description: "Start the day by clearing inbox noise and planning the next move.",
      value: 34,
      completed: true,
      createdAt: makeTime(now, -1, 17),
      dueDate: makeTime(now, 0, 8),
      completedAt: makeTime(now, 0, 8, 30),
      category: "homework",
      estimatedMinutes: 30,
      priority: "low",
    },
  ];

  const socialPosts: SocialPost[] = [
    createLevelMilestonePost(profile, 3, makeTime(now, 0, 9, 15)),
    {
      id: crypto.randomUUID(),
      userId: "luna-hart",
      username: "Luna Hart",
      avatar: "LH",
      content: "Shipped my pilot onboarding experiment and the retention slide finally clicks.",
      likes: 31,
      comments: 7,
      timestamp: makeTime(now, 0, 7, 40),
      kind: "community",
      guild: "Night Shift",
      highlight: "Pilot launch",
    },
    createPlayerCompletionPost(profile, tasks[7], makeTime(now, 0, 8, 45)),
    {
      id: crypto.randomUUID(),
      userId: "omar-vale",
      username: "Omar Vale",
      avatar: "OV",
      content: "Ran the pricing rehearsal twice. The second pass sounded much sharper.",
      likes: 22,
      comments: 5,
      timestamp: makeTime(now, -1, 18, 20),
      kind: "community",
      guild: "Launch Ops",
    },
    createPlayerCompletionPost(profile, tasks[5], makeTime(now, -2, 20, 10)),
    {
      id: crypto.randomUUID(),
      userId: "maya-lin",
      username: "Maya Lin",
      avatar: "ML",
      content: "Customer quotes are now on the deck. The story feels much more human.",
      likes: 17,
      comments: 3,
      timestamp: makeTime(now, -2, 13, 5),
      kind: "community",
      guild: "Study Warriors",
    },
  ]
    .sort((left, right) => right.timestamp.getTime() - left.timestamp.getTime())
    .slice(0, MAX_FEED_ITEMS);

  const guildActivities: GuildActivity[] = [
    {
      id: crypto.randomUUID(),
      name: "Maya Lin",
      activity: "finished deck QA and flagged two copy fixes.",
      timestamp: makeTime(now, 0, 8, 50),
      type: "focus",
    },
    createQuestActivity(profile, tasks[7], makeTime(now, 0, 8, 35)),
    createLevelActivity(profile, 3, makeTime(now, 0, 9, 15)),
    {
      id: crypto.randomUUID(),
      name: "Eli Morris",
      activity: "closed competitor benchmarking.",
      timestamp: makeTime(now, -1, 16, 40),
      type: "quest",
    },
    {
      id: crypto.randomUUID(),
      name: "Sana Cho",
      activity: "unlocked a five day focus streak.",
      timestamp: makeTime(now, -1, 12, 15),
      type: "achievement",
    },
  ]
    .sort((left, right) => right.timestamp.getTime() - left.timestamp.getTime())
    .slice(0, MAX_GUILD_ITEMS);

  return {
    profile,
    tasks,
    socialPosts,
    guildActivities,
  };
};
