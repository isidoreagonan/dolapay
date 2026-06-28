
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
