import { Task, BattleSession, AppSettings } from '../types';

const TASKS_KEY = 'fight-mode-tasks';
const SESSIONS_KEY = 'fight-mode-sessions';
const SETTINGS_KEY = 'fight-mode-settings';

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
      };
};

export const saveSettings = (settings: AppSettings): void => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};