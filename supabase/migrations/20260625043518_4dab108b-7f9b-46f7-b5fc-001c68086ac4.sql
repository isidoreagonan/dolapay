
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS country text;

ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS hq_city text,
  ADD COLUMN IF NOT EXISTS hq_country text,
  ADD COLUMN IF NOT EXISTS director_city text,
  ADD COLUMN IF NOT EXISTS director_country text;
