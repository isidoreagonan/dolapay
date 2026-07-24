-- Create the pawapay_status_logs table
CREATE TABLE pawapay_status_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    correspondent TEXT NOT NULL,
    country TEXT NOT NULL,
    operation_type TEXT NOT NULL,
    status TEXT NOT NULL
);

-- Add an index on created_at and correspondent for fast aggregations
CREATE INDEX idx_pawapay_status_logs_created_at ON pawapay_status_logs(created_at);
CREATE INDEX idx_pawapay_status_logs_correspondent ON pawapay_status_logs(correspondent);

-- Optional: Enable Row Level Security (RLS) but allow anonymous reads if needed
ALTER TABLE pawapay_status_logs ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read the logs (since the status page is public)
CREATE POLICY "Allow public read access to status logs"
ON pawapay_status_logs
FOR SELECT
TO public
USING (true);

-- Only service role (our API) can insert
CREATE POLICY "Allow service role to insert logs"
ON pawapay_status_logs
FOR INSERT
TO service_role
WITH CHECK (true);
