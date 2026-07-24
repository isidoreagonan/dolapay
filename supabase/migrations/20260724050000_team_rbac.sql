-- Création d'une fonction réutilisable pour vérifier l'accès "Workspace"
CREATE OR REPLACE FUNCTION public.has_workspace_access(target_profile_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    auth.uid() = target_profile_id 
    OR 
    EXISTS (
      SELECT 1 FROM public.team_members tm
      JOIN public.profiles p ON p.email = tm.email
      WHERE tm.owner_id = target_profile_id
      AND p.id = auth.uid()
      AND tm.status = 'active'
    );
$$;

-- 1. TRANSACTIONS
DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can insert own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can update own transactions" ON public.transactions;
CREATE POLICY "workspace manages transactions" ON public.transactions
  FOR ALL USING (public.has_workspace_access(profile_id)) WITH CHECK (public.has_workspace_access(profile_id));

-- 2. PAYOUT BATCHES
DROP POLICY IF EXISTS "owner manages batches" ON public.payout_batches;
CREATE POLICY "workspace manages batches" ON public.payout_batches
  FOR ALL USING (public.has_workspace_access(owner_id)) WITH CHECK (public.has_workspace_access(owner_id));

-- 3. PAYOUT BATCH ITEMS
DROP POLICY IF EXISTS "owner manages batch items" ON public.payout_batch_items;
CREATE POLICY "workspace manages batch items" ON public.payout_batch_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.payout_batches b WHERE b.id = batch_id AND public.has_workspace_access(b.owner_id))
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.payout_batches b WHERE b.id = batch_id AND public.has_workspace_access(b.owner_id))
  );

-- 4. PAYMENT LINKS
DROP POLICY IF EXISTS "Users can manage own payment links" ON public.payment_links;
CREATE POLICY "workspace manages payment links" ON public.payment_links
  FOR ALL USING (public.has_workspace_access(profile_id)) WITH CHECK (public.has_workspace_access(profile_id));

-- 5. WITHDRAWALS
DROP POLICY IF EXISTS "Users read own withdrawals" ON public.withdrawal_requests;
DROP POLICY IF EXISTS "Users insert own withdrawals" ON public.withdrawal_requests;
CREATE POLICY "workspace manages withdrawals" ON public.withdrawal_requests
  FOR ALL USING (public.has_workspace_access(profile_id)) WITH CHECK (public.has_workspace_access(profile_id));

-- 6. WALLETS
DROP POLICY IF EXISTS "Users read own wallet" ON public.wallets;
DROP POLICY IF EXISTS "Users update own wallet" ON public.wallets;
CREATE POLICY "workspace manages wallets" ON public.wallets
  FOR ALL USING (public.has_workspace_access(profile_id)) WITH CHECK (public.has_workspace_access(profile_id));

-- 7. SAVED PAYOUT METHODS
DROP POLICY IF EXISTS "Users read own payout methods" ON public.saved_payout_methods;
DROP POLICY IF EXISTS "Users insert own payout methods" ON public.saved_payout_methods;
DROP POLICY IF EXISTS "Users update own payout methods" ON public.saved_payout_methods;
DROP POLICY IF EXISTS "Users delete own payout methods" ON public.saved_payout_methods;
CREATE POLICY "workspace manages saved methods" ON public.saved_payout_methods
  FOR ALL USING (public.has_workspace_access(profile_id)) WITH CHECK (public.has_workspace_access(profile_id));

-- 8. API KEYS
DROP POLICY IF EXISTS "Users can manage own api keys" ON public.api_keys;
CREATE POLICY "workspace manages api keys" ON public.api_keys
  FOR ALL USING (public.has_workspace_access(profile_id)) WITH CHECK (public.has_workspace_access(profile_id));

-- 9. WEBHOOKS
DROP POLICY IF EXISTS "Users can view their own webhooks" ON public.webhooks;
DROP POLICY IF EXISTS "Users can insert their own webhooks" ON public.webhooks;
DROP POLICY IF EXISTS "Users can update their own webhooks" ON public.webhooks;
DROP POLICY IF EXISTS "Users can delete their own webhooks" ON public.webhooks;
CREATE POLICY "workspace manages webhooks" ON public.webhooks
  FOR ALL USING (public.has_workspace_access(profile_id)) WITH CHECK (public.has_workspace_access(profile_id));
