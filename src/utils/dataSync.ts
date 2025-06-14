import { supabase, DatabaseUserProfile, DatabaseTask, DatabaseTransaction, DatabaseSession } from './supabase';
import { Task, UserProfile, PointTransaction, BattleSession } from '../types';
import { toast } from 'sonner';

export class DataSyncService {
  // Convert local task to database format
  private taskToDatabase(task: Task, userId: string): Omit<DatabaseTask, 'id' | 'created_at' | 'updated_at'> {
    return {
      user_id: userId,
      title: task.title,
      description: task.description,
      estimated_time: task.estimatedTime,
      difficulty: task.difficulty,
      completed: task.completed,
      tags: task.tags || [],
      sub_tasks: task.subTasks || [],
      completed_at: task.completedAt,
    };
  }

  // Convert database task to local format
  private taskFromDatabase(dbTask: DatabaseTask): Task {
    return {
      id: dbTask.id,
      title: dbTask.title,
      description: dbTask.description,
      estimatedTime: dbTask.estimated_time,
      difficulty: dbTask.difficulty as 1 | 2 | 3 | 4 | 5,
      completed: dbTask.completed,
      tags: dbTask.tags,
      subTasks: dbTask.sub_tasks,
      createdAt: dbTask.created_at,
      completedAt: dbTask.completed_at,
    };
  }

  // Convert local profile to database format
  private profileToDatabase(profile: UserProfile): Omit<DatabaseUserProfile, 'id' | 'email' | 'created_at' | 'updated_at'> {
    return {
      points: profile.points,
      level: profile.level,
      streak: profile.streak,
      last_completion_date: profile.lastCompletionDate,
      total_tasks_completed: profile.totalTasksCompleted,
      owned_warriors: profile.ownedWarriors,
      active_warrior: profile.activeWarrior,
      gemini_api_key: profile.geminiApiKey,
    };
  }

  // Convert database profile to local format
  private profileFromDatabase(dbProfile: DatabaseUserProfile): UserProfile {
    return {
      id: dbProfile.id,
      points: dbProfile.points,
      level: dbProfile.level,
      streak: dbProfile.streak,
      lastCompletionDate: dbProfile.last_completion_date,
      totalTasksCompleted: dbProfile.total_tasks_completed,
      ownedWarriors: dbProfile.owned_warriors,
      activeWarrior: dbProfile.active_warrior,
      geminiApiKey: dbProfile.gemini_api_key,
    };
  }

  // Sync user profile
  async syncProfile(localProfile: UserProfile): Promise<UserProfile | null> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return null;

