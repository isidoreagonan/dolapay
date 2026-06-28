
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
