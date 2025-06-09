/*
  # Authentication and User Data Schema

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `points` (integer)
      - `level` (integer)
      - `streak` (integer)
      - `last_completion_date` (date)
      - `total_tasks_completed` (integer)
      - `owned_warriors` (text array)
      - `active_warrior` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `user_tasks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `title` (text)
      - `description` (text)
      - `estimated_time` (integer)
      - `difficulty` (integer)
      - `completed` (boolean)
      - `tags` (text array)
      - `sub_tasks` (jsonb)
      - `created_at` (timestamp)
      - `completed_at` (timestamp)
      - `updated_at` (timestamp)

    - `user_transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `type` (text)
      - `amount` (integer)
      - `reason` (text)
      - `task_id` (uuid)
      - `created_at` (timestamp)

    - `user_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `duration` (integer)
      - `task_ids` (text array)
      - `completed` (boolean)
      - `start_time` (timestamp)
      - `end_time` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
*/

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  points integer DEFAULT 0,
  level integer DEFAULT 0,
  streak integer DEFAULT 0,
  last_completion_date date,
  total_tasks_completed integer DEFAULT 0,
  owned_warriors text[] DEFAULT '{}',
  active_warrior text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User Tasks Table
CREATE TABLE IF NOT EXISTS user_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  estimated_time integer,
  difficulty integer NOT NULL CHECK (difficulty >= 1 AND difficulty <= 5),
  completed boolean DEFAULT false,
  tags text[] DEFAULT '{}',
  sub_tasks jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  updated_at timestamptz DEFAULT now()
);

-- User Transactions Table
CREATE TABLE IF NOT EXISTS user_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('earned', 'spent')),
  amount integer NOT NULL,
  reason text NOT NULL,
  task_id uuid,
  created_at timestamptz DEFAULT now()
);

-- User Sessions Table
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  duration integer NOT NULL,
  task_ids text[] DEFAULT '{}',
  completed boolean DEFAULT false,
  start_time timestamptz,
  end_time timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policies for user_tasks
CREATE POLICY "Users can read own tasks"
  ON user_tasks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks"
  ON user_tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
  ON user_tasks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
  ON user_tasks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for user_transactions
CREATE POLICY "Users can read own transactions"
  ON user_transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON user_transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for user_sessions
CREATE POLICY "Users can read own sessions"
  ON user_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON user_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON user_sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON user_tasks
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();