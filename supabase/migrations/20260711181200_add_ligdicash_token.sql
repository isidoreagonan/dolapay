-- Add ligdicash_token column to transactions table for secure verification
ALTER TABLE public.transactions ADD COLUMN ligdicash_token TEXT;
