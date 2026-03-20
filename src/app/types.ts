export interface Task {
  id: string;
  title: string;
  description?: string;
  value: number;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
  category: 'homework' | 'revision' | 'assignment' | 'project' | 'other';
  deadline?: Date;
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
  currentStreak: number;
  totalValue: number;
}

export interface OmlomState {
  mode: 'normal' | 'stressed' | 'happy' | 'evolved';
  workloadLevel: number; // 0-100
  mood: string;
  currentAura: string;
}

export interface Accessory {
  id: string;
  name: string;
  type: 'hat' | 'glasses' | 'scarf' | 'crown' | 'wings' | 'pet';
  emoji: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  cost: number; // in gold
  unlocked: boolean;
  equipped: boolean;
}

export interface SocialPost {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  content: string;
  taskCompleted?: string;
  rewardEarned?: number;
  likes: number;
  comments: number;
  timestamp: Date;
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
}