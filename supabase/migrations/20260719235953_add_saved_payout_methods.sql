-- Migration: Add Saved Payout Methods table
-- Date: 2026-07-20

CREATE TABLE IF NOT EXISTS public.saved_payout_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  country_code VARCHAR(2) NOT NULL,
  provider TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_payout_methods TO authenticated;
GRANT ALL ON public.saved_payout_methods TO service_role;
ALTER TABLE public.saved_payout_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own payout methods" ON public.saved_payout_methods
  FOR SELECT TO authenticated USING (auth.uid() = profile_id);

CREATE POLICY "Users insert own payout methods" ON public.saved_payout_methods
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users update own payout methods" ON public.saved_payout_methods
  FOR UPDATE TO authenticated USING (auth.uid() = profile_id);

CREATE POLICY "Users delete own payout methods" ON public.saved_payout_methods
  FOR DELETE TO authenticated USING (auth.uid() = profile_id);

CREATE POLICY "Admins read all payout methods" ON public.saved_payout_methods
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
