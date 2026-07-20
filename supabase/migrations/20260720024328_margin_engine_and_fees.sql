-- 1. Add Margin Columns to transactions
ALTER TABLE public.transactions 
  ADD COLUMN IF NOT EXISTS gateway TEXT,
  ADD COLUMN IF NOT EXISTS operator_fee NUMERIC(14,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS gateway_fee NUMERIC(14,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS dola_margin NUMERIC(14,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS net_amount NUMERIC(14,2);

-- Set net_amount to amount for existing old transactions if null
UPDATE public.transactions SET net_amount = amount WHERE net_amount IS NULL;

-- 2. Create the fee_structures table
CREATE TABLE IF NOT EXISTS public.fee_structures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL, -- e.g., 'orange', 'mtn', 'moov', 'wave'
  gateway TEXT NOT NULL, -- e.g., 'pawapay', 'ligdicash'
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('pay-in', 'pay-out', 'payment_link')), -- 'pay-in' or 'pay-out'
  operator_fee_percentage NUMERIC(5,4) DEFAULT 0.0000, -- e.g., 0.0100 for 1%
  gateway_fee_percentage NUMERIC(5,4) DEFAULT 0.0000,
  dola_margin_percentage NUMERIC(5,4) DEFAULT 0.0100, -- Default 1%
  fixed_fee NUMERIC(14,2) DEFAULT 0, -- e.g., flat 100 XOF
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(provider, gateway, transaction_type)
);

-- Enable RLS and setup policies
ALTER TABLE public.fee_structures ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.fee_structures TO authenticated;
GRANT ALL ON public.fee_structures TO service_role;

-- Users can view fee structures
CREATE POLICY "Users can view fee structures" ON public.fee_structures
  FOR SELECT TO authenticated USING (true);