      // First, try to get existing profile
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.user.id)
        .single();

      if (existingProfile) {
        // Merge local and cloud data (cloud takes precedence for conflicts)
        const mergedProfile = this.mergeProfiles(localProfile, this.profileFromDatabase(existingProfile));
        
        // Update cloud with merged data
        const { error } = await supabase
          .from('user_profiles')
          .update(this.profileToDatabase(mergedProfile))
          .eq('id', user.user.id);

        if (error) throw error;
        return mergedProfile;
      } else {
        // Create new profile in cloud
        const { error } = await supabase
          .from('user_profiles')
          .insert({
            id: user.user.id,
            email: user.user.email!,
            ...this.profileToDatabase(localProfile),
          });

        if (error) throw error;
        return localProfile;
      }
    } catch (error) {
      console.error('Error syncing profile:', error);
      toast.error('Failed to sync profile');
      return null;
    }
  }

  // Sync tasks
  async syncTasks(localTasks: Task[]): Promise<Task[]> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return localTasks;

      // Get cloud tasks
      const { data: cloudTasks, error } = await supabase
        .from('user_tasks')
        .select('*')
        .eq('user_id', user.user.id);

      if (error) throw error;

      const cloudTasksLocal = cloudTasks?.map(this.taskFromDatabase) || [];
      const mergedTasks = this.mergeTasks(localTasks, cloudTasksLocal);

      // Update cloud with merged tasks
      await this.updateCloudTasks(mergedTasks, user.user.id);

      return mergedTasks;
    } catch (error) {
      console.error('Error syncing tasks:', error);
      toast.error('Failed to sync tasks');
      return localTasks;
    }
  }

  // Sync transactions
  async syncTransactions(localTransactions: PointTransaction[]): Promise<PointTransaction[]> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return localTransactions;

      // Get cloud transactions
      const { data: cloudTransactions, error } = await supabase
        .from('user_transactions')
        .select('*')
        .eq('user_id', user.user.id);

      if (error) throw error;

      const cloudTransactionsLocal = cloudTransactions?.map((t: DatabaseTransaction): PointTransaction => ({
        id: t.id,
        type: t.type,
        amount: t.amount,
        reason: t.reason,
        taskId: t.task_id,
        timestamp: t.created_at,
      })) || [];

      const mergedTransactions = this.mergeTransactions(localTransactions, cloudTransactionsLocal);

      // Update cloud with new local transactions
      const newTransactions = localTransactions.filter(
        local => !cloudTransactionsLocal.some(cloud => cloud.id === local.id)
      );

      if (newTransactions.length > 0) {
        const { error: insertError } = await supabase
          .from('user_transactions')
          .insert(
            newTransactions.map(t => ({
              id: t.id,
              user_id: user.user.id,
              type: t.type,
              amount: t.amount,
              reason: t.reason,
              task_id: t.taskId,
              created_at: t.timestamp,
            }))
          );

        if (insertError) throw insertError;
      }

      return mergedTransactions;
    } catch (error) {
      console.error('Error syncing transactions:', error);
      toast.error('Failed to sync transactions');
      return localTransactions;
    }
  }

  // Helper methods for merging data
  private mergeProfiles(local: UserProfile, cloud: UserProfile): UserProfile {
    // Cloud data takes precedence, but we keep the higher values for points and tasks
    return {
      ...cloud,
      points: Math.max(local.points, cloud.points),
      totalTasksCompleted: Math.max(local.totalTasksCompleted, cloud.totalTasksCompleted),
      ownedWarriors: [...new Set([...local.ownedWarriors, ...cloud.ownedWarriors])],
      streak: Math.max(local.streak, cloud.streak),
      // For API key, prefer local if cloud doesn't have one, otherwise use cloud
      geminiApiKey: cloud.geminiApiKey || local.geminiApiKey,
      openaiApiKey: cloud.openaiApiKey || local.openaiApiKey,
      llmProvider: cloud.llmProvider || local.llmProvider,
      llmSettings: cloud.llmSettings || local.llmSettings,
    };
  }

  private mergeTasks(local: Task[], cloud: Task[]): Task[] {
    const merged = new Map<string, Task>();

    // Add all cloud tasks first
    cloud.forEach(task => merged.set(task.id, task));

    // Add or update with local tasks
    local.forEach(localTask => {
      const cloudTask = merged.get(localTask.id);
      if (!cloudTask) {
        // New local task
        merged.set(localTask.id, localTask);
      } else {
        // Merge task data - prefer more recent updates
        const localDate = new Date(localTask.createdAt);
        const cloudDate = new Date(cloudTask.createdAt);
        
        if (localDate > cloudDate || localTask.completed !== cloudTask.completed) {
          merged.set(localTask.id, localTask);
        }
      }
    });

    return Array.from(merged.values());
  }

  private mergeTransactions(local: PointTransaction[], cloud: PointTransaction[]): PointTransaction[] {
    const merged = new Map<string, PointTransaction>();

    // Add all transactions, cloud first then local (local overwrites if same ID)
    cloud.forEach(t => merged.set(t.id, t));
    local.forEach(t => merged.set(t.id, t));

    return Array.from(merged.values()).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  private async updateCloudTasks(tasks: Task[], userId: string) {
    // Delete all existing tasks and insert merged ones
    await supabase.from('user_tasks').delete().eq('user_id', userId);

    if (tasks.length > 0) {
      const { error } = await supabase
        .from('user_tasks')
        .insert(
          tasks.map(task => ({
            id: task.id,
            ...this.taskToDatabase(task, userId),
            created_at: task.createdAt,
            completed_at: task.completedAt,
          }))
        );

      if (error) throw error;
    }
  }

  // Add new task to cloud
  async addTaskToCloud(task: Task): Promise<void> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { error } = await supabase
        .from('user_tasks')
        .insert({
          id: task.id,
          ...this.taskToDatabase(task, user.user.id),
          created_at: task.createdAt,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error adding task to cloud:', error);
    }
  }

  // Update task in cloud
  async updateTaskInCloud(task: Task): Promise<void> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { error } = await supabase
        .from('user_tasks')
        .update({
          ...this.taskToDatabase(task, user.user.id),
          completed_at: task.completedAt,
        })
        .eq('id', task.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating task in cloud:', error);
    }
  }

  // Delete task from cloud
  async deleteTaskFromCloud(taskId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting task from cloud:', error);
    }
  }

  // Add transaction to cloud
  async addTransactionToCloud(transaction: PointTransaction): Promise<void> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { error } = await supabase
        .from('user_transactions')
        .insert({
          id: transaction.id,
          user_id: user.user.id,
          type: transaction.type,
          amount: transaction.amount,
          reason: transaction.reason,
          task_id: transaction.taskId,
          created_at: transaction.timestamp,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error adding transaction to cloud:', error);
    }
  }

  // Update profile in cloud
  async updateProfileInCloud(profile: UserProfile): Promise<void> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { error } = await supabase
        .from('user_profiles')
        .update(this.profileToDatabase(profile))
        .eq('id', user.user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating profile in cloud:', error);
    }
  }
}

export const dataSyncService = new DataSyncService();