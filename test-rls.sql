BEGIN;
SET LOCAL ROLE authenticated;
SELECT * FROM public.profiles LIMIT 1;
ROLLBACK;
