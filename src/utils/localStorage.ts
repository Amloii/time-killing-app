import { Task, BattleSession, AppSettings } from '../types';
import { CapacitorService } from './capacitor';

const TASKS_KEY = 'fight-mode-tasks';
const SESSIONS_KEY = 'fight-mode-sessions';
const SETTINGS_KEY = 'fight-mode-settings';

// Tasks
export const getTasks = async (): Promise<Task[]> => {
  const tasks = await CapacitorService.getItem(TASKS_KEY);
  return tasks ? JSON.parse(tasks) : [];
};

export const saveTasks = async (tasks: Task[]): Promise<void> => {
  await CapacitorService.setItem(TASKS_KEY, JSON.stringify(tasks));
};

// Battle Sessions
export const getSessions = async (): Promise<BattleSession[]> => {
  const sessions = await CapacitorService.getItem(SESSIONS_KEY);
  return sessions ? JSON.parse(sessions) : [];
};

export const saveSessions = async (sessions: BattleSession[]): Promise<void> => {
  await CapacitorService.setItem(SESSIONS_KEY, JSON.stringify(sessions));
};

// Settings
export const getSettings = async (): Promise<AppSettings> => {
  const settings = await CapacitorService.getItem(SETTINGS_KEY);
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

export const saveSettings = async (settings: AppSettings): Promise<void> => {
  await CapacitorService.setItem(SETTINGS_KEY, JSON.stringify(settings));
};