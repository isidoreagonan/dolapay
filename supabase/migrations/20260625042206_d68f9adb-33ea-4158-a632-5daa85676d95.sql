
-- Profiles: onboarding & mobile money
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS mobile_money_number TEXT,
  ADD COLUMN IF NOT EXISTS mobile_money_provider TEXT,
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS date_of_birth DATE;

-- Businesses: full KYB fields
ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS headquarters_address TEXT,
  ADD COLUMN IF NOT EXISTS director_first_name TEXT,
  ADD COLUMN IF NOT EXISTS director_last_name TEXT,
  ADD COLUMN IF NOT EXISTS director_dob DATE,
  ADD COLUMN IF NOT EXISTS director_address TEXT,
  ADD COLUMN IF NOT EXISTS director_role TEXT,
  ADD COLUMN IF NOT EXISTS merchant_mm_number TEXT,
  ADD COLUMN IF NOT EXISTS merchant_mm_provider TEXT,
  ADD COLUMN IF NOT EXISTS ubos JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Payment links: configurable redirect URLs
ALTER TABLE public.payment_links
  ADD COLUMN IF NOT EXISTS success_url TEXT,
  ADD COLUMN IF NOT EXISTS failure_url TEXT;

-- Transactions: idempotency
ALTER TABLE public.transactions
  ADD COLUMN IF NOT EXISTS idempotency_key TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS transactions_idem_uniq
  ON public.transactions(profile_id, idempotency_key)
  WHERE idempotency_key IS NOT NULL;

-- Rate limit log for /api/public/pay/:slug
CREATE TABLE IF NOT EXISTS public.pay_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip TEXT NOT NULL,
  slug TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.pay_attempts TO service_role;
ALTER TABLE public.pay_attempts ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS pay_attempts_ip_slug_idx
  ON public.pay_attempts(ip, slug, created_at DESC);
CREATE INDEX IF NOT EXISTS pay_attempts_created_idx
  ON public.pay_attempts(created_at DESC);
