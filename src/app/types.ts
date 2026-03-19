export type TaskCategory =
  | "homework"
  | "revision"
  | "assignment"
  | "project"
  | "other";

export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description?: string;
  value: number;
  completed: boolean;
  createdAt: Date;
  dueDate: Date;
  completedAt?: Date;
  category: TaskCategory;
  estimatedMinutes: number;
  priority: TaskPriority;
}

export interface Reward {
  gold: number;
  xp: number;
  auraShards: number;
  items?: string[];
}

export interface UserStats {
  level: number;
  xp: number;
  nextLevelXp: number;
  gold: number;
  auraShards: number;
  tasksCompleted: number;
  questsCreated: number;
  currentStreak: number;
  bestStreak: number;
  totalValue: number;
  focusMinutes: number;
  weeklyGoalMinutes: number;
  weeklyFocusMinutes: number;
  weeklyXp: number;
  completionRate: number;
}

export interface OmlomState {
  mode: "normal" | "stressed" | "happy" | "evolved";
  workloadLevel: number;
  mood: string;
  currentAura: "blue" | "red" | "rainbow" | "gold";
}

export interface SocialPost {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  content: string;
  taskId?: string;
  taskCompleted?: string;
  rewardEarned?: number;
  likes: number;
  comments: number;
  timestamp: Date;
  kind: "community" | "player" | "milestone";
  guild?: string;
  highlight?: string;
  likedByViewer?: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar: string;
  level: number;
  xp: number;
  tasksCompleted: number;
  guild?: string;
  streak: number;
  weeklyXp: number;
  focusMinutes: number;
  isPlayer?: boolean;
}

export interface GuildActivity {
  id: string;
  name: string;
  activity: string;
  timestamp: Date;
  type: "focus" | "levelup" | "quest" | "achievement";
  taskId?: string;
}

export interface DemoProfile {
  userId: string;
  username: string;
  avatar: string;
  guild: string;
  role: string;
  motto: string;
  joinedAt: Date;
}

export interface DailyMomentum {
  date: string;
  label: string;
  xp: number;
  completions: number;
  focusMinutes: number;
  plannedValue: number;
}
