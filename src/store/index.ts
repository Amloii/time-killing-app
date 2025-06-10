import { create } from 'zustand';
import { Task, BattleSession, AppSettings, SubTask, UserProfile, PointTransaction } from '../types';
import { getTasks, saveTasks, getSessions, saveSessions, getSettings, saveSettings, getUserProfile, saveUserProfile, getTransactions, saveTransactions } from '../utils/localStorage';
import { calculateTaskPoints } from '../utils/pointsCalculator';
import { WARRIORS } from '../utils/warriors';
import { dataSyncService } from '../utils/dataSync';
import { supabase } from '../utils/supabase';
import { useNotifications } from '../hooks/useNotifications';
import { useVibration } from '../hooks/useVibration';

interface AppState {
  tasks: Task[];
  currentSession: BattleSession | null;
  settings: AppSettings;
  userProfile: UserProfile;
  transactions: PointTransaction[];
  battleActive: boolean;
  activeTab: 'tasks' | 'battle';
  currentTaskIndex: number;
  timeRemaining: number;
  selectedBattleTasks: string[];
  lastSyncTime: number | null;
  syncInProgress: boolean;
  
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
  
  // PWA actions
  sendNotification: (title: string, options?: NotificationOptions) => void;
  triggerVibration: (pattern: number | number[]) => void;
  
  // Settings actions
  updateSettings: (settings: Partial<AppSettings>) => void;
  
  // Navigation actions
  setActiveTab: (tab: 'tasks' | 'battle') => void;
  
  // Task Chop actions
  addSubTasks: (parentTaskId: string, subTasks: Omit<SubTask, 'id'>[]) => void;
  
  // Gamification actions
  awardPoints: (taskId: string, completedEarly?: boolean) => { pointsBreakdown: any; newStreak: number };
  purchaseWarrior: (warriorId: string) => void;
  setActiveWarrior: (warriorId: string) => void;
  updateStreak: () => void;
  
  // Battle task selection
  addToBattleSelection: (taskId: string) => void;
  removeFromBattleSelection: (taskId: string) => void;
  clearBattleSelection: () => void;
  
  // Sync actions
  syncWithSupabase: () => Promise<void>;
  clearLocalData: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  tasks: getTasks(),
  currentSession: null,
  settings: getSettings(),
  userProfile: getUserProfile(),
  transactions: getTransactions(),
  battleActive: false,
  activeTab: 'battle',
  currentTaskIndex: 0,
  timeRemaining: 0,
  selectedBattleTasks: [],
  lastSyncTime: null,
  syncInProgress: false,
  
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
      
