CREATE TABLE IF NOT EXISTS public.checkout_sessions (
    id text PRIMARY KEY,
    profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount numeric NOT NULL,
    currency text DEFAULT 'XOF'::text,
    customer_email text,
    customer_name text,
    success_url text,
    cancel_url text,
    client_reference_id text,
    status text DEFAULT 'open'::text,
    transaction_id uuid REFERENCES public.transactions(id) ON DELETE SET NULL,
    expires_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Active Row Level Security
ALTER TABLE public.checkout_sessions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own checkout sessions"
    ON public.checkout_sessions FOR SELECT
    USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert their own checkout sessions"
    ON public.checkout_sessions FOR INSERT
    WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update their own checkout sessions"
    ON public.checkout_sessions FOR UPDATE
    USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete their own checkout sessions"
    ON public.checkout_sessions FOR DELETE
    USING (auth.uid() = profile_id);

DROP TRIGGER IF EXISTS set_checkout_sessions_updated_at ON public.checkout_sessions;
CREATE TRIGGER set_checkout_sessions_updated_at
    BEFORE UPDATE ON public.checkout_sessions
    EXECUTE PROCEDURE public.handle_updated_at();

-- Trigger to auto-complete session when transaction succeeds
CREATE OR REPLACE FUNCTION public.sync_checkout_session_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'success' THEN
        UPDATE public.checkout_sessions
        SET status = 'completed'
        WHERE transaction_id = NEW.id AND status != 'completed';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS sync_checkout_session_status_trigger ON public.transactions;
CREATE TRIGGER sync_checkout_session_status_trigger
    AFTER UPDATE OF status ON public.transactions
    FOR EACH ROW
    WHEN (NEW.status = 'success')
    EXECUTE PROCEDURE public.sync_checkout_session_status();
