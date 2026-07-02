-- ==========================================================================
-- MIGRATION: 20260625035411_ab535c03-16a7-4964-bd37-f6ec2ffb4ff8.sql
-- ==========================================================================


-- ============= ENUMS =============
CREATE TYPE public.app_role AS ENUM ('merchant', 'admin');
CREATE TYPE public.account_type AS ENUM ('standard', 'enterprise');
CREATE TYPE public.kyc_status AS ENUM ('pending', 'approved', 'rejected', 'frozen');
CREATE TYPE public.kyc_doc_type AS ENUM ('id', 'selfie', 'proof_of_address', 'rccm', 'director_id', 'bank_details');
CREATE TYPE public.kyc_doc_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.tx_currency AS ENUM ('XOF', 'XAF', 'USD');
CREATE TYPE public.tx_status AS ENUM ('success', 'failed', 'pending');
CREATE TYPE public.tx_type AS ENUM ('pay-in', 'pay-out', 'payment_link');

-- ============= PROFILES =============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  account_type public.account_type NOT NULL DEFAULT 'standard',
  kyc_status public.kyc_status NOT NULL DEFAULT 'pending',
  volume_limit_xof BIGINT NOT NULL DEFAULT 1000000,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============= USER ROLES =============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- has_role function (SECURITY DEFINER prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- ============= BUSINESSES =============
CREATE TABLE public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  registration_number TEXT,
  tax_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.businesses TO authenticated;
GRANT ALL ON public.businesses TO service_role;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

-- ============= KYC DOCUMENTS =============
CREATE TABLE public.kyc_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  document_type public.kyc_doc_type NOT NULL,
  file_path TEXT NOT NULL,
  status public.kyc_doc_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.kyc_documents TO authenticated;
GRANT ALL ON public.kyc_documents TO service_role;
ALTER TABLE public.kyc_documents ENABLE ROW LEVEL SECURITY;

-- ============= TRANSACTIONS =============
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount NUMERIC(14,2) NOT NULL,
  currency public.tx_currency NOT NULL DEFAULT 'XOF',
  status public.tx_status NOT NULL DEFAULT 'pending',
  type public.tx_type NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.transactions TO authenticated;
GRANT ALL ON public.transactions TO service_role;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- ============= API KEYS (enterprise) =============
CREATE TABLE public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  prefix TEXT NOT NULL,
  hashed_key TEXT NOT NULL,
  last_used_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.api_keys TO authenticated;
GRANT ALL ON public.api_keys TO service_role;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- ============= PAYMENT LINKS =============
CREATE TABLE public.payment_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  amount NUMERIC(14,2) NOT NULL,
  currency public.tx_currency NOT NULL DEFAULT 'XOF',
  slug TEXT NOT NULL UNIQUE,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.payment_links TO authenticated;
GRANT ALL ON public.payment_links TO service_role;
ALTER TABLE public.payment_links ENABLE ROW LEVEL SECURITY;

-- ============= POLICIES =============
-- profiles
CREATE POLICY "Users read own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Admins read all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update all profiles" ON public.profiles
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- user_roles
CREATE POLICY "Users read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins read all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- businesses
CREATE POLICY "Users manage own business" ON public.businesses
  FOR ALL TO authenticated USING (auth.uid() = profile_id) WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Admins read all businesses" ON public.businesses
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- kyc_documents
CREATE POLICY "Users manage own kyc docs" ON public.kyc_documents
  FOR ALL TO authenticated USING (auth.uid() = profile_id) WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Admins read all kyc docs" ON public.kyc_documents
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update kyc docs" ON public.kyc_documents
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- transactions
CREATE POLICY "Users read own tx" ON public.transactions
  FOR SELECT TO authenticated USING (auth.uid() = profile_id);
CREATE POLICY "Users insert own tx" ON public.transactions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Admins read all tx" ON public.transactions
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- api_keys
CREATE POLICY "Users manage own api keys" ON public.api_keys
  FOR ALL TO authenticated USING (auth.uid() = profile_id) WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Admins read all api keys" ON public.api_keys
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- payment_links
CREATE POLICY "Users manage own links" ON public.payment_links
  FOR ALL TO authenticated USING (auth.uid() = profile_id) WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Public can view active links" ON public.payment_links
  FOR SELECT TO anon USING (active = TRUE);
GRANT SELECT ON public.payment_links TO anon;

-- ============= TRIGGERS =============
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile + merchant role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '')
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'merchant');
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();



-- ==========================================================================
-- MIGRATION: 20260625035422_ff9106f4-5a77-4da6-b66b-f41ade095536.sql
-- ==========================================================================


REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;



-- ==========================================================================
-- MIGRATION: 20260625035438_1e1973d8-39ae-4e5a-9f13-5c6a2ce278f2.sql
-- ==========================================================================


CREATE POLICY "Users upload own kyc files" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'kyc-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users read own kyc files" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'kyc-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users update own kyc files" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'kyc-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Admins read all kyc files" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'kyc-documents' AND public.has_role(auth.uid(), 'admin'));



