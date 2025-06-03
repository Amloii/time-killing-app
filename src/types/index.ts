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