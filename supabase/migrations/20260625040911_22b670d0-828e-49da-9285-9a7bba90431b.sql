
GRANT SELECT ON public.payment_links TO anon;
CREATE POLICY "anyone can view active links" ON public.payment_links
  FOR SELECT TO anon
  USING (active = true);

GRANT SELECT ON public.transactions TO anon;
CREATE POLICY "anyone can view a transaction by id" ON public.transactions
  FOR SELECT TO anon
  USING (true);
