
ALTER TABLE public.payment_links
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS thank_you_message TEXT,
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS invoice_number TEXT,
  ADD COLUMN IF NOT EXISTS fees_paid_by TEXT NOT NULL DEFAULT 'merchant' CHECK (fees_paid_by IN ('merchant','customer'));
