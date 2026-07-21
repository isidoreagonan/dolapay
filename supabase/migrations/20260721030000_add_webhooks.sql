CREATE TABLE IF NOT EXISTS public.webhook_endpoints (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    url text NOT NULL,
    secret text NOT NULL,
    active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Active Row Level Security
ALTER TABLE public.webhook_endpoints ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own webhooks"
    ON public.webhook_endpoints FOR SELECT
    USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert their own webhooks"
    ON public.webhook_endpoints FOR INSERT
    WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update their own webhooks"
    ON public.webhook_endpoints FOR UPDATE
    USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete their own webhooks"
    ON public.webhook_endpoints FOR DELETE
    USING (auth.uid() = profile_id);

-- Setup updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS set_webhook_endpoints_updated_at ON public.webhook_endpoints;
CREATE TRIGGER set_webhook_endpoints_updated_at
    BEFORE UPDATE ON public.webhook_endpoints
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();
