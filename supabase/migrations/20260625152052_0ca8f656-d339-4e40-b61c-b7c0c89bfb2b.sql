ALTER TYPE public.kyc_status ADD VALUE IF NOT EXISTS 'in_compliance_review';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS kyc_rejection_reason TEXT;