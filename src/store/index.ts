import { create } from 'zustand';
import { Task, BattleSession, AppSettings, SubTask } from '../types';
import { getTasks, saveTasks, getSessions, saveSessions, getSettings, saveSettings } from '../utils/localStorage';

interface AppState {
  tasks: Task[];
  currentSession: BattleSession | null;
  settings: AppSettings;
  battleActive: boolean;
  activeTab: 'tasks' | 'battle' | 'chop';
  currentTaskIndex: number;
  timeRemaining: number;
  
  // Task actions
  addTask: (task: Omit<Task, 'id' | 'completed' | 'createdAt'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  completeTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  
  // Session actions
  createSession: (duration: number, taskIds: string[]) => void;
  startBattle: () => void;
  endBattle: (completed: boolean) => void;
  nextTask: () => void;
  
  // Settings actions
  updateSettings: (settings: Partial<AppSettings>) => void;
  
  // Navigation actions
  setActiveTab: (tab: 'tasks' | 'battle' | 'chop') => void;
  
  // Task Chop actions
  addSubTasks: (parentTaskId: string, subTasks: Omit<SubTask, 'id'>[]) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  tasks: getTasks(),
  currentSession: null,
  settings: getSettings(),
  battleActive: false,
  activeTab: 'battle',
  currentTaskIndex: 0,
  timeRemaining: 0,
  
  // Task actions
  addTask: (task) => {
    const newTask: Task = {
      id: Date.now().toString(),
      completed: false,
      createdAt: new Date().toISOString(),
      subTasks: [],
      ...task,
    };
    
    set((state) => {
      const updatedTasks = [...state.tasks, newTask];
      saveTasks(updatedTasks);
      return { tasks: updatedTasks };
    });
  },
  
  updateTask: (taskId, updates) => {
    set((state) => {
      const updatedTasks = state.tasks.map((task) => 
        task.id === taskId ? { ...task, ...updates } : task
      );
      saveTasks(updatedTasks);
      return { tasks: updatedTasks };
    });
  },
  
  completeTask: (taskId) => {
    set((state) => {
      const updatedTasks = state.tasks.map((task) => 
        task.id === taskId 
          ? { ...task, completed: true, completedAt: new Date().toISOString() } 
          : task
      );
      saveTasks(updatedTasks);
      return { tasks: updatedTasks };
    });
  },
  
  deleteTask: (taskId) => {
    set((state) => {
      const updatedTasks = state.tasks.filter((task) => task.id !== taskId);
      saveTasks(updatedTasks);
      return { tasks: updatedTasks };
    });
  },
  
  // Session actions
  createSession: (duration, taskIds) => {
    const newSession: BattleSession = {
      id: Date.now().toString(),
      duration,
      taskIds,
      completed: false,
    };
    
    set(() => {
      const sessions = getSessions();
      const updatedSessions = [...sessions, newSession];
      saveSessions(updatedSessions);
      return { 
        currentSession: newSession,
        timeRemaining: duration * 60, // Convert minutes to seconds
      };
    });
  },
  
  startBattle: () => {
    set((state) => {
      if (!state.currentSession) return state;
      
      const updatedSession = {
        ...state.currentSession,
        startTime: new Date().toISOString(),
      };
      
      const sessions = getSessions();
      const updatedSessions = sessions.map((session) => 
        session.id === updatedSession.id ? updatedSession : session
      );
      
      saveSessions(updatedSessions);
      
      return {
        currentSession: updatedSession,
        battleActive: true,
        currentTaskIndex: 0,
      };
    });
  },
  
  endBattle: (completed) => {
    set((state) => {
      if (!state.currentSession) return state;
      
      const updatedSession = {
        ...state.currentSession,
        endTime: new Date().toISOString(),
        completed,
      };
      
      const sessions = getSessions();
      const updatedSessions = sessions.map((session) => 
        session.id === updatedSession.id ? updatedSession : session
      );
      
      saveSessions(updatedSessions);
      
      return {
        currentSession: null,
        battleActive: false,
      };
    });
  },
  
  nextTask: () => {
    set((state) => {
      const { currentTaskIndex, currentSession } = state;
      if (!currentSession) return state;
      
      const nextIndex = currentTaskIndex + 1;
      const isLastTask = nextIndex >= currentSession.taskIds.length;
      
      if (isLastTask) {
        return {
          battleActive: false,
          currentTaskIndex: 0,
        };
      }
      
      return {
        currentTaskIndex: nextIndex,
      };
    });
  },
  
  // Settings actions
  updateSettings: (newSettings) => {
    set((state) => {
      const updatedSettings = { ...state.settings, ...newSettings };
      saveSettings(updatedSettings);
      return { settings: updatedSettings };
    });
  },
  
  // Navigation actions
  setActiveTab: (tab) => {
    set({ activeTab: tab });
  },
  
  // Task Chop actions
  addSubTasks: (parentTaskId, subTasks) => {
    set((state) => {
      const updatedTasks = state.tasks.map((task) => {
        if (task.id === parentTaskId) {
          const newSubTasks = subTasks.map((subTask) => ({
            ...subTask,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            parentTaskId,
          }));
          
          return {
            ...task,
            subTasks: [...(task.subTasks || []), ...newSubTasks],
          };
        }
        return task;
      });
      
      saveTasks(updatedTasks);
      return { tasks: updatedTasks };
    });
  },
}));