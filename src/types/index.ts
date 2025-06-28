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
  ownedPets?: string[];
  activeWarrior?: string;
  activePet?: string;
  warriorPetPairings: { [warriorId: string]: string }; // warrior ID -> pet ID mapping
  llmProvider?: 'gemini' | 'openai';
  geminiApiKey?: string;
  openaiApiKey?: string;
  llmSettings?: LLMSettings;
}

export interface LLMSettings {
  temperature: number;
  maxTokens: number;
  model: string;
  outputFormat: 'json' | 'text';
  enableUsageMonitoring: boolean;
}

export interface LLMProvider {
  id: 'gemini' | 'openai';
  name: string;
  models: LLMModel[];
  maxTokens: number;
  defaultModel: string;
}

export interface LLMModel {
  id: string;
  name: string;
  maxTokens: number;
  costPer1kTokens: number;
}

export interface LLMUsage {
  provider: 'gemini' | 'openai';
  model: string;
  tokensUsed: number;
  cost: number;
  timestamp: string;
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

export interface Pet {
  id: string;
  name: string;
  type: 'Dragon' | 'Phoenix' | 'Tiger' | 'Wolf' | 'Eagle' | 'Turtle';
  rarity: WarriorRarity;
  cost: number;
  description: string;
  imageUrl: string;
  animationUrl: string;
  abilities: string[];
  compatibleWarriors: string[]; // warrior IDs this pet can pair with
}

export interface WarriorPetPair {
  warriorId: string;
  petId: string;
  bondLevel: number; // 1-5, affects battle bonuses
  unlockedAt: string;
}