import { create } from 'zustand';
import { Task, BattleSession, AppSettings, SubTask } from '../types';
import { getTasks, saveTasks, getSessions, saveSessions, getSettings, saveSettings } from '../utils/localStorage';
import { CapacitorService } from '../utils/capacitor';

interface AppState {
  tasks: Task[];
  currentSession: BattleSession | null;
  settings: AppSettings;
  battleActive: boolean;
  activeTab: 'tasks' | 'battle';
  currentTaskIndex: number;
  timeRemaining: number;
  isLoading: boolean;
  
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
  setActiveTab: (tab: 'tasks' | 'battle') => void;
  
  // Task Chop actions
  addSubTasks: (parentTaskId: string, subTasks: Omit<SubTask, 'id'>[]) => void;
  
  // Initialize data
  initializeData: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  tasks: [],
  currentSession: null,
  settings: {
    defaultSessionDuration: 20,
    soundEnabled: true,
    showAnimations: true,
    theme: 'light',
    defaultTags: ['Work', 'Personal', 'Urgent', 'Important'],
    keyboardShortcutsEnabled: true,
    geminiApiKey: '',
  },
  battleActive: false,
  activeTab: 'battle',
  currentTaskIndex: 0,
  timeRemaining: 0,
  isLoading: true,
  
  // Initialize data
  initializeData: async () => {
    try {
      const [tasks, settings] = await Promise.all([
        getTasks(),
        getSettings()
      ]);
      
      set({ tasks, settings, isLoading: false });
    } catch (error) {
      console.error('Error initializing data:', error);
      set({ isLoading: false });
    }
  },
  
  // Task actions
  addTask: async (task) => {
    await CapacitorService.hapticFeedback();
    
    const newTask: Task = {
      id: Date.now().toString(),
      completed: false,
      createdAt: new Date().toISOString(),
      subTasks: [],
      ...task,
    };
    
    set(async (state) => {
      const updatedTasks = [...state.tasks, newTask];
      await saveTasks(updatedTasks);
      return { tasks: updatedTasks };
    });
  },
  
  updateTask: async (taskId, updates) => {
    set(async (state) => {
      const updatedTasks = state.tasks.map((task) => 
        task.id === taskId ? { ...task, ...updates } : task
      );
      await saveTasks(updatedTasks);
      return { tasks: updatedTasks };
    });
  },
  
  completeTask: async (taskId) => {
    await CapacitorService.hapticFeedback();
    
    set(async (state) => {
      const updatedTasks = state.tasks.map((task) => 
        task.id === taskId 
          ? { ...task, completed: true, completedAt: new Date().toISOString() } 
          : task
      );
      await saveTasks(updatedTasks);
      return { tasks: updatedTasks };
    });
  },
  
  deleteTask: async (taskId) => {
    await CapacitorService.hapticFeedback();
    
    set(async (state) => {
      const updatedTasks = state.tasks.filter((task) => task.id !== taskId);
      await saveTasks(updatedTasks);
      return { tasks: updatedTasks };
    });
  },
  
  // Session actions
  createSession: async (duration, taskIds) => {
    const newSession: BattleSession = {
      id: Date.now().toString(),
      duration,
      taskIds,
      completed: false,
    };
    
    set(async () => {
      const sessions = await getSessions();
      const updatedSessions = [...sessions, newSession];
      await saveSessions(updatedSessions);
      return { 
        currentSession: newSession,
        timeRemaining: duration * 60, // Convert minutes to seconds
      };
    });
  },
  
  startBattle: async () => {
    await CapacitorService.hapticFeedback();
    
    set(async (state) => {
      if (!state.currentSession) return state;
      
      const updatedSession = {
        ...state.currentSession,
        startTime: new Date().toISOString(),
      };
      
      const sessions = await getSessions();
      const updatedSessions = sessions.map((session) => 
        session.id === updatedSession.id ? updatedSession : session
      );
      
      await saveSessions(updatedSessions);
      
      return {
        currentSession: updatedSession,
        battleActive: true,
        currentTaskIndex: 0,
      };
    });
  },
  
  endBattle: async (completed) => {
    await CapacitorService.hapticFeedback();
    
    set(async (state) => {
      if (!state.currentSession) return state;
      
      const updatedSession = {
        ...state.currentSession,
        endTime: new Date().toISOString(),
        completed,
      };
      
      const sessions = await getSessions();
      const updatedSessions = sessions.map((session) => 
        session.id === updatedSession.id ? updatedSession : session
      );
      
      await saveSessions(updatedSessions);
      
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
  updateSettings: async (newSettings) => {
    set(async (state) => {
      const updatedSettings = { ...state.settings, ...newSettings };
      await saveSettings(updatedSettings);
      return { settings: updatedSettings };
    });
  },
  
  // Navigation actions
  setActiveTab: (tab) => {
    set({ activeTab: tab });
  },
  
  // Task Chop actions
  addSubTasks: async (parentTaskId, subTasks) => {
    set(async (state) => {
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
      
      await saveTasks(updatedTasks);
      return { tasks: updatedTasks };
    });
  },
}));