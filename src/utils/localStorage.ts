import { Task, BattleSession, AppSettings } from '../types';
import { UserProfile, PointTransaction } from '../types';

const TASKS_KEY = 'fight-mode-tasks';
const SESSIONS_KEY = 'fight-mode-sessions';
const SETTINGS_KEY = 'fight-mode-settings';
const PROFILE_KEY = 'fight-mode-profile';
const TRANSACTIONS_KEY = 'fight-mode-transactions';

// Tasks
export const getTasks = (): Task[] => {
  const tasks = localStorage.getItem(TASKS_KEY);
  return tasks ? JSON.parse(tasks) : [];
};

export const saveTasks = (tasks: Task[]): void => {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

// Battle Sessions
export const getSessions = (): BattleSession[] => {
  const sessions = localStorage.getItem(SESSIONS_KEY);
  return sessions ? JSON.parse(sessions) : [];
};

export const saveSessions = (sessions: BattleSession[]): void => {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
};

// Settings
export const getSettings = (): AppSettings => {
  const settings = localStorage.getItem(SETTINGS_KEY);
  return settings
    ? JSON.parse(settings)
    : {
        defaultSessionDuration: 20,
        soundEnabled: true,
        showAnimations: true,
        theme: 'light',
        defaultTags: ['Work', 'Personal', 'Urgent', 'Important'],
        keyboardShortcutsEnabled: true,
        geminiApiKey: '',
      };
};

export const saveSettings = (settings: AppSettings): void => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

// User Profile
export const getUserProfile = (): UserProfile => {
  const profile = localStorage.getItem(PROFILE_KEY);
  return profile
    ? JSON.parse(profile)
    : {
        id: Date.now().toString(),
        points: 0,
        level: 0,
        streak: 0,
        totalTasksCompleted: 0,
        ownedWarriors: [],
      };
};

export const saveUserProfile = (profile: UserProfile): void => {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

// Point Transactions
export const getTransactions = (): PointTransaction[] => {
  const transactions = localStorage.getItem(TRANSACTIONS_KEY);
  return transactions ? JSON.parse(transactions) : [];
};

export const saveTransactions = (transactions: PointTransaction[]): void => {
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
};