      // Sync to cloud if authenticated
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          dataSyncService.addTaskToCloud(newTask);
        }
      });
      
      return { tasks: updatedTasks };
    });
  },
  
  updateTask: (taskId, updates) => {
    set((state) => {
      const updatedTasks = state.tasks.map((task) => 
        task.id === taskId ? { ...task, ...updates } : task
      );
      saveTasks(updatedTasks);
      
      // Sync to cloud if authenticated
      const updatedTask = updatedTasks.find(t => t.id === taskId);
      if (updatedTask) {
        supabase.auth.getUser().then(({ data: { user } }) => {
          if (user) {
            dataSyncService.updateTaskInCloud(updatedTask);
          }
        });
      }
      
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
      
      // Sync to cloud if authenticated
      const completedTask = updatedTasks.find(t => t.id === taskId);
      if (completedTask) {
        supabase.auth.getUser().then(({ data: { user } }) => {
          if (user) {
            dataSyncService.updateTaskInCloud(completedTask);
          }
        });
      }
      
      return { tasks: updatedTasks };
    });
  },
  
  deleteTask: (taskId) => {
    set((state) => {
      const updatedTasks = state.tasks.filter((task) => task.id !== taskId);
      saveTasks(updatedTasks);
      
      // Sync to cloud if authenticated
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          dataSyncService.deleteTaskFromCloud(taskId);
        }
      });
      
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
      
      // Sync to cloud if authenticated
      const updatedTask = updatedTasks.find(t => t.id === parentTaskId);
      if (updatedTask) {
        supabase.auth.getUser().then(({ data: { user } }) => {
          if (user) {
            dataSyncService.updateTaskInCloud(updatedTask);
          }
        });
      }
      
      return { tasks: updatedTasks };
    });
  },
  
  // Gamification actions
  awardPoints: (taskId, completedEarly = false) => {
    const state = get();
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return { pointsBreakdown: null, newStreak: 0 };
    
    // Update streak
    const today = new Date().toDateString();
    const lastCompletion = state.userProfile.lastCompletionDate;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    let newStreak = 1;
    if (lastCompletion) {
      const lastDate = new Date(lastCompletion).toDateString();
      if (lastDate === today) {
        // Already completed today, don't update streak
        newStreak = state.userProfile.streak;
      } else if (lastDate === yesterday.toDateString()) {
        // Consecutive day
        newStreak = state.userProfile.streak + 1;
      }
    }
    
    const pointsBreakdown = calculateTaskPoints(task, completedEarly, newStreak);
    
    // Create transaction
    const transaction: PointTransaction = {
      id: Date.now().toString(),
      type: 'earned',
      amount: pointsBreakdown.total,
      reason: `Completed task: ${task.title}`,
      taskId: task.id,
      timestamp: new Date().toISOString(),
    };
    
    const updatedProfile: UserProfile = {
      ...state.userProfile,
      points: state.userProfile.points + pointsBreakdown.total,
      streak: newStreak,
      lastCompletionDate: today,
      totalTasksCompleted: state.userProfile.totalTasksCompleted + 1,
    };
    
    const updatedTransactions = [...state.transactions, transaction];
    
    saveUserProfile(updatedProfile);
    saveTransactions(updatedTransactions);
    
    // Sync to cloud if authenticated
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        dataSyncService.updateProfileInCloud(updatedProfile);
        dataSyncService.addTransactionToCloud(transaction);
      }
    });
    
    set({
      userProfile: updatedProfile,
      transactions: updatedTransactions,
    });
    
    return { pointsBreakdown, newStreak };
  },
  
  purchaseWarrior: (warriorId) => {
    const state = get();
    const warrior = WARRIORS.find(w => w.id === warriorId);
    if (!warrior || state.userProfile.points < warrior.cost) return;
    
    const transaction: PointTransaction = {
      id: Date.now().toString(),
      type: 'spent',
      amount: warrior.cost,
      reason: `Purchased warrior: ${warrior.name}`,
      timestamp: new Date().toISOString(),
    };
    
    const updatedProfile: UserProfile = {
      ...state.userProfile,
      points: state.userProfile.points - warrior.cost,
      ownedWarriors: [...state.userProfile.ownedWarriors, warriorId],
      activeWarrior: state.userProfile.ownedWarriors.length === 0 ? warriorId : state.userProfile.activeWarrior,
    };
    
    const updatedTransactions = [...state.transactions, transaction];
    
    saveUserProfile(updatedProfile);
    saveTransactions(updatedTransactions);
    
    // Sync to cloud if authenticated
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        dataSyncService.updateProfileInCloud(updatedProfile);
        dataSyncService.addTransactionToCloud(transaction);
      }
    });
    
    set({
      userProfile: updatedProfile,
      transactions: updatedTransactions,
    });
  },
  
  setActiveWarrior: (warriorId) => {
    const state = get();
    if (!state.userProfile.ownedWarriors.includes(warriorId)) return;
    
    const updatedProfile: UserProfile = {
      ...state.userProfile,
      activeWarrior: warriorId,
    };
    
    saveUserProfile(updatedProfile);
    
    // Sync to cloud if authenticated
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        dataSyncService.updateProfileInCloud(updatedProfile);
      }
    });
    
    set({ userProfile: updatedProfile });
  },
  
  // Battle task selection
  addToBattleSelection: (taskId) => {
    set((state) => ({
      selectedBattleTasks: state.selectedBattleTasks.includes(taskId)
        ? state.selectedBattleTasks
        : [...state.selectedBattleTasks, taskId]
    }));
  },
  
  removeFromBattleSelection: (taskId) => {
    set((state) => ({
      selectedBattleTasks: state.selectedBattleTasks.filter(id => id !== taskId)
    }));
  },
  
  clearBattleSelection: () => {
    set({ selectedBattleTasks: [] });
  },
  
  updateStreak: () => {
    const state = get();
    const today = new Date().toDateString();
    const lastCompletion = state.userProfile.lastCompletionDate;
    
    if (!lastCompletion) return;
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const lastDate = new Date(lastCompletion).toDateString();
    
    // Reset streak if more than a day has passed
    if (lastDate !== today && lastDate !== yesterday.toDateString()) {
      const updatedProfile: UserProfile = {
        ...state.userProfile,
        streak: 0,
      };
      
      saveUserProfile(updatedProfile);
      
      // Sync to cloud if authenticated
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          dataSyncService.updateProfileInCloud(updatedProfile);
        }
      });
      
      set({ userProfile: updatedProfile });
    }
  },
  
  // Sync actions
  syncWithSupabase: async () => {
    const state = get();
    if (state.syncInProgress) return;
    
    set({ syncInProgress: true });
    
    try {
      // Sync profile
      const syncedProfile = await dataSyncService.syncProfile(state.userProfile);
      if (syncedProfile) {
        saveUserProfile(syncedProfile);
        set({ userProfile: syncedProfile });
      }
      
      // Sync tasks
      const syncedTasks = await dataSyncService.syncTasks(state.tasks);
      saveTasks(syncedTasks);
      set({ tasks: syncedTasks });
      
      // Sync transactions
      const syncedTransactions = await dataSyncService.syncTransactions(state.transactions);
      saveTransactions(syncedTransactions);
      set({ transactions: syncedTransactions });
      
      set({ lastSyncTime: Date.now() });
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      set({ syncInProgress: false });
    }
  },
  
  clearLocalData: () => {
    localStorage.clear();
    set({
      tasks: [],
      userProfile: getUserProfile(),
      transactions: [],
      selectedBattleTasks: [],
      lastSyncTime: null,
    });
  },
}));