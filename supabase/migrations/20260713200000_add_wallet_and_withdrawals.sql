-- Migration: Add Wallets and Withdrawal Requests tables
-- Date: 2026-07-13

-- ============= WALLETS =============
CREATE TABLE IF NOT EXISTS public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  balance NUMERIC(14,2) NOT NULL DEFAULT 0.00,
  currency public.tx_currency NOT NULL DEFAULT 'XOF',
  hashed_pin TEXT, -- Code PIN à 4 chiffres haché
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.wallets TO authenticated;
GRANT ALL ON public.wallets TO service_role;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own wallet" ON public.wallets
  FOR SELECT TO authenticated USING (auth.uid() = profile_id);

CREATE POLICY "Users update own wallet" ON public.wallets
  FOR UPDATE TO authenticated USING (auth.uid() = profile_id);

CREATE POLICY "Admins read all wallets" ON public.wallets
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============= WITHDRAWAL REQUESTS =============
CREATE TABLE IF NOT EXISTS public.withdrawal_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
  amount NUMERIC(14,2) NOT NULL,
  currency public.tx_currency NOT NULL DEFAULT 'XOF',
  method TEXT NOT NULL, -- e.g., 'ORANGE', 'MOOV', 'TELECEL'
  recipient_phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'success', 'failed'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.withdrawal_requests TO authenticated;
GRANT ALL ON public.withdrawal_requests TO service_role;
ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own withdrawals" ON public.withdrawal_requests
  FOR SELECT TO authenticated USING (auth.uid() = profile_id);

CREATE POLICY "Users insert own withdrawals" ON public.withdrawal_requests
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Admins read all withdrawals" ON public.withdrawal_requests
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update all withdrawals" ON public.withdrawal_requests
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============= TRIGGERS & TRIGGERS FUNCTIONS =============
-- Auto-create wallet for new profiles
CREATE OR REPLACE FUNCTION public.handle_new_profile_wallet()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.wallets (profile_id, balance, currency)
  VALUES (NEW.id, 0.00, 'XOF')
  ON CONFLICT (profile_id) DO NOTHING;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_profile_created_create_wallet
AFTER INSERT ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_new_profile_wallet();

-- Populate wallets for existing profiles
INSERT INTO public.wallets (profile_id, balance, currency)
SELECT id, 0.00, 'XOF' FROM public.profiles
ON CONFLICT (profile_id) DO NOTHING;
