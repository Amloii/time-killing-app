import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface DatabaseUserProfile {
  id: string;
  email: string;
  points: number;
  level: number;
  streak: number;
  last_completion_date?: string;
  total_tasks_completed: number;
  owned_warriors: string[];
  active_warrior?: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseTask {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  estimated_time?: number;
  difficulty: number;
  completed: boolean;
  tags: string[];
  sub_tasks: any[];
  created_at: string;
  completed_at?: string;
  updated_at: string;
}

export interface DatabaseTransaction {
  id: string;
  user_id: string;
  type: 'earned' | 'spent';
  amount: number;
  reason: string;
  task_id?: string;
  created_at: string;
}

export interface DatabaseSession {
  id: string;
  user_id: string;
  duration: number;
  task_ids: string[];
  completed: boolean;
  start_time?: string;
  end_time?: string;
  created_at: string;
}