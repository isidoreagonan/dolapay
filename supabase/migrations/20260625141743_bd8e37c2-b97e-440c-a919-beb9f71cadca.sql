ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS first_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_name text;

-- Add business representatives table for KYB
CREATE TABLE IF NOT EXISTS public.business_representatives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  title text NOT NULL,
  email text NOT NULL,
  verified boolean NOT NULL DEFAULT false,
  verified_at timestamptz,
  ai_verification_log jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.business_representatives TO authenticated;
GRANT ALL ON public.business_representatives TO service_role;

ALTER TABLE public.business_representatives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own representatives" ON public.business_representatives
  FOR ALL TO authenticated
  USING (auth.uid() = profile_id) WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Admins read all representatives" ON public.business_representatives
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_business_reps_updated_at
  BEFORE UPDATE ON public.business_representatives
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();