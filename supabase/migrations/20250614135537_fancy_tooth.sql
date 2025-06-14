/*
  # Add LLM Provider Fields to User Profiles

  1. New Columns
    - `openai_api_key` (text) - OpenAI API key
    - `llm_provider` (text) - Selected LLM provider ('gemini' or 'openai')
    - `llm_settings` (jsonb) - LLM configuration settings

  2. Updates
    - Add new columns to user_profiles table
    - Ensure backward compatibility with existing data
*/

-- Add OpenAI API key column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'openai_api_key'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN openai_api_key text;
  END IF;
END $$;

-- Add LLM provider column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'llm_provider'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN llm_provider text CHECK (llm_provider IN ('gemini', 'openai'));
  END IF;
END $$;

-- Add LLM settings column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'llm_settings'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN llm_settings jsonb DEFAULT '{}';
  END IF;
END $$;