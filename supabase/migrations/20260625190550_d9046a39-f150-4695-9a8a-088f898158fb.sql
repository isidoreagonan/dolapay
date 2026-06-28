ALTER TABLE public.business_representatives
  ADD COLUMN IF NOT EXISTS didit_session_id text UNIQUE,
  ADD COLUMN IF NOT EXISTS didit_status text;

CREATE INDEX IF NOT EXISTS business_representatives_didit_session_idx
  ON public.business_representatives(didit_session_id);