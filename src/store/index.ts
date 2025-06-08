import { create } from 'zustand';
import { Task, BattleSession, AppSettings, SubTask, UserProfile, PointTransaction } from '../types';
import { getTasks, saveTasks, getSessions, saveSessions, getSettings, saveSettings, getUserProfile, saveUserProfile, getTransactions, saveTransactions } from '../utils/localStorage';
import { calculateTaskPoints } from '../utils/pointsCalculator';
import { WARRIORS } from '../utils/warriors';

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
  
  // Gamification actions
  awardPoints: (taskId: string, completedEarly?: boolean) => { pointsBreakdown: any; newStreak: number };
  purchaseWarrior: (warriorId: string) => void;
  setActiveWarrior: (warriorId: string) => void;
  updateStreak: () => void;
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
    set({ userProfile: updatedProfile });
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
      set({ userProfile: updatedProfile });
    }
  },
}));