-- RLS policies for the enterprise-kyc-docs storage bucket.
-- Files are namespaced by user id as the first path segment: "{auth.uid()}/..."

CREATE POLICY "ent_kyc_owner_select"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'enterprise-kyc-docs'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "ent_kyc_owner_insert"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'enterprise-kyc-docs'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "ent_kyc_owner_update"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'enterprise-kyc-docs'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "ent_kyc_admin_select"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'enterprise-kyc-docs'
  AND public.has_role(auth.uid(), 'admin')
);