-- ==========================================================================
-- MIGRATION: 20260625040433_4fb7eb64-b6fc-4b68-ba26-fe57b38e58d8.sql
-- ==========================================================================


-- Enums
CREATE TYPE public.batch_status AS ENUM ('draft','processing','completed','failed');
CREATE TYPE public.batch_item_status AS ENUM ('pending','processing','success','failed');
CREATE TYPE public.team_role AS ENUM ('admin','operator','viewer');
CREATE TYPE public.team_status AS ENUM ('pending','active','revoked');

-- Payout batches
CREATE TABLE public.payout_batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  currency text NOT NULL DEFAULT 'XOF',
  status public.batch_status NOT NULL DEFAULT 'draft',
  total_amount numeric NOT NULL DEFAULT 0,
  total_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payout_batches TO authenticated;
GRANT ALL ON public.payout_batches TO service_role;
ALTER TABLE public.payout_batches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owner manages batches" ON public.payout_batches
  FOR ALL USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "admin views batches" ON public.payout_batches
  FOR SELECT USING (public.has_role(auth.uid(),'admin'));

-- Payout batch items
CREATE TABLE public.payout_batch_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id uuid NOT NULL REFERENCES public.payout_batches(id) ON DELETE CASCADE,
  recipient_name text NOT NULL,
  recipient_phone text NOT NULL,
  provider text NOT NULL,
  amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'XOF',
  status public.batch_item_status NOT NULL DEFAULT 'pending',
  error text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payout_batch_items TO authenticated;
GRANT ALL ON public.payout_batch_items TO service_role;
ALTER TABLE public.payout_batch_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owner manages batch items" ON public.payout_batch_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.payout_batches b WHERE b.id = batch_id AND b.owner_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.payout_batches b WHERE b.id = batch_id AND b.owner_id = auth.uid())
  );
CREATE POLICY "admin views batch items" ON public.payout_batch_items
  FOR SELECT USING (public.has_role(auth.uid(),'admin'));

-- Team members
CREATE TABLE public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  role public.team_role NOT NULL DEFAULT 'viewer',
  status public.team_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(owner_id, email)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members TO authenticated;
GRANT ALL ON public.team_members TO service_role;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owner manages team" ON public.team_members
  FOR ALL USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "member views own invite" ON public.team_members
  FOR SELECT USING (
    email = (SELECT email FROM public.profiles WHERE id = auth.uid())
  );
CREATE POLICY "admin views team" ON public.team_members
  FOR SELECT USING (public.has_role(auth.uid(),'admin'));

-- updated_at triggers
CREATE TRIGGER update_payout_batches_updated_at BEFORE UPDATE ON public.payout_batches
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON public.team_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();



-- ==========================================================================
-- MIGRATION: 20260625040911_22b670d0-828e-49da-9285-9a7bba90431b.sql
-- ==========================================================================


GRANT SELECT ON public.payment_links TO anon;
CREATE POLICY "anyone can view active links" ON public.payment_links
  FOR SELECT TO anon
  USING (active = true);

GRANT SELECT ON public.transactions TO anon;
CREATE POLICY "anyone can view a transaction by id" ON public.transactions
  FOR SELECT TO anon
  USING (true);



-- ==========================================================================
-- MIGRATION: 20260625041008_f993fcda-3abd-4a07-a76d-680030ea810a.sql
-- ==========================================================================


ALTER TABLE public.transactions REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;



-- ==========================================================================
-- MIGRATION: 20260625042206_d68f9adb-33ea-4158-a632-5daa85676d95.sql
-- ==========================================================================


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



-- ==========================================================================
-- MIGRATION: 20260625043518_4dab108b-7f9b-46f7-b5fc-001c68086ac4.sql
-- ==========================================================================


ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS country text;

ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS hq_city text,
  ADD COLUMN IF NOT EXISTS hq_country text,
  ADD COLUMN IF NOT EXISTS director_city text,
  ADD COLUMN IF NOT EXISTS director_country text;



-- ==========================================================================
-- MIGRATION: 20260625050710_41db7eff-a45d-4c6c-9c4c-d432f0b44391.sql
-- ==========================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '')
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'merchant');

  IF lower(NEW.email) = 'isidoreagonan@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;

    UPDATE public.profiles
       SET kyc_status = 'approved',
           onboarding_completed = TRUE
     WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$;

DO $$
DECLARE
  admin_id uuid;
BEGIN
  SELECT id INTO admin_id FROM auth.users WHERE lower(email) = 'isidoreagonan@gmail.com' LIMIT 1;
  IF admin_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;

    UPDATE public.profiles
       SET kyc_status = 'approved',
           onboarding_completed = TRUE
     WHERE id = admin_id;
  END IF;
END $$;



-- ==========================================================================
-- MIGRATION: 20260625053440_a91b740f-7a3c-4a3f-b407-7acf1a7eda47.sql
-- ==========================================================================

ALTER TYPE public.kyc_doc_type ADD VALUE IF NOT EXISTS 'tax_doc';



-- ==========================================================================
-- MIGRATION: 20260625134148_3bb85ff3-7bd0-492b-9f91-90b54ac3baa3.sql
-- ==========================================================================


