
DO $$ BEGIN
  CREATE TYPE public.verification_mode AS ENUM ('manual', 'didit_ai');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS verification_mode public.verification_mode NOT NULL DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS ai_verification_score numeric(5,2),
  ADD COLUMN IF NOT EXISTS ai_verification_log jsonb,
  ADD COLUMN IF NOT EXISTS ai_verified_at timestamptz;
