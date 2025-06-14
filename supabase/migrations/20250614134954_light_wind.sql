/*
  # Add Gemini API Key to User Profiles

  1. Schema Changes
    - Add `gemini_api_key` column to `user_profiles` table
    - Column is encrypted and nullable

  2. Security
    - Maintain existing RLS policies
    - API key is only accessible by the profile owner
*/

-- Add gemini_api_key column to user_profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'gemini_api_key'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN gemini_api_key text;
  END IF;
END $$;