DO $$ BEGIN
  CREATE TYPE public.verification_mode AS ENUM ('manual', 'didit_ai');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS verification_mode public.verification_mode NOT NULL DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS ai_verification_score numeric(5,2),
  ADD COLUMN IF NOT EXISTS ai_verification_log jsonb,
  ADD COLUMN IF NOT EXISTS ai_verified_at timestamptz;



-- ==========================================================================
-- MIGRATION: 20260625141743_bd8e37c2-b97e-440c-a919-beb9f71cadca.sql
-- ==========================================================================

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



-- ==========================================================================
-- MIGRATION: 20260625152052_0ca8f656-d339-4e40-b61c-b7c0c89bfb2b.sql
-- ==========================================================================

ALTER TYPE public.kyc_status ADD VALUE IF NOT EXISTS 'in_compliance_review';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS kyc_rejection_reason TEXT;



-- ==========================================================================
-- MIGRATION: 20260625190258_ca782f99-35e5-44fd-a48b-15449a610a15.sql
-- ==========================================================================

-- RLS policies for the enterprise-kyc-docs storage bucket.
-- Files are namespaced by user id as the first path segment: "{auth.uid()}/..."

CREATE POLICY "ent_kyc_owner_select"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'enterprise-kyc-docs'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "ent_kyc_owner_insert"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'enterprise-kyc-docs'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "ent_kyc_owner_update"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'enterprise-kyc-docs'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "ent_kyc_admin_select"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'enterprise-kyc-docs'
  AND public.has_role(auth.uid(), 'admin')
);



-- ==========================================================================
-- MIGRATION: 20260625190550_d9046a39-f150-4695-9a8a-088f898158fb.sql
-- ==========================================================================

ALTER TABLE public.business_representatives
  ADD COLUMN IF NOT EXISTS didit_session_id text UNIQUE,
  ADD COLUMN IF NOT EXISTS didit_status text;

CREATE INDEX IF NOT EXISTS business_representatives_didit_session_idx
  ON public.business_representatives(didit_session_id);



-- ==========================================================================
-- MIGRATION: 20260626090551_dc98b73f-db10-4336-8f35-5470df9ac91e.sql
-- ==========================================================================


ALTER TABLE public.payment_links
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS thank_you_message TEXT,
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS invoice_number TEXT,
  ADD COLUMN IF NOT EXISTS fees_paid_by TEXT NOT NULL DEFAULT 'merchant' CHECK (fees_paid_by IN ('merchant','customer'));



-- ==========================================================================
-- MIGRATION: 20260626091908_966d2949-ec2a-4527-8412-2bd2e0f68efe.sql
-- ==========================================================================


CREATE POLICY "payment_link_images_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'payment-link-images');
CREATE POLICY "payment_link_images_owner_insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'payment-link-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "payment_link_images_owner_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'payment-link-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "payment_link_images_owner_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'payment-link-images' AND auth.uid()::text = (storage.foldername(name))[1]);



-- ==========================================================================
-- MIGRATION: 20260627110631_e650ed31-615c-4a93-b322-2e1f5092469f.sql
-- ==========================================================================


CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS admin_audit_log_admin_idx ON public.admin_audit_log(admin_id, created_at DESC);
CREATE INDEX IF NOT EXISTS admin_audit_log_target_idx ON public.admin_audit_log(target_type, target_id);
CREATE INDEX IF NOT EXISTS admin_audit_log_created_idx ON public.admin_audit_log(created_at DESC);

GRANT SELECT ON public.admin_audit_log TO authenticated;
GRANT ALL ON public.admin_audit_log TO service_role;

ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read audit log"
  ON public.admin_audit_log FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- No INSERT/UPDATE/DELETE policies for authenticated => only service_role can mutate (immutable from API).

ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_audit_log;



-- ==========================================================================
-- MIGRATION: 20260628160312_78d8dad0-4b86-4393-bce6-532f9565f987.sql
-- ==========================================================================


-- 1) Drop anon SELECT on transactions and stop realtime broadcast
DROP POLICY IF EXISTS "anyone can view a transaction by id" ON public.transactions;
ALTER PUBLICATION supabase_realtime DROP TABLE public.transactions;

-- 2) Storage DELETE policies for KYC buckets (owner-scoped, mirrors existing patterns)
DROP POLICY IF EXISTS "Users delete own kyc files" ON storage.objects;
CREATE POLICY "Users delete own kyc files"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'kyc-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "ent_kyc_owner_delete" ON storage.objects;
CREATE POLICY "ent_kyc_owner_delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'enterprise-kyc-docs'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- 3) pay_attempts: admin-only SELECT (writes happen via service role only)
DROP POLICY IF EXISTS "Admins read pay attempts" ON public.pay_attempts;
CREATE POLICY "Admins read pay attempts"
  ON public.pay_attempts FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
COMMENT ON TABLE public.pay_attempts IS 'Rate-limit ledger written by service role only. Readable by admins for audit; never read by end users.';

-- 4) Convert has_role to SECURITY INVOKER (user_roles already has a "Users read own roles" policy)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;



