export interface Task {
  id: string;
  title: string;
  description?: string;
  estimatedTime?: number; // in minutes
  difficulty: 1 | 2 | 3 | 4 | 5;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  tags?: string[];
  subTasks?: SubTask[];
}

export interface BattleSession {
  id: string;
  duration: number; // in minutes
  startTime?: string;
  endTime?: string;
  taskIds: string[];
  completed: boolean;
}

export interface AppSettings {
  defaultSessionDuration: number;
  soundEnabled: boolean;
  showAnimations: boolean;
  theme: 'light' | 'dark';
  defaultTags: string[];
  keyboardShortcutsEnabled: boolean;
}

export type TaskType = 'Research' | 'Development' | 'Design' | 'Testing' | 'Documentation';

export interface SubTask {
  id: string;
  description: string;
  summary: string;
  estimatedTime: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  type: TaskType;
  parentTaskId?: string;
}

export interface UserProfile {
  id: string;
  points: number;
  level: number;
  streak: number;
  lastCompletionDate?: string;
  totalTasksCompleted: number;
  ownedWarriors: string[];
  activeWarrior?: string;
  geminiApiKey?: string;
}

export type WarriorRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';

export interface Warrior {
  id: string;
  name: string;
  rarity: WarriorRarity;
  cost: number;
  description: string;
  imageUrl: string;
  animationUrl: string;
  unlocked: boolean;
}

export interface PointTransaction {
  id: string;
  type: 'earned' | 'spent';
  amount: number;
  reason: string;
  taskId?: string;
  timestamp: